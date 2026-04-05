import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Star, Heart, Gift, Cake, Globe, Phone, Mail,
  MapPin, Clock, CheckCircle2, AlertTriangle, Search,
  Plus, Edit2, ChevronRight, MessageSquare, Send,
  Award, TrendingUp, Users, Calendar, Sparkles,
  Crown, Shield, ThumbsUp, ThumbsDown, Eye,
  ArrowUpRight, Coffee, Bed, UtensilsCrossed, Wifi,
  Car, HeartHandshake, BellRing, Filter, Download, UserCheck
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface GuestsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

type LoyaltyTier = "Platinum Elite" | "Platinum" | "Gold" | "Silver" | "Member";
type NationalityFlag = string;

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  flag: string;
  email: string;
  phone: string;
  tier: LoyaltyTier;
  points: number;
  totalStays: number;
  totalNights: number;
  totalSpend: number;
  lastStay: string;
  nextStay?: string;
  currentlyInHouse: boolean;
  currentRoom?: string;
  preferredRoom: string;
  preferredFloor: string;
  dietaryReq: string[];
  pillowPref: string;
  amenityPref: string[];
  interests: string[];
  language: string;
  birthday: string;
  anniversary?: string;
  dnd: boolean;
  vip: boolean;
  notes: string;
  profileComplete: number;
  sentiment: "Positive" | "Neutral" | "Negative";
  nps?: number;
  blacklisted: boolean;
  tags: string[];
}

interface FeedbackEntry {
  id: string;
  guestId: string;
  guestName: string;
  stay: string;
  rating: number;
  channel: string;
  category: string;
  comment: string;
  responded: boolean;
  response?: string;
  date: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

interface LoyaltyTransaction {
  id: string;
  guestId: string;
  guestName: string;
  type: "Earn" | "Redeem" | "Bonus" | "Expire";
  points: number;
  description: string;
  date: string;
  balance: number;
}

interface GuestMoment {
  id: string;
  guestId: string;
  guestName: string;
  type: "Birthday" | "Anniversary" | "Milestone Stay" | "First Stay" | "Return After Long Absence";
  date: string;
  room: string;
  tier: LoyaltyTier;
  actionTaken?: string;
  status: "Upcoming" | "Today" | "Done";
  suggestedGift: string;
}

// ── Sample Data ──────────────────────────────────────────────
const guests: Guest[] = [
  { id: "G001", firstName: "Sheikh Khalid", lastName: "Al-Zayed", nationality: "Bahraini", flag: "🇧🇭", email: "k.alzayed@rbb.bh", phone: "+973 3900 1100", tier: "Platinum Elite", points: 84200, totalStays: 47, totalNights: 142, totalSpend: 98500, lastStay: "2026-04-02", nextStay: "2026-04-12", currentlyInHouse: true, currentRoom: "1001", preferredRoom: "Penthouse Suite", preferredFloor: "10th", dietaryReq: ["Halal"], pillowPref: "Soft", amenityPref: ["Fresh flowers", "Oud incense", "Arabic coffee"], interests: ["Golf", "Fine Dining", "Business"], language: "Arabic", birthday: "1968-09-14", dnd: false, vip: true, notes: "Always greet with 'Ahlan wa Sahlan'. Prefers room at 20°C. Never discuss business in front of family.", profileComplete: 100, sentiment: "Positive", nps: 10, blacklisted: false, tags: ["VIP", "Board Member", "Regular"] },
  { id: "G002", firstName: "James", lastName: "Chen", nationality: "British", flag: "🇬🇧", email: "j.chen@techforward.com", phone: "+44 7700 900123", tier: "Gold", points: 22800, totalStays: 18, totalNights: 54, totalSpend: 32400, lastStay: "2026-04-02", nextStay: "2026-04-08", currentlyInHouse: true, currentRoom: "501", preferredRoom: "King Deluxe", preferredFloor: "5th", dietaryReq: ["Vegetarian"], pillowPref: "Medium", amenityPref: ["Nespresso machine", "Extra towels"], interests: ["Technology", "Swimming", "Business"], language: "English", birthday: "1985-03-22", dnd: false, vip: false, notes: "Always requests a quiet room. Dislikes being called 'sir'. Prefers text communication.", profileComplete: 92, sentiment: "Positive", nps: 9, blacklisted: false, tags: ["Business", "Tech"] },
  { id: "G003", firstName: "Maryam", lastName: "Al-Khalifa", nationality: "Bahraini", flag: "🇧🇭", email: "maryam.khalifa@gmail.com", phone: "+973 3765 4321", tier: "Platinum", points: 41500, totalStays: 32, totalNights: 96, totalSpend: 56200, lastStay: "2026-04-02", currentlyInHouse: true, currentRoom: "712", preferredRoom: "Junior Suite", preferredFloor: "7th", dietaryReq: ["Halal", "No Shellfish"], pillowPref: "Firm", amenityPref: ["Rose petals", "Herbal tea"], interests: ["Spa", "Shopping", "Family"], language: "Arabic", birthday: "1990-11-28", anniversary: "2015-06-15", dnd: true, vip: true, notes: "Newlywed. First anniversary stay coming up. Always upgrades happily.", profileComplete: 98, sentiment: "Positive", nps: 10, blacklisted: false, tags: ["VIP", "Loyalty", "Honeymoon"] },
  { id: "G004", firstName: "David", lastName: "Müller", nationality: "German", flag: "🇩🇪", email: "d.muller@deutschebank.de", phone: "+49 172 3456789", tier: "Gold", points: 18200, totalStays: 12, totalNights: 36, totalSpend: 21600, lastStay: "2026-04-02", currentlyInHouse: true, currentRoom: "305", preferredRoom: "Standard King", preferredFloor: "3rd", dietaryReq: ["Gluten-free"], pillowPref: "Medium", amenityPref: ["Fitness access", "Newspaper (FT)"], interests: ["Finance", "History", "Running"], language: "German", birthday: "1978-07-04", dnd: false, vip: false, notes: "Allergic to perfume sprays in room. Prefers room service breakfast at 07:00 sharp.", profileComplete: 85, sentiment: "Neutral", nps: 7, blacklisted: false, tags: ["Business", "Finance"] },
  { id: "G005", firstName: "Priya", lastName: "Sharma", nationality: "Indian", flag: "🇮🇳", email: "p.sharma@aiventures.io", phone: "+91 9876 543210", tier: "Silver", points: 8400, totalStays: 5, totalNights: 12, totalSpend: 9800, lastStay: "2026-04-02", currentlyInHouse: true, currentRoom: "208", preferredRoom: "Deluxe Twin", preferredFloor: "2nd", dietaryReq: ["Vegan"], pillowPref: "Soft", amenityPref: ["Yoga mat", "Green tea"], interests: ["Yoga", "Technology", "Sustainability"], language: "English", birthday: "1992-04-08", dnd: false, vip: false, notes: "Very eco-conscious. Leave a 'no daily housekeeping' card by default.", profileComplete: 78, sentiment: "Positive", nps: 9, blacklisted: false, tags: ["Tech", "Sustainability"] },
  { id: "G006", firstName: "Carlos", lastName: "Mendez", nationality: "Spanish", flag: "🇪🇸", email: "c.mendez@globalcorp.es", phone: "+34 612 345678", tier: "Member", points: 2100, totalStays: 2, totalNights: 6, totalSpend: 4200, lastStay: "2026-04-02", currentlyInHouse: true, currentRoom: "316", preferredRoom: "Standard King", preferredFloor: "3rd", dietaryReq: [], pillowPref: "Medium", amenityPref: [], interests: ["Business", "Football"], language: "Spanish", birthday: "1982-12-01", dnd: false, vip: false, notes: "", profileComplete: 45, sentiment: "Neutral", blacklisted: false, tags: ["New Guest"] },
  { id: "G007", firstName: "Noura", lastName: "Al-Rashid", nationality: "Saudi", flag: "🇸🇦", email: "noura.rashid@aramco.sa", phone: "+966 55 234 5678", tier: "Platinum", points: 38700, totalStays: 28, totalNights: 84, totalSpend: 48600, lastStay: "2026-02-14", nextStay: "2026-05-01", currentlyInHouse: false, preferredRoom: "Suite", preferredFloor: "8th", dietaryReq: ["Halal", "No Pork"], pillowPref: "Soft", amenityPref: ["Luxury bath set", "Fresh Dates"], interests: ["Shopping", "Spa", "Art"], language: "Arabic", birthday: "1986-05-01", anniversary: "2010-09-20", dnd: false, vip: true, notes: "Favourite room: 802. Anniversary in September — coordinate gift in advance.", profileComplete: 96, sentiment: "Positive", nps: 9, blacklisted: false, tags: ["VIP", "Regular", "Loyalty"] },
  { id: "G008", firstName: "Robert", lastName: "Park", nationality: "Korean", flag: "🇰🇷", email: "r.park@samsungbio.kr", phone: "+82 10 3456 7890", tier: "Silver", points: 11200, totalStays: 8, totalNights: 24, totalSpend: 15800, lastStay: "2026-04-02", currentlyInHouse: true, currentRoom: "615", preferredRoom: "King City View", preferredFloor: "6th", dietaryReq: [], pillowPref: "Firm", amenityPref: ["Smart TV", "Fast WiFi"], interests: ["Technology", "Golf", "Business"], language: "Korean", birthday: "1988-02-14", dnd: false, vip: false, notes: "Prefers low floor for quick elevator access. Always checks WiFi speed on arrival.", profileComplete: 72, sentiment: "Neutral", blacklisted: false, tags: ["Business", "Tech"] },
];

const feedbackEntries: FeedbackEntry[] = [
  { id: "F001", guestId: "G001", guestName: "Sheikh Khalid Al-Zayed", stay: "Mar 2026", rating: 5, channel: "Direct", category: "Room", comment: "Exceptional as always. The team remembered my oud incense preference without being asked. World-class hospitality.", responded: true, response: "Your loyalty means everything to us. Looking forward to welcoming you again in April.", date: "2026-03-30", sentiment: "Positive" },
  { id: "F002", guestId: "G002", guestName: "James Chen", stay: "Mar 2026", rating: 4, channel: "Google", category: "Service", comment: "Great stay overall. WiFi could be faster for video calls but staff were incredibly responsive.", responded: true, response: "Thank you James — we've upgraded the WiFi infrastructure in Rooms 500-520. See you soon.", date: "2026-03-29", sentiment: "Positive" },
  { id: "F003", guestId: "G004", guestName: "David Müller", stay: "Feb 2026", rating: 3, channel: "TripAdvisor", category: "Housekeeping", comment: "Room had perfume spray used despite my allergy note on file. This has happened before. Disappointing.", responded: false, date: "2026-03-02", sentiment: "Negative" },
  { id: "F004", guestId: "G007", guestName: "Noura Al-Rashid", stay: "Feb 2026", rating: 5, channel: "WhatsApp", category: "F&B", comment: "The Valentine's dinner setup was magical. Thank you for remembering our anniversary. We will be back!", responded: true, response: "It was our honour, Ms Al-Rashid. We look forward to celebrating many more moments with you.", date: "2026-02-16", sentiment: "Positive" },
  { id: "F005", guestId: "G005", guestName: "Priya Sharma", stay: "Apr 2026", rating: 5, channel: "In-App", category: "Sustainability", comment: "Loved the eco-friendly room option and the vegan breakfast. Finally a hotel that gets it!", responded: false, date: "2026-04-02", sentiment: "Positive" },
];

const loyaltyTransactions: LoyaltyTransaction[] = [
  { id: "LT001", guestId: "G001", guestName: "Sheikh Khalid Al-Zayed", type: "Earn", points: 3500, description: "Room stay — Penthouse Apr 2026", date: "2026-04-02", balance: 84200 },
  { id: "LT002", guestId: "G003", guestName: "Maryam Al-Khalifa", type: "Bonus", points: 1000, description: "Anniversary bonus — Platinum tier", date: "2026-04-02", balance: 41500 },
  { id: "LT003", guestId: "G002", guestName: "James Chen", type: "Earn", points: 850, description: "Room stay — Deluxe King Apr 2026", date: "2026-04-02", balance: 22800 },
  { id: "LT004", guestId: "G007", guestName: "Noura Al-Rashid", type: "Redeem", points: -5000, description: "Spa treatment redemption — Feb 2026", date: "2026-02-14", balance: 38700 },
  { id: "LT005", guestId: "G004", guestName: "David Müller", type: "Earn", points: 620, description: "Room stay — Standard King Apr 2026", date: "2026-04-02", balance: 18200 },
];

const guestMoments: GuestMoment[] = [
  { id: "M001", guestId: "G005", guestName: "Priya Sharma", type: "Birthday", date: "2026-04-08", room: "208", tier: "Silver", status: "Upcoming", suggestedGift: "Complimentary birthday cake + room upgrade to Junior Suite" },
  { id: "M002", guestId: "G001", guestName: "Sheikh Khalid Al-Zayed", type: "Milestone Stay", date: "2026-04-12", room: "1001", tier: "Platinum Elite", status: "Upcoming", suggestedGift: "Personalised crystal plaque + complimentary dinner for 2" },
  { id: "M003", guestId: "G003", guestName: "Maryam Al-Khalifa", type: "Anniversary", date: "2026-06-15", room: "TBD", tier: "Platinum", status: "Upcoming", suggestedGift: "Rose petal turndown + champagne + couple massage" },
  { id: "M004", guestId: "G007", guestName: "Noura Al-Rashid", type: "Birthday", date: "2026-05-01", room: "TBD", tier: "Platinum", status: "Upcoming", suggestedGift: "VIP flower arrangement + handwritten card + Platinum afternoon tea" },
];

const satisfactionTrend = [
  { month: "Nov", score: 8.2 }, { month: "Dec", score: 8.5 }, { month: "Jan", score: 8.3 },
  { month: "Feb", score: 8.7 }, { month: "Mar", score: 8.9 }, { month: "Apr", score: 9.1 },
];

const tierDistribution = [
  { name: "Platinum Elite", value: 8, color: "#7c3aed" },
  { name: "Platinum", value: 22, color: "#6366f1" },
  { name: "Gold", value: 45, color: "#f59e0b" },
  { name: "Silver", value: 98, color: "#94a3b8" },
  { name: "Member", value: 312, color: "#e2e8f0" },
];

const nationalityData = [
  { country: "Bahrain", guests: 142 },
  { country: "Saudi Arabia", guests: 98 },
  { country: "UAE", guests: 76 },
  { country: "UK", guests: 45 },
  { country: "India", guests: 38 },
  { country: "Germany", guests: 22 },
  { country: "Other", guests: 64 },
];

// ── Helper Components ──────────────────────────────────────────
const tierColors: Record<LoyaltyTier, string> = {
  "Platinum Elite": "bg-purple-100 text-purple-800 border border-purple-200",
  Platinum: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  Gold: "bg-amber-100 text-amber-800 border border-amber-200",
  Silver: "bg-slate-100 text-slate-700 border border-slate-200",
  Member: "bg-muted text-muted-foreground border border-border",
};
const TierBadge = ({ tier }: { tier: LoyaltyTier }) => (
  <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", tierColors[tier])}>{tier}</span>
);
const SentimentBadge = ({ s }: { s: string }) => (
  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", s === "Positive" ? "bg-green-100 text-green-700" : s === "Negative" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700")}>{s}</span>
);
const PriorityDot = ({ tier }: { tier: LoyaltyTier }) => (
  <span className={cn("w-2 h-2 rounded-full inline-block mr-2", tier === "Platinum Elite" ? "bg-purple-500" : tier === "Platinum" ? "bg-indigo-500" : tier === "Gold" ? "bg-amber-400" : "bg-slate-400")} />
);
const getGuestStatus = (g: Guest): string => {
  if (g.currentlyInHouse) return "In-House";
  if (!g.currentlyInHouse && !!g.nextStay) return "Arriving Today";
  return "Reserved";
};

export function Guests({ aiEnabled, activeSubmenu = "Overview" }: GuestsProps) {
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [tierFilter, setTierFilter] = useState<string>("All");
  const inHouseGuests = guests.filter(g => g.currentlyInHouse === true);
  const todayArrivals = guests.filter(g => !g.currentlyInHouse && !!g.nextStay);
  const vipGuests = guests.filter(g => g.tier === "Platinum Elite" || g.tier === "Platinum");

  const filteredGuests = guests.filter(g => {
    const matchSearch = `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase()) || g.nationality.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "All" || g.tier === tierFilter;
    return matchSearch && matchTier;
  });
  const avgSatisfaction = (feedbackEntries.reduce((s, f) => s + f.rating, 0) / feedbackEntries.length).toFixed(1);

  return (
    <AnimatePresence mode="wait">

        {/* ── OVERVIEW ────────────────────────────────────── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search guests..." />}
              header={<SectionHeader title="Guest Intelligence" subtitle="Know every guest before they walk through the door" icon={UserCheck} />}
              kpi={<KpiStrip items={[{color:"bg-violet-500",value:inHouseGuests.length,label:"In-House Guests"},{color:"bg-blue-500",value:todayArrivals.length,label:"Arrivals Today"},{color:"bg-amber-500",value:avgSatisfaction,label:"Satisfaction Score"},{color:"bg-emerald-500",value:"485",label:"Active Members"},{color:"bg-rose-500",value:vipGuests.length,label:"VIP Guests"}]} />}
            >

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Satisfaction trend */}
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Satisfaction Score Trend" />
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={satisfactionTrend}>
                    <defs><linearGradient id="satGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-violet-500,#7c3aed)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--color-violet-500,#7c3aed)" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[7.5, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="url(#satGrad)" strokeWidth={2} dot={{ r: 4, fill: "#7c3aed" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Tier distribution */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Loyalty Tier Breakdown" />
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {tierDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number, n: string) => [v, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {tierDistribution.slice(0,3).map(t => (
                    <div key={t.name} className="flex justify-between text-xs">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} />{t.name}</span>
                      <span className="font-semibold text-foreground">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom row: In-house VIPs + Upcoming Moments + Recent Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* In-house VIPs */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500" />VIPs On Property</h3>
                  <span className="text-xs text-muted-foreground">{inHouseGuests.filter(g=>g.tier==="Platinum Elite"||g.tier==="Platinum").length} guests</span>
                </div>
                <div className="space-y-3">
                  {inHouseGuests.filter(g=>g.tier==="Platinum Elite"||g.tier==="Platinum").map(g => (
                    <div key={g.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer" onClick={() => setSelectedGuest(g)}>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">{g.firstName.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{`${g.firstName} ${g.lastName}`}</p>
                        <p className="text-xs text-muted-foreground">Room {g.currentRoom} · {g.totalNights} nights</p>
                      </div>
                      <TierBadge tier={g.tier} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Upcoming moments */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Upcoming Moments" className="mb-3" actions={<Gift className="w-4 h-4 text-pink-500" />} />
                <div className="space-y-3">
                  {guestMoments.map(m => (
                    <div key={m.id} className="p-2.5 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{m.guestName}</span>
                        <span className="text-xs text-muted-foreground">{m.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {m.type === "Birthday" ? <Cake className="w-3 h-3 text-pink-400" /> : m.type === "Anniversary" ? <Heart className="w-3 h-3 text-red-400" /> : <Star className="w-3 h-3 text-amber-400" />}
                        <span className="text-xs text-muted-foreground">{m.type}</span>
                      </div>
                      <p className="text-xs text-violet-600 mt-1.5 line-clamp-1">{m.suggestedGift}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Recent feedback */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Recent Feedback" className="mb-3" actions={<MessageSquare className="w-4 h-4 text-blue-500" />} />
                <div className="space-y-3">
                  {feedbackEntries.slice(0, 4).map(f => (
                    <div key={f.id} className="border-b border-border/50 pb-2 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{f.guestName}</span>
                        <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} className={cn("w-3 h-3",s<=f.rating?"text-amber-400 fill-amber-400":"text-muted-foreground")} />)}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{f.comment}</p>
                      <SentimentBadge s={f.sentiment} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── ALL GUESTS ───────────────────────────────────── */}
        {activeSubmenu === "All Guests" && (
          <motion.div key="all-guests" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search by name, email, nationality..." />}
              header={<SectionHeader title="Guest Directory" subtitle={`${guests.length} total profiles`} icon={UserCheck} actions={<button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" />New Guest Profile</button>} />}
              kpi={<KpiStrip items={[{color:"bg-violet-500",value:guests.length,label:"Total Guests"},{color:"bg-indigo-500",value:guests.filter(g=>g.tier==="Platinum Elite").length,label:"Platinum Elite"},{color:"bg-amber-500",value:guests.filter(g=>g.tier==="Gold").length,label:"Gold"},{color:"bg-slate-500",value:guests.filter(g=>g.tier==="Silver").length,label:"Silver"},{color:"bg-emerald-500",value:inHouseGuests.length,label:"In-House"}]} />}
            >
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                {["All","Platinum Elite","Platinum","Gold","Silver"].map(t => (
                  <button key={t} onClick={()=>setTierFilter(t)} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border", tierFilter===t?"bg-violet-600 text-white border-violet-600":"bg-card border-border text-muted-foreground hover:bg-secondary")}>{t}</button>
                ))}
              </div>
            </div>
            {/* Guest table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Guest</th>
                  <th className="text-left px-4 py-3 font-medium">Tier</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Nationality</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Stays</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Points</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Profile</th>
                </tr></thead>

                <tbody className="divide-y divide-border/50">
                  {filteredGuests.map(g => (
                    <tr key={g.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={()=>setSelectedGuest(g)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", g.tier==="Platinum Elite"?"bg-gradient-to-br from-purple-500 to-violet-700":g.tier==="Platinum"?"bg-gradient-to-br from-indigo-400 to-indigo-600":g.tier==="Gold"?"bg-gradient-to-br from-amber-400 to-orange-500":"bg-gradient-to-br from-slate-400 to-slate-600")}>{g.firstName.charAt(0)}</div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">{`${g.firstName} ${g.lastName}`}{g.vip&&<Crown className="w-3 h-3 text-amber-500"/>}</div>
                            <p className="text-xs text-muted-foreground">{g.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><TierBadge tier={g.tier} /></td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-muted-foreground"/><span className="text-foreground">{g.nationality}</span></div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell font-semibold text-foreground">{g.totalStays}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-500"/><span className="font-medium text-foreground">{g.points.toLocaleString()}</span></div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getGuestStatus(g)==="In-House"?"bg-green-100 text-green-700":getGuestStatus(g)==="Arriving Today"?"bg-blue-100 text-blue-700":"bg-purple-100 text-purple-700")}>{getGuestStatus(g)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{width:`${g.profileComplete}%`}}/></div>
                          <span className="text-xs text-muted-foreground">{g.profileComplete}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Guest detail panel */}
            {selectedGuest && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl", selectedGuest.tier==="Platinum Elite"?"bg-gradient-to-br from-purple-500 to-violet-700":"bg-gradient-to-br from-indigo-400 to-indigo-600")}>{selectedGuest.firstName.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2"><h3 className="text-lg font-bold text-foreground">{`${selectedGuest.firstName} ${selectedGuest.lastName}`}</h3>{selectedGuest.vip&&<Crown className="w-4 h-4 text-amber-500"/>}</div>
                      <TierBadge tier={selectedGuest.tier} />
                      <p className="text-sm text-muted-foreground mt-1">{selectedGuest.email} · {selectedGuest.phone}</p>
                    </div>
                  </div>
                  <button onClick={()=>setSelectedGuest(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors">✕</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[{label:"Total Stays",v:selectedGuest.totalStays},{label:"Total Spend",v:`$${selectedGuest.totalSpend.toLocaleString()}`},{label:"Loyalty Points",v:selectedGuest.points.toLocaleString()},{label:"Nationality",v:selectedGuest.nationality}].map(s=>(
                    <div key={s.label} className="bg-secondary/40 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-lg font-bold text-foreground mt-1">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Coffee className="w-4 h-4"/>Room Preferences</h4>
                    <div className="space-y-1.5 text-sm">
                      {[["Floor",selectedGuest.preferredFloor],["Pillow",selectedGuest.pillowPref],["Dietary",selectedGuest.dietaryReq.join(", ")||"None"]].map(([k,v])=>(
                        <div key={k} className="flex justify-between border-b border-border/50 pb-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/>Interests & Notes</h4>
                    <div className="flex flex-wrap gap-1.5 mb-2">{selectedGuest.interests.map(i=><span key={i} className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">{i}</span>)}</div>
                    <p className="text-sm text-muted-foreground">{selectedGuest.notes}</p>
                  </div>
                </div>
              </div>
            )}
            </PageShell>
          </motion.div>
        )}

        {/* ── ARRIVALS TODAY ───────────────────────────────── */}
        {activeSubmenu === "Arrivals Today" && (
          <motion.div key="arrivals" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search arrivals..." />}
              header={<SectionHeader title="Today's Arrivals" subtitle={`${todayArrivals.length} guests arriving · All preferences pre-loaded`} icon={UserCheck} actions={<button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"><Send className="w-4 h-4"/>Send Pre-Arrival Messages</button>} />}
              kpi={<KpiStrip items={[{color:"bg-blue-500",value:todayArrivals.length,label:"Arriving Today"},{color:"bg-violet-500",value:todayArrivals.filter(g=>g.vip).length,label:"VIP Arrivals"},{color:"bg-amber-500",value:todayArrivals.filter(g=>g.tier==="Platinum Elite"||g.tier==="Platinum").length,label:"Platinum+"},{color:"bg-emerald-500",value:todayArrivals.filter(g=>g.dietaryReq.length>0).length,label:"Dietary Needs"},{color:"bg-rose-500",value:todayArrivals.filter(g=>g.dnd).length,label:"DND Preference"}]} />}
            >
            <div className="space-y-4">
              {todayArrivals.map(g => (
                <div key={g.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0", g.tier==="Platinum Elite"?"bg-gradient-to-br from-purple-500 to-violet-700":g.tier==="Platinum"?"bg-gradient-to-br from-indigo-400 to-indigo-600":"bg-gradient-to-br from-amber-400 to-orange-500")}>{g.firstName.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-foreground">{`${g.firstName} ${g.lastName}`}</span>
                        {g.vip&&<Crown className="w-4 h-4 text-amber-500"/>}
                        <TierBadge tier={g.tier} />
                        <span className="text-sm text-muted-foreground">· Room {g.currentRoom} · {g.totalNights} nights</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div className="bg-secondary/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Check-in Time</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>14:00 (ETA 15:30)</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Pillow Pref.</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1"><Bed className="w-3.5 h-3.5"/>{g.pillowPref}</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Floor Pref.</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5"/>{g.preferredFloor}</p>
                        </div>
                        <div className="bg-secondary/40 rounded-xl p-3">
                          <p className="text-xs text-muted-foreground">Dietary</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-1"><UtensilsCrossed className="w-3.5 h-3.5"/>{g.dietaryReq[0]||"None"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button className="px-3 py-2 bg-violet-600 text-white text-xs rounded-xl hover:bg-violet-700 transition-colors">Assign Room</button>
                      <button className="px-3 py-2 bg-secondary text-foreground text-xs rounded-xl hover:bg-secondary/80 transition-colors border border-border">Pre-Arrival Note</button>
                    </div>
                  </div>
                  {g.notes && <p className="mt-3 text-sm text-muted-foreground bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5"/>{g.notes}</p>}
                </div>
              ))}
              {todayArrivals.length === 0 && <div className="text-center text-muted-foreground py-16"><Calendar className="w-10 h-10 mx-auto mb-3 opacity-30"/>No arrivals scheduled for today</div>}
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── VIP INTELLIGENCE ─────────────────────────────── */}
        {activeSubmenu === "VIP Intelligence" && (
          <motion.div key="vip" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search VIP guests..." />}
              header={<SectionHeader title="VIP Intelligence" subtitle="Every detail, anticipated before they ask" icon={UserCheck} />}
              kpi={<KpiStrip items={[{color:"bg-violet-500",value:vipGuests.length,label:"Total VIPs"},{color:"bg-emerald-500",value:vipGuests.filter(g=>g.currentlyInHouse).length,label:"On Property"},{color:"bg-blue-500",value:vipGuests.filter(g=>!g.currentlyInHouse&&!!g.nextStay).length,label:"Arriving Soon"},{color:"bg-amber-500",value:vipGuests.filter(g=>g.tier==="Platinum Elite").length,label:"Platinum Elite"},{color:"bg-indigo-500",value:vipGuests.filter(g=>g.tier==="Platinum").length,label:"Platinum"}]} />}
            >
            {/* Alert banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <BellRing className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Sheikh Khalid Al-Zayed (Room 1001) — 50th stay milestone approaching</p>
                <p className="text-xs text-amber-600 mt-0.5">Arrange a personalised crystal plaque and complimentary dinner. He prefers Arabic cuisine, no seafood.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* In-house VIPs */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Crown className="w-4 h-4 text-amber-500"/>On Property Now</h3>
                {vipGuests.filter(g=>g.currentlyInHouse).map(g => (
                  <div key={g.id} className="mb-4 pb-4 border-b border-border/50 last:border-0 last:mb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white font-bold shrink-0">{g.firstName.charAt(0)}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">{`${g.firstName} ${g.lastName}`}<Crown className="w-3 h-3 text-amber-500"/></div>
                        <div className="flex items-center gap-2"><TierBadge tier={g.tier}/><span className="text-xs text-muted-foreground">Room {g.currentRoom}</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[["Stays",g.totalStays],["Total Spend","$"+g.totalSpend.toLocaleString()],["Language",g.language],["Dietary",g.dietaryReq[0]||"None"]].map(([k,v])=>(
                        <div key={k} className="bg-secondary/40 rounded-lg p-2"><p className="text-muted-foreground">{k}</p><p className="font-semibold text-foreground mt-0.5">{v}</p></div>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">{g.interests.map(i=><span key={i} className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">{i}</span>)}</div>
                    <p className="text-xs text-muted-foreground mt-2 italic">{g.notes}</p>
                  </div>
                ))}
              </div>
              {/* Upcoming VIPs */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-violet-500"/>Upcoming VIPs</h3>
                {vipGuests.filter(g=>!g.currentlyInHouse&&!!g.nextStay).map(g => (
                  <div key={g.id} className="mb-4 pb-4 border-b border-border/50 last:border-0 last:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0">{g.firstName.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-foreground">{`${g.firstName} ${g.lastName}`}</div>
                        <div className="flex items-center gap-2"><TierBadge tier={g.tier}/><span className="text-xs text-muted-foreground">Arriving {g.nextStay}</span></div>
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex gap-2"><span className="text-muted-foreground w-20 shrink-0">Pillow:</span><span className="text-foreground font-medium">{g.pillowPref}</span></div>
                      <div className="flex gap-2"><span className="text-muted-foreground w-20 shrink-0">Floor:</span><span className="text-foreground font-medium">{g.preferredFloor}</span></div>
                      <div className="flex gap-2"><span className="text-muted-foreground w-20 shrink-0">Dietary:</span><span className="text-foreground font-medium">{g.dietaryReq.join(", ")||"None"}</span></div>
                    </div>
                  </div>
                ))}
                {vipGuests.filter(g=>!g.currentlyInHouse&&!!g.nextStay).length===0&&<p className="text-muted-foreground text-sm text-center py-8">No upcoming VIP arrivals</p>}
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── GUEST MOMENTS ────────────────────────────────── */}
        {activeSubmenu === "Guest Moments" && (
          <motion.div key="moments" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search moments..." />}
              header={<SectionHeader title="Guest Moments" subtitle="Birthdays, anniversaries, milestones — never miss a thing" icon={UserCheck} actions={<button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"><Plus className="w-4 h-4"/>Create a Moment</button>} />}
              kpi={<KpiStrip items={[{color:"bg-pink-500",value:guestMoments.filter(m=>m.type==="Birthday").length,label:"Birthdays"},{color:"bg-red-500",value:guestMoments.filter(m=>m.type==="Anniversary").length,label:"Anniversaries"},{color:"bg-amber-500",value:guestMoments.filter(m=>m.type==="Milestone Stay").length,label:"Milestones"},{color:"bg-emerald-500",value:guestMoments.filter(m=>m.status==="Done").length,label:"Completed"},{color:"bg-slate-500",value:guestMoments.filter(m=>m.status==="Upcoming").length,label:"Upcoming"}]} />}
            >
            {/* Upcoming moments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guestMoments.map(m => {
                const guest = guests.find(g=>g.id===m.guestId);
                return (
                  <div key={m.id} className={cn("bg-card rounded-2xl shadow-sm border p-5", m.type==="Birthday"?"border-pink-200":m.type==="Anniversary"?"border-red-200":"border-amber-200")}>
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0", m.type==="Birthday"?"bg-pink-100":m.type==="Anniversary"?"bg-red-100":"bg-amber-100")}>
                        {m.type==="Birthday"?"🎂":m.type==="Anniversary"?"💍":"🏆"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-base">{m.guestName}</span>
                          <span className="text-xs text-muted-foreground">{m.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", m.type==="Birthday"?"bg-pink-100 text-pink-700":m.type==="Anniversary"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700")}>{m.type}</span>
                          {guest && <TierBadge tier={guest.tier} />}
                          {m.room && <span className="text-xs text-muted-foreground">Room {m.room}</span>}
                        </div>
                        <div className="mt-3 bg-secondary/40 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-violet-700">AI Suggested Gesture</p>
                              <p className="text-sm text-foreground mt-0.5">{m.suggestedGift}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-xl hover:bg-violet-700 transition-colors">Approve & Action</button>
                          <button className="px-3 py-1.5 bg-secondary text-foreground text-xs rounded-xl hover:bg-secondary/80 border border-border transition-colors">Customise</button>
                          <button className="px-3 py-1.5 bg-secondary text-foreground text-xs rounded-xl hover:bg-secondary/80 border border-border transition-colors">Skip</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Nationality breakdown bar */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Guest Nationalities" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={nationalityData} layout="vertical" margin={{left:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)" horizontal={false} />
                  <XAxis type="number" tick={{fontSize:12}} />
                  <YAxis dataKey="country" type="category" tick={{fontSize:12}} width={80} />
                  <Tooltip />
                  <Bar dataKey="guests" fill="#7c3aed" radius={[0,6,6,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── LOYALTY & REWARDS ────────────────────────────── */}
        {activeSubmenu === "Loyalty & Rewards" && (
          <motion.div key="loyalty" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search loyalty..." />}
              header={<SectionHeader title="Loyalty & Rewards" subtitle="Points, perks and progress across every tier" icon={UserCheck} />}
              kpi={<KpiStrip items={tierDistribution.map(t => {
                const colorMap: Record<string, string> = {
                  "Platinum Elite": "bg-violet-500",
                  "Platinum": "bg-indigo-500",
                  "Gold": "bg-amber-500",
                  "Silver": "bg-slate-500",
                  "Member": "bg-slate-400"
                };
                return { color: colorMap[t.name] ?? "bg-slate-500", value: String(t.value), label: t.name };
              })} />}
            >
            {/* Tier benefits matrix */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border"><SectionHeader title="Tier Benefits" /></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-medium">Benefit</th>
                    <th className="text-center px-4 py-3 font-medium">Member</th>
                    <th className="text-center px-4 py-3 font-medium">Silver</th>
                    <th className="text-center px-4 py-3 font-medium">Gold</th>
                    <th className="text-center px-4 py-3 font-medium">Platinum</th>
                    <th className="text-center px-4 py-3 font-medium">Plat. Elite</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border/50">
                    {[["Points Earn Rate","1x","1.25x","1.5x","2x","3x"],["Early Check-in","✕","✕","✓","✓","✓"],["Late Check-out","✕","✕","✓","✓","✓"],["Room Upgrade","✕","✕","Subject to availability","Guaranteed","Suite guaranteed"],["Lounge Access","✕","✕","✕","✓","✓"],["Dedicated Host","✕","✕","✕","✕","✓"],["Points Expiry","12 mo","18 mo","24 mo","Never","Never"]].map((row,i) => (
                      <tr key={i} className="hover:bg-secondary/30 transition-colors">
                        {row.map((cell,j) => (
                          <td key={j} className={cn("px-4 py-3 text-center", j===0?"text-left font-medium text-foreground":"text-muted-foreground", cell==="✓"?"text-green-600 font-semibold":cell==="✕"?"text-red-400":"")}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transaction log */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <SectionHeader title="Recent Points Activity" />
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><Download className="w-3.5 h-3.5"/>Export</button>
              </div>
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Guest</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Description</th>
                  <th className="text-right px-4 py-3 font-medium">Points</th>
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {loyaltyTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{tx.guestName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{tx.date}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", tx.type==="Earn"?"bg-green-100 text-green-700":tx.type==="Redeem"?"bg-orange-100 text-orange-700":"bg-blue-100 text-blue-700")}>{tx.type}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{tx.description}</td>
                      <td className={cn("px-4 py-3 text-right font-bold", tx.type==="Earn"?"text-green-600":"text-orange-600")}>{tx.type==="Earn"?"+":"-"}{tx.points.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── FEEDBACK ─────────────────────────────────────── */}
        {activeSubmenu === "Feedback" && (
          <motion.div key="feedback" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search feedback..." />}
              header={<SectionHeader title="Guest Feedback" subtitle="Every voice heard, every issue resolved" icon={UserCheck} actions={<div className="text-center bg-card rounded-xl border border-border px-4 py-2"><p className="text-xs text-muted-foreground">Avg Rating</p><p className="text-xl font-bold text-amber-500">{avgSatisfaction} ★</p></div>} />}
              kpi={<KpiStrip items={[
                { color: "bg-emerald-500", value: feedbackEntries.filter(f=>f.sentiment==="Positive").length, label: "Positive" },
                { color: "bg-amber-500", value: feedbackEntries.filter(f=>f.sentiment==="Neutral").length, label: "Neutral" },
                { color: "bg-rose-500", value: feedbackEntries.filter(f=>f.sentiment==="Negative").length, label: "Negative" },
                { color: "bg-blue-500", value: feedbackEntries.filter(f=>f.responded).length, label: "Responded" },
                { color: "bg-slate-500", value: feedbackEntries.filter(f=>!f.responded).length, label: "Awaiting" },
              ]} />}
            >
            {/* Feedback cards */}
            <div className="space-y-4">
              {feedbackEntries.map(f => (
                <div key={f.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold shrink-0">{f.guestName.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{f.guestName}</span>
                          <SentimentBadge s={f.sentiment} />
                          <span className="text-xs text-muted-foreground">{f.channel} · {f.date}</span>
                        </div>
                        <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} className={cn("w-4 h-4",s<=f.rating?"text-amber-400 fill-amber-400":"text-muted-foreground")}/>)}</div>
                      </div>
                      <p className="text-sm text-foreground mt-2 leading-relaxed">{f.comment}</p>
                      {f.response ? (
                        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
                          <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/>Hotel Response</p>
                          <p className="text-sm text-blue-800">{f.response}</p>
                        </div>
                      ) : (
                        <div className="mt-3 flex gap-2">
                          <input placeholder="Write a response…" className="flex-1 text-sm border border-border rounded-xl px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-violet-400" />
                          <button className="px-3 py-1.5 bg-violet-600 text-white text-xs rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-1"><Send className="w-3 h-3"/>Reply</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── JOURNEY ──────────────────────────────────────── */}
        {activeSubmenu === "Journey" && (
          <motion.div key="journey" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search guest to view journey..." />}
              header={<SectionHeader title="Guest Journey" subtitle="Full cross-property history and spend at a glance" icon={UserCheck} />}
              kpi={<KpiStrip items={[{color:"bg-violet-500",value:guests[0].totalStays,label:"Total Stays"},{color:"bg-blue-500",value:guests[0].totalNights,label:"Total Nights"},{color:"bg-emerald-500",value:`$${guests[0].totalSpend.toLocaleString()}`,label:"Total Spend"},{color:"bg-amber-500",value:guests[0].points.toLocaleString(),label:"Points"},{color:"bg-rose-500",value:guests[0].tier,label:"Tier"}]} />}
            >
            {/* Show journey for first VIP as default */}
            {(() => {
              const g = guests[0];
              return (
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center text-white font-bold text-xl">{g.firstName.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><span className="text-xl font-bold text-foreground">{`${g.firstName} ${g.lastName}`}</span><Crown className="w-4 h-4 text-amber-500"/><TierBadge tier={g.tier}/></div>
                      <p className="text-sm text-muted-foreground mt-0.5">{g.nationality} · Member since 2019 · {g.email}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[{l:"Total Stays",v:g.totalStays},{l:"Total Spend",v:"$"+g.totalSpend.toLocaleString()},{l:"Points",v:g.points.toLocaleString()}].map(s=>(
                        <div key={s.l}><p className="text-xs text-muted-foreground">{s.l}</p><p className="text-lg font-bold text-foreground">{s.v}</p></div>
                      ))}
                    </div>
                  </div>
                  {/* Stay timeline */}
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <SectionHeader title="Stay History Timeline" />
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                      {[
                        { property: "Singularity Grand Manama", date: "Mar 2026", nights: 3, room: "Suite 1001", spend: 4800, highlight: "50th stay milestone", rating: 10 },
                        { property: "Boutique Dubai", date: "Jan 2026", nights: 2, room: "Deluxe 501", spend: 2200, highlight: "Upgrade provided", rating: 9 },
                        { property: "Singularity Grand Manama", date: "Dec 2025", nights: 5, room: "Suite 1002", spend: 7500, highlight: "New Year stay", rating: 10 },
                        { property: "Resort Maldives", date: "Oct 2025", nights: 7, room: "Water Villa", spend: 18000, highlight: "Honeymoon anniversary", rating: 10 },
                        { property: "Singularity Grand Manama", date: "Aug 2025", nights: 2, room: "Deluxe 605", spend: 2800, highlight: "", rating: 9 },
                      ].map((stay, i) => (
                        <div key={i} className="relative flex gap-5 mb-5 last:mb-0">
                          <div className={cn("w-3 h-3 rounded-full border-2 z-10 mt-1.5 shrink-0", i===0?"bg-violet-500 border-violet-600":"bg-white border-slate-300")} style={{marginLeft:"18px"}} />
                          <div className="flex-1 bg-secondary/30 rounded-xl p-4 hover:bg-secondary/60 transition-colors">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div><span className="font-semibold text-foreground">{stay.property}</span><span className="text-xs text-muted-foreground ml-2">{stay.date}</span></div>
                              <div className="flex items-center gap-1">{[1,2,3,4,5].map(s=><Star key={s} className={cn("w-3 h-3",s<=Math.round(stay.rating/2)?"text-amber-400 fill-amber-400":"text-muted-foreground")}/>)}</div>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-muted-foreground">{stay.nights} nights · {stay.room}</span>
                              <span className="font-semibold text-foreground">${stay.spend.toLocaleString()}</span>
                              {stay.highlight&&<span className="text-violet-600 text-xs font-medium">{stay.highlight}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Spend breakdown */}
                  <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <SectionHeader title="Spend by Category" />
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={[{cat:"Rooms",v:28000},{cat:"F&B",v:12000},{cat:"Spa",v:4500},{cat:"Activities",v:2800},{cat:"Other",v:1200}]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)" />
                        <XAxis dataKey="cat" tick={{fontSize:12}} />
                        <YAxis tick={{fontSize:12}} />
                        <Tooltip formatter={(v:number)=>["$"+v.toLocaleString(),"Spend"]} />
                        <Bar dataKey="v" fill="#7c3aed" radius={[6,6,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })()}
            </PageShell>
          </motion.div>
        )}

      </AnimatePresence>
  );
}
