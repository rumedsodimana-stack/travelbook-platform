/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Car, 
  MapPin, 
  Users, 
  ShieldCheck, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Search,
  Navigation,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { cn } from './lib/utils';
import RideMap, { RideMarker } from './components/RideMap';
import RiderDashboard from './components/RiderDashboard';
import ChatWindow from './components/ChatWindow';
import { db } from './firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { RideRequest, Vehicle } from './types';

// Helper to calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Components will be extracted to separate files later for better organization
const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn(
    "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden",
    className
  )}>
    {children}
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  disabled
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  className?: string,
  disabled?: boolean
}) => {
  const variants = {
    primary: "bg-amber-300 text-slate-950 font-bold shadow-lg shadow-amber-300/20 hover:scale-105 active:scale-95 hover:bg-amber-200",
    secondary: "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30",
    outline: "bg-transparent border-2 border-amber-300 text-amber-300 hover:bg-amber-300 hover:text-slate-950",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-3 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

export default function App() {
  const { user, profile, loading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'rides' | 'vehicles' | 'chat' | 'wallet'>('rides');
  const [appMode, setAppMode] = useState<'provider' | 'rider'>('provider');

  // Ride State
  const [openRides, setOpenRides] = useState<RideRequest[]>([]);
  const [acceptedRide, setAcceptedRide] = useState<RideRequest | null>(null);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [routeIndex, setRouteIndex] = useState(0);

  // Fleet State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'Car',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    capacity: 4
  });

  // Initialize driver location
  useEffect(() => {
    if (navigator.geolocation && !driverLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setDriverLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setDriverLocation([40.730610, -73.935242]) // Fallback to somewhere in NYC
      );
    }
  }, []);

  // Fetch vehicles
  useEffect(() => {
    if (!user || appMode !== 'provider') return;
    const q = query(collection(db, 'vehicles'), where('providerId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setVehicles(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Vehicle)));
    });
    return () => unsub();
  }, [user, appMode]);

  // Fetch open and accepted rides from Firestore
  useEffect(() => {
    if (!user || appMode !== 'provider') return;

    const qOpen = query(collection(db, 'rideRequests'), where('status', '==', 'Open'));
    const unsubOpen = onSnapshot(qOpen, (snapshot) => {
      const rides = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as RideRequest));
      setOpenRides(rides.filter(r => r.rideType !== 'robotaxi'));
    });

    const qAccepted = query(
      collection(db, 'rideRequests'), 
      where('providerId', '==', user.uid), 
      where('status', '==', 'Accepted')
    );
    const unsubAccepted = onSnapshot(qAccepted, (snapshot) => {
      if (!snapshot.empty) {
        setAcceptedRide({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as RideRequest);
      } else {
        setAcceptedRide(null);
      }
    });

    return () => { unsubOpen(); unsubAccepted(); };
  }, [user, appMode]);

  // Fetch Route from OSRM when ride is accepted
  useEffect(() => {
    if (acceptedRide && driverLocation && !routeCoords) {
      const fetchRoute = async () => {
        try {
          const startLat = driverLocation[0];
          const startLng = driverLocation[1];
          const endLat = acceptedRide.pickupLat || 40.7128;
          const endLng = acceptedRide.pickupLng || -74.0060;
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRouteCoords(coords);
            setRouteIndex(0);
          }
        } catch (e) {
          console.error("Error fetching route", e);
        }
      };
      fetchRoute();
    } else if (!acceptedRide) {
      setRouteCoords(null);
      setRouteIndex(0);
    }
  }, [acceptedRide]);

  // Simulate driver movement along the route and sync to Firestore
  useEffect(() => {
    if (!acceptedRide || !driverLocation || !routeCoords) return;
    
    const interval = setInterval(() => {
      setDriverLocation(prev => {
        if (!prev) return prev;
        if (routeIndex >= routeCoords.length) return prev;
        
        const target = routeCoords[routeIndex];
        const speed = 0.0003; // Adjust speed as needed
        const dLat = target[0] - prev[0];
        const dLng = target[1] - prev[1];
        const dist = Math.sqrt(dLat*dLat + dLng*dLng);
        
        let newLoc: [number, number] = [prev[0], prev[1]];
        if (dist < speed) {
          setRouteIndex(i => i + 1);
          newLoc = target;
        } else {
          const ratio = speed / dist;
          newLoc = [
            prev[0] + dLat * ratio,
            prev[1] + dLng * ratio
          ];
        }

        // Sync driver location to Firestore so rider can see it
        if (acceptedRide.id) {
          updateDoc(doc(db, 'rideRequests', acceptedRide.id), {
            driverLat: newLoc[0],
            driverLng: newLoc[1]
          }).catch(err => console.error("Error syncing driver location:", err));
        }

        return newLoc;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedRide, routeCoords, routeIndex]);

  // Calculate ETA whenever driver location or accepted ride changes
  useEffect(() => {
    if (!acceptedRide || !driverLocation) {
      setEtaMinutes(null);
      return;
    }
    const targetLat = acceptedRide.pickupLat || 40.7128;
    const targetLng = acceptedRide.pickupLng || -74.0060;

    const distanceKm = getDistanceFromLatLonInKm(driverLocation[0], driverLocation[1], targetLat, targetLng);
    const estimatedMinutes = Math.ceil(distanceKm / 0.5);
    setEtaMinutes(estimatedMinutes > 0 ? estimatedMinutes : 0);
  }, [driverLocation, acceptedRide]);

  const handleAcceptRide = async (id: string) => {
    if (!user) return;
    try {
      const activeVehicle = activeVehicleId 
        ? vehicles.find(v => v.id === activeVehicleId) 
        : (vehicles.length > 0 ? vehicles[0] : null);
      
      const updateData: any = {
        status: 'Accepted',
        providerId: user.uid
      };

      if (activeVehicle) {
        updateData.vehicleId = activeVehicle.id;
        updateData.vehicleDetails = {
          make: activeVehicle.make || '',
          model: activeVehicle.model || '',
          color: activeVehicle.color || '',
          licensePlate: activeVehicle.licensePlate || ''
        };
      }

      await updateDoc(doc(db, 'rideRequests', id), updateData);
    } catch (error) {
      console.error("Error accepting ride:", error);
    }
  };

  const handleCompleteRide = async () => {
    if (!acceptedRide?.id || !user) return;
    try {
      const fare = acceptedRide.fare || 15;
      
      // Update ride status
      await updateDoc(doc(db, 'rideRequests', acceptedRide.id), {
        status: 'Completed'
      });

      // Update provider's wallet
      await updateDoc(doc(db, 'users', user.uid), {
        walletBalance: (profile?.walletBalance || 0) + fare
      });

      // Update rider's wallet (deduct fare)
      // We need to fetch the rider's current balance first
      import('firebase/firestore').then(async ({ getDoc }) => {
        const riderDoc = await getDoc(doc(db, 'users', acceptedRide.travelerId));
        if (riderDoc.exists()) {
          const riderData = riderDoc.data();
          await updateDoc(doc(db, 'users', acceptedRide.travelerId), {
            walletBalance: (riderData.walletBalance || 0) - fare
          });
        }
      });

      setEtaMinutes(null);
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };

  // Map RideRequests to RideMarkers for the map
  const rideMarkers: RideMarker[] = openRides.map(r => ({
    id: r.id!,
    lat: r.pickupLat || 40.7128,
    lng: r.pickupLng || -74.0060,
    travelerName: r.travelerName,
    origin: r.origin,
    destination: r.destination,
    passengers: r.passengers,
    status: 'pending'
  }));

  if (acceptedRide) {
    rideMarkers.push({
      id: acceptedRide.id!,
      lat: acceptedRide.pickupLat || 40.7128,
      lng: acceptedRide.pickupLng || -74.0060,
      travelerName: acceptedRide.travelerName,
      origin: acceptedRide.origin,
      destination: acceptedRide.destination,
      passengers: acceptedRide.passengers,
      status: 'accepted'
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07161d] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07161d] relative overflow-hidden flex items-center justify-center p-6">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse delay-700" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <GlassCard className="p-8 md:p-12 text-center relative z-10">
            <div className="inline-flex p-4 bg-amber-300/10 rounded-3xl mb-6">
              <Car className="w-12 h-12 text-amber-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              TravelBook <span className="text-amber-300">Rides</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              The professional gateway for transportation providers. Register your fleet, 
              connect with travelers from the Travel Book network, and grow your business.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button onClick={login} className="flex items-center justify-center gap-3 text-lg px-10 py-4">
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </Button>
              <Button variant="secondary" className="px-10 py-4">
                Learn More
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Verified Rides", desc: "Access pre-screened travelers from trusted networks." },
                { icon: Users, title: "Fleet Management", desc: "Manage multiple vehicles and track their performance." },
                { icon: MessageSquare, title: "AI Support", desc: "Get 24/7 assistance with our Gemini-powered chatbot." }
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <feature.icon className="w-6 h-6 text-amber-300" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07161d] text-white font-sans">
      {/* Sidebar / Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 z-[9999]">
        <GlassCard className="p-2 flex justify-between md:flex-col gap-2 w-full md:w-auto">
          <div className="flex md:flex-col gap-2 flex-1 md:flex-none justify-around md:justify-start">
            {[
              { id: 'rides', icon: Navigation, label: 'Rides' },
              { id: 'vehicles', icon: Car, label: 'Fleet' },
              { id: 'wallet', icon: CreditCard, label: 'Wallet' },
              { id: 'chat', icon: MessageSquare, label: 'Support' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "p-3 md:p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 flex-1 md:flex-none",
                  activeTab === item.id ? "bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/20" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="w-px h-auto bg-white/10 md:w-8 md:h-px mx-1 md:mx-auto md:my-1" />
          <button 
            onClick={logout}
            className="p-3 md:p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all flex flex-col items-center justify-center shrink-0"
          >
            <LogOut className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:hidden mt-1">Exit</span>
          </button>
        </GlassCard>
      </nav>

      {/* Main Content */}
      <main className="md:pl-32 p-4 pb-32 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-screen flex flex-col">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 shrink-0">
          <div>
            <h2 className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs md:text-sm mb-1 md:mb-2">
              {appMode === 'provider' ? 'Provider Portal' : 'Rider Portal'}
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold">{profile?.displayName || 'User'}</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              variant="secondary" 
              onClick={() => setAppMode(prev => prev === 'provider' ? 'rider' : 'provider')}
              className="text-sm px-4 py-2 flex items-center justify-center gap-2"
            >
              Switch to {appMode === 'provider' ? 'Rider' : 'Provider'}
            </Button>
            <GlassCard className="px-4 py-2 md:px-6 md:py-3 flex items-center gap-3 w-full sm:w-auto justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-semibold text-sm md:text-base">System Online</span>
            </GlassCard>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {appMode === 'rider' ? (
            <motion.div
              key="rider-mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col"
            >
              <RiderDashboard />
            </motion.div>
          ) : (
            <>
              {activeTab === 'rides' && (
            <motion.div
              key="rides"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 flex-1"
            >
              {/* Map Section - Takes up 2 columns on large screens */}
              <div className="lg:col-span-2 h-[350px] lg:h-full min-h-[350px] relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 shrink-0">
                <RideMap 
                  rides={rideMarkers} 
                  driverLocation={driverLocation}
                  acceptedRide={rideMarkers.find(r => r.id === acceptedRide?.id) || null}
                  onAcceptRide={handleAcceptRide}
                  routeCoords={routeCoords}
                />
                
                {/* Floating Map Controls/Stats */}
                <div className="absolute top-6 left-6 z-[400] flex flex-col gap-4">
                  {!acceptedRide ? (
                    <GlassCard className="px-4 py-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-bold">{openRides.length} Requests Nearby</span>
                    </GlassCard>
                  ) : (
                    <GlassCard className="px-4 py-3 flex flex-col gap-1 border-green-500/30 bg-green-900/20">
                      <div className="flex items-center gap-2 text-green-400">
                        <Navigation className="w-4 h-4 animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider">En Route</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {etaMinutes !== null ? (
                          etaMinutes === 0 ? 'Arriving now' : `${etaMinutes} min away`
                        ) : 'Calculating...'}
                      </div>
                    </GlassCard>
                  )}
                </div>
              </div>

              {/* List Section */}
              <div className="flex flex-col gap-4 lg:gap-6 h-[500px] lg:h-full overflow-hidden">
                <div className="flex items-center justify-between shrink-0">
                  <h3 className="text-xl md:text-2xl font-bold">
                    {acceptedRide ? 'Current Ride' : 'Nearby Requests'}
                  </h3>
                  {!acceptedRide && (
                    <div className="flex gap-2">
                      <Button variant="secondary" className="p-2 rounded-xl"><Search className="w-5 h-5" /></Button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {acceptedRide ? (
                    // Accepted Ride View
                    <GlassCard className="p-5 border-green-500/50 shadow-lg shadow-green-500/10">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-bold shadow-inner text-lg">
                              {acceptedRide.travelerName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{acceptedRide.travelerName}</h4>
                              <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                                <Clock className="w-3 h-3" />
                                <span>ETA: {etaMinutes} min</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-green-400 font-bold bg-green-500/10 px-3 py-1 rounded-full">
                            <Users className="w-4 h-4" />
                            <span>{acceptedRide.passengers}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Pickup</p>
                              <p className="text-base font-medium">{acceptedRide.origin}</p>
                            </div>
                          </div>
                          <div className="w-px h-6 bg-white/10 ml-2.5" />
                          <div className="flex items-start gap-3">
                            <Navigation className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Drop-off</p>
                              <p className="text-base font-medium">{acceptedRide.destination}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="secondary" 
                            onClick={() => setIsChatOpen(true)}
                            className="flex-1 py-3 text-sm flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" /> Message
                          </Button>
                          <Button 
                            onClick={handleCompleteRide}
                            className="flex-1 py-3 text-sm bg-green-500 hover:bg-green-600 shadow-green-500/30"
                          >
                            Complete
                          </Button>
                        </div>
                      </div>
                    </GlassCard>
                  ) : (
                    // Pending Rides List
                    openRides.map((ride) => (
                      <GlassCard key={ride.id} className="p-5 hover:border-amber-300/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-amber-300/10">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-amber-400 flex items-center justify-center font-bold shadow-inner">
                                {ride.travelerName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-bold">{ride.travelerName}</h4>
                                <p className="text-white/40 text-xs">Requested recently</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-300 font-bold bg-amber-300/10 px-3 py-1 rounded-full">
                              <Users className="w-4 h-4" />
                              <span>{ride.passengers}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3 bg-black/20 p-3 rounded-2xl border border-white/5">
                            <div className="flex items-start gap-3">
                              <MapPin className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Pickup</p>
                                <p className="text-sm font-medium">{ride.origin}</p>
                              </div>
                            </div>
                            <div className="w-px h-4 bg-white/10 ml-2" />
                            <div className="flex items-start gap-3">
                              <Navigation className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Drop-off</p>
                                <p className="text-sm font-medium">{ride.destination}</p>
                              </div>
                            </div>
                          </div>
                          
                          <Button onClick={() => handleAcceptRide(ride.id!)} className="w-full py-2.5 text-sm">
                            Accept Ride
                          </Button>
                        </div>
                      </GlassCard>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

              {activeTab === 'vehicles' && (
                <motion.div
                  key="vehicles"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Your Fleet</h3>
                <Button onClick={() => setShowAddVehicle(true)} className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Vehicle
                </Button>
              </div>

              {showAddVehicle && (
                <GlassCard className="p-6 border-amber-300/30">
                  <h4 className="text-xl font-bold mb-4">Add New Vehicle</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Make (e.g. Toyota)" value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="text" placeholder="Model (e.g. Camry)" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="number" placeholder="Year" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="text" placeholder="Color" value={newVehicle.color} onChange={e => setNewVehicle({...newVehicle, color: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="text" placeholder="License Plate" value={newVehicle.licensePlate} onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                    <input type="number" placeholder="Capacity" value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})} className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" onClick={() => setShowAddVehicle(false)}>Cancel</Button>
                    <Button onClick={async () => {
                      if (!user) return;
                      await addDoc(collection(db, 'vehicles'), {
                        ...newVehicle,
                        providerId: user.uid,
                        status: 'Pending',
                        createdAt: serverTimestamp()
                      });
                      setShowAddVehicle(false);
                      setNewVehicle({ type: 'Car', make: '', model: '', year: 2024, color: '', licensePlate: '', capacity: 4 });
                    }}>Save Vehicle</Button>
                  </div>
                </GlassCard>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle, i) => (
                  <GlassCard key={vehicle.id || i} className="group">
                    <div className="aspect-video bg-white/5 relative overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/${vehicle.model || 'car'}/800/450`} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className={cn("absolute top-4 right-4 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold uppercase", vehicle.status === 'Verified' ? 'bg-green-500/80' : 'bg-yellow-500/80')}>
                        {vehicle.status}
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-1">{vehicle.make} {vehicle.model}</h4>
                      <p className="text-white/40 text-sm mb-4">{vehicle.color} • {vehicle.year} • {vehicle.licensePlate}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            <Users className="w-4 h-4 text-teal-400" />
                            <span className="text-xs ml-1">{vehicle.capacity}</span>
                          </div>
                        </div>
                        <Button 
                          variant={activeVehicleId === vehicle.id ? "primary" : "ghost"}
                          className={cn("text-sm px-4 py-2", activeVehicleId === vehicle.id ? "bg-amber-300 text-slate-950" : "")}
                          onClick={() => setActiveVehicleId(vehicle.id!)}
                        >
                          {activeVehicleId === vehicle.id ? "Active" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
                
                {vehicles.length === 0 && !showAddVehicle && (
                  <div className="col-span-full text-center py-12 text-white/40">
                    <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No vehicles added yet. Add your first vehicle to start accepting rides.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'wallet' && (
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Provider Wallet</h3>
              </div>

              <GlassCard className="p-8 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30 text-center max-w-md mx-auto">
                <CreditCard className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white/60 mb-2">Total Earnings</h4>
                <div className="text-5xl font-bold mb-8">${(profile?.walletBalance || 0).toFixed(2)}</div>
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 shadow-green-500/30"
                  onClick={() => alert("Withdrawal initiated!")}
                >
                  Withdraw Funds
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-[calc(100svh-220px)] lg:h-[calc(100vh-180px)] flex flex-col"
            >
              <GlassCard className="flex-1 flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-300/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold">Gemini Support</h3>
                    <p className="text-xs text-green-400 font-bold uppercase tracking-widest">AI Assistant Online</p>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  <div className="flex gap-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded-lg bg-amber-300 shrink-0 flex items-center justify-center text-xs font-bold text-slate-950">G</div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm leading-relaxed">
                      Hello! I'm your TravelBook Rides AI assistant. How can I help you manage your fleet or find more rides today?
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-white/10">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask anything..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-amber-300/50 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Button className="px-4 py-2 text-sm">Send</Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
            </>
          )}
          {/* Chat Window Overlay */}
          <AnimatePresence>
            {isChatOpen && acceptedRide && user && (
              <ChatWindow 
                rideId={acceptedRide.id!} 
                currentUserId={user.uid} 
                otherPartyName={acceptedRide.travelerName} 
                onClose={() => setIsChatOpen(false)} 
              />
            )}
          </AnimatePresence>
        </AnimatePresence>
      </main>
    </div>
  );
}
