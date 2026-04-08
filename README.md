# ✈️ TravelBook Platform

> **The one-stop travel marketplace.** Search and book flights, hotels, rides, tours, events, and experiences — all in one AI-powered app.

TravelBook is a full travel marketplace delivered as a monorepo with four purpose-built portals: a consumer travel app, a ride-sharing operator portal, a hotel & dining OS, and a tour operator platform. Every portal shares the same dark glassmorphism design system and is powered by Google Gemini AI, Amadeus flights, Mapbox maps, Stripe payments, and a suite of industry-leading travel APIs.

---

## The Four Portals

| Portal | Who it's for | Stack | Dev command |
|---|---|---|---|
| **TravelBook** | Travelers — search & book everything | Next.js 15, Supabase, Gemini AI | `npm run dev:travelbook` |
| **TravelBook Rides** | Vehicle owners — list vehicles & accept rides | Vite + React, Firebase | `npm run dev:rides` |
| **TravelBook Hotel OS** | Hotels & restaurants — manage availability | Vite + React, Supabase | `npm run dev:hotel-os` |
| **TravelBook Tours** | Tour operators — create & sell packages | Next.js, Supabase | `npm run dev:tours` |

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm 8+ (workspaces support)

### Install

```bash
git clone https://github.com/rumedsodimana-stack/travelbook-platform.git
cd travelbook-platform
npm install
```

### Configure environment variables

```bash
cp .env.example apps/travelbook/.env.local
cp .env.example apps/travelbook-rides/.env.local
cp .env.example apps/travelbook-hotel-os/.env.local
cp .env.example apps/travelbook-tours/.env.local
# Then fill in your API keys in each .env.local
```

### Run

```bash
npm run dev:travelbook   # Consumer app  → http://localhost:3000
npm run dev:rides        # Rides portal  → http://localhost:5173
npm run dev:hotel-os     # Hotel OS      → http://localhost:5174
npm run dev:tours        # Tours portal  → http://localhost:3001
```

### Build all

```bash
npm run build:all
```

---

## Monorepo Structure

```
travelbook-platform/
├── apps/
│   ├── travelbook/           ✈️  Consumer travel app (Next.js 15)
│   ├── travelbook-rides/     🚗  Vehicle owner portal (Vite + Firebase)
│   ├── travelbook-hotel-os/  🏨  Hotel & dining OS (Vite + React)
│   └── travelbook-tours/     🗺️  Tour operator portal (Next.js)
├── packages/
│   ├── ui/                   🎨  Shared design system (tokens, cn(), portals registry)
│   └── config/               ⚙️  Shared ESLint, TypeScript, Tailwind configs
├── docs/                     📚  Full documentation
├── .env.example              🔑  All environment variable definitions
└── package.json              📦  npm workspace root
```

---

## Key Features

**AI Travel Planner** — Input a destination, dates, and budget. Gemini AI generates a complete day-by-day itinerary with visa, flights, hotels, activities, dining, and entertainment. Each category is a swipe carousel with 3–4 alternatives. Book individually or hit "Book All."

**Ride Ecosystem** — Firebase Realtime Database powers sub-second ride request/accept matching between consumers and vehicle owners. Uber-like live map tracking via Mapbox.

**Operator Portals** — Dedicated, purpose-built interfaces for vehicle owners, hotel managers, restaurant operators, and tour companies — not generic admin dashboards.

**Shared Design System** — Dark glassmorphism aesthetic across all portals. Teal `#14b8a6` for consumer, Amber `#f59e0b` for operators. DM Sans throughout. All tokens in `packages/ui`.

---

## Third-Party Integrations

| Category | Providers |
|---|---|
| Flights | Amadeus (primary), Skyscanner |
| Accommodation | Booking.com |
| Insurance | Cover Genius XCover, Battleface |
| Events | Ticketmaster, Eventbrite |
| Activities | Viator / TripAdvisor, GetYourGuide |
| Maps | Mapbox |
| Payments | Stripe |
| AI | Google Gemini 2.0 Flash, Gemini 2.5 Flash TTS |
| Database | Supabase (PostgreSQL) |
| Realtime (Rides) | Firebase Realtime Database |

---

## Documentation

| Doc | Description |
|---|---|
| [docs/PLATFORM_OVERVIEW.md](docs/PLATFORM_OVERVIEW.md) | Vision, the four portals, AI Travel Planner deep-dive, all API integrations, design language |
| [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md) | Step-by-step guides for travelers, vehicle owners, hotel operators, and tour operators |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Monorepo setup, env vars, Firebase config, shared UI package, services map, adding new APIs |

---

## License

Private — © TravelBook Platform. All rights reserved.
