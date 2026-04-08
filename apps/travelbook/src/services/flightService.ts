/**
 * flightService.ts — Amadeus Flight Search
 * Activate: add AMADEUS_API_KEY + AMADEUS_API_SECRET to .env.local
 * Docs: https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search
 */

import { User } from '@/types';
import { generateMockUser } from '@/services/dataFactory';
import { hydrateTravelBookUser } from '@/services/identityService';

export interface FlightSearchParams {
  origin: string;       // IATA code, e.g. "JFK"
  destination: string;  // IATA code, e.g. "DXB"
  date: string;         // "YYYY-MM-DD"
  passengers: number;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  seatsAvailable: number;
  cabin: string;
}

async function getAmadeusToken(): Promise<string> {
  const key = process.env.AMADEUS_API_KEY!;
  const secret = process.env.AMADEUS_API_SECRET!;
  const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${key}&client_secret=${secret}`,
  });
  if (!res.ok) throw new Error('Amadeus token request failed');
  const data = await res.json();
  return data.access_token;
}

function mapAmadeusOffer(offer: any): Flight {
  const seg = offer.itineraries?.[0]?.segments?.[0];
  if (!seg) throw new Error('Invalid Amadeus offer structure: missing itinerary/segments');
  return {
    id: offer.id,
    airline: seg.carrierCode,
    flightNumber: `${seg.carrierCode}${seg.number}`,
    origin: seg.departure.iataCode,
    destination: seg.arrival.iataCode,
    departureTime: seg.departure.at,
    arrivalTime: seg.arrival.at,
    duration: offer.itineraries?.[0]?.duration ?? 'N/A',
    price: parseFloat(offer.price?.grandTotal ?? '0'),
    currency: offer.price?.currency ?? 'USD',
    seatsAvailable: offer.numberOfBookableSeats ?? 0,
    cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
  };
}

export async function searchFlights(params: FlightSearchParams): Promise<User[]> {
  const key = process.env.AMADEUS_API_KEY;

  if (!key) {
    console.warn('[flightService] AMADEUS_API_KEY not set — returning mock flight data.');
    return getMockFlights(params);
  }

  try {
    const token = await getAmadeusToken();
    const url = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
    url.searchParams.set('originLocationCode', params.origin);
    url.searchParams.set('destinationLocationCode', params.destination);
    url.searchParams.set('departureDate', params.date);
    url.searchParams.set('adults', String(params.passengers));
    url.searchParams.set('max', '15');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Amadeus flight search failed: ${res.status}`);
    const data = await res.json();
    const flights: Flight[] = (data.data || []).map(mapAmadeusOffer);
    return flights.map((f) => hydrateTravelBookUser({
      ...generateMockUser(parseInt(f.id, 36) % 100000),
      id: f.id,
      name: `${f.airline} ${f.flightNumber}`,
      accountType: 'provider',
      providerType: 'flight',
      category: 'Airline',
      price: f.price,
      verified: true,
      provider: 'Air partner',
      location: `${f.origin} → ${f.destination}`,
    }));
  } catch (err) {
    console.error('[flightService] API error, falling back to mock:', err);
    return getMockFlights(params);
  }
}

function getMockFlights(params: FlightSearchParams): User[] {
  return Array.from({ length: 8 }, (_, i) =>
    hydrateTravelBookUser({
      ...generateMockUser(200 + i),
      id: `flight-mock-${i}`,
      name: ['SkyLink Air', 'Global Air', 'North Star', 'AeroJet', 'SunWing'][i % 5] + ` FL${100 + i}`,
      accountType: 'provider',
      providerType: 'flight',
      category: 'Airline',
      price: 250 + i * 45,
      verified: true,
      provider: 'Air partner',
      location: `${params.origin || 'NYC'} → ${params.destination || 'DXB'}`,
    }),
  );
}
