import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from "recharts";
import {
  Building2, Globe, TrendingUp, TrendingDown, DollarSign,
  Users, MapPin, Star, CheckCircle2, AlertCircle, Search,
  Filter, Download, ChevronRight, BarChart2, ArrowRight,
  RefreshCw, FileText, Award, BookOpen, Layers, Eye,
  Shuffle, Clock, Settings, Plus
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface MultiPropertyProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

interface Property {
  id: string;
  name: string;
  city: string;
  country: string;
  brand: string;
  rooms: number;
  stars: number;
  gm: string;
  occupancy: number;
  adr: number;
  revpar: number;
  revenue: number;
  gop: number;
  gopPct: number;
  nps: number;
  openIssues: number;
  status: "Open" | "Renovation" | "Soft Opening";
  lastAudit: string;
}

interface TransferRequest {
  id: string;
  guestName: string;
  fromProperty: string;
  toProperty: string;
  currentRoom: string;
  requestedDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Declined" | "Completed";
  loyaltyTier: string;
  requestedBy: string;
  createdAt: string;
  notes: string;
}

interface SOPDocument {
  id: string;
  title: string;
  department: string;
  category: string;
  version: string;
  lastUpdated: string;
  author: string;
  applicableTo: string[];
  status: "Active" | "Under Review" | "Archived";
  acknowledgedBy: number;
  totalStaff: number;
  content: string;
}

interface BenchmarkMetric {
  metric: string;
  property1: number;
  property2: number;
  property3: number;
  property4: number;
  chainAvg: number;
}

// ── Sample Data ────────────────────────────────────────────────
const properties: Property[] = [
  { id: "P001", name: "Singularity Grand Manama", city: "Manama", country: "Bahrain", brand: "Singularity Grand", rooms: 248, stars: 5, gm: "Hassan Al-Mansouri", occupancy: 87, adr: 185, revpar: 160.95, revenue: 1240000, gop: 496000, gopPct: 40, nps: 72, openIssues: 3, status: "Open", lastAudit: "2026-03-15" },
  { id: "P002", name: "Singularity Boutique Dubai", city: "Dubai", country: "UAE", brand: "Singularity Boutique", rooms: 120, stars: 5, gm: "Layla Al-Rashid", occupancy: 92, adr: 320, revpar: 294.4, revenue: 980000, gop: 441000, gopPct: 45, nps: 81, openIssues: 1, status: "Open", lastAudit: "2026-03-20" },
  { id: "P003", name: "Singularity Resort Maldives", city: "North Malé Atoll", country: "Maldives", brand: "Singularity Resort", rooms: 80, stars: 5, gm: "Priya Ranawaka", occupancy: 95, adr: 680, revpar: 646, revenue: 1650000, gop: 742500, gopPct: 45, nps: 89, openIssues: 0, status: "Open", lastAudit: "2026-02-28" },
  { id: "P004", name: "Singularity City Colombo", city: "Colombo", country: "Sri Lanka", brand: "Singularity City", rooms: 180, stars: 4, gm: "Kamal Perera", occupancy: 74, adr: 95, revpar: 70.3, revenue: 420000, gop: 138600, gopPct: 33, nps: 65, openIssues: 7, status: "Open", lastAudit: "2026-03-01" },
  { id: "P005", name: "Singularity Boutique Abu Dhabi", city: "Abu Dhabi", country: "UAE", brand: "Singularity Boutique", rooms: 95, stars: 5, gm: "Sara Al-Hamdan", occupancy: 0, adr: 0, revpar: 0, revenue: 0, gop: 0, gopPct: 0, nps: 0, openIssues: 0, status: "Soft Opening", lastAudit: "N/A" },
];

const transferRequests: TransferRequest[] = [
  { id: "TR001", guestName: "James Chen", fromProperty: "Singularity Grand Manama", toProperty: "Singularity Boutique Dubai", currentRoom: "501", requestedDate: "2026-04-05", reason: "Business travel continuation", status: "Approved", loyaltyTier: "Gold", requestedBy: "Front Office", createdAt: "2026-04-02 09:00", notes: "Guest wants seamless transfer, same booking reference." },
  { id: "TR002", guestName: "Maryam Al-Khalifa", fromProperty: "Singularity Boutique Dubai", toProperty: "Singularity Resort Maldives", currentRoom: "802", requestedDate: "2026-04-10", reason: "Leisure extension — honeymoon", status: "Pending", loyaltyTier: "Platinum", requestedBy: "Concierge", createdAt: "2026-04-02 11:00", notes: "Couple's villa preferred. Arrange flower decoration on arrival." },
  { id: "TR003", guestName: "David Müller", fromProperty: "Singularity Grand Manama", toProperty: "Singularity City Colombo", currentRoom: "305", requestedDate: "2026-04-08", reason: "Conference in Colombo", status: "Approved", loyaltyTier: "Silver", requestedBy: "Front Office", createdAt: "2026-04-01 14:00", notes: "" },
  { id: "TR004", guestName: "Sheikh Khalid Al-Zayed", fromProperty: "Singularity Boutique Dubai", toProperty: "Singularity Grand Manama", currentRoom: "Penthouse", requestedDate: "2026-04-12", reason: "Royal Bank Gala attendance", status: "Pending", loyaltyTier: "Platinum Elite", requestedBy: "VIP Relations", createdAt: "2026-04-02 10:00", notes: "VIP protocol. Notify GM directly." },
];

const sopDocuments: SOPDocument[] = [
  { id: "SOP001", title: "Guest Check-In & Check-Out Procedure", department: "Front Office", category: "Operations", version: "v3.2", lastUpdated: "2026-01-15", author: "COO Office", applicableTo: ["All Properties"], status: "Active", acknowledgedBy: 142, totalStaff: 148, content: "This SOP defines the standard check-in process for all Singularity properties. Steps: 1) Greet guest within 30 seconds. 2) Verify ID and booking. 3) Pre-assign room based on guest profile. 4) Explain amenities and F&B outlets. 5) Escort VIP guests to room." },
  { id: "SOP002", title: "Fire Safety & Emergency Evacuation", department: "Security", category: "Safety", version: "v2.1", lastUpdated: "2025-11-01", author: "Safety & Compliance", applicableTo: ["All Properties"], status: "Active", acknowledgedBy: 310, totalStaff: 320, content: "In the event of a fire alarm: 1) Do not use lifts. 2) Guide guests to nearest stairwell. 3) Proceed to assembly point. 4) Account for all guests using room list. 5) Do not re-enter until all-clear." },
  { id: "SOP003", title: "VIP Guest Handling Protocol", department: "Front Office", category: "Guest Experience", version: "v4.0", lastUpdated: "2026-02-20", author: "GM Council", applicableTo: ["All Properties"], status: "Active", acknowledgedBy: 98, totalStaff: 148, content: "VIP guests are flagged in PMS. On identification: 1) Notify GM immediately. 2) Arrange personal greeting from GM or senior manager. 3) Pre-block suite with welcome amenity. 4) Assign dedicated concierge." },
  { id: "SOP004", title: "Food Allergen & Dietary Requirements", department: "Food & Beverage", category: "Food Safety", version: "v2.3", lastUpdated: "2026-03-01", author: "F&B Director", applicableTo: ["All Properties"], status: "Active", acknowledgedBy: 87, totalStaff: 95, content: "All dietary requirements must be captured at booking stage. Kitchen team to be briefed before every service. Allergen menus to be available in all languages relevant to current guest mix." },
  { id: "SOP005", title: "Housekeeping Room Inspection Checklist", department: "Housekeeping", category: "Operations", version: "v1.8", lastUpdated: "2026-01-10", author: "Housekeeping Director", applicableTo: ["Singularity Grand Manama", "Singularity Boutique Dubai"], status: "Under Review", acknowledgedBy: 44, totalStaff: 60, content: "Post-cleaning: supervisor must inspect every room. Checklist: 1) Linen pressed and spotless. 2) Bathroom fully stocked. 3) Minibar checked. 4) All surfaces dust-free. 5) HVAC on pre-set temperature." },
  { id: "SOP006", title: "Revenue Management Rate Parity Policy", department: "Sales & Revenue", category: "Revenue", version: "v3.0", lastUpdated: "2026-02-01", author: "Chain Revenue Manager", applicableTo: ["All Properties"], status: "Active", acknowledgedBy: 28, totalStaff: 30, content: "Rate parity must be maintained across all OTAs, GDS, and direct channels. Daily rate audits required. Any deviation > 5% must be approved by the Chain Revenue Manager." },
];

const benchmarkMetrics: BenchmarkMetric[] = [
  { metric: "Occupancy %", property1: 87, property2: 92, property3: 95, property4: 74, chainAvg: 87 },
  { metric: "ADR (indexed)", property1: 65, property2: 80, property3: 100, property4: 35, chainAvg: 70 },
  { metric: "RevPAR (indexed)", property1: 62, property2: 78, property3: 100, property4: 28, chainAvg: 67 },
  { metric: "GOP %", property1: 40, property2: 45, property3: 45, property4: 33, chainAvg: 41 },
  { metric: "NPS", property1: 72, property2: 81, property3: 89, property4: 65, chainAvg: 77 },
  { metric: "Staff Satisfaction", property1: 78, property2: 85, property3: 90, property4: 70, chainAvg: 81 },
];

const consolidatedPL = [
  { dept: "Rooms", p1: 820000, p2: 640000, p3: 1100000, p4: 280000 },
  { dept: "F&B", p1: 280000, p2: 180000, p3: 320000, p4: 90000 },
  { dept: "Spa & Wellness", p1: 85000, p2: 95000, p3: 180000, p4: 32000 },
  { dept: "Events", p1: 152000, p2: 85000, p3: 0, p4: 28000 },
  { dept: "Other", p1: 42000, p2: 25000, p3: 50000, p4: 18000 },
];

const chainOccupancyTrend = [
  { month: "Nov", manama: 72, dubai: 85, maldives: 90, colombo: 60 },
  { month: "Dec", manama: 78, dubai: 88, maldives: 95, colombo: 65 },
  { month: "Jan", manama: 75, dubai: 80, maldives: 92, colombo: 58 },
  { month: "Feb", manama: 80, dubai: 85, maldives: 94, colombo: 62 },
  { month: "Mar", manama: 83, dubai: 90, maldives: 94, colombo: 70 },
  { month: "Apr", manama: 87, dubai: 92, maldives: 95, colombo: 74 },
];

// ── Main Component ────────────────────────────────────────────
export function MultiProperty({ aiEnabled, activeSubmenu = "Overview" }: MultiPropertyProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [search, setSearch] = useState("");
  const [activePropertyFilter, setActivePropertyFilter] = useState("All Properties");

  const totalRevenue = properties.filter(p => p.status === "Open").reduce((s, p) => s + p.revenue, 0);
  const avgOccupancy = Math.round(properties.filter(p => p.occupancy > 0).reduce((s, p) => s + p.occupancy, 0) / properties.filter(p => p.occupancy > 0).length);
  const avgNPS = Math.round(properties.filter(p => p.nps > 0).reduce((s, p) => s + p.nps, 0) / properties.filter(p => p.nps > 0).length);
  const totalRooms = properties.reduce((s, p) => s + p.rooms, 0);

  const propertyColors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];

  return (
    <PageShell
      search={<SectionSearch value={search} onChange={setSearch} placeholder="Search properties, reports..." />}
      header={<SectionHeader title="Multi-Property" subtitle="Chain-wide portfolio management and benchmarking" icon={Building2} />}
      kpi={<KpiStrip items={[
        {color:"bg-indigo-500",value:`USD ${(totalRevenue/1000000).toFixed(2)}M`,label:"Chain-Wide Revenue"},
        {color:"bg-emerald-500",value:`${properties.filter(p=>p.status==="Open").length}/${properties.length}`,label:"Properties Open"},
        {color:"bg-blue-500",value:`${avgOccupancy}%`,label:"Avg Occupancy"},
        {color:"bg-amber-500",value:avgNPS,label:"Chain NPS"},
        {color:"bg-pink-500",value:totalRooms,label:"Total Rooms"},
      ]} />}
    >
      <AnimatePresence mode="wait">

        {/* ── OVERVIEW / CHAIN DASHBOARD ── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="mpov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {properties.map((prop, idx) => (
                <div key={prop.id} className="bg-card rounded-2xl shadow-sm border border-border p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedProperty(prop)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: propertyColors[idx] }} />
                        <h3 className="font-semibold text-foreground text-sm">{prop.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={11} />{prop.city}, {prop.country}</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", prop.status === "Open" ? "bg-emerald-100 text-emerald-700" : prop.status === "Soft Opening" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>{prop.status}</span>
                  </div>
                  {prop.status === "Open" ? (
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Occ", value: `${prop.occupancy}%`, color: prop.occupancy >= 85 ? "text-emerald-600" : "text-amber-600" },
                        { label: "ADR", value: `$${prop.adr}`, color: "text-foreground" },
                        { label: "RevPAR", value: `$${prop.revpar.toFixed(0)}`, color: "text-foreground" },
                      ].map(m => (
                        <div key={m.label} className="text-center p-2.5 bg-secondary/30 rounded-xl">
                          <p className={cn("text-lg font-bold", m.color)}>{m.value}</p>
                          <p className="text-xs text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-secondary/30 rounded-xl text-center text-sm text-muted-foreground">Pre-opening phase</div>
                  )}
                  {prop.status === "Open" && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      <span>GM: {prop.gm}</span>
                      <div className="flex items-center gap-2">
                        {prop.openIssues > 0 && <span className="text-amber-600 font-medium">{prop.openIssues} issues</span>}
                        <span className="flex items-center gap-0.5"><Star size={11} className="text-amber-400 fill-amber-400" /> NPS {prop.nps}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Occupancy Trend */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Chain-Wide Occupancy Trend (6 Months)" />
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chainOccupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} domain={[50, 100]} />
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="manama" name="Manama" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="dubai" name="Dubai" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="maldives" name="Maldives" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="colombo" name="Colombo" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── PROPERTY LIST ── */}
        {activeSubmenu === "All Properties" && (
          <motion.div key="proplist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="All Properties" />
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90"><Plus size={16} /> Add Property</button>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Property", "Location", "Brand", "Rooms", "Occupancy", "ADR", "RevPAR", "Revenue", "GOP %", "NPS", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {properties.map((prop, idx) => (
                      <tr key={prop.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedProperty(prop)}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: propertyColors[idx] }} />
                            <div>
                              <p className="font-medium text-foreground">{prop.name}</p>
                              <p className="text-xs text-muted-foreground">GM: {prop.gm}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{prop.city}, {prop.country}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{prop.brand}</td>
                        <td className="px-4 py-3 text-foreground">{prop.rooms}</td>
                        <td className="px-4 py-3">
                          <span className={cn("font-semibold", prop.occupancy >= 85 ? "text-emerald-600" : prop.occupancy >= 70 ? "text-amber-600" : "text-red-500")}>{prop.occupancy > 0 ? `${prop.occupancy}%` : "–"}</span>
                        </td>
                        <td className="px-4 py-3 text-foreground">{prop.adr > 0 ? `$${prop.adr}` : "–"}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{prop.revpar > 0 ? `$${prop.revpar.toFixed(0)}` : "–"}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{prop.revenue > 0 ? `$${(prop.revenue / 1000).toFixed(0)}k` : "–"}</td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", prop.gopPct >= 40 ? "text-emerald-600" : prop.gopPct >= 30 ? "text-amber-600" : "text-red-500")}>{prop.gopPct > 0 ? `${prop.gopPct}%` : "–"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", prop.nps >= 80 ? "text-emerald-600" : prop.nps >= 65 ? "text-amber-600" : "text-red-500")}>{prop.nps > 0 ? prop.nps : "–"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", prop.status === "Open" ? "bg-emerald-100 text-emerald-700" : prop.status === "Soft Opening" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>{prop.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Property Detail Panel */}
            {selectedProperty && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedProperty.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProperty.city}, {selectedProperty.country} · {selectedProperty.brand} · {selectedProperty.rooms} rooms · {selectedProperty.stars}★</p>
                  </div>
                  <button onClick={() => setSelectedProperty(null)} className="text-muted-foreground text-sm">✕</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[["GM", selectedProperty.gm], ["Last Audit", selectedProperty.lastAudit], ["Open Issues", selectedProperty.openIssues], ["GOP", `$${selectedProperty.gop.toLocaleString()}`], ["Occupancy", `${selectedProperty.occupancy}%`], ["ADR", `$${selectedProperty.adr}`], ["RevPAR", `$${selectedProperty.revpar.toFixed(0)}`], ["Revenue MTD", `$${(selectedProperty.revenue / 1000).toFixed(0)}k`]].map(([k, v]) => (
                    <div key={k} className="p-3 bg-secondary/30 rounded-xl text-sm">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-semibold text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── TRANSFER REQUESTS ── */}
        {activeSubmenu === "Transfers" && (
          <motion.div key="transfers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="Inter-Property Transfer Requests" />
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90"><Plus size={16} /> New Transfer</button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Transfers", value: transferRequests.length, color: "text-indigo-600" },
                { label: "Pending", value: transferRequests.filter(t => t.status === "Pending").length, color: "text-amber-600" },
                { label: "Approved", value: transferRequests.filter(t => t.status === "Approved").length, color: "text-emerald-600" },
                { label: "Completed", value: transferRequests.filter(t => t.status === "Completed").length, color: "text-blue-600" },
              ].map(c => (
                <div key={c.label} className="bg-card rounded-2xl shadow-sm border border-border p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={cn("text-3xl font-bold mt-1", c.color)}>{c.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {transferRequests.map(tr => {
                const statusMap: Record<string, string> = {
                  Pending: "bg-amber-100 text-amber-700",
                  Approved: "bg-emerald-100 text-emerald-700",
                  Declined: "bg-red-100 text-red-700",
                  Completed: "bg-blue-100 text-blue-700",
                };
                const tierMap: Record<string, string> = {
                  "Platinum Elite": "bg-purple-100 text-purple-700",
                  Platinum: "bg-indigo-100 text-indigo-700",
                  Gold: "bg-amber-100 text-amber-700",
                  Silver: "bg-slate-100 text-slate-700",
                };
                return (
                  <div key={tr.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{tr.guestName}</h3>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", tierMap[tr.loyaltyTier] || "bg-slate-100 text-slate-700")}>{tr.loyaltyTier}</span>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[tr.status])}>{tr.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Requested by: {tr.requestedBy} · {tr.createdAt}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">{tr.requestedDate}</p>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl mb-4">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">From</p>
                        <p className="text-sm font-medium text-foreground">{tr.fromProperty}</p>
                        <p className="text-xs text-muted-foreground">Rm {tr.currentRoom}</p>
                      </div>
                      <ArrowRight size={20} className="text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 text-center">
                        <p className="text-xs text-muted-foreground mb-1">To</p>
                        <p className="text-sm font-medium text-foreground">{tr.toProperty}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3"><strong className="text-foreground">Reason:</strong> {tr.reason}</p>
                    {tr.notes && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800 mb-4">
                        <strong>Notes:</strong> {tr.notes}
                      </div>
                    )}
                    {tr.status === "Pending" && (
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Approve</button>
                        <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">Decline</button>
                        <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70">Coordinate</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── CONSOLIDATED P&L ── */}
        {activeSubmenu === "Consolidated P&L" && (
          <motion.div key="consolidatedpl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="Consolidated P&L — April 2026" />
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/70"><Download size={16} /> Export</button>
            </div>

            {/* Chain summary KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Chain Revenue", value: `$${(totalRevenue / 1000000).toFixed(2)}M`, sub: "MTD Apr 2026", color: "text-indigo-600" },
                { label: "Total GOP", value: `$${(properties.reduce((s, p) => s + p.gop, 0) / 1000000).toFixed(2)}M`, sub: "Gross Operating Profit", color: "text-emerald-600" },
                { label: "Chain GOP %", value: `${Math.round(properties.filter(p => p.revenue > 0).reduce((s, p) => s + p.gopPct, 0) / properties.filter(p => p.revenue > 0).length)}%`, sub: "Average across properties", color: "text-blue-600" },
                { label: "Total Room Revenue", value: `$${(consolidatedPL.find(d => d.dept === "Rooms") ? Object.values(consolidatedPL.find(d => d.dept === "Rooms")!).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number / 1000000 : 0).toFixed(2)}M`, sub: "Rooms dept only", color: "text-amber-600" },
              ].map(c => (
                <div key={c.label} className="bg-card rounded-2xl shadow-sm border border-border p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={cn("text-2xl font-bold mt-1", c.color)}>{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Revenue by dept + property */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Revenue by Department & Property (USD)" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Department</th>
                      {properties.filter(p => p.status === "Open").map(p => <th key={p.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{p.city}</th>)}
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {consolidatedPL.map(row => {
                      const vals = [row.p1, row.p2, row.p3, row.p4];
                      const total = vals.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={row.dept} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{row.dept}</td>
                          {vals.map((v, i) => <td key={i} className="px-4 py-3 text-foreground">${v.toLocaleString()}</td>)}
                          <td className="px-4 py-3 font-bold text-foreground">${total.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-secondary/20 font-bold">
                      <td className="px-4 py-3 text-foreground">Total Revenue</td>
                      {[1240000 + 280000 + 85000 + 152000 + 42000, 640000 + 180000 + 95000 + 85000 + 25000, 1100000 + 320000 + 180000 + 0 + 50000, 280000 + 90000 + 32000 + 28000 + 18000].map((v, i) => <td key={i} className="px-4 py-3 text-foreground">${v.toLocaleString()}</td>)}
                      <td className="px-4 py-3 text-foreground">${(1799000 + 1025000 + 1650000 + 448000).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="px-4 py-3 font-bold text-emerald-700">GOP</td>
                      {properties.filter(p => p.status === "Open").map(p => <td key={p.id} className="px-4 py-3 font-bold text-emerald-700">${p.gop.toLocaleString()}</td>)}
                      <td className="px-4 py-3 font-bold text-emerald-700">${properties.reduce((s, p) => s + p.gop, 0).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Revenue chart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Revenue by Department" />
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={consolidatedPL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="dept" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  <Legend />
                  <Bar dataKey="p1" name="Manama" fill="#6366f1" stackId="a" />
                  <Bar dataKey="p2" name="Dubai" fill="#0ea5e9" stackId="a" />
                  <Bar dataKey="p3" name="Maldives" fill="#10b981" stackId="a" />
                  <Bar dataKey="p4" name="Colombo" fill="#f59e0b" radius={[4,4,0,0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── SOP LIBRARY ── */}
        {activeSubmenu === "SOP Library" && (
          <motion.div key="sop" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="Standard Operating Procedures" />
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/70"><Download size={16} /> Export All</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90"><Plus size={16} /> New SOP</button>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
              <div className="flex flex-wrap gap-3">
                {["All", "Front Office", "Security", "Housekeeping", "F&B", "Sales & Revenue"].map(dept => (
                  <button key={dept} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", activePropertyFilter === dept ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")} onClick={() => setActivePropertyFilter(dept)}>{dept}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {sopDocuments.filter(s => activePropertyFilter === "All" || s.department === activePropertyFilter).filter(s => s.title.toLowerCase().includes(search.toLowerCase())).map(sop => {
                const ackPct = Math.round((sop.acknowledgedBy / sop.totalStaff) * 100);
                const statusMap: Record<string, string> = {
                  Active: "bg-emerald-100 text-emerald-700",
                  "Under Review": "bg-amber-100 text-amber-700",
                  Archived: "bg-slate-100 text-slate-700",
                };
                return (
                  <div key={sop.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{sop.title}</h3>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[sop.status])}>{sop.status}</span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{sop.version}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{sop.department} · {sop.category} · Updated: {sop.lastUpdated} · Author: {sop.author}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Download size={14} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{sop.content}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {sop.applicableTo.map(p => <span key={p} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{p}</span>)}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Staff Acknowledgement</span>
                          <span className="font-medium text-foreground">{sop.acknowledgedBy}/{sop.totalStaff} ({ackPct}%)</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", ackPct === 100 ? "bg-emerald-500" : ackPct >= 70 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${ackPct}%` }} />
                        </div>
                      </div>
                      {ackPct < 100 && <button className="text-xs text-primary hover:underline whitespace-nowrap flex items-center gap-1"><RefreshCw size={12} /> Send Reminder</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── BENCHMARKING ── */}
        {activeSubmenu === "Benchmarking" && (
          <motion.div key="bench" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <SectionHeader title="Inter-Property Benchmarking" />
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/70"><Download size={16} /> Export Report</button>
            </div>

            {/* Radar chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Performance Radar — All Properties" />
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={benchmarkMetrics}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <Radar name="Manama" dataKey="property1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Dubai" dataKey="property2" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Maldives" dataKey="property3" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Colombo" dataKey="property4" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Ranked KPIs */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Property Rankings" />
                <div className="space-y-4">
                  {[
                    { label: "RevPAR (USD)", sorted: [...properties].filter(p => p.revpar > 0).sort((a, b) => b.revpar - a.revpar), getValue: (p: Property) => `$${p.revpar.toFixed(0)}`, getBar: (p: Property) => (p.revpar / 646) * 100 },
                    { label: "Occupancy (%)", sorted: [...properties].filter(p => p.occupancy > 0).sort((a, b) => b.occupancy - a.occupancy), getValue: (p: Property) => `${p.occupancy}%`, getBar: (p: Property) => p.occupancy },
                    { label: "NPS Score", sorted: [...properties].filter(p => p.nps > 0).sort((a, b) => b.nps - a.nps), getValue: (p: Property) => p.nps, getBar: (p: Property) => p.nps },
                  ].map(ranking => (
                    <div key={ranking.label}>
                      <p className="text-sm font-medium text-foreground mb-2">{ranking.label}</p>
                      <div className="space-y-1.5">
                        {ranking.sorted.map((prop, i) => (
                          <div key={prop.id} className="flex items-center gap-3">
                            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-foreground">{prop.city}</span>
                                <span className="font-medium text-foreground">{ranking.getValue(prop)}</span>
                              </div>
                              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${ranking.getBar(prop)}%` }} />
                              </div>
                            </div>
                            {i === 0 && <Award size={14} className="text-amber-500 flex-shrink-0" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full benchmark table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Full Benchmark Comparison" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Metric</th>
                      {properties.filter(p => p.status === "Open").map(p => <th key={p.id} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{p.city}</th>)}
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">Chain Avg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {benchmarkMetrics.map(row => {
                      const vals = [row.property1, row.property2, row.property3, row.property4];
                      const max = Math.max(...vals);
                      return (
                        <tr key={row.metric} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{row.metric}</td>
                          {vals.map((v, i) => (
                            <td key={i} className={cn("px-4 py-3 font-semibold", v === max ? "text-emerald-600" : "text-foreground")}>{v}{row.metric.includes("%") ? "%" : ""}{v === max && <span className="ml-1 text-xs">↑</span>}</td>
                          ))}
                          <td className="px-4 py-3 text-muted-foreground">{row.chainAvg}{row.metric.includes("%") ? "%" : ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── OCCUPANCY HEATMAP ── */}
        {activeSubmenu === "Occupancy Heatmap" && (
          <motion.div key="heatmap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
            <SectionHeader title="Chain-Wide Occupancy Heatmap — April 2026" />

            {/* Heatmap grid */}
            {properties.filter(p => p.status === "Open").map(prop => {
              const days = Array.from({ length: 30 }, (_, i) => {
                const base = prop.occupancy;
                const variation = Math.floor(Math.random() * 20) - 10;
                return Math.min(100, Math.max(30, base + variation));
              });
              return (
                <div key={prop.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{prop.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Avg: <strong className="text-foreground">{prop.occupancy}%</strong></span>
                      <span>ADR: <strong className="text-foreground">${prop.adr}</strong></span>
                    </div>
                  </div>
                  <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(30, 1fr)" }}>
                    {days.map((occ, i) => {
                      const bgColor = occ >= 90 ? "bg-emerald-500" : occ >= 75 ? "bg-emerald-400" : occ >= 60 ? "bg-amber-400" : occ >= 45 ? "bg-orange-400" : "bg-red-400";
                      return (
                        <div key={i} className="group relative">
                          <div className={cn("h-8 rounded-sm cursor-pointer transition-opacity hover:opacity-80", bgColor)} title={`Apr ${i + 1}: ${occ}%`} />
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {i + 1}: {occ}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-muted-foreground">Apr 1</div>
                    <LegendBar items={[
                      { label: "90%+", color: "bg-emerald-100 border-emerald-200" },
                      { label: "75–89%", color: "bg-emerald-50 border-emerald-100" },
                      { label: "60–74%", color: "bg-amber-100 border-amber-200" },
                      { label: "45–59%", color: "bg-orange-100 border-orange-200" },
                      { label: "<45%", color: "bg-red-100 border-red-200" },
                    ]} />
                    <div className="text-xs text-muted-foreground">Apr 30</div>
                  </div>
                </div>
              );
            })}

            {/* Trend chart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="6-Month Occupancy Trend by Property" />
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chainOccupancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} domain={[50, 100]} />
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="manama" name="Manama" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="dubai" name="Dubai" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="maldives" name="Maldives" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="colombo" name="Colombo" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </PageShell>
  );
}
