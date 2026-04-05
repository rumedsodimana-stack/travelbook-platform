// ============================================================
// @travelbook/ui — Shared Design System
// Used by: TravelBook, TravelBook Rides, TravelBook Hotel OS,
//          TravelBook Tours
// ============================================================

// --- COLOR TOKENS ---
export const colors = {
  background: {
    primary: '#07161d',   // Darkest — page background
    surface: '#0a1d26',   // Cards, sidebars, panels
    elevated: '#0f2a38',  // Elevated surfaces, modals
  },
  accent: {
    teal: '#14b8a6',
    tealDark: '#0d9488',
    tealLight: '#5eead4',
    amber: '#fbbf24',
    amberDark: '#d97706',
    amberLight: '#fde68a',
  },
  text: {
    primary: '#ffffff',
    muted: 'rgba(255,255,255,0.4)',
    subtle: 'rgba(255,255,255,0.6)',
    inverse: '#07161d',
  },
  glass: {
    bg: 'rgba(255,255,255,0.1)',
    bgHover: 'rgba(255,255,255,0.15)',
    border: 'rgba(255,255,255,0.2)',
    borderStrong: 'rgba(255,255,255,0.3)',
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  }
} as const;

// --- TYPOGRAPHY ---
export const fonts = {
  heading: "'DM Sans', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem',// 30px
  '4xl': '2.25rem', // 36px
} as const;

// --- SPACING ---
export const borderRadius = {
  sm: '0.5rem',     // rounded-lg
  md: '0.75rem',    // rounded-xl
  lg: '1rem',       // rounded-2xl
  xl: '1.5rem',     // rounded-3xl (cards)
  full: '9999px',   // pills
} as const;

// --- COMPONENT CLASS NAMES (Tailwind) ---
export const cn = {
  // Layout
  page: 'min-h-screen bg-[#07161d] text-white',
  pageWithFont: 'min-h-screen bg-[#07161d] text-white font-sans',

  // Cards
  glassCard: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden',
  glassCardHover: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:border-teal-500/50 hover:shadow-teal-500/10 transition-all duration-300',
  glassPanel: 'bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl',

  // Buttons
  btnPrimary: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl px-6 py-3 font-semibold shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
  btnSecondary: 'bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl px-6 py-3 font-semibold hover:bg-white/30 transition-all duration-300',
  btnAmber: 'bg-amber-300 text-slate-950 rounded-2xl px-6 py-3 font-semibold shadow-lg shadow-amber-300/20 hover:scale-105 active:scale-95 transition-all duration-300',
  btnGhost: 'bg-transparent text-white/70 rounded-2xl px-6 py-3 hover:text-white hover:bg-white/10 transition-all duration-300',
  btnDanger: 'bg-red-500/20 text-red-400 rounded-2xl px-6 py-3 hover:bg-red-500/30 transition-all duration-300',

  // Navigation
  navContainer: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-2',
  navItemActive: 'bg-teal-500 text-white rounded-2xl shadow-lg shadow-teal-500/40',
  navItemInactive: 'text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300',

  // Inputs
  input: 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-all',

  // Badges
  badgeTeal: 'bg-teal-500/20 text-teal-400 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
  badgeAmber: 'bg-amber-300/20 text-amber-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
  badgeGreen: 'bg-green-500/20 text-green-400 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
  badgeRed: 'bg-red-500/20 text-red-400 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',

  // Text
  label: 'text-[10px] text-white/40 uppercase font-bold tracking-wider',
  sectionTitle: 'text-2xl font-bold text-white',
  muted: 'text-white/40 text-sm',
} as const;

// --- GOOGLE FONTS ---
export const googleFontsUrl = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";

// --- PORTAL METADATA ---
export const portals = {
  travelbook: {
    name: 'TravelBook',
    tagline: 'Your Complete Travel Companion',
    description: 'Search and book flights, hotels, tours, rides, and experiences',
    color: colors.accent.teal,
    path: 'apps/travelbook',
    github: 'https://github.com/rumedsodimana-stack/travelbook',
    type: 'consumer' as const,
  },
  rides: {
    name: 'TravelBook Rides',
    tagline: 'Drive. Earn. Repeat.',
    description: 'Vehicle owner portal — list your vehicle and accept ride requests',
    color: colors.accent.teal,
    path: 'apps/travelbook-rides',
    github: 'https://github.com/rumedsodimana-stack/Tavelbook-rides',
    type: 'operator' as const,
  },
  hotelOs: {
    name: 'TravelBook Hotel OS',
    tagline: 'Run Your Property Smarter',
    description: 'Hotel and dining operator portal — manage rooms, tables, and availability',
    color: colors.accent.amber,
    path: 'apps/travelbook-hotel-os',
    github: 'https://github.com/rumedsodimana-stack/Os-front-end',
    type: 'operator' as const,
  },
  tours: {
    name: 'TravelBook Tours',
    tagline: 'Create. Package. Sell.',
    description: 'Tour operator portal — build and sell travel packages',
    color: colors.accent.amber,
    path: 'apps/travelbook-tours',
    github: 'https://github.com/rumedsodimana-stack/paraiso-tours',
    type: 'operator' as const,
  },
} as const;

// --- THIRD-PARTY API INTEGRATIONS ---
export const thirdPartyApis = {
  flights: {
    name: 'Amadeus Travel API',
    docs: 'https://developers.amadeus.com',
    envKey: 'NEXT_PUBLIC_AMADEUS_API_KEY',
    description: 'Flight search, booking, and pricing',
    category: 'flights',
  },
  flightsAlternate: {
    name: 'Skyscanner API',
    docs: 'https://www.partners.skyscanner.net/affiliates/travel-apis',
    envKey: 'NEXT_PUBLIC_SKYSCANNER_API_KEY',
    description: 'Alternative flight search and price comparison',
    category: 'flights',
  },
  hotels: {
    name: 'Booking.com Demand API',
    docs: 'https://developers.booking.com',
    envKey: 'NEXT_PUBLIC_BOOKING_API_KEY',
    description: 'Hotel inventory and availability',
    category: 'accommodation',
  },
  insurance: {
    name: 'Cover Genius XCover API',
    docs: 'https://www.covergenius.com/xcover',
    envKey: 'NEXT_PUBLIC_COVER_GENIUS_API_KEY',
    description: 'Embedded travel insurance at checkout',
    category: 'insurance',
  },
  insuranceAlternate: {
    name: 'Battleface API',
    docs: 'https://battleface.com/api',
    envKey: 'NEXT_PUBLIC_BATTLEFACE_API_KEY',
    description: 'Adventure and specialty travel insurance',
    category: 'insurance',
  },
  events: {
    name: 'Ticketmaster Discovery API',
    docs: 'https://developer.ticketmaster.com',
    envKey: 'NEXT_PUBLIC_TICKETMASTER_API_KEY',
    description: 'Events, concerts, sports, and shows at destinations',
    category: 'events',
  },
  eventsAlternate: {
    name: 'Eventbrite API',
    docs: 'https://www.eventbrite.com/platform/api',
    envKey: 'NEXT_PUBLIC_EVENTBRITE_API_KEY',
    description: 'Local events and experiences',
    category: 'events',
  },
  entertainment: {
    name: 'Viator (TripAdvisor) API',
    docs: 'https://partnerresources.viator.com',
    envKey: 'NEXT_PUBLIC_VIATOR_API_KEY',
    description: 'Tours, activities, and experiences at destinations',
    category: 'entertainment',
  },
  entertainmentAlternate: {
    name: 'GetYourGuide API',
    docs: 'https://api.getyourguide.com',
    envKey: 'NEXT_PUBLIC_GETYOURGUIDE_API_KEY',
    description: 'Tours, activities, and attraction tickets',
    category: 'entertainment',
  },
  maps: {
    name: 'Mapbox API',
    docs: 'https://docs.mapbox.com',
    envKey: 'NEXT_PUBLIC_MAPBOX_TOKEN',
    description: 'Maps, geocoding, and routing',
    category: 'maps',
  },
  payments: {
    name: 'Stripe API',
    docs: 'https://stripe.com/docs',
    envKey: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    description: 'Payment processing for all bookings',
    category: 'payments',
  },
  ai: {
    name: 'Google Gemini API',
    docs: 'https://ai.google.dev',
    envKey: 'NEXT_PUBLIC_GEMINI_API_KEY',
    description: 'AI travel planner, search suggestions, live concierge',
    category: 'ai',
  },
} as const;

export type ApiCategory = 'flights' | 'accommodation' | 'insurance' | 'events' | 'entertainment' | 'maps' | 'payments' | 'ai';
export type PortalType = 'consumer' | 'operator';
