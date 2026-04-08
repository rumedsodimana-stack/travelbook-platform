/**
 * entertainmentService.ts — Viator Tours & Activities
 * Activate: add VIATOR_API_KEY to .env.local (server-side only)
 * Docs: https://docs.viator.com/partner-api/technical/
 */

import { User } from '@/types';
import { generateMockUser } from '@/services/dataFactory';
import { hydrateTravelBookUser } from '@/services/identityService';

export interface ActivitySearchParams {
  destinationId?: string;  // Viator destination ID
  destName?: string;       // Human-readable fallback for mock
  startDate?: string;      // "YYYY-MM-DD"
  endDate?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  duration: string;
  imageUrl?: string;
  bookingUrl?: string;
  category?: string;
}

function mapViatorProduct(p: any): Activity {
  return {
    id: p.productCode || p.webURL,
    title: p.title,
    description: p.description || '',
    price: p.pricing?.summary?.fromPrice || 0,
    currency: p.pricing?.currency || 'USD',
    rating: p.reviews?.combinedAverageRating || 0,
    reviewCount: p.reviews?.totalReviews || 0,
    duration: p.duration?.fixedDurationInMinutes
      ? `${Math.round(p.duration.fixedDurationInMinutes / 60)}h`
      : 'Varies',
    imageUrl: p.images?.[0]?.variants?.[0]?.url,
    bookingUrl: p.webURL,
    category: p.categories?.[0]?.groupName,
  };
}

export async function searchActivities(params: ActivitySearchParams): Promise<User[]> {
  const key = process.env.VIATOR_API_KEY;

  if (!key) {
    console.warn('[entertainmentService] VIATOR_API_KEY not set — returning mock activities.');
    return getMockActivities(params);
  }

  try {
    const res = await fetch('https://api.viator.com/partner/products/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'en-US',
        'exp-api-key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filtering: { destination: params.destinationId },
        startDate: params.startDate,
        endDate: params.endDate,
        pagination: { start: 1, count: 15 },
        currency: 'USD',
      }),
    });

    if (!res.ok) throw new Error(`Viator search failed: ${res.status}`);
    const data = await res.json();
    const activities: Activity[] = (data.products || []).map(mapViatorProduct);

    return activities.map((a) => hydrateTravelBookUser({
      ...generateMockUser(Math.abs(parseInt(a.id.slice(-5), 36)) % 100000),
      id: a.id,
      name: a.title,
      accountType: 'provider',
      providerType: 'entertainment',
      category: 'Entertainment Provider',
      price: a.price,
      verified: true,
      provider: 'Entertainment partner',
      location: params.destName || 'Popular destination',
      avatar: a.imageUrl || `https://picsum.photos/seed/${a.id}/200`,
    }));
  } catch (err) {
    console.error('[entertainmentService] API error, falling back to mock:', err);
    return getMockActivities(params);
  }
}

function getMockActivities(params: ActivitySearchParams): User[] {
  const names = [
    'Sunset Boat Tour', 'City Food Walk', 'Mountain Hike & Sunset', 'Cultural Dance Show', 'Night Photography Tour',
  ];
  return names.map((name, i) =>
    hydrateTravelBookUser({
      ...generateMockUser(400 + i),
      id: `activity-mock-${i}`,
      name,
      accountType: 'provider',
      providerType: 'entertainment',
      category: 'Entertainment Provider',
      price: 35 + i * 25,
      verified: true,
      provider: 'Entertainment partner',
      location: params.destName || 'Popular destination',
    }),
  );
}
