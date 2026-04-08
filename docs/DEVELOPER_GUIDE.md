# TravelBook Platform — Developer Guide

This guide covers the monorepo structure, local development setup, shared packages, Firebase configuration, and how to add new supplier integrations.

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Node.js | 18.x | 20.x recommended |
| npm | 8.x | Workspaces support required |
| Git | Any recent | — |
| A Supabase project | — | Free tier works for local dev |
| A Firebase project | — | Required for Rides portal only |

---

## Monorepo Structure

The platform uses **npm workspaces** — a single `node_modules` at the root, with each app and package declared as a workspace member.

```
travelbook-platform/
├── apps/
│   ├── travelbook/           # Consumer app — Next.js 15 (App Router)
│   ├── travelbook-rides/     # Vehicle owner portal — Vite + React
│   ├── travelbook-hotel-os/  # Hotel & dining OS — Vite + React
│   └── travelbook-tours/     # Tour operator portal — Next.js
├── packages/
│   ├── ui/                   # Shared design system & tokens
│   │   └── src/
│   │       ├── index.ts      # All exports: colors, fonts, cn(), portals, thirdPartyApis
│   │       └── DESIGN_SYSTEM.md
│   └── config/               # Shared ESLint, TypeScript, Tailwind configs
├── .env.example              # All environment variables (copy to each app)
├── package.json              # Root workspace manifest + scripts
└── package-lock.json
```

### Root `package.json` scripts

```json
{
  "scripts": {
    "dev:travelbook":  "npm run dev --workspace=apps/travelbook",
    "dev:rides":       "npm run dev --workspace=apps/travelbook-rides",
    "dev:hotel-os":    "npm run dev --workspace=apps/travelbook-hotel-os",
    "dev:tours":       "npm run dev --workspace=apps/travelbook-tours",
    "build:all":       "npm run build --workspaces --if-present",
    "lint:all":        "npm run lint --workspaces --if-present"
  }
}
```

All `dev:*` commands run on their app's default port. Consult each app's `package.json` for the exact port — typically `3000` for Next.js apps and `5173` for Vite apps.

---

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/rumedsodimana-stack/travelbook-platform.git
cd travelbook-platform

# 2. Install all workspace dependencies in one shot
npm install

# That's it — npm hoists shared deps to the root node_modules.
# App-specific deps that can't be hoisted live in their own node_modules.
```

---

## Environment Variables

All environment variables are listed in `.env.example` at the repo root. Each app needs its own `.env.local` with the variables it uses.

### Quick setup

```bash
cp .env.example apps/travelbook/.env.local
cp .env.example apps/travelbook-rides/.env.local
cp .env.example apps/travelbook-hotel-os/.env.local
cp .env.example apps/travelbook-tours/.env.local
```

Then open each `.env.local` and fill in the relevant keys. You don't need to populate every variable — only the ones for the APIs you want active in that portal.

### Variable reference

```bash
# ── AI ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_GEMINI_API_KEY=        # Google AI Studio key — powers the AI Travel Planner

# ── Database (Supabase) ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Public anon key (safe to expose)

# ── Firebase (TravelBook Rides only) ───────────────────────────────
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# ── Flights ─────────────────────────────────────────────────────────
NEXT_PUBLIC_AMADEUS_API_KEY=
NEXT_PUBLIC_AMADEUS_API_SECRET=    # Used to fetch Amadeus OAuth2 token
NEXT_PUBLIC_SKYSCANNER_API_KEY=

# ── Accommodation ───────────────────────────────────────────────────
NEXT_PUBLIC_BOOKING_API_KEY=

# ── Insurance ───────────────────────────────────────────────────────
NEXT_PUBLIC_COVER_GENIUS_API_KEY=
NEXT_PUBLIC_BATTLEFACE_API_KEY=

# ── Events ──────────────────────────────────────────────────────────
NEXT_PUBLIC_TICKETMASTER_API_KEY=
NEXT_PUBLIC_EVENTBRITE_API_KEY=

# ── Entertainment / Activities ──────────────────────────────────────
NEXT_PUBLIC_VIATOR_API_KEY=
NEXT_PUBLIC_GETYOURGUIDE_API_KEY=

# ── Maps ────────────────────────────────────────────────────────────
NEXT_PUBLIC_MAPBOX_TOKEN=

# ── Payments ────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=   # Client-side Stripe key
STRIPE_SECRET_KEY=                     # Server-side only — never expose publicly
```

**Note on `NEXT_PUBLIC_` prefix:** In Next.js apps, any variable prefixed `NEXT_PUBLIC_` is bundled into the client-side JavaScript. Variables without this prefix (like `STRIPE_SECRET_KEY`) are server-only and must only be accessed in API routes or Server Components. In Vite apps, the equivalent prefix is `VITE_`.

---

## Running Apps Locally

```bash
# Consumer app — http://localhost:3000
npm run dev:travelbook

# Rides portal — http://localhost:5173
npm run dev:rides

# Hotel OS — http://localhost:5174
npm run dev:hotel-os

# Tours portal — http://localhost:3001
npm run dev:tours
```

To run multiple portals simultaneously, open a separate terminal for each command. There are no port conflicts as each app declares its own dev port.

---

## The Shared UI Package (`packages/ui`)

The `@travelbook/ui` package is the single source of truth for the design system. Every portal imports from it.

### Importing

```ts
import { colors, fonts, fontSizes, cn, portals, thirdPartyApis } from '@travelbook/ui';
```

### Design tokens

**Colors** (`colors`) — A nested object with `background`, `accent`, `text`, `glass`, and `status` keys:

```ts
colors.background.primary   // '#07161d' — page background
colors.background.surface   // '#0a1d26' — cards, sidebars
colors.background.elevated  // '#0f2a38' — modals, popovers
colors.accent.teal          // '#14b8a6' — primary brand CTA
colors.accent.amber         // '#fbbf24' — operator portal accent
colors.glass.bg             // 'rgba(255,255,255,0.1)' — glassmorphism card fill
colors.glass.border         // 'rgba(255,255,255,0.2)' — glassmorphism card border
colors.status.success       // '#22c55e'
colors.status.error         // '#ef4444'
```

**Typography** (`fonts`, `fontSizes`) — DM Sans for all headings and body text; JetBrains Mono for code/data:

```ts
fonts.heading   // "'DM Sans', sans-serif"
fonts.mono      // "'JetBrains Mono', monospace"
fontSizes.base  // '1rem' (16px)
fontSizes['4xl'] // '2.25rem' (36px)
```

### `cn()` helper

A thin wrapper around `clsx` + `tailwind-merge` for conditional class composition. Use it everywhere instead of string concatenation:

```ts
import { cn } from '@travelbook/ui';

// Conditional classes without conflict
<div className={cn(
  'rounded-xl border p-4',
  isActive && 'border-teal-500 bg-white/10',
  isDisabled && 'opacity-40 cursor-not-allowed',
)} />
```

### Portal registry (`portals`)

A typed array of all four portal definitions. Useful for nav components, dashboards, and any UI that lists portals:

```ts
portals.forEach(p => {
  console.log(p.id, p.name, p.tagline, p.color, p.path, p.runScript);
});
// e.g. { id: 'travelbook', name: 'TravelBook', color: '#14b8a6', runScript: 'dev:travelbook', ... }
```

### Third-party API registry (`thirdPartyApis`)

A typed array of every external integration with its name, category, description, docs URL, and the env variable that activates it:

```ts
thirdPartyApis.filter(api => api.category === 'flights');
// Returns Amadeus and Skyscanner entries
```

---

## Firebase Setup (TravelBook Rides)

TravelBook Rides is the only portal using Firebase. The consumer app (TravelBook) uses the **same Firebase project** for the real-time ride-matching listener — meaning both apps must share identical `FIREBASE_*` / `VITE_FIREBASE_*` environment variables.

### Steps

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Realtime Database** (not Firestore) — the ride-matching system uses the Realtime DB's push/listen architecture for lowest latency
3. Enable **Firebase Authentication** — enable Email/Password and Google providers
4. Copy the Firebase config object from Project Settings → Your Apps → Web
5. Populate `VITE_FIREBASE_*` keys in both `apps/travelbook-rides/.env.local` and `apps/travelbook/.env.local`

### Realtime Database rules (development)

For local development only — **do not use in production**:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

For production, scope rules to specific paths (`/ride-requests`, `/drivers`, etc.) per user UID.

---

## Key Services in `apps/travelbook/src/services/`

| File | Purpose | Primary API |
|---|---|---|
| `geminiService.ts` | AI suggestions, itinerary generation, TTS, review summarization | Google Gemini |
| `tripPlannerService.ts` | Cascading trip plan builder — full TripPlan object generator | Google Gemini + mock fallback |
| `flightService.ts` | Flight search and booking | Amadeus |
| `insuranceService.ts` | Travel insurance quotes and purchase | Cover Genius, Battleface |
| `eventsService.ts` | Events search at destination | Ticketmaster, Eventbrite |
| `entertainmentService.ts` | Activities and experiences | Viator, GetYourGuide |
| `mapsService.ts` | Geocoding, map rendering | Mapbox |
| `bookingService.ts` | Stripe Payment Intent creation and booking records | Stripe, Supabase |
| `accountService.ts` | User profile CRUD | Supabase |
| `identityService.ts` | Session hydration, `TravelBookUser` shape | Supabase Auth |
| `dataFactory.ts` | Mock data generators for development (users, trips) | — |
| `liveApiService.ts` | Gemini Live API (real-time voice concierge) | Google Gemini Live |
| `providerOnboardingApiService.ts` | Operator onboarding flow API calls | Supabase |
| `providerInviteService.ts` | Operator invite links and referral tracking | Supabase |
| `providerPageService.ts` | Operator public page data (hotel/tour listing pages) | Supabase |

---

## The Cascading Timing Engine (`tripPlannerService.ts`)

The most architecturally interesting piece of the codebase. Understanding it unlocks the AI Travel Planner.

### Data types

```ts
type PlanItemCategory =
  | 'visa' | 'flight' | 'accommodation' | 'transport'
  | 'activity' | 'dining' | 'event' | 'entertainment';

interface PlanItemOption {
  id: string;
  title: string;        // e.g. "British Airways BA 117"
  subtitle: string;     // e.g. "London → Tokyo, 11h 45m"
  price: number;        // Per person total for this option
  currency: string;
  rating?: number;
  reviewCount?: number;
  duration?: number;    // Minutes
  tags?: string[];      // e.g. ['Business class', 'Direct']
  provider?: string;
}

interface PlanItem {
  id: string;
  category: PlanItemCategory;
  scheduledAt: string;        // ISO datetime — when this item starts
  endAt: string;              // ISO datetime — when it ends
  durationMinutes: number;
  selectedOptionIndex: number; // Which option the user has chosen (0 = first)
  options: PlanItemOption[];  // 3–4 alternatives to swipe through
  notes: string;              // AI tip shown below the card
  isRequired: boolean;        // If true, can't be removed from the plan
  travelTimeTo: number;       // Minutes of travel after this item ends
}

interface TripPlan {
  id: string;
  destination: string;
  originCity: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetCurrency: string;
  travellers: number;
  items: PlanItem[];
  totalEstimatedCost: number;
  aiSummary: string;
  createdAt: string;
}
```

### How the cursor works

The timing engine uses a mutable `cursor` variable (ISO timestamp string) that advances through the trip:

```ts
let cursor = `${input.startDate}T06:00:00.000Z`;

function pushItem(category, options, durationMinutes, notes, travelTimeTo, isRequired) {
  const endAt = addMinutes(cursor, durationMinutes);
  items.push({ scheduledAt: cursor, endAt, ... });
  cursor = addMinutes(endAt, travelTimeTo); // advance past travel time
}
```

Each call to `pushItem` appends a new `PlanItem` anchored to the current `cursor`, then bumps the cursor forward by `durationMinutes + travelTimeTo`. This produces a chronologically coherent itinerary where every item flows naturally from the previous one.

### Gemini vs mock

The service tries Gemini first; if the API key is missing or the call fails, it falls back to `buildMockPlan()`:

```ts
export async function generateTripPlan(input: TripPlanInput): Promise<TripPlan> {
  if (API_KEY) {
    try {
      return await generateWithGemini(input);
    } catch (e) {
      console.warn('[TripPlanner] Gemini failed, using mock data:', e);
    }
  }
  await new Promise(r => setTimeout(r, 1800)); // realistic delay
  return buildMockPlan(input);
}
```

`buildMockPlan()` uses the `DESTINATIONS` registry — a typed map of destination keys to real data (named airlines, hotels, restaurants, activities) for London, Paris, Tokyo, Dubai, and Bali. Any unrecognized destination falls through to `DEFAULT_DEST`.

---

## Adding a New Third-Party Supplier API

Follow this pattern to add a new travel API (e.g. a car rental provider, a new hotel aggregator):

**1. Add the env variable to `.env.example`**

```bash
# Car Rental
NEXT_PUBLIC_RENTALCARS_API_KEY=
```

**2. Create a service file**

```ts
// apps/travelbook/src/services/carRentalService.ts

const API_KEY = process.env.NEXT_PUBLIC_RENTALCARS_API_KEY;

export interface CarRentalSearchParams {
  pickupLocation: string;  // IATA airport code
  dropoffLocation: string;
  pickupDate: string;
  dropoffDate: string;
  driverAge: number;
}

export interface CarRental {
  id: string;
  provider: string;
  carType: string;
  pricePerDay: number;
  currency: string;
  // ...
}

export async function searchCarRentals(params: CarRentalSearchParams): Promise<CarRental[]> {
  if (!API_KEY) return getMockCarRentals(params); // always have a mock fallback
  const res = await fetch(`https://api.rentalcars.com/v1/search?...`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await res.json();
  return data.results.map(mapToCarRental);
}

function getMockCarRentals(params: CarRentalSearchParams): CarRental[] {
  return [/* static mock data */];
}
```

**3. Register it in `packages/ui/src/index.ts`** (optional but recommended)

Add the new provider to the `thirdPartyApis` array so it appears in the design system registry:

```ts
{
  id: 'rentalcars',
  name: 'RentalCars',
  category: 'transport',
  description: 'Car rental search across 900+ suppliers worldwide',
  docsUrl: 'https://api.rentalcars.com/docs',
  envKey: 'NEXT_PUBLIC_RENTALCARS_API_KEY',
},
```

**4. Wire into the UI**

Import and call your new service from the relevant page or component. If it belongs in the AI Travel Planner, add a new `PlanItemCategory` value and a corresponding `pushItem` call in `tripPlannerService.ts`.

**5. Add to `.env.local` in each app that needs it**

---

## Supabase Database Schema Conventions

The platform uses Supabase (PostgreSQL) as its primary database for all portals except Rides. Tables follow these conventions:

- All tables use snake_case
- Primary keys are `id UUID DEFAULT gen_random_uuid()`
- Created/updated timestamps: `created_at TIMESTAMPTZ DEFAULT now()`, `updated_at TIMESTAMPTZ DEFAULT now()`
- Soft deletes: `deleted_at TIMESTAMPTZ` (null = active)
- Foreign keys to auth users: `user_id UUID REFERENCES auth.users(id)`
- Row Level Security (RLS) is **always enabled** — each table needs policies

---

## Deployment

Each app can be deployed independently. The recommended target is **Vercel** (the platform includes a Vercel MCP integration).

```bash
# Deploy the consumer app
vercel --cwd apps/travelbook

# Deploy the rides portal
vercel --cwd apps/travelbook-rides
```

Set environment variables in Vercel's dashboard under each project's Settings → Environment Variables. Do not commit `.env.local` files to version control — they are listed in `.gitignore`.

---

## Linting & Building

```bash
# Lint all workspaces
npm run lint:all

# Build all apps (CI/CD pipeline)
npm run build:all

# Build a single app
npm run build --workspace=apps/travelbook
```

TypeScript strict mode is enabled across all apps. The shared `packages/config` workspace exports base `tsconfig.json` and `eslint.config.js` that each app extends.
