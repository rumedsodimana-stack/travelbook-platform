import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Car } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createDriverIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <div class="absolute inset-0 bg-amber-300 rounded-full animate-ping opacity-20"></div>
        <div class="relative z-10 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-400 to-amber-400 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-md text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createLocationIcon = (isDestination: boolean = false) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative flex items-center justify-center w-10 h-10">
        <div class="relative z-10 flex items-center justify-center w-8 h-8 ${isDestination ? 'bg-amber-400' : 'bg-green-500'} rounded-full shadow-lg border-2 border-white/20 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

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

interface RiderMapProps {
  userLocation: [number, number] | null;
  destinationLocation?: [number, number] | null;
  driverLocation?: [number, number] | null;
  rideStatus: 'idle' | 'searching' | 'accepted' | 'arriving' | 'in_progress';
  routeCoords?: [number, number][] | null;
}

export default function RiderMap({ userLocation, destinationLocation, driverLocation, rideStatus, routeCoords }: RiderMapProps) {
  const [localUserLocation, setLocalUserLocation] = useState<[number, number]>([40.7128, -74.0060]);

  useEffect(() => {
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocalUserLocation([position.coords.latitude, position.coords.longitude]),
        (error) => console.error("Error getting location", error)
      );
    }
  }, [userLocation]);

  const currentLocation = userLocation || localUserLocation;

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
          <Polyline positions={routeCoords} color="#8b5cf6" weight={5} opacity={0.8} />
        )}

        {/* User Location Marker (Pickup) */}
        <Marker position={currentLocation} icon={createLocationIcon(false)}>
          <Popup>
            <div className="text-center text-gray-900">
              <p className="font-bold text-lg mb-1">Pickup Location</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        {destinationLocation && (
          <Marker position={destinationLocation} icon={createLocationIcon(true)}>
            <Popup>
              <div className="text-center text-gray-900">
                <p className="font-bold text-lg mb-1">Drop-off Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line from Pickup to Destination */}
        {destinationLocation && rideStatus === 'in_progress' && (
          <Polyline 
            positions={[currentLocation, destinationLocation]} 
            color="#6366f1" 
            weight={4} 
            dashArray="10, 10" 
          />
        )}

        {/* Driver Location Marker */}
        {driverLocation && (rideStatus === 'accepted' || rideStatus === 'arriving') && (
          <Marker position={driverLocation} icon={createDriverIcon()}>
            <Popup>
              <div className="text-center text-gray-900">
                <p className="font-bold text-lg mb-1">Your Driver</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line from Driver to Pickup */}
        {driverLocation && (rideStatus === 'accepted' || rideStatus === 'arriving') && (
          <Polyline 
            positions={[driverLocation, currentLocation]} 
            color="#3b82f6" 
            weight={4} 
            dashArray="10, 10" 
            className="animate-pulse"
          />
        )}

      </MapContainer>
      
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(15,23,42,0.8)] z-[400] rounded-3xl" />
    </div>
  );
}
