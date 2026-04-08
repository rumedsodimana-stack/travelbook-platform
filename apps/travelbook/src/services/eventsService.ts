/**
 * eventsService.ts — Ticketmaster Discovery API
 * FREE tier available — get a key at: https://developer-acct.ticketmaster.com/user/register
 * Activate: add NEXT_PUBLIC_TICKETMASTER_KEY to .env.local
 */

import { User } from '@/types';
import { generateMockUser } from '@/services/dataFactory';
import { hydrateTravelBookUser } from '@/services/identityService';

export interface EventSearchParams {
  city: string;
  countryCode?: string;  // ISO 2-letter, e.g. "US"
  startDate?: string;    // "YYYY-MM-DDTHH:mm:ssZ"
  endDate?: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  priceMin: number;
  priceMax: number;
  url: string;
  imageUrl?: string;
  genre?: string;
}

function mapTMEvent(e: any): Event {
  return {
    id: e.id,
    name: e.name,
    venue: e._embedded?.venues?.[0]?.name || 'Venue TBD',
    city: e._embedded?.venues?.[0]?.city?.name || '',
    date: e.dates?.start?.localDate || '',
    priceMin: e.priceRanges?.[0]?.min || 0,
    priceMax: e.priceRanges?.[0]?.max || 0,
    url: e.url || '',
    imageUrl: e.images?.[0]?.url,
    genre: e.classifications?.[0]?.genre?.name,
  };
}

export async function searchEvents(params: EventSearchParams): Promise<User[]> {
  const key = process.env.NEXT_PUBLIC_TICKETMASTER_KEY;

  if (!key) {
    console.warn('[eventsService] NEXT_PUBLIC_TICKETMASTER_KEY not set — returning mock events.');
    return getMockEvents(params);
  }

  try {
    const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    url.searchParams.set('apikey', key);
    url.searchParams.set('city', params.city);
    if (params.countryCode) url.searchParams.set('countryCode', params.countryCode);
    if (params.startDate) url.searchParams.set('startDateTime', params.startDate);
    if (params.endDate) url.searchParams.set('endDateTime', params.endDate);
    url.searchParams.set('size', '15');

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Ticketmaster search failed: ${res.status}`);
    const data = await res.json();
    const events: Event[] = (data._embedded?.events || []).map(mapTMEvent);

    return events.map((ev) => hydrateTravelBookUser({
      ...generateMockUser(parseInt(ev.id.slice(-6), 16) % 100000),
      id: ev.id,
      name: ev.name,
      accountType: 'provider',
      providerType: 'event',
      category: 'Event',
      price: ev.priceMin || 50,
      verified: true,
      provider: 'Event partner',
      location: `${ev.venue}, ${ev.city}`,
      avatar: ev.imageUrl || `https://picsum.photos/seed/${ev.id}/200`,
    }));
  } catch (err) {
    console.error('[eventsService] API error, falling back to mock:', err);
    return getMockEvents(params);
  }
}

function getMockEvents(params: EventSearchParams): User[] {
  const names = ['City Music Fest', 'Sunset Night Pass', 'Food & Culture Fair', 'Art Biennale', 'Jazz in the Park'];
  return names.map((name, i) =>
    hydrateTravelBookUser({
      ...generateMockUser(300 + i),
      id: `event-mock-${i}`,
      name,
      accountType: 'provider',
      providerType: 'event',
      category: 'Event',
      price: 30 + i * 20,
      verified: true,
      provider: 'Event partner',
      location: params.city || 'Popular city',
    }),
  );
}
