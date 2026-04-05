import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  Building, Bed, DollarSign, Users, Plug, Palette, CreditCard,
  Plus, Edit2, Trash2, CheckCircle2, AlertTriangle, Globe,
  Phone, Mail, MapPin, Save, Upload, Shield, Key, Eye, EyeOff,
  Tag, Calendar, Percent, RefreshCw, Download, Wifi, WifiOff,
  Star, ChevronRight, ToggleLeft, ToggleRight, Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";


interface SettingsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

interface RoomType {
  id: string; name: string; code: string; count: number;
  maxOcc: number; sizeSqm: number; baseRate: number;
  view: string; bedType: string; amenities: string[];
}

interface RatePlan {
  id: string; name: string; code: string; type: "BAR" | "Corporate" | "Package" | "Promotion";
  discount: number; minNights: number; advanceDays: number; cancellation: string;
  active: boolean; channels: string[];
}

interface UserRole {
  id: string; name: string; email: string; role: string;
  department: string; lastLogin: string; status: "Active" | "Inactive";
  permissions: string[];
}

interface Integration {
  id: string; name: string; category: string; status: "Connected" | "Disconnected" | "Error";
  lastSync: string; description: string; logo: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const roomTypes: RoomType[] = [
  { id: "RT01", name: "Deluxe City View", code: "DCR", count: 32, maxOcc: 2, sizeSqm: 38, baseRate: 145, view: "City", bedType: "King", amenities: ["Free WiFi", "Minibar", "Safe", "Espresso Machine"] },
  { id: "RT02", name: "Deluxe Sea View", code: "DSR", count: 24, maxOcc: 2, sizeSqm: 40, baseRate: 175, view: "Sea", bedType: "King", amenities: ["Free WiFi", "Minibar", "Safe", "Espresso Machine", "Bathrobe"] },
  { id: "RT03", name: "Superior Twin", code: "STR", count: 18, maxOcc: 3, sizeSqm: 36, baseRate: 135, view: "City", bedType: "Twin", amenities: ["Free WiFi", "Minibar", "Safe"] },
  { id: "RT04", name: "Junior Suite", code: "JST", count: 14, maxOcc: 2, sizeSqm: 58, baseRate: 245, view: "Sea", bedType: "King", amenities: ["Free WiFi", "Minibar", "Safe", "Espresso Machine", "Bathrobe", "Separate Lounge"] },
  { id: "RT05", name: "Executive Suite", code: "EST", count: 8, maxOcc: 3, sizeSqm: 85, baseRate: 420, view: "Panoramic Sea", bedType: "King", amenities: ["Free WiFi", "Minibar", "Safe", "Butler Service", "Lounge Access", "Airport Transfer"] },
  { id: "RT06", name: "Presidential Suite", code: "PST", count: 2, maxOcc: 4, sizeSqm: 180, baseRate: 850, view: "Panoramic", bedType: "King + Twins", amenities: ["Free WiFi", "Full Minibar", "Butler Service", "Private Dining", "Lounge Access", "Limousine"] },
];

const ratePlans: RatePlan[] = [
  { id: "RP01", name: "Best Available Rate", code: "BAR", type: "BAR", discount: 0, minNights: 1, advanceDays: 0, cancellation: "24hrs", active: true, channels: ["Direct", "Booking.com", "Expedia", "GDS"] },
  { id: "RP02", name: "Advance Purchase 7", code: "AP7", type: "Promotion", discount: 10, minNights: 1, advanceDays: 7, cancellation: "Non-refundable", active: true, channels: ["Direct", "Booking.com"] },
  { id: "RP03", name: "Advance Purchase 14", code: "AP14", type: "Promotion", discount: 15, minNights: 2, advanceDays: 14, cancellation: "Non-refundable", active: true, channels: ["Direct", "Booking.com", "Expedia"] },
  { id: "RP04", name: "Corporate Standard", code: "CORP", type: "Corporate", discount: 20, minNights: 1, advanceDays: 0, cancellation: "Free cancellation", active: true, channels: ["Direct", "GDS"] },
  { id: "RP05", name: "Bed & Breakfast", code: "BB", type: "Package", discount: 0, minNights: 1, advanceDays: 0, cancellation: "48hrs", active: true, channels: ["Direct", "Booking.com"] },
  { id: "RP06", name: "Summer Escape Package", code: "SUM26", type: "Package", discount: 12, minNights: 3, advanceDays: 0, cancellation: "Free cancellation", active: false, channels: ["Direct"] },
];

const users: UserRole[] = [
  { id: "U01", name: "Sarah Mitchell", email: "sarah.mitchell@singularityhotels.com", role: "General Manager", department: "Management", lastLogin: "Today 09:14", status: "Active", permissions: ["All Access"] },
  { id: "U02", name: "Ahmed Al-Mansouri", email: "ahmed.mansouri@singularityhotels.com", role: "Front Desk Manager", department: "Front Desk", lastLogin: "Today 08:32", status: "Active", permissions: ["Check-in/out", "Folios", "Room Assignment"] },
  { id: "U03", name: "Elena Marchetti", email: "elena.marchetti@singularityhotels.com", role: "Revenue Manager", department: "Sales & Revenue", lastLogin: "Today 10:45", status: "Active", permissions: ["Rates", "Channels", "Reports"] },
  { id: "U04", name: "Ling Wei", email: "ling.wei@singularityhotels.com", role: "Housekeeping Supervisor", department: "Housekeeping", lastLogin: "Yesterday 22:10", status: "Active", permissions: ["Room Status", "Tasks", "Linen"] },
  { id: "U05", name: "Mohammed Al-Rashid", email: "m.rashid@singularityhotels.com", role: "Maintenance Manager", department: "Maintenance", lastLogin: "Today 07:58", status: "Active", permissions: ["Work Orders", "Assets", "PPM"] },
  { id: "U06", name: "Priya Sharma", email: "priya.sharma@singularityhotels.com", role: "Finance Officer", department: "Finance", lastLogin: "Today 11:22", status: "Active", permissions: ["Folios", "Invoices", "Reports", "Night Audit"] },
];

const integrations: Integration[] = [
  { id: "I01", name: "Booking.com", category: "OTA", status: "Connected", lastSync: "2 min ago", description: "Online travel agent — inventory and rate distribution", logo: "🏨" },
  { id: "I02", name: "Expedia Group", category: "OTA", status: "Connected", lastSync: "5 min ago", description: "Expedia, Hotels.com, Vrbo — multi-channel distribution", logo: "✈️" },
  { id: "I03", name: "Amadeus GDS", category: "GDS", status: "Connected", lastSync: "8 min ago", description: "Global Distribution System — travel agent bookings", logo: "🌐" },
  { id: "I04", name: "Stripe Payments", category: "Payments", status: "Connected", lastSync: "1 min ago", description: "Payment processing — cards, digital wallets", logo: "💳" },
  { id: "I05", name: "WhatsApp Business", category: "Messaging", status: "Connected", lastSync: "Live", description: "Guest messaging and broadcast communications", logo: "💬" },
  { id: "I06", name: "Infor HMS", category: "POS", status: "Connected", lastSync: "3 min ago", description: "Point of sale — F&B, spa, and retail outlets", logo: "🍽️" },
  { id: "I07", name: "Schneider EBO", category: "BMS", status: "Connected", lastSync: "10 min ago", description: "Building management — HVAC, energy, IoT sensors", logo: "⚡" },
  { id: "I08", name: "Airbnb for Work", category: "OTA", status: "Disconnected", lastSync: "Never", description: "Corporate extended-stay bookings through Airbnb", logo: "🏠" },
  { id: "I09", name: "SiteMinder", category: "Channel Manager", status: "Connected", lastSync: "1 min ago", description: "Central channel manager — rate parity and distribution hub", logo: "📡" },
  { id: "I10", name: "TripAdvisor", category: "Review", status: "Error", lastSync: "6 hrs ago", description: "Review monitoring and response management", logo: "⭐" },
];

export function Settings({ aiEnabled, activeSubmenu = "Hotel Profile" }: SettingsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <AnimatePresence mode="wait">

        {/* ── HOTEL PROFILE ────────────────────────────────── */}
        {activeSubmenu === "Hotel Profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search settings..." />}
            header={<SectionHeader icon={SettingsIcon} title="Hotel Profile" subtitle="Property identity, contact details, and brand settings" />}
          >
            {/* Hotel branding */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <SectionHeader title="Property Identity" />
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">S</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Hotel Logo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PNG or SVG, min 200×200px</p>
                  <button className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 border border-violet-200 bg-violet-50 rounded-xl px-3 py-1.5 hover:bg-violet-100 transition-colors"><Upload className="w-3 h-3"/>Upload Logo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[["Property Name","Singularity Grand Manama"],["Brand Name","Singularity Hotels & Resorts"],["Star Rating","5"],["Property Code","SGM01"],["Year Opened","2019"],["Total Rooms","150"]].map(([label,val])=>(
                  <div key={label}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                    <input defaultValue={val} className="mt-1.5 w-full px-3 py-2 border border-border rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400"/>
                  </div>
                ))}
              </div>
            </div>
            {/* Contact */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <SectionHeader title="Contact & Location" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[["Address","Building 123, Road 45, Block 302"],["City","Manama"],["Country","Kingdom of Bahrain"],["Postcode","00973"],["Phone","+973 1234 5678"],["Email","info@singularitymanama.com"],["Website","www.singularityhotels.com"],["Currency","BHD — Bahraini Dinar"]].map(([label,val])=>(
                  <div key={label}>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                    <input defaultValue={val} className="mt-1.5 w-full px-3 py-2 border border-border rounded-xl text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400"/>
                  </div>
                ))}
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── ROOM TYPES ───────────────────────────────────── */}
        {activeSubmenu === "Room Types" && (
          <motion.div key="roomtypes" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search room types..." />}
            header={<SectionHeader icon={SettingsIcon} title="Room Types" subtitle={`${roomTypes.length} room categories · ${roomTypes.reduce((s,r)=>s+r.count,0)} total rooms`} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roomTypes.map(rt=>(
                <div key={rt.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2"><span className="font-bold text-foreground">{rt.name}</span><span className="px-2 py-0.5 bg-secondary rounded-full text-xs text-muted-foreground font-mono">{rt.code}</span></div>
                      <p className="text-xs text-muted-foreground mt-0.5">{rt.count} rooms · {rt.bedType} · {rt.sizeSqm}m² · {rt.view} View · Max {rt.maxOcc} guests</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 text-muted-foreground"/></button>
                      <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-muted-foreground"/></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-500"/><span className="text-sm font-bold text-foreground">BHD {rt.baseRate}</span><span className="text-xs text-muted-foreground">/ night (base)</span></div>
                    <div className="flex items-center gap-1">{[1,2,3,4,5].map(s=><Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400"/>)}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {rt.amenities.map(a=><span key={a} className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-full text-xs">{a}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── RATE PLANS ───────────────────────────────────── */}
        {activeSubmenu === "Rate Plans" && (
          <motion.div key="rateplans" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search rate plans..." />}
            header={<SectionHeader icon={SettingsIcon} title="Rate Plans" subtitle={`${ratePlans.filter(r=>r.active).length} active plans · ${ratePlans.length} total`} />}
          >
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  {["Plan Name","Code","Type","Discount","Min Nights","Advance","Cancellation","Channels","Status","Action"].map(h=><th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {ratePlans.map(rp=>(
                    <tr key={rp.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{rp.name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{rp.code}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", rp.type==="BAR"?"bg-blue-100 text-blue-700":rp.type==="Corporate"?"bg-violet-100 text-violet-700":rp.type==="Package"?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700")}>{rp.type}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{rp.discount > 0 ? `-${rp.discount}%` : "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rp.minNights} night{rp.minNights>1?"s":""}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rp.advanceDays > 0 ? `${rp.advanceDays} days` : "None"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{rp.cancellation}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">{rp.channels.slice(0,2).map(c=><span key={c} className="px-1.5 py-0.5 bg-secondary rounded text-xs text-muted-foreground">{c}</span>)}{rp.channels.length>2&&<span className="text-xs text-muted-foreground">+{rp.channels.length-2}</span>}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold",rp.active?"bg-emerald-100 text-emerald-700":"bg-muted text-muted-foreground")}>{rp.active?"Active":"Inactive"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 text-muted-foreground"/></button>
                          <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">{rp.active?<ToggleRight className="w-4 h-4 text-emerald-500"/>:<ToggleLeft className="w-4 h-4 text-muted-foreground"/>}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── USER ROLES ───────────────────────────────────── */}
        {activeSubmenu === "User Roles" && (
          <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search users..." />}
            header={<SectionHeader icon={SettingsIcon} title="User Roles & Access" subtitle={`${users.filter(u=>u.status==="Active").length} active users`} />}
          >
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  {["User","Role","Department","Last Login","Status","Permissions","Action"].map(h=><th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {users.map(u=>(
                    <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">{u.name.charAt(0)}</div>
                          <div><p className="font-semibold text-foreground">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{u.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold",u.status==="Active"?"bg-emerald-100 text-emerald-700":"bg-muted text-muted-foreground")}>{u.status}</span></td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{u.permissions.slice(0,2).map(p=><span key={p} className="px-1.5 py-0.5 bg-secondary rounded text-xs text-muted-foreground">{p}</span>)}{u.permissions.length>2&&<span className="text-xs text-muted-foreground">+{u.permissions.length-2}</span>}</div></td>
                      <td className="px-4 py-3"><div className="flex gap-1"><button className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 text-muted-foreground"/></button><button className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Key className="w-3.5 h-3.5 text-muted-foreground"/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── INTEGRATIONS ─────────────────────────────────── */}
        {activeSubmenu === "Integrations" && (
          <motion.div key="integrations" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search integrations..." />}
            header={<SectionHeader icon={SettingsIcon} title="Integrations" subtitle={`${integrations.filter(i=>i.status==="Connected").length} connected · ${integrations.filter(i=>i.status==="Error").length} with errors`} />}
          >
            {["OTA","GDS","Payments","Messaging","POS","BMS","Channel Manager","Review"].map(cat=>{
              const catItems = integrations.filter(i=>i.category===cat);
              if(!catItems.length) return null;
              return (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{cat}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {catItems.map(intg=>(
                      <div key={intg.id} className="bg-card rounded-2xl shadow-sm border border-border p-4 flex items-center gap-4">
                        <div className="text-3xl w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center shrink-0">{intg.logo}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2"><span className="font-semibold text-foreground">{intg.name}</span><span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",intg.status==="Connected"?"bg-emerald-100 text-emerald-700":intg.status==="Error"?"bg-red-100 text-red-700":"bg-muted text-muted-foreground")}>{intg.status}</span></div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{intg.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5"/>Last sync: {intg.lastSync}</p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button className="px-2.5 py-1 text-xs border border-border rounded-lg hover:bg-secondary transition-colors text-muted-foreground">{intg.status==="Connected"?"Configure":"Connect"}</button>
                          {intg.status==="Error"&&<button className="px-2.5 py-1 text-xs bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>Fix Error</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </PageShell>
          </motion.div>
        )}

        {/* ── APPEARANCE ───────────────────────────────────── */}
        {activeSubmenu === "Appearance" && (
          <motion.div key="appearance" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search appearance..." />}
            header={<SectionHeader icon={SettingsIcon} title="Appearance" subtitle="Theme, colours, language and display preferences" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Theme" />
                <div className="grid grid-cols-3 gap-3">
                  {[{label:"Light",bg:"bg-white",border:"border-violet-500",text:"text-foreground"},{label:"Dark",bg:"bg-muted-foreground",border:"border-border",text:"text-white"},{label:"System",bg:"bg-gradient-to-br from-white to-slate-900",border:"border-border",text:"text-muted-foreground"}].map(t=>(
                    <button key={t.label} className={cn("rounded-xl border-2 p-3 text-center transition-all hover:border-violet-400",t.border,t.bg)}>
                      <div className={cn("text-xs font-semibold",t.text)}>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Language & Region" />
                <div className="space-y-3">
                  {[["Language","English (UK)"],["Date Format","DD/MM/YYYY"],["Time Format","24-hour"],["Timezone","GMT+3 (Arabia Standard)"],["Currency Display","BHD #,###.###"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground flex items-center gap-1">{v}<ChevronRight className="w-3 h-3 text-muted-foreground"/></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Security" />
                <div className="space-y-3">
                  {[["Two-Factor Auth","Enabled"],["Session Timeout","30 minutes"],["Password Policy","Strong (min 12 chars)"],["Audit Logging","All actions"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0">
                      <span className="text-muted-foreground">{k}</span>
                      <span className={cn("font-medium",v.includes("Enabled")||v.includes("All")?"text-emerald-600":"text-foreground")}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Hotel Timings" />
                <div className="space-y-3">
                  {[["Check-in Time","15:00"],["Check-out Time","12:00"],["Night Audit Time","02:00"],["Breakfast Hours","06:30 – 11:00"],["Spa Hours","09:00 – 22:00"]].map(([k,v])=>(
                    <div key={k} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0">
                      <span className="text-muted-foreground">{k}</span>
                      <input defaultValue={v} className="font-medium text-foreground text-right bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-violet-400 rounded px-1 w-32"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── BILLING ──────────────────────────────────────── */}
        {activeSubmenu === "Billing" && (
          <motion.div key="billing" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search billing..." />}
            header={<SectionHeader icon={SettingsIcon} title="Billing & Subscription" subtitle="Manage your Singularity PMS subscription" />}
          >
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
              <div className="flex items-start justify-between">
                <div><p className="text-white/70 text-sm">Current Plan</p><p className="text-3xl font-bold mt-1">Enterprise</p><p className="text-white/80 text-sm mt-1">Unlimited properties · All modules · Priority support</p></div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-sm font-semibold">Active</div>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <div><p className="text-white/70 text-xs">Monthly Fee</p><p className="text-xl font-bold">BHD 480</p></div>
                <div><p className="text-white/70 text-xs">Billed</p><p className="text-xl font-bold">Annually</p></div>
                <div><p className="text-white/70 text-xs">Next Renewal</p><p className="text-xl font-bold">Jan 2027</p></div>
              </div>
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border"><SectionHeader title="Recent Invoices" /></div>
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  {["Invoice","Period","Amount","Status","Action"].map(h=><th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {[["INV-2026-001","Jan 2026","BHD 480","Paid"],["INV-2025-012","Dec 2025","BHD 480","Paid"],["INV-2025-011","Nov 2025","BHD 480","Paid"],["INV-2025-010","Oct 2025","BHD 480","Paid"]].map(([inv,period,amt,status])=>(
                    <tr key={inv} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{inv}</td>
                      <td className="px-4 py-3 text-foreground">{period}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{amt}</td>
                      <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{status}</span></td>
                      <td className="px-4 py-3"><button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"><Download className="w-3.5 h-3.5"/>PDF</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PageShell>
          </motion.div>
        )}

      </AnimatePresence>
  );
}
