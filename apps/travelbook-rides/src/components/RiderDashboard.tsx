import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Car, 
  Clock, 
  ShieldCheck, 
  Star,
  MessageSquare,
  History,
  CreditCard,
  Zap,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { cn } from '../lib/utils';
import RiderMap from './RiderMap';
import ChatWindow from './ChatWindow';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { RideRequest } from '../types';

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl", className)}>
    {children}
  </div>
);

const Button = ({ children, className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md",
    outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10"
  };
  
  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Helper to calculate distance
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function RiderDashboard() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'wallet'>('book');
  const [rideHistory, setRideHistory] = useState<RideRequest[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<[number, number] | null>(null);
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  
  const [destinationText, setDestinationText] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [rideType, setRideType] = useState<'standard' | 'robotaxi'>('standard');
  const [rideStatus, setRideStatus] = useState<'idle' | 'searching' | 'accepted' | 'arriving' | 'in_progress'>('idle');
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const [activeRideId, setActiveRideId] = useState<string | null>(null);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [routeIndex, setRouteIndex] = useState(0);

  // Initialize user location
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setUserLocation([40.7128, -74.0060]) // Fallback NYC
      );
    }
  }, []);

  // Listen to active ride
  useEffect(() => {
    if (!activeRideId) {
      setActiveRide(null);
      return;
    }

    const unsub = onSnapshot(doc(db, 'rideRequests', activeRideId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RideRequest;
        setActiveRide({ id: docSnap.id, ...data });
        
        if (data.status === 'Accepted') {
          setRideStatus('accepted');
        } else if (data.status === 'Completed') {
          setRideStatus('idle');
          setActiveRideId(null);
          setDestinationText('');
          setDestinationLocation(null);
          setDriverLocation(null);
          setActiveTab('history');
        } else if (data.status === 'Cancelled') {
          setRideStatus('idle');
          setActiveRideId(null);
          setDestinationText('');
          setDestinationLocation(null);
          setDriverLocation(null);
        }

        if (data.driverLat && data.driverLng) {
          // Only update from Firestore if we are NOT the ones simulating it locally
          if (data.providerId !== 'tesla-network') {
            setDriverLocation([data.driverLat, data.driverLng]);
          }
        }
      }
    });

    return () => unsub();
  }, [activeRideId]);

  // Auto-accept and simulate Robo Taxi movement
  useEffect(() => {
    if (activeRide?.status === 'Open' && activeRide.rideType === 'robotaxi') {
      const timer = setTimeout(async () => {
        try {
          await updateDoc(doc(db, 'rideRequests', activeRide.id!), {
            status: 'Accepted',
            providerId: 'tesla-network',
            driverLat: (activeRide.pickupLat || 40.7128) - 0.015,
            driverLng: (activeRide.pickupLng || -74.0060) - 0.015
          });
        } catch (e) {
          console.error("Error auto-accepting robotaxi:", e);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeRide?.status, activeRide?.rideType, activeRide?.id, activeRide?.pickupLat, activeRide?.pickupLng]);

  // Fetch Route from OSRM when ride is accepted
  useEffect(() => {
    if ((rideStatus === 'accepted' || rideStatus === 'arriving') && driverLocation && userLocation && !routeCoords) {
      const fetchRoute = async () => {
        try {
          const startLat = driverLocation[0];
          const startLng = driverLocation[1];
          const endLat = userLocation[0];
          const endLng = userLocation[1];
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
    } else if (rideStatus === 'idle') {
      setRouteCoords(null);
      setRouteIndex(0);
    }
  }, [rideStatus]);

  // Simulate Robo Taxi movement along the route
  useEffect(() => {
    if (activeRide?.status === 'Accepted' && activeRide.providerId === 'tesla-network' && routeCoords) {
      const timer = setInterval(() => {
        setDriverLocation(prev => {
          if (!prev) return prev;
          if (routeIndex >= routeCoords.length) return prev;

          const target = routeCoords[routeIndex];
          const speed = 0.0003;
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

          // Sync to Firestore
          updateDoc(doc(db, 'rideRequests', activeRide.id!), {
            driverLat: newLoc[0],
            driverLng: newLoc[1]
          }).catch(e => console.error(e));

          return newLoc;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeRide?.status, activeRide?.providerId, activeRide?.id, routeCoords, routeIndex]);

  const handleRequestRide = async () => {
    if (!destinationText || !user || !profile) return;
    
    let destLoc: [number, number] = [40.7328, -73.9860];
    if (userLocation) {
      destLoc = [userLocation[0] + 0.02, userLocation[1] + 0.02];
    }
    setDestinationLocation(destLoc);

    setRideStatus('searching');

    // Calculate estimated fare based on distance
    const pickupLat = userLocation ? userLocation[0] : 40.7128;
    const pickupLng = userLocation ? userLocation[1] : -74.0060;
    const distanceKm = getDistanceFromLatLonInKm(pickupLat, pickupLng, destLoc[0], destLoc[1]);
    const baseFare = 5;
    const perKmRate = rideType === 'robotaxi' ? 1.5 : 2.5; // Robotaxi is cheaper
    const estimatedFare = Math.round((baseFare + (distanceKm * perKmRate)) * 100) / 100;

    try {
      const docRef = await addDoc(collection(db, 'rideRequests'), {
        travelerId: user.uid,
        travelerName: profile.displayName || 'Traveler',
        origin: 'Current Location',
        destination: destinationText,
        passengers: passengers,
        rideType: rideType,
        status: 'Open',
        pickupLat: pickupLat,
        pickupLng: pickupLng,
        dropoffLat: destLoc[0],
        dropoffLng: destLoc[1],
        fare: estimatedFare,
        createdAt: serverTimestamp()
      });
      setActiveRideId(docRef.id);
    } catch (error) {
      console.error("Error creating ride request:", error);
      setRideStatus('idle');
    }
  };

  const handleAiBooking = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse the following ride request: "${aiPrompt}". 
        Return JSON with:
        - destination: The intended destination.
        - passengers: Number of passengers (default 1).
        - rideType: Either 'standard' or 'robotaxi' (default 'standard' unless autonomous, self-driving, or robotaxi is mentioned).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              passengers: { type: Type.INTEGER },
              rideType: { type: Type.STRING }
            },
            required: ['destination', 'passengers', 'rideType']
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setDestinationText(result.destination);
        setPassengers(result.passengers);
        if (result.rideType === 'robotaxi' || result.rideType === 'standard') {
          setRideType(result.rideType);
        }
        setAiPrompt('');
      }
    } catch (error) {
      console.error("AI Booking failed:", error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Calculate ETA
  useEffect(() => {
    if (!driverLocation || !userLocation || (rideStatus !== 'accepted' && rideStatus !== 'arriving')) {
      setEtaMinutes(null);
      return;
    }

    const distanceKm = getDistanceFromLatLonInKm(driverLocation[0], driverLocation[1], userLocation[0], userLocation[1]);
    const estimatedMinutes = Math.ceil(distanceKm / 0.5); // 30km/h
    setEtaMinutes(estimatedMinutes > 0 ? estimatedMinutes : 0);
    
    if (estimatedMinutes === 0 && rideStatus === 'accepted') {
        setRideStatus('arriving');
    }
  }, [driverLocation, userLocation, rideStatus]);

  // Fetch Ride History
  useEffect(() => {
    if (activeTab === 'history' && user) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const q = query(
            collection(db, 'rideRequests'),
            where('travelerId', '==', user.uid),
            where('status', '==', 'Completed'),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const historyData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as RideRequest[];
          setRideHistory(historyData);
        } catch (error) {
          console.error("Error fetching ride history:", error);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, user]);

  const handleCompleteRide = async () => {
    // This is now handled by the provider side, but we keep it for testing/fallback if needed
    if (!user || !profile || !activeRideId) return;
    
    try {
      await updateDoc(doc(db, 'rideRequests', activeRideId), {
        status: 'Completed',
        fare: Math.floor(Math.random() * 20) + 15
      });
    } catch (error) {
      console.error("Error saving completed ride:", error);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRideId) return;
    try {
      await updateDoc(doc(db, 'rideRequests', activeRideId), {
        status: 'Cancelled'
      });
    } catch (error) {
      console.error("Error cancelling ride:", error);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8 flex-1">
      {/* Map Section */}
      <div className="lg:col-span-2 h-[350px] lg:h-full min-h-[350px] relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 shrink-0">
        <RiderMap 
          userLocation={userLocation}
          destinationLocation={destinationLocation}
          driverLocation={driverLocation}
          rideStatus={rideStatus}
          routeCoords={routeCoords}
        />
        
        {/* Floating Map Controls/Stats */}
        <div className="absolute top-6 left-6 z-[400] flex flex-col gap-4">
          {rideStatus === 'accepted' || rideStatus === 'arriving' ? (
            <GlassCard className="px-4 py-3 flex flex-col gap-1 border-amber-300/20 bg-amber-500/10">
              <div className="flex items-center gap-2 text-amber-300">
                <Car className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider">Driver En Route</span>
              </div>
              <div className="text-2xl font-bold">
                {etaMinutes !== null ? (
                  etaMinutes === 0 ? 'Arriving now' : `${etaMinutes} min away`
                ) : 'Calculating...'}
              </div>
            </GlassCard>
          ) : null}
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-4 lg:gap-6 h-[500px] lg:h-full overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-xl md:text-2xl font-bold">
            {activeTab === 'history' ? 'Ride History' :
             rideStatus === 'idle' ? 'Book a Ride' : 
             rideStatus === 'searching' ? 'Finding a Driver...' : 
             'Your Ride'}
          </h3>
          <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('book')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === 'book' ? "bg-amber-300 text-slate-950" : "text-white/60 hover:text-white"
              )}
            >
              Book
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === 'history' ? "bg-amber-300 text-slate-950" : "text-white/60 hover:text-white"
              )}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === 'wallet' ? "bg-amber-300 text-slate-950" : "text-white/60 hover:text-white"
              )}
            >
              Wallet
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'wallet' ? (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <GlassCard className="p-6 bg-gradient-to-br from-teal-900/30 to-amber-900/10 border-amber-300/20 text-center">
                  <CreditCard className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white/60 mb-1">Current Balance</h4>
                  <div className="text-4xl font-bold mb-6">${(profile?.walletBalance || 0).toFixed(2)}</div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      if (!user) return;
                      await updateDoc(doc(db, 'users', user.uid), {
                        walletBalance: (profile?.walletBalance || 0) + 50
                      });
                    }}
                  >
                    Add $50.00
                  </Button>
                </GlassCard>
              </motion.div>
            ) : activeTab === 'history' ? (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                {loadingHistory ? (
                  <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : rideHistory.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <History className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No Past Rides</h4>
                    <p className="text-white/60">You haven't taken any rides yet.</p>
                  </GlassCard>
                ) : (
                  rideHistory.map((ride) => (
                    <GlassCard key={ride.id} className="p-5 border-white/10 hover:border-white/20 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-sm text-white/60 mb-1">
                            {ride.createdAt ? new Date((ride.createdAt as any).toDate()).toLocaleDateString() : 'Unknown Date'}
                          </div>
                          <div className="font-bold text-lg">${ride.fare?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          Completed
                        </div>
                      </div>
                      
                      <div className="space-y-3 relative before:absolute before:inset-y-3 before:left-2.5 before:w-0.5 before:bg-white/10">
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-[#07161d] border-4 border-green-500 flex-shrink-0" />
                          <span className="text-white/80 text-sm">{ride.origin}</span>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-5 h-5 rounded-full bg-[#07161d] border-4 border-teal-400 flex-shrink-0" />
                          <span className="text-white/80 text-sm">{ride.destination}</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </motion.div>
            ) : (
              <>
                {rideStatus === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                <GlassCard className="p-5 flex flex-col gap-5">
                  <div className="space-y-4">
                    {/* AI Concierge */}
                    <div className="bg-gradient-to-r from-teal-500/10 to-amber-500/10 border border-amber-300/20 rounded-2xl p-4">
                      <div className="flex items-center gap-2 mb-3 text-amber-300">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-bold text-sm">AI Concierge</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="e.g. I need a robotaxi to JFK for 3 people" 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAiBooking()}
                          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-300 transition-colors"
                        />
                        <button 
                          onClick={handleAiBooking}
                          disabled={isAiProcessing || !aiPrompt.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-300 rounded-lg text-slate-950 disabled:opacity-50 disabled:bg-white/10 transition-colors"
                        >
                          {isAiProcessing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <button 
                        onClick={() => setRideType('standard')} 
                        className={cn("flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all", rideType === 'standard' ? "bg-amber-300/20 border-amber-300 text-amber-300" : "border-white/10 text-white/60 hover:bg-white/5")}
                      >
                        <Car className="w-6 h-6" />
                        <span className="text-sm font-bold">Standard</span>
                      </button>
                      <button 
                        onClick={() => setRideType('robotaxi')} 
                        className={cn("flex-1 py-3 rounded-xl border flex flex-col items-center gap-2 transition-all", rideType === 'robotaxi' ? "bg-teal-500/20 border-teal-400 text-teal-400" : "border-white/10 text-white/60 hover:bg-white/5")}
                      >
                        <Zap className="w-6 h-6" />
                        <span className="text-sm font-bold">Robo Taxi</span>
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full" />
                      <input 
                        type="text" 
                        value="Current Location" 
                        disabled
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white/60 cursor-not-allowed"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full" />
                      <input 
                        type="text" 
                        placeholder="Where to?" 
                        value={destinationText}
                        onChange={(e) => setDestinationText(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="font-medium text-white/80">Passengers</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >-</button>
                      <span className="font-bold text-lg w-4 text-center">{passengers}</span>
                      <button 
                        onClick={() => setPassengers(Math.min(6, passengers + 1))}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >+</button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRequestRide} 
                    disabled={!destinationText}
                    className="w-full py-4 text-lg mt-2"
                  >
                    Request Ride
                  </Button>
                </GlassCard>
              </motion.div>
            )}

            {rideStatus === 'searching' && (
              <motion.div
                key="searching"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-amber-300/20 rounded-full animate-ping" />
                  <div className="absolute inset-2 border-4 border-teal-400/50 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="w-8 h-8 text-amber-300 animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Finding your driver</h3>
                <p className="text-white/60">Connecting to the RideConnect network...</p>
                
                <Button 
                  variant="secondary" 
                  onClick={handleCancelRide}
                  className="mt-8"
                >
                  Cancel Request
                </Button>
              </motion.div>
            )}

            {(rideStatus === 'accepted' || rideStatus === 'arriving') && (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="p-5 border-amber-300/50 shadow-lg shadow-amber-300/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      {activeRide?.providerId === 'tesla-network' ? (
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full border-2 border-teal-400 bg-teal-400/20 flex items-center justify-center">
                              <Zap className="w-8 h-8 text-teal-400" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#0f172a]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-teal-400">Tesla Cybercab</h4>
                            <div className="flex items-center gap-1 text-teal-400/60 text-sm font-medium">
                              <span>Autonomous Network</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src="https://picsum.photos/seed/driver1/100/100" 
                              alt="Driver" 
                              className="w-14 h-14 rounded-full border-2 border-amber-300 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#0f172a]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">Alex M.</h4>
                            <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                              <Star className="w-4 h-4 fill-current" />
                              <span>4.9 (120 rides)</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {activeRide?.providerId === 'tesla-network' 
                            ? 'Cybercab' 
                            : activeRide?.vehicleDetails 
                              ? `${activeRide.vehicleDetails.make} ${activeRide.vehicleDetails.model}`
                              : 'Toyota Prius'}
                        </div>
                        <div className="text-white/60 text-sm">
                          {activeRide?.providerId === 'tesla-network' 
                            ? 'TSLA-01' 
                            : activeRide?.vehicleDetails?.licensePlate || 'ABC-1234'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="secondary" 
                        onClick={() => setIsChatOpen(true)}
                        className="flex-1 py-3 text-sm flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" /> Contact
                      </Button>
                      <Button className="flex-1 py-3 text-sm flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Share Status
                      </Button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={handleCancelRide}
                        className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCompleteRide}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-green-500/30"
                      >
                        Complete Trip
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isChatOpen && activeRide && user && (
          <ChatWindow 
            rideId={activeRide.id!} 
            currentUserId={user.uid} 
            otherPartyName={activeRide.providerId === 'tesla-network' ? 'Tesla Network' : 'Alex M.'} 
            onClose={() => setIsChatOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
