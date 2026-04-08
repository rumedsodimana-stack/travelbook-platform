# TravelBook Platform — Overview

> **The one-stop travel marketplace.** Book flights, hotels, rides, tours, events, and experiences — all powered by a single AI-driven platform connecting travelers with operators worldwide.

---

## Vision

TravelBook's mission is to collapse the fragmented travel-booking experience into a single, intelligent platform. Travelers should never have to juggle five tabs across five different services to plan a trip. From the moment you decide on a destination to the moment you land home, every touchpoint — flights, accommodation, ground transport, dining, events, tours, and insurance — lives in one app, powered by one AI.

The operator side is equally intentional. Vehicle owners, hotels, restaurants, and tour operators each get a purpose-built portal tailored to their workflow, rather than a generic dashboard bolted onto the consumer app.

---

## The Four Portals

| Portal | Audience | Stack | Path |
|---|---|---|---|
| **TravelBook** | Travelers / consumers | Next.js 15, Supabase, Gemini AI | `apps/travelbook/` |
| **TravelBook Rides** | Vehicle owners | Vite + React, Firebase | `apps/travelbook-rides/` |
| **TravelBook Hotel OS** | Hotels & dining venues | Vite + React, Supabase | `apps/travelbook-hotel-os/` |
| **TravelBook Tours** | Tour operators | Next.js, Supabase | `apps/travelbook-tours/` |

---

### ✈️ TravelBook — Consumer App

The primary traveler-facing product. Users land on a dark glassmorphism interface and can:

- Search and book **flights** (Amadeus), **hotels** (Booking.com), **rides** (Firebase-matched), **tours** (Viator/GetYourGuide), **events** (Ticketmaster/Eventbrite), and **activities**
- Launch the **AI Travel Planner** to generate a full cascading itinerary from a single prompt
- Purchase **travel insurance** at checkout (Cover Genius / Battleface)
- Apply for **visas** inline (iVisa integration)
- View **interactive maps** of their destination (Mapbox)
- Chat with a **live AI concierge** (Gemini Live API) for real-time travel advice

---

### 🚗 TravelBook Rides — Vehicle Owner Portal

An Uber-for-travelers marketplace, but supply-side. Vehicle owners:

- List their car/van/SUV with photos, pricing per km/hour, and availability calendar
- Receive real-time ride requests from TravelBook consumers traveling in their area
- Accept, manage, and complete rides with in-app navigation
- View earnings dashboards and trip history

Rides use **Firebase Realtime Database** for the matching layer, giving sub-second latency for request-accept flows.

---

### 🏨 TravelBook Hotel OS — Hotel & Dining Operator Portal

A lightweight property management system for hotels and restaurants that want their inventory listed on TravelBook. Operators can:

- Create and manage **room types** with photos, amenities, and nightly rates
- Set **dining seat availability** and reservation windows for restaurants
- View and manage **live bookings** pushed from the TravelBook consumer app in real time
- Update availability calendars and handle check-in/check-out status

---

### 🗺️ TravelBook Tours — Tour Operator Portal

Tour operators and experience providers use this portal to:

- Build structured **tour packages** with day-by-day itineraries, inclusions, and exclusions
- Configure **pricing tiers** (solo, couple, group, private)
- Set **booking capacity** and manage waitlists
- Track **sales, revenue, and upcoming departures** from a single dashboard
- Publish packages directly to the TravelBook consumer marketplace

---

## The AI Travel Planner

The marquee feature of the TravelBook consumer app. Powered by **Google Gemini 2.0 Flash**.

### How It Works

1. **User inputs** destination, origin city, travel dates, budget, number of travelers, and optional preferences (e.g. "love nature, local food, skip museums")
2. **Gemini AI** generates a structured, day-by-day trip plan with real airline names, real hotels, and real restaurants for that destination
3. The plan is returned as a typed `TripPlan` object containing `PlanItem` entries across eight categories:

| Category | Examples |
|---|---|
| `visa` | Visa on Arrival, e-Visa Online, Visa-Free Entry |
| `flight` | Outbound + return flight options (3 airlines per leg) |
| `accommodation` | 3 hotel tiers (5★ / 4★ / 3★) with nightly rates |
| `transport` | Airport transfer, metro day pass, taxi |
| `activity` | Landmark visits, guided tours, free exploration |
| `dining` | Breakfast / lunch / dinner at 3 restaurant options each |
| `entertainment` | Shows, museums, nightlife |
| `event` | Concerts, sports, local festivals |

4. The UI renders each `PlanItem` as a **horizontal swipe carousel** — travelers swipe left/right to pick their preferred option (e.g. choose the 3★ hotel over the 5★, or skip the guided tour for free exploration)
5. A running **cost total** updates in real time as selections change
6. When ready, travelers can **book individual items one by one**, or hit **"Book All"** to confirm every selected option in a single checkout flow

### Cascading Timing Engine

Each `PlanItem` carries `scheduledAt`, `endAt`, `durationMinutes`, and `travelTimeTo` (travel time to the next item). The plan builder (`utils/tripPlannerService.ts`) uses a `cursor` timestamp that advances through the trip chronologically — so the full itinerary is time-aware from day 1 arrival to final departure.

### AI Fallback

If the Gemini API key is absent or the API call fails, `tripPlannerService` falls back to a rich **destination-aware mock dataset** covering London, Paris, Tokyo, Dubai, and Bali — with real airline codes, named hotels, and restaurant recommendations. This means the planner is always demo-able, even without live API credentials.

### Additional Gemini Features

- **Search suggestions** — as the user types a destination, Gemini returns 5 relevant suggestions in real time
- **Review summarization** — community reviews are summarized into a one-sentence sentiment using `gemini-2.0-flash`
- **Text-to-speech itinerary** — the full plan can be narrated aloud using `gemini-2.5-flash-preview-tts` with the "Kore" voice
- **Google Search grounding** — the itinerary generator uses Gemini's native `googleSearch` tool to pull real-time flight prices and availability into the plan

---

## Third-Party API Integrations

TravelBook is a marketplace aggregator — it surfaces inventory from industry-leading travel APIs rather than managing its own.


### ✈️ Flights

**Amadeus Travel API** (primary) — Flight Offers Search v2. Authenticates via OAuth2 client credentials, returns structured `Flight` objects with IATA codes, cabin class, seat availability, and pricing. Docs: [developers.amadeus.com](https://developers.amadeus.com)

**Skyscanner API** (alternate) — Meta-search for price comparison across carriers. Used as a secondary source for fare estimates. Docs: [partners.skyscanner.net](https://www.partners.skyscanner.net)

### 🏨 Accommodation

**Booking.com Demand API** — Hotel inventory, availability calendars, and room pricing. Provides the hotel search results on the TravelBook consumer app. Docs: [developers.booking.com](https://developers.booking.com)

### 🛡️ Travel Insurance

**Cover Genius XCover** (primary) — Embedded travel insurance offered at checkout. Covers trip cancellation, medical, and baggage. Presented as an optional add-on during the booking confirmation flow.

**Battleface** (specialty) — Adventure and high-risk-destination travel insurance for travelers heading off the beaten path.

### 🎟️ Events

**Ticketmaster Discovery API** (primary) — Concerts, sports, theatre, and live events at the traveler's destination. Surfaced in the "Events" category of the AI plan and the Events browse tab. Docs: [developer.ticketmaster.com](https://developer.ticketmaster.com)

**Eventbrite API** — Local events, workshops, and community experiences. Complements Ticketmaster for smaller, local happenings.

### 🎯 Entertainment & Activities

**Viator / TripAdvisor** (primary) — Tours, day trips, cooking classes, skip-the-line tickets. The `entertainmentService.ts` calls the Viator API for curated activity options by destination.

**GetYourGuide** (alternate) — Additional activities inventory and attraction tickets as a backup source.

### 🗺️ Maps

**Mapbox** — Interactive maps throughout the platform: destination exploration, ride tracking in TravelBook Rides, and hotel/tour location pins. The `mapsService.ts` wraps Mapbox's Geocoding and Maps GL APIs.

### 🛂 Visas

**iVisa** — Inline visa application for international destinations. The AI Travel Planner's `visa` category items link to iVisa's API to surface visa-on-arrival fees, e-visa costs, and application URLs per destination/passport combination.

### 💳 Payments

**Stripe** — All booking payments across every portal flow through Stripe. The `bookingService.ts` creates Stripe Payment Intents server-side. The consumer app uses Stripe Elements for PCI-compliant card capture.

### 🔥 Realtime (Rides)

**Firebase Realtime Database** — The ride request/accept matching layer for TravelBook Rides. When a consumer requests a ride, it writes to Firebase; the vehicle owner's app listens in real time and can accept within seconds. Firebase Auth handles identity for the Rides portal.

### 🧠 AI

**Google Gemini** — Used across TravelBook for the AI Travel Planner, search autocomplete suggestions, itinerary narration (TTS), and review summarization. The `geminiService.ts` and `tripPlannerService.ts` both call `@google/genai`.

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Consumer app framework | Next.js 15 (App Router) |
| Operator portals (Rides, Hotel OS) | Vite + React 18 |
| Tours portal | Next.js |
| Shared UI / design system | `packages/ui` — TypeScript, Tailwind CSS |
| Primary database | Supabase (PostgreSQL + Realtime) |
| Ride matching database | Firebase Realtime Database |
| Auth (consumer + operators) | Supabase Auth |
| Auth (Rides portal) | Firebase Auth |
| AI / LLM | Google Gemini 2.0 Flash, Gemini 2.5 Flash TTS |
| Payments | Stripe |
| Maps | Mapbox GL JS |
| Package management | npm workspaces (monorepo) |
| Language | TypeScript throughout |
| Styling | Tailwind CSS + dark glassmorphism tokens |
| Font | DM Sans (all portals) |

---

## Design Language

All four portals share the same visual identity defined in `packages/ui/src/index.ts`:

- **Background palette** — Deep navy/teal darks (`#07161d` → `#0a1d26` → `#0f2a38`) layered as page, surface, and elevated
- **Accent — Teal** (`#14b8a6`) — Primary brand color used for CTAs, active states, and highlights in the consumer app
- **Accent — Amber** (`#f59e0b` / `#fbbf24`) — Used for operator portal accents and earnings/revenue callouts
- **Glassmorphism** — Cards use `rgba(255,255,255,0.1)` backgrounds with `rgba(255,255,255,0.2)` borders and backdrop-blur, giving the frosted glass aesthetic
- **Typography** — DM Sans across all headings and body text; JetBrains Mono for code/data values
- **Status colors** — Green `#22c55e` (success), Amber `#f59e0b` (warning), Red `#ef4444` (error), Blue `#3b82f6` (info)
