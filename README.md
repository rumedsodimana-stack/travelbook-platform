# TravelBook Platform

> The unified monorepo for the entire TravelBook ecosystem — consumer travel app, ride-sharing operator portal, hotel & dining OS, and tours management platform.

---

## Ecosystem Overview

```
travelbook-platform/
├── apps/
│   ├── travelbook/           ✈️  Consumer travel app (Next.js)
│   ├── travelbook-rides/     🚗  Vehicle owner portal (Vite + Firebase)
│   ├── travelbook-hotel-os/  🏨  Hotel & dining OS (Next.js)
│   └── travelbook-tours/     🗺️  Tour operator portal (Next.js)
└── packages/
    ├── ui/                   🎨  Shared design system & tokens
    └── config/               ⚙️  Shared configuration
```

---

## The Four Portals

| Portal | Type | Description | Stack |
|--------|------|-------------|-------|
| [TravelBook](https://github.com/rumedsodimana-stack/travelbook) | Consumer | Search and book flights, hotels, tours, rides, and experiences | Next.js, Supabase, Gemini AI |
| [TravelBook Rides](https://github.com/rumedsodimana-stack/Tavelbook-rides) | Operator | Vehicle owner portal — list your vehicle and accept ride requests | Vite, Firebase |
| [TravelBook Hotel OS](https://github.com/rumedsodimana-stack/Os-front-end) | Operator | Hotel & dining operator portal — manage rooms, tables, and availability | Next.js, Supabase |
| [TravelBook Tours](https://github.com/rumedsodimana-stack/paraiso-tours) | Operator | Tour operator portal — build and sell travel packages | Next.js, Supabase |

---

## Portal Details

### ✈️ TravelBook (Consumer App)
**Tagline:** Your Complete Travel Companion

The primary consumer-facing portal. Users can search and book across all travel verticals: flights, hotels, tours, rides, events, and activities. Powered by an AI travel planner (Google Gemini) for itinerary suggestions and a live concierge experience.

- **GitHub:** https://github.com/rumedsodimana-stack/travelbook
- **Local path:** `apps/travelbook`
- **Run:** `npm run dev:travelbook`

### 🚗 TravelBook Rides (Vehicle Owner Portal)
**Tagline:** Drive. Earn. Repeat.

Operator portal for vehicle owners to list their cars and accept ride requests from TravelBook consumers. Manages vehicle listings, availability, and earnings.

- **GitHub:** https://github.com/rumedsodimana-stack/Tavelbook-rides
- **Local path:** `apps/travelbook-rides`
- **Run:** `npm run dev:rides`

### 🏨 TravelBook Hotel OS (Hotel & Dining Operator Portal)
**Tagline:** Run Your Property Smarter

Full property management interface for hotel and restaurant operators. Manage room inventory, table availability, check-ins, and real-time booking updates from the TravelBook consumer app.

- **GitHub:** https://github.com/rumedsodimana-stack/Os-front-end
- **Local path:** `apps/travelbook-hotel-os`
- **Run:** `npm run dev:hotel-os`

### 🗺️ TravelBook Tours (Tour Operator Portal)
**Tagline:** Create. Package. Sell.

Portal for tour operators to build, package, and sell travel experiences. Create custom itineraries, set pricing tiers, manage booking capacity, and track sales.

- **GitHub:** https://github.com/rumedsodimana-stack/paraiso-tours
- **Local path:** `apps/travelbook-tours`
- **Run:** `npm run dev:tours`

---

## Third-Party API Integrations

TravelBook's marketplace is powered by industry-leading third-party APIs:

### ✈️ Flights
| Provider | Purpose | Docs |
|----------|---------|------|
| **Amadeus Travel API** (primary) | Flight search, booking, pricing | [developers.amadeus.com](https://developers.amadeus.com) |
| **Skyscanner API** (alternate) | Price comparison, meta-search | [partners.skyscanner.net](https://www.partners.skyscanner.net/affiliates/travel-apis) |

### 🏨 Accommodation
| Provider | Purpose | Docs |
|----------|---------|------|
| **Booking.com Demand API** | Hotel inventory and availability | [developers.booking.com](https://developers.booking.com) |

### 🛡️ Travel Insurance
| Provider | Purpose | Docs |
|----------|---------|------|
| **Cover Genius XCover** (primary) | Embedded insurance at checkout | [covergenius.com/xcover](https://www.covergenius.com/xcover) |
| **Battleface** (specialty) | Adventure & specialty travel insurance | [battleface.com/api](https://battleface.com/api) |

### 🎟️ Events
| Provider | Purpose | Docs |
|----------|---------|------|
| **Ticketmaster Discovery API** (primary) | Concerts, sports, shows at destinations | [developer.ticketmaster.com](https://developer.ticketmaster.com) |
| **Eventbrite API** (local) | Local events and experiences | [eventbrite.com/platform/api](https://www.eventbrite.com/platform/api) |

### 🎯 Entertainment & Activities
| Provider | Purpose | Docs |
|----------|---------|------|
| **Viator / TripAdvisor** (primary) | Tours, activities, experiences | [partnerresources.viator.com](https://partnerresources.viator.com) |
| **GetYourGuide** (alternate) | Tours, activities, attraction tickets | [api.getyourguide.com](https://api.getyourguide.com) |

### 🗺️ Maps
| Provider | Purpose | Docs |
|----------|---------|------|
| **Mapbox** | Maps, geocoding, routing | [docs.mapbox.com](https://docs.mapbox.com) |

### 💳 Payments
| Provider | Purpose | Docs |
|----------|---------|------|
| **Stripe** | Payment processing for all bookings | [stripe.com/docs](https://stripe.com/docs) |

### 🤖 AI / Intelligence
| Provider | Purpose | Docs |
|----------|---------|------|
| **Google Gemini** | AI travel planner, search suggestions, live concierge | [ai.google.dev](https://ai.google.dev) |

---

## Setup

### Prerequisites

- Node.js 18+
- npm 8+ (workspaces support)
- Git

### Install

```bash
# Clone the monorepo
git clone https://github.com/rumedsodimana-stack/travelbook-platform.git
cd travelbook-platform

# Install all dependencies across workspaces
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` in each app you want to run, then fill in your API keys:

```bash
cp .env.example apps/travelbook/.env.local
cp .env.example apps/travelbook-rides/.env.local
cp .env.example apps/travelbook-hotel-os/.env.local
cp .env.example apps/travelbook-tours/.env.local
```

See `.env.example` at the root for all required variables.

### Running Apps

```bash
# Run the consumer app
npm run dev:travelbook

# Run the rides operator portal
npm run dev:rides

# Run the hotel OS
npm run dev:hotel-os

# Run the tours portal
npm run dev:tours

# Build all apps
npm run build:all

# Lint all apps
npm run lint:all
```

---

## Design System

The shared design system lives in `packages/ui`. It provides:

- **Color tokens** — dark glassmorphism palette (teal for consumer, amber for operators)
- **Typography** — DM Sans font stack + size scale
- **Component class names** — Tailwind utility bundles for cards, buttons, nav, inputs, badges
- **Portal metadata** — structured registry of all four portals
- **API integration map** — typed references to all third-party providers

See [`packages/ui/src/DESIGN_SYSTEM.md`](packages/ui/src/DESIGN_SYSTEM.md) for full documentation.

```ts
import { colors, cn, portals, thirdPartyApis } from '@travelbook/ui';
```

---

## Environment Variables Reference

| Variable | Used By | Provider |
|----------|---------|----------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | TravelBook, Hotel OS, Tours | Google Gemini |
| `NEXT_PUBLIC_SUPABASE_URL` | TravelBook, Hotel OS, Tours | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | TravelBook, Hotel OS, Tours | Supabase |
| `VITE_FIREBASE_*` | TravelBook Rides | Firebase |
| `NEXT_PUBLIC_AMADEUS_API_KEY` | TravelBook | Amadeus |
| `NEXT_PUBLIC_AMADEUS_API_SECRET` | TravelBook | Amadeus |
| `NEXT_PUBLIC_SKYSCANNER_API_KEY` | TravelBook | Skyscanner |
| `NEXT_PUBLIC_BOOKING_API_KEY` | TravelBook | Booking.com |
| `NEXT_PUBLIC_COVER_GENIUS_API_KEY` | TravelBook | Cover Genius |
| `NEXT_PUBLIC_BATTLEFACE_API_KEY` | TravelBook | Battleface |
| `NEXT_PUBLIC_TICKETMASTER_API_KEY` | TravelBook | Ticketmaster |
| `NEXT_PUBLIC_EVENTBRITE_API_KEY` | TravelBook | Eventbrite |
| `NEXT_PUBLIC_VIATOR_API_KEY` | TravelBook | Viator |
| `NEXT_PUBLIC_GETYOURGUIDE_API_KEY` | TravelBook | GetYourGuide |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | TravelBook, Hotel OS, Tours | Mapbox |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | All apps | Stripe |
| `STRIPE_SECRET_KEY` | All apps (server) | Stripe |

---

## Repository Structure

```
travelbook-platform/
├── apps/
│   ├── travelbook/           # Consumer travel app
│   ├── travelbook-rides/     # Vehicle owner portal
│   ├── travelbook-hotel-os/  # Hotel & dining OS
│   └── travelbook-tours/     # Tour operator portal
├── packages/
│   ├── ui/                   # Shared design system
│   │   └── src/
│   │       ├── index.ts      # Design tokens & utilities
│   │       └── DESIGN_SYSTEM.md
│   └── config/               # Shared config (ESLint, TypeScript, etc.)
├── .env.example              # All environment variables
├── .gitignore
├── package.json              # Root workspace config
└── README.md
```

---

## License

Private — © TravelBook Platform. All rights reserved.
