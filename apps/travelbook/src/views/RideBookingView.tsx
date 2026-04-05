'use client';
/**
 * RideBookingView.tsx — Uber-like ride booking connected to the shared Firebase backend
 * used by TravelBook Rides drivers. Flow: Location → Vehicles → Live tracking.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { GlassCard } from '@/components/GlassCard';
import {
  ArrowLeft, MapPin, Navigation2, Car, Users, DollarSign,
  Loader2, CheckCircle2, Clock, AlertCircle, X, Zap,
} from 'lucide-react';
import {
  collection, addDoc, doc, onSnapshot,
  query, where, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

// Leaflet map — SSR-safe dynamic import
const TravelerRideMap = dynamic(() => import('@/components/TravelerRideMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
      <Loader2 className="animate-spin text-teal-400" size={32} />
    </div>
  ),
});

// ── Types (mirrors TravelBook Rides schema) ──────────────────────────────────
type VehicleType = 'Car' | 'Van' | 'Bus' | 'Motorcycle';

interface FirestoreVehicle {
  id: string;
  providerId: string;
  type: VehicleType;
  make?: string;
  model: string;
  year?: number;
  color?: string;
  capacity: number;
  status: 'Pending' | 'Verified' | 'Rejected';
  photoUrl?: string;
}

type RideStatus = 'Open' | 'Accepted' | 'Completed' | 'Cancelled';

interface ActiveRide {
  id: string;
  status: RideStatus;
  fare: number;
  providerId?: string;
  vehicleDetails?: { make: string; model: string; color: string; licensePlate: string };
  driverLat?: number;
  driverLng?: number;
}

// ── Fare helpers ─────────────────────────────────────────────────────────────
const FARE_RATES: Record<VehicleType, { base: number; perKm: number }> = {
  Car:        { base: 3,  perKm: 1.5 },
  Van:        { base: 5,  perKm: 2.5 },
  Bus:        { base: 8,  perKm: 3.5 },
  Motorcycle: { base: 2,  perKm: 1.0 },
};

function estimateFare(type: VehicleType): number {
  const km = 5 + Math.random() * 15; // 5–20 km simulated
  const r = FARE_RATES[type] ?? FARE_RATES.Car;
  return Math.round((r.base + km * r.perKm) * 100) / 100;
}

function vehicleEmoji(type: VehicleType): string {
  return { Car: '🚗', Van: '🚐', Bus: '🚌', Motorcycle: '🏍️' }[type] ?? '🚗';
}

// ── LocalStorage traveler identity ───────────────────────────────────────────
function getTravelerId(): string {
  if (typeof window === 'undefined') return 'traveler-ssr';
  const k = 'tb_traveler_id';
  const v = localStorage.getItem(k);
  if (v) return v;
  const n = `traveler-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(k, n);
  return n;
}

// ── Mock vehicles (shown if Firestore returns nothing) ───────────────────────
const MOCK_VEHICLES: FirestoreVehicle[] = [
  { id: 'mock-car-1',   providerId: 'mock', type: 'Car',        model: 'Toyota Corolla', color: 'White',  capacity: 4, status: 'Verified' },
  { id: 'mock-van-1',   providerId: 'mock', type: 'Van',        model: 'Toyota HiAce',   color: 'Silver', capacity: 7, status: 'Verified' },
  { id: 'mock-bike-1',  providerId: 'mock', type: 'Motorcycle', model: 'Honda CB500',    color: 'Black',  capacity: 1, status: 'Verified' },
];

// ── Props & step type ────────────────────────────────────────────────────────
type BookingStep = 'location' | 'vehicles' | 'booking';

interface RideBookingViewProps {
  onBack: () => void;
  currentUser?: User | null;
}

// ── Main component ────────────────────────────────────────────────────────────
export const RideBookingView: React.FC<RideBookingViewProps> = ({ onBack, currentUser }) => {
  const [step, setStep]               = useState<BookingStep>('location');
  const [pickup, setPickup]           = useState('Locating you…');
  const [dropoff, setDropoff]         = useState('');
  const [userLat, setUserLat]         = useState(40.7128);
  const [userLng, setUserLng]         = useState(-74.006);
  const [driverLat, setDriverLat]     = useState<number | null>(null);
  const [driverLng, setDriverLng]     = useState<number | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(true);
  const [vehicles, setVehicles]       = useState<FirestoreVehicle[]>([]);
  const [vehicleFares, setVehicleFares] = useState<Record<string, number>>({});
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [activeRide, setActiveRide]   = useState<ActiveRide | null>(null);
  const [bookingVehicleId, setBookingVehicleId] = useState<string | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [eta, setEta]                 = useState(8);
  const unsubRef  = useRef<(() => void) | null>(null);
  const etaTimer  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Geolocate on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setPickup('Current location (GPS unavailable)');
      setIsGeolocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setPickup(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setIsGeolocating(false);
      },
      () => {
        setPickup('Current location (GPS unavailable)');
        setIsGeolocating(false);
      },
    );
    return () => { unsubRef.current?.(); if (etaTimer.current) clearInterval(etaTimer.current); };
  }, []);

  // ETA countdown once ride is Accepted
  useEffect(() => {
    if (activeRide?.status !== 'Accepted') return;
    setEta(8);
    etaTimer.current = setInterval(() => {
      setEta((p) => { if (p <= 1) { clearInterval(etaTimer.current!); return 0; } return p - 1; });
    }, 60_000);
    return () => { if (etaTimer.current) clearInterval(etaTimer.current); };
  }, [activeRide?.status]);

  // Load verified vehicles from Firestore
  const loadVehicles = useCallback(async () => {
    if (!dropoff.trim()) { setError('Please enter a destination first.'); return; }
    setError(null);
    setLoadingVehicles(true);
    setStep('vehicles');
    try {
      const snap = await getDocs(query(collection(db, 'vehicles'), where('status', '==', 'Verified')));
      const list: FirestoreVehicle[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreVehicle));
      const usedList = list.length > 0 ? list : MOCK_VEHICLES;
      const fares: Record<string, number> = {};
      usedList.forEach((v) => { fares[v.id] = estimateFare(v.type); });
      setVehicles(usedList);
      setVehicleFares(fares);
    } catch (err) {
      console.error('[RideBooking] loadVehicles error:', err);
      const fares: Record<string, number> = {};
      MOCK_VEHICLES.forEach((v) => { fares[v.id] = estimateFare(v.type); });
      setVehicles(MOCK_VEHICLES);
      setVehicleFares(fares);
    } finally {
      setLoadingVehicles(false);
    }
  }, [dropoff]);

  // Create rideRequest + subscribe to live updates
  const bookVehicle = useCallback(async (vehicle: FirestoreVehicle) => {
    setBookingVehicleId(vehicle.id);
    setError(null);
    const travelerId  = currentUser?.id ?? getTravelerId();
    const travelerName = currentUser?.name ?? 'TravelBook Traveler';
    const fare = vehicleFares[vehicle.id] ?? estimateFare(vehicle.type);
    try {
      const ref = await addDoc(collection(db, 'rideRequests'), {
        travelerId, travelerName,
        origin: pickup, destination: dropoff,
        pickupLat: userLat, pickupLng: userLng,
        passengers: 1, fare, status: 'Open', rideType: 'standard',
        createdAt: serverTimestamp(),
      });
      setActiveRide({ id: ref.id, status: 'Open', fare });
      setStep('booking');
      unsubRef.current = onSnapshot(doc(db, 'rideRequests', ref.id), (snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        setActiveRide({ id: snap.id, status: d.status, fare: d.fare, providerId: d.providerId, vehicleDetails: d.vehicleDetails });
        if (d.driverLat) setDriverLat(d.driverLat);
        if (d.driverLng) setDriverLng(d.driverLng);
      });
    } catch (err) {
      console.error('[RideBooking] bookVehicle error:', err);
      setError('Booking failed — check your connection and try again.');
    } finally {
      setBookingVehicleId(null);
    }
  }, [currentUser, pickup, dropoff, userLat, userLng, vehicleFares]);

  // ── Render helpers ──────────────────────────────────────────────────────────
  const statusBadge = (status: RideStatus) => {
    const map = {
      Open:      { label: 'Waiting for driver…', color: 'text-amber-400',  bg: 'bg-amber-400/10',  dot: 'bg-amber-400' },
      Accepted:  { label: 'Driver on the way',   color: 'text-teal-400',   bg: 'bg-teal-400/10',   dot: 'bg-teal-400' },
      Completed: { label: 'Trip completed',       color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
      Cancelled: { label: 'Ride cancelled',       color: 'text-rose-400',   bg: 'bg-rose-400/10',   dot: 'bg-rose-400' },
    };
    const m = map[status];
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${m.bg} ${m.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${m.dot} ${status === 'Open' ? 'animate-pulse' : ''}`} />
        {m.label}
      </span>
    );
  };

  // ── STEP 1: Location ────────────────────────────────────────────────────────
  const renderLocationStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-48 sm:h-64 rounded-3xl overflow-hidden border border-white/10">
        <TravelerRideMap userLat={userLat} userLng={userLng} />
      </div>

      <GlassCard className="p-6 space-y-4">
        <h3 className="text-white font-black text-sm uppercase tracking-widest">Where are you going?</h3>

        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" size={18} />
          <input
            readOnly
            value={isGeolocating ? 'Detecting your location…' : pickup}
            className="w-full bg-white/5 border border-teal-500/30 rounded-2xl pl-12 pr-4 py-4 text-white text-sm placeholder-white/30 focus:outline-none"
            placeholder="Pickup location"
          />
          {isGeolocating && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-teal-400" size={16} />}
        </div>

        <div className="relative">
          <Navigation2 className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            value={dropoff}
            onChange={(e) => { setDropoff(e.target.value); setError(null); }}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white text-sm placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-all"
            placeholder="Where to?"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button
          onClick={loadVehicles}
          disabled={isGeolocating || !dropoff.trim()}
          className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20"
        >
          <Car size={16} /> See Available Rides
        </button>
      </GlassCard>
    </div>
  );

  // ── STEP 2: Vehicle selection ────────────────────────────────────────────────
  const renderVehiclesStep = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep('location')} className="flex items-center gap-2 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Change Route
        </button>
        <div className="text-right">
          <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">To</p>
          <p className="text-white text-sm font-bold truncate max-w-[160px]">{dropoff}</p>
        </div>
      </div>

      {loadingVehicles ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="relative w-14 h-14"><div className="absolute inset-0 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" /></div>
          <p className="text-white/40 font-black uppercase tracking-widest text-[10px] animate-pulse">Finding nearby vehicles…</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-white font-black text-sm uppercase tracking-widest">Choose your ride</h3>
          {vehicles.map((v) => (
            <GlassCard key={v.id} className="p-5 border-white/10 hover:border-teal-500/40 transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{vehicleEmoji(v.type)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-black text-base">{v.type}</span>
                      <span className="text-white/30 text-xs">·</span>
                      <span className="text-white/50 text-xs">{v.make || ''} {v.model}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/40 text-[9px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Users size={9} /> {v.capacity} seats</span>
                      {v.color && <span>{v.color}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-white/30 text-[8px] font-black uppercase">Est. fare</p>
                    <p className="text-white font-black text-xl">${vehicleFares[v.id]?.toFixed(2) ?? '—'}</p>
                  </div>
                  <button
                    onClick={() => bookVehicle(v)}
                    disabled={bookingVehicleId === v.id}
                    className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    {bookingVehicleId === v.id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                    Book
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ── STEP 3: Active booking / live tracking ──────────────────────────────────
  const renderBookingStep = () => {
    if (!activeRide) return null;
    const isCompleted = activeRide.status === 'Completed';
    const isAccepted  = activeRide.status === 'Accepted';
    const isOpen      = activeRide.status === 'Open';

    return (
      <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Map */}
        <div className="h-52 sm:h-72 rounded-3xl overflow-hidden border border-white/10">
          <TravelerRideMap
            userLat={userLat} userLng={userLng}
            driverLat={driverLat} driverLng={driverLng}
            rideStatus={activeRide.status}
          />
        </div>

        {/* Status card */}
        <GlassCard className={`p-6 space-y-4 ${isAccepted ? 'border-teal-500/40' : isCompleted ? 'border-emerald-500/40' : 'border-white/10'}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              {statusBadge(activeRide.status)}
              <p className="mt-3 text-white/40 text-xs">
                {pickup} <span className="text-white/20">→</span> {dropoff}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">Fare</p>
              <p className="text-white font-black text-2xl">${activeRide.fare.toFixed(2)}</p>
            </div>
          </div>

          {/* Waiting pulsing indicator */}
          {isOpen && (
            <div className="flex items-center gap-3 py-3 border-t border-white/5">
              <div className="relative flex-shrink-0 w-8 h-8">
                <div className="absolute inset-0 bg-amber-400 rounded-full opacity-25 animate-ping" />
                <div className="relative z-10 w-8 h-8 bg-amber-400/20 border border-amber-400/40 rounded-full flex items-center justify-center">
                  <Clock size={14} className="text-amber-400" />
                </div>
              </div>
              <p className="text-white/60 text-sm">Waiting for a nearby driver to accept your request…</p>
            </div>
          )}

          {/* Driver accepted info */}
          {isAccepted && activeRide.vehicleDetails && (
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-xl">🚗</div>
                <div>
                  <p className="text-white font-bold text-sm">
                    {activeRide.vehicleDetails.make} {activeRide.vehicleDetails.model}
                  </p>
                  <p className="text-white/40 text-xs">{activeRide.vehicleDetails.color} · {activeRide.vehicleDetails.licensePlate}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-white/30 text-[8px] font-black uppercase">ETA</p>
                  <p className="text-teal-400 font-black text-lg">{eta} min</p>
                </div>
              </div>
            </div>
          )}

          {/* Completed */}
          {isCompleted && (
            <div className="border-t border-white/5 pt-4 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white font-bold">Trip completed!</p>
                <p className="text-white/40 text-xs">Fare paid: ${activeRide.fare.toFixed(2)}</p>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Book another / back */}
        {(isCompleted || activeRide.status === 'Cancelled') && (
          <button
            onClick={() => { unsubRef.current?.(); setStep('location'); setActiveRide(null); setDropoff(''); setDriverLat(null); setDriverLng(null); }}
            className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95"
          >
            Book Another Ride
          </button>
        )}
      </div>
    );
  };

  // ── Root render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-white font-black text-2xl tracking-tight">Book a Ride</h2>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">
            {step === 'location' ? 'Set pickup & destination' : step === 'vehicles' ? 'Choose your vehicle' : 'Live ride tracking'}
          </p>
        </div>
      </div>

      {step === 'location' && renderLocationStep()}
      {step === 'vehicles' && renderVehiclesStep()}
      {step === 'booking'  && renderBookingStep()}
    </div>
  );
};
