# AI Travel Planner — Feature Guide

## What is it?

The AI Travel Planner is TravelBook's centrepiece feature. It takes a destination, travel dates, budget, and traveller count, then generates a **complete day-by-day itinerary** — including visa info, outbound and return flights, accommodation, transport, activities, and dining — all laid out as a **vertical scrolling timeline**.

Every item in the timeline has a **horizontal carousel of 3–5 alternative options**. Switching to a different option (e.g. a cheaper hotel) automatically recalculates the timing of every item below it in the timeline.

---

## Three-Step Flow

### Step 1 — Input
The user fills in:
- **Destination** and **origin city**
- **Travel dates** (start + end)
- **Travellers** (stepper, 1–12)
- **Budget** + currency (USD / EUR / GBP / AED / LKR)
- **Preferences** (optional free text — e.g. "love hiking, avoid crowds")

A **"Try Demo"** button pre-fills with Bali / London / 7 days / 2 travellers / $3,000 and skips straight to a fully built itinerary — no API key required.

### Step 2 — AI Generation (Loading)
After submission, a full-screen loader shows rotating status messages ("Checking visa requirements…", "Finding best flights…", etc.) while `generateTripPlan()` runs. The loading cycle is driven by a 1.6 s interval.

### Step 3 — Interactive Plan View
The generated `TripPlan` renders as a scrollable timeline. A **sticky header** shows the destination, date range, live total cost, and a budget progress bar (teal → amber → red as budget fills). At the bottom, a floating action bar shows the running total and a **"Book All"** button.

---

## APIs & Services

| Service | File | Purpose |
|---|---|---|
| Gemini 2.0 Flash | `src/services/tripPlannerService.ts` | Primary plan generation via `@google/genai` |
| Mock engine | same file | Destination-aware fallback — no API key needed |
| Cascade utility | `src/utils/planCascade.ts` | Recalculates item timing on option swap |

**Supported destinations with rich mock data:** London, Paris, Tokyo, Dubai, Bali. All other destinations fall back to a generic but realistic mock dataset.

The Gemini prompt instructs the model to return a single JSON object matching the `TripPlan` schema, with real airline names, real hotel names, and geographically accurate timing. If Gemini is unavailable (no `NEXT_PUBLIC_GEMINI_API_KEY`) or returns malformed JSON, the service silently falls back to the mock engine.

---

## Cascading Timing Engine

**File:** `src/utils/planCascade.ts` — `cascadeTimingChange(items, changedIndex, newOptionIndex)`

When a user taps **SELECT** on an alternative option card:

1. The changed item's `selectedOptionIndex` is updated.
2. The new option's `duration` (in minutes) replaces `durationMinutes` on that item.
3. `endAt = scheduledAt + newDuration` is recalculated for the changed item.
4. Every subsequent item is recalculated in a forward pass:
   ```
   newScheduledAt[i] = endAt[i-1] + travelTimeTo[i]
   newEndAt[i]       = newScheduledAt[i] + durationMinutes[i]
   ```
5. Only timing changes cascade — each item keeps its own selected option.
6. All affected cards briefly flash an **"UPDATED"** badge via React state animation.

---

## Data Model

Key types (defined in `src/types/index.ts`):

- **`TripPlan`** — top-level object: destination, dates, budget, items array, AI summary
- **`PlanItem`** — one timeline entry: category, scheduledAt/endAt ISO strings, durationMinutes, options array, travelTimeTo
- **`PlanItemOption`** — one swipeable card: title, subtitle, price, rating, tags, duration
- **`PlanItemCategory`** — `visa | flight | accommodation | transport | activity | dining | event | entertainment`

---

## Running Locally

```bash
# From the monorepo root
cd apps/travelbook
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The AI Planner is accessible from:
- **Home feed** — "Plan My Trip with AI" banner below the stories row
- **Explore tab** — "AI Trip Planner" card above the search bar
- **Direct route** — `AppRoute.AI_PLANNER = 'ai_planner'`

### With Gemini (optional)

Create `.env.local` in `apps/travelbook/`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

Without this key, the planner uses the built-in destination-aware mock engine, which is indistinguishable from a real AI response in terms of structure and quality.

### Demo mode (no setup needed)

On the input screen, tap **"Try Demo — Bali, 7 days"**. This pre-fills all fields with the `DEMO_PRESET` from `tripPlannerService.ts` and immediately generates a full Bali itinerary using the mock engine.

---

## File Map

```
src/
  views/AIPlannerView.tsx          # Main view (input → loading → plan)
  services/tripPlannerService.ts   # Gemini integration + mock engine
  utils/planCascade.ts             # Cascading timing recalculation
  types/index.ts                   # TripPlan, PlanItem, PlanItemOption types
```
