/**
 * mapsService.ts — Mapbox Geocoding
 * Activate: add NEXT_PUBLIC_MAPBOX_KEY to .env.local
 * Key signup: https://account.mapbox.com/access-tokens/
 */

export interface GeoResult {
  lat: number;
  lng: number;
  placeName: string;
}

export async function geocode(query: string): Promise<GeoResult[]> {
  const key = process.env.NEXT_PUBLIC_MAPBOX_KEY;

  if (!key) {
    console.warn('[mapsService] NEXT_PUBLIC_MAPBOX_KEY not set — returning empty geocode results.');
    return [];
  }

  const encoded = encodeURIComponent(query);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${key}&limit=5`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Mapbox geocode failed: ${res.status}`);

  const data = await res.json();
  return (data.features || []).map((f: any) => ({
    lat: f.center[1],
    lng: f.center[0],
    placeName: f.place_name,
  }));
}
