'use client';
/**
 * TravelerRideMap.tsx — Leaflet map for the traveler ride booking flow.
 * Imported dynamically (ssr: false) in RideBookingView to avoid SSR issues.
 */

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's broken default icon paths in bundled environments
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function pulsingDivIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:56px;height:56px;display:flex;align-items:center;justify-content:center">
        <div style="position:absolute;inset:0;background:${color};border-radius:50%;opacity:.3;animation:tb-ping 1.6s ease-out infinite"></div>
        <div style="position:relative;z-index:10;width:36px;height:36px;background:${color};border-radius:50%;
             border:3px solid rgba(255,255,255,.85);box-shadow:0 4px 14px rgba(0,0,0,.4);
             display:flex;align-items:center;justify-content:center;font-size:16px">${label}</div>
      </div>`,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
}

function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true, duration: 1.2 });
  }, [lat, lng, map]);
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

export interface TravelerRideMapProps {
  userLat: number;
  userLng: number;
  driverLat?: number | null;
  driverLng?: number | null;
  rideStatus?: string;
}

export default function TravelerRideMap({
  userLat, userLng, driverLat, driverLng, rideStatus,
}: TravelerRideMapProps) {
  const focusLat = rideStatus === 'Accepted' && driverLat ? driverLat : userLat;
  const focusLng = rideStatus === 'Accepted' && driverLng ? driverLng : userLng;

  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '1.5rem', overflow: 'hidden', position: 'relative' }}>
      <style>{`@keyframes tb-ping{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(2.2);opacity:0}}`}</style>
      <MapContainer
        center={[userLat, userLng]}
        zoom={14}
        style={{ height: '100%', width: '100%', background: '#07161d' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController lat={focusLat} lng={focusLng} />

        {/* Traveler / pickup pin */}
        <Marker position={[userLat, userLng]} icon={pulsingDivIcon('#14b8a6', '📍')}>
          <Popup><b>Your pickup</b></Popup>
        </Marker>

        {/* Driver pin — visible once ride is Accepted */}
        {driverLat && driverLng && (
          <Marker position={[driverLat, driverLng]} icon={pulsingDivIcon('#f59e0b', '🚗')}>
            <Popup><b>Your driver</b></Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Edge vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '1.5rem', pointerEvents: 'none',
        boxShadow: 'inset 0 0 80px rgba(7,22,29,.75)',
      }} />
    </div>
  );
}
