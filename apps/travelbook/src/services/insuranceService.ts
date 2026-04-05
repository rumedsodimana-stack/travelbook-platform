/**
 * insuranceService.ts — Cover Genius XCover API
 * Activate: add XCOVER_API_KEY + XCOVER_PARTNER_CODE to .env.local
 * Docs: https://docs.xcover.com/reference/get-quote
 */

export interface InsuranceSearchParams {
  destination: string;
  startDate: string;   // "YYYY-MM-DD"
  endDate: string;     // "YYYY-MM-DD"
  travelers: number;
  coverageType?: 'comprehensive' | 'medical_only' | 'cancellation';
}

export interface InsuranceQuote {
  id: string;
  provider: string;
  planName: string;
  coverageType: string;
  pricePerTraveler: number;
  totalPrice: number;
  currency: string;
  highlights: string[];
  maxMedical: number;
  maxCancellation: number;
  quoteRef: string;
}

export async function getInsuranceQuotes(params: InsuranceSearchParams): Promise<InsuranceQuote[]> {
  const apiKey = process.env.XCOVER_API_KEY;
  const partnerCode = process.env.XCOVER_PARTNER_CODE;

  if (!apiKey || !partnerCode) {
    console.warn('[insuranceService] XCOVER_API_KEY not set — returning mock insurance quotes.');
    return getMockQuotes(params);
  }

  try {
    const res = await fetch(`https://api.xcover.com/xcover/partners/${partnerCode}/quotes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${apiKey}`,
      },
      body: JSON.stringify({
        request: [{
          policy_type: 'travel_insurance',
          policy_start_date: params.startDate,
          policy_end_date: params.endDate,
          destination_country: params.destination,
          travellers: Array.from({ length: params.travelers }, (_, i) => ({
            age: 30 + i * 2,
            type: 'adult',
          })),
        }],
      }),
    });

    if (!res.ok) throw new Error(`XCover quote failed: ${res.status}`);
    const data = await res.json();

    return (data.quotes || []).map((q: any, i: number) => ({
      id: q.id || `xcover-${i}`,
      provider: 'Cover Genius',
      planName: q.policy_name || `Plan ${i + 1}`,
      coverageType: params.coverageType || 'comprehensive',
      pricePerTraveler: q.price?.amount || 0,
      totalPrice: (q.price?.amount || 0) * params.travelers,
      currency: q.price?.currency || 'USD',
      highlights: q.benefits?.map((b: any) => b.name) || [],
      maxMedical: q.limits?.medical || 100000,
      maxCancellation: q.limits?.cancellation || 5000,
      quoteRef: q.id || '',
    }));
  } catch (err) {
    console.error('[insuranceService] API error, falling back to mock:', err);
    return getMockQuotes(params);
  }
}

function getMockQuotes(params: InsuranceSearchParams): InsuranceQuote[] {
  const plans = [
    { name: 'Essential Cover', med: 50000, cancel: 2500, multiplier: 1 },
    { name: 'Premium Shield', med: 150000, cancel: 10000, multiplier: 1.9 },
    { name: 'Medical Only', med: 200000, cancel: 0, multiplier: 0.8 },
  ];
  return plans.map((p, i) => ({
    id: `ins-mock-${i}`,
    provider: ['SafeTrip', 'AXA Travel', 'Allianz'][i],
    planName: p.name,
    coverageType: params.coverageType || 'comprehensive',
    pricePerTraveler: parseFloat((18 + i * 12 * p.multiplier).toFixed(2)),
    totalPrice: parseFloat(((18 + i * 12 * p.multiplier) * params.travelers).toFixed(2)),
    currency: 'USD',
    highlights: ['Emergency medical', '24/7 support', 'Trip cancellation'],
    maxMedical: p.med,
    maxCancellation: p.cancel,
    quoteRef: `MOCK-${Date.now()}-${i}`,
  }));
}
