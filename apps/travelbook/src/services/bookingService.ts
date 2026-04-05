import { User } from '@/types';
import { generateMockUser } from '@/services/dataFactory';
import { hydrateTravelBookUser } from '@/services/identityService';
import { searchFlights } from '@/services/flightService';
import { searchEvents } from '@/services/eventsService';
import { searchActivities } from '@/services/entertainmentService';

export const INTERCONNECT_CONFIG = {
  SABRE: { name: 'Sabre Mosaic / REST GDS', status: 'connected', region: 'US-EAST-1', capabilities: ['NDC Air', 'Hotel Pro', 'Car MOVE'] },
  BIZTRIP_AI: { name: 'BizTrip Agent Orchestrator', status: 'active', version: '2.4.0-agentic', capabilities: ['Policy Check', 'Rebooking', 'Disruption Handling'] },
  PAY_SHIELD: { name: 'Payment Settlement', status: 'online', networks: ['Stripe Connect', 'Bank Transfer'] },
};

/**
 * Main search dispatcher — routes each category to its real API service
 * (with automatic mock fallback when API keys are not configured).
 */
export const searchGlobalProviders = async (
  category: string,
  criteria: Record<string, unknown>,
): Promise<User[]> => {
  const location = (criteria.location as string) || 'Global';

  // --- Flight search via Amadeus ---
  if (category === 'flight') {
    return searchFlights({
      origin: (criteria.origin as string) || 'JFK',
      destination: (criteria.destination as string) || 'DXB',
      date: (criteria.date as string) || new Date().toISOString().slice(0, 10),
      passengers: (criteria.passengers as number) || 1,
    });
  }

  // --- Event search via Ticketmaster ---
  if (category === 'event') {
    return searchEvents({ city: location });
  }

  // --- Entertainment / activities via Viator ---
  if (category === 'entertainment') {
    return searchActivities({ destName: location });
  }

  // --- Transport: handled by RideBookingView directly (Firebase live flow) ---
  // searchGlobalProviders('transport') is kept for legacy callers but returns mock.

  // --- Hotels, Tours, Transport — mock (plug in real API here) ---
  await new Promise((resolve) => setTimeout(resolve, 800));
  const results: User[] = [];
  const seed = Math.floor(Math.random() * 1000000);

  for (let i = 0; i < 15; i++) {
    const user = generateMockUser(seed + i);
    const providerNames: Record<string, string[]> = {
      hotel: ['Grand Hotel', 'Boutique Stay', 'City Suites', 'Eco Retreat'],
      transport: ['Rail Link', 'Metro Ride', 'Shuttle Line', 'City Transfer'],
      tour: ['Island Trail Co.', 'Hidden City Walks', 'Mountain Story Tours', 'Local Roots Travel'],
    };
    const possibleNames = providerNames[category] || ['Provider'];
    const namePrefix = possibleNames[i % possibleNames.length];
    const categoryLabelMap: Record<string, string> = {
      hotel: 'Hotel', transport: 'Transport Provider', tour: 'Tour Provider',
    };
    const providerLabelMap: Record<string, string> = {
      hotel: 'Stay partner', transport: 'Transport partner', tour: 'Tour operator',
    };

    results.push(
      hydrateTravelBookUser({
        ...user,
        name: `${namePrefix} #${seed + i}`,
        accountType: 'provider',
        membershipTier: i % 7 === 0 ? 'gold' : 'premium',
        providerType: category === 'transport' ? 'transport' : (category as User['providerType']),
        category: categoryLabelMap[category] || 'Travel Provider',
        price: Math.floor(Math.random() * 500) + 50,
        verified: true,
        provider: providerLabelMap[category] || 'Travel partner',
        location,
      }),
    );
  }
  return results;
};

export const validateInventory = async (_name: string) => {
  return { available: true, price: 100 };
};
