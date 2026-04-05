# @travelbook/ui — TravelBook Design System

The shared design system for all TravelBook portals. This package provides design tokens, Tailwind class utilities, portal metadata, and third-party API integration references used across the entire TravelBook ecosystem.

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Typography](#typography)
3. [Spacing & Border Radius](#spacing--border-radius)
4. [Component Patterns](#component-patterns)
5. [Third-Party API Integration Map](#third-party-api-integration-map)
6. [Portal Registry](#portal-registry)
7. [Usage Guide](#usage-guide)

---

## Color Tokens

All colors are exported from `colors` in `index.ts`.

### Background

| Token | Hex | Usage |
|-------|-----|-------|
| `background.primary` | `#07161d` | Page background (darkest layer) |
| `background.surface` | `#0a1d26` | Cards, sidebars, panels |
| `background.elevated` | `#0f2a38` | Modals, elevated surfaces |

### Accent

| Token | Hex | Usage |
|-------|-----|-------|
| `accent.teal` | `#14b8a6` | Primary CTA, active states, consumer portals |
| `accent.tealDark` | `#0d9488` | Teal hover/pressed states |
| `accent.tealLight` | `#5eead4` | Teal highlights, icons |
| `accent.amber` | `#fbbf24` | Operator portals (Hotel OS, Tours) |
| `accent.amberDark` | `#d97706` | Amber hover/pressed states |
| `accent.amberLight` | `#fde68a` | Amber highlights |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `text.primary` | `#ffffff` | Headings, body copy |
| `text.muted` | `rgba(255,255,255,0.4)` | Placeholders, metadata |
| `text.subtle` | `rgba(255,255,255,0.6)` | Secondary labels |
| `text.inverse` | `#07161d` | Text on light/amber backgrounds |

### Glass (Glassmorphism)

| Token | Value | Usage |
|-------|-------|-------|
| `glass.bg` | `rgba(255,255,255,0.1)` | Glass card background |
| `glass.bgHover` | `rgba(255,255,255,0.15)` | Glass card hover background |
| `glass.border` | `rgba(255,255,255,0.2)` | Default glass border |
| `glass.borderStrong` | `rgba(255,255,255,0.3)` | Focused/selected glass border |

### Status

| Token | Hex | Usage |
|-------|-----|-------|
| `status.success` | `#22c55e` | Confirmed bookings, available |
| `status.warning` | `#f59e0b` | Pending, limited availability |
| `status.error` | `#ef4444` | Errors, unavailable, cancelled |
| `status.info` | `#3b82f6` | Info states, notifications |

---

## Typography

### Font Stack

```ts
fonts.heading  // 'DM Sans', sans-serif
fonts.body     // 'DM Sans', sans-serif
fonts.mono     // 'JetBrains Mono', monospace
```

Load DM Sans from Google Fonts using the exported `googleFontsUrl`:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
```

### Font Sizes

| Token | rem | px |
|-------|-----|----|
| `xs` | 0.75rem | 12px |
| `sm` | 0.875rem | 14px |
| `base` | 1rem | 16px |
| `lg` | 1.125rem | 18px |
| `xl` | 1.25rem | 20px |
| `2xl` | 1.5rem | 24px |
| `3xl` | 1.875rem | 30px |
| `4xl` | 2.25rem | 36px |

---

## Spacing & Border Radius

```ts
borderRadius.sm    // 0.5rem  — rounded-lg
borderRadius.md    // 0.75rem — rounded-xl
borderRadius.lg    // 1rem    — rounded-2xl
borderRadius.xl    // 1.5rem  — rounded-3xl (cards)
borderRadius.full  // 9999px  — pills/chips
```

---

## Component Patterns

All class names are exported from `cn` and use Tailwind utility classes.

### Layout

```tsx
// Full-page wrapper
<div className={cn.page}>...</div>
<div className={cn.pageWithFont}>...</div>
```

### Cards

```tsx
// Standard glass card
<div className={cn.glassCard}>...</div>

// Glass card with hover effect (listings, grid items)
<div className={cn.glassCardHover}>...</div>

// Lighter glass panel (sidebars, info boxes)
<div className={cn.glassPanel}>...</div>
```

### Buttons

```tsx
// Primary CTA (book, confirm, submit)
<button className={cn.btnPrimary}>Book Now</button>

// Secondary action
<button className={cn.btnSecondary}>Learn More</button>

// Amber (operator portals: Hotel OS, Tours)
<button className={cn.btnAmber}>Add Package</button>

// Ghost (nav, secondary links)
<button className={cn.btnGhost}>Cancel</button>

// Destructive
<button className={cn.btnDanger}>Delete</button>
```

### Navigation

```tsx
<nav className={cn.navContainer}>
  <button className={cn.navItemActive}>Dashboard</button>
  <button className={cn.navItemInactive}>Bookings</button>
</nav>
```

### Inputs

```tsx
<input className={cn.input} placeholder="Search destinations..." />
```

### Badges

```tsx
<span className={cn.badgeTeal}>Confirmed</span>
<span className={cn.badgeAmber}>Pending</span>
<span className={cn.badgeGreen}>Available</span>
<span className={cn.badgeRed}>Cancelled</span>
```

### Text Utilities

```tsx
<p className={cn.label}>Departure Date</p>
<h2 className={cn.sectionTitle}>Upcoming Trips</h2>
<p className={cn.muted}>No bookings yet</p>
```

---

## Third-Party API Integration Map

These are the external providers that power TravelBook's marketplace inventory. All env keys follow the naming convention defined in `.env.example` at the monorepo root.

### Flights

| Provider | Env Key | Docs |
|----------|---------|------|
| **Amadeus Travel API** (primary) | `NEXT_PUBLIC_AMADEUS_API_KEY` + `NEXT_PUBLIC_AMADEUS_API_SECRET` | [developers.amadeus.com](https://developers.amadeus.com) |
| **Skyscanner API** (alternate) | `NEXT_PUBLIC_SKYSCANNER_API_KEY` | [partners.skyscanner.net](https://www.partners.skyscanner.net/affiliates/travel-apis) |

### Accommodation

| Provider | Env Key | Docs |
|----------|---------|------|
| **Booking.com Demand API** | `NEXT_PUBLIC_BOOKING_API_KEY` | [developers.booking.com](https://developers.booking.com) |

### Travel Insurance

| Provider | Env Key | Docs |
|----------|---------|------|
| **Cover Genius XCover** (primary) | `NEXT_PUBLIC_COVER_GENIUS_API_KEY` | [covergenius.com/xcover](https://www.covergenius.com/xcover) |
| **Battleface** (adventure/specialty) | `NEXT_PUBLIC_BATTLEFACE_API_KEY` | [battleface.com/api](https://battleface.com/api) |

### Events

| Provider | Env Key | Docs |
|----------|---------|------|
| **Ticketmaster Discovery API** (primary) | `NEXT_PUBLIC_TICKETMASTER_API_KEY` | [developer.ticketmaster.com](https://developer.ticketmaster.com) |
| **Eventbrite API** (local events) | `NEXT_PUBLIC_EVENTBRITE_API_KEY` | [eventbrite.com/platform/api](https://www.eventbrite.com/platform/api) |

### Entertainment & Activities

| Provider | Env Key | Docs |
|----------|---------|------|
| **Viator / TripAdvisor** (primary) | `NEXT_PUBLIC_VIATOR_API_KEY` | [partnerresources.viator.com](https://partnerresources.viator.com) |
| **GetYourGuide** (alternate) | `NEXT_PUBLIC_GETYOURGUIDE_API_KEY` | [api.getyourguide.com](https://api.getyourguide.com) |

### Maps

| Provider | Env Key | Docs |
|----------|---------|------|
| **Mapbox** | `NEXT_PUBLIC_MAPBOX_TOKEN` | [docs.mapbox.com](https://docs.mapbox.com) |

### Payments

| Provider | Env Key | Docs |
|----------|---------|------|
| **Stripe** | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` | [stripe.com/docs](https://stripe.com/docs) |

### AI / Intelligence

| Provider | Env Key | Docs |
|----------|---------|------|
| **Google Gemini** | `NEXT_PUBLIC_GEMINI_API_KEY` | [ai.google.dev](https://ai.google.dev) |

---

## Portal Registry

The `portals` export maps each portal's metadata for cross-app navigation and documentation.

| Key | Portal Name | Type | Color |
|-----|-------------|------|-------|
| `travelbook` | TravelBook | consumer | teal |
| `rides` | TravelBook Rides | operator | teal |
| `hotelOs` | TravelBook Hotel OS | operator | amber |
| `tours` | TravelBook Tours | operator | amber |

---

## Usage Guide

### Install in an app

Since this is a monorepo with npm workspaces, reference the package directly:

```json
// In your app's package.json
{
  "dependencies": {
    "@travelbook/ui": "*"
  }
}
```

### Import tokens

```ts
import { colors, cn, portals, thirdPartyApis, googleFontsUrl } from '@travelbook/ui';

// Use a color token
const bg = colors.background.primary; // '#07161d'

// Use a class name
<div className={cn.glassCard}>...</div>

// Reference portal metadata
const { name, tagline } = portals.travelbook;
```

### Design philosophy

TravelBook uses a **dark glassmorphism** aesthetic — deep navy backgrounds (`#07161d`), frosted glass cards, and teal/amber accents. The system is intentionally opinionated to ensure visual consistency across all four portals while allowing each portal to express its personality (teal for consumer/rides, amber for operator portals).

Keep all visual decisions grounded in these tokens. Do not introduce hardcoded hex values or Tailwind classes that duplicate what's already defined here.
