import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Users, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom HTML Icon for Ride Requests
const createCustomIcon = (passengers: number, isAccepted: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center w-12 h-12">
        <div class="absolute inset-0 ${isAccepted ? 'bg-green-500' : 'bg-amber-300'} rounded-full animate-ping opacity-20"></div>
        <div class="relative z-10 flex items-center justify-center w-10 h-10 ${isAccepted ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-teal-400 to-amber-400'} rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md text-white font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          ${passengers}
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// Component to recenter map when location changes and fix rendering issues
function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), {
      animate: true,
      duration: 1.5
    });
  }, [lat, lng, map]);
  
  return null;
}

export interface RideMarker {
  id: string;
  lat: number;
  lng: number;
  travelerName: string;
  origin: string;
  destination: string;
  passengers: number;
  status?: 'pending' | 'accepted' | 'completed';
}

interface RideMapProps {
  rides: RideMarker[];
  driverLocation: [number, number] | null;
  acceptedRide: RideMarker | null;
  onAcceptRide?: (id: string) => void;
  routeCoords?: [number, number][] | null;
}

export default function RideMap({ rides, driverLocation, acceptedRide, onAcceptRide, routeCoords }: RideMapProps) {
  const [localUserLocation, setLocalUserLocation] = useState<[number, number]>([40.7128, -74.0060]);

  useEffect(() => {
    if (!driverLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error("Error getting location", error)
      );
    }
  }, [driverLocation]);

  const currentLocation = driverLocation || localUserLocation;

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 relative z-0 bg-[#07161d]">
      <MapContainer 
        center={currentLocation} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={!L.Browser.mobile}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapController lat={currentLocation[0]} lng={currentLocation[1]} />

        {routeCoords && routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#3b82f6" weight={5} opacity={0.8} />
        )}

        {/* Driver Location Marker */}
        <Marker position={currentLocation}>
          <Popup>
            <div className="text-center text-gray-900">
              <p className="font-bold text-lg mb-1">Your Location</p>
              <p className="text-gray-600 text-sm">
                {acceptedRide ? 'En route to pickup' : 'Ready to accept rides'}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Route Line if ride is accepted */}
        {acceptedRide && (
          <Polyline 
            positions={[currentLocation, [acceptedRide.lat, acceptedRide.lng]]} 
            color="#3b82f6" 
            weight={4} 
            dashArray="10, 10" 
            className="animate-pulse"
          />
        )}

        {/* Ride Request Markers */}
        {rides.map((ride) => {
          const isAccepted = acceptedRide?.id === ride.id;
          if (ride.status === 'accepted' && !isAccepted) return null; // Hide other accepted rides

          return (
            <Marker 
              key={ride.id} 
              position={[ride.lat, ride.lng]}
              icon={createCustomIcon(ride.passengers, isAccepted)}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px] text-gray-900">
                  <h4 className="font-bold text-lg mb-2">{ride.travelerName}</h4>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{ride.origin}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Navigation className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{ride.destination}</span>
                    </div>
                  </div>
                  {!isAccepted ? (
                    <button 
                      onClick={() => onAcceptRide?.(ride.id)}
                      className="w-full bg-amber-300 text-slate-950 font-bold py-2 rounded-xl hover:scale-105 transition-transform"
                    >
                      Accept Ride
                    </button>
                  ) : (
                    <div className="w-full bg-green-100 text-green-700 py-2 rounded-xl font-bold text-center border border-green-200">
                      Ride Accepted
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(15,23,42,0.8)] z-[400] rounded-3xl" />
    </div>
  );
}
