import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import {
  Users, Star, Heart, Phone, Mail, Search, Plus, Download, Eye,
  Edit2, Calendar, Gift, MessageSquare, AlertTriangle, CheckCircle2,
  TrendingUp, Award, Filter, Clock, Tag, Globe, Zap, RefreshCw,
  ChevronDown, XCircle, BarChart2, MapPin, Bell, BellOff,
} from "lucide-react";
import { cn } from "../lib/utils";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface CRMProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

interface Guest {
  id: string; name: string; nationality: string; email: string;
  phone: string; tier: "Standard" | "Silver" | "Gold" | "Platinum";
  totalStays: number; totalNights: number; totalSpend: number;
  lastStay: string; nextArrival: string; birthday: string;
  preferences: string[]; dnd: boolean; notes: string;
  source: string; segment: string;
}

interface StayHistory {
  id: string; guestId: string; checkIn: string; checkOut: string;
  room: string; nights: number; spend: number; rating: number; notes: string;
}

interface Campaign {
  id: string; name: string; type: string; status: "Draft" | "Scheduled" | "Sent" | "Active";
  sent: number; opened: number; clicked: number; revenue: number;
  scheduledDate: string; segment: string;
}

interface Complaint {
  id: string; guest: string; room: string; category: string;
  description: string; date: string; assignedTo: string;
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  resolution: string; rating: number;
}

const guests: Guest[] = [
  { id: "G001", name: "Ahmed Al-Mansouri", nationality: "Bahraini", email: "ahmed@example.com", phone: "+973 3301 0011", tier: "Platinum", totalStays: 42, totalNights: 118, totalSpend: 28400, lastStay: "2026-03-28", nextArrival: "2026-04-15", birthday: "1978-07-15", preferences: ["High floor", "King bed", "Non-smoking", "Extra pillows"], dnd: false, notes: "Always requests wake-up call at 06:30. Prefers dates and Arabic coffee on arrival.", source: "Direct", segment: "Business Frequent" },
  { id: "G002", name: "Sarah Al-Rashid", nationality: "Saudi", email: "sarah.r@example.com", phone: "+966 5012 3456", tier: "Gold", totalStays: 18, totalNights: 54, totalSpend: 12800, lastStay: "2026-03-31", nextArrival: "", birthday: "1985-12-03", preferences: ["Suite", "Sea view", "Champagne on arrival"], dnd: true, notes: "VIP — member of royal family staff. Always book 501 or 502.", source: "GDS", segment: "Leisure Luxury" },
  { id: "G003", name: "James Harrington", nationality: "British", email: "j.harrington@corp.co.uk", phone: "+44 7700 900123", tier: "Silver", totalStays: 9, totalNights: 22, totalSpend: 4200, lastStay: "2026-04-01", nextArrival: "2026-05-10", birthday: "1990-03-22", preferences: ["Late check-out", "Gym access", "No housekeeping"], dnd: false, notes: "Allergic to feather pillows — always provide foam alternative.", source: "Corporate", segment: "Business Transient" },
  { id: "G004", name: "Elena Marchetti", nationality: "Italian", email: "elena.m@luxury.it", phone: "+39 055 1234 567", tier: "Gold", totalStays: 12, totalNights: 36, totalSpend: 9600, lastStay: "2026-04-02", nextArrival: "2026-04-08", birthday: "1982-06-19", preferences: ["Quiet room", "Cappuccino on arrival", "Hypoallergenic pillows"], dnd: false, notes: "Food blogger — always comp one meal per stay and provide media kit.", source: "Direct", segment: "Leisure" },
  { id: "G005", name: "Mohammed Yasir", nationality: "Pakistani", email: "m.yasir@example.com", phone: "+92 300 1234567", tier: "Standard", totalStays: 3, totalNights: 7, totalSpend: 1250, lastStay: "2026-03-30", nextArrival: "", birthday: "1995-11-08", preferences: ["Prayer mat", "Halal dining"], dnd: false, notes: "First-time Platinum candidate — enroll after next stay.", source: "OTA", segment: "Leisure" },
  { id: "G006", name: "David Chen", nationality: "Singaporean", email: "d.chen@techco.sg", phone: "+65 8123 4567", tier: "Silver", totalStays: 7, totalNights: 14, totalSpend: 3800, lastStay: "2026-04-02", nextArrival: "2026-06-15", birthday: "1988-04-30", preferences: ["Corner room", "Ethernet cable", "Extra desk space"], dnd: false, notes: "Tech executive. Needs fast WiFi and extra monitors — arrange in advance.", source: "Corporate", segment: "Business Transient" },
  { id: "G007", name: "Fatima Binte Sari", nationality: "Malaysian", email: "fatima.s@example.my", phone: "+60 12 345 6789", tier: "Gold", totalStays: 15, totalNights: 45, totalSpend: 7200, lastStay: "2026-04-01", nextArrival: "2026-04-20", birthday: "1979-01-25", preferences: ["High floor", "Bathtub", "Halal options", "Prayer direction card"], dnd: false, notes: "Repeat guest for Eid. Always book in advance. Prefers room 302–308.", source: "Direct", segment: "Leisure" },
  { id: "G008", name: "Raj Patel", nationality: "Indian", email: "raj.p@example.com", phone: "+91 98765 43210", tier: "Standard", totalStays: 2, totalNights: 4, totalSpend: 680, lastStay: "2026-04-02", nextArrival: "", birthday: "1992-09-14", preferences: ["Vegetarian meals"], dnd: false, notes: "", source: "OTA", segment: "Leisure" },
];

const stayHistory: StayHistory[] = [
  { id: "SH001", guestId: "G001", checkIn: "2026-03-25", checkOut: "2026-03-28", room: "412", nights: 3, spend: 820, rating: 5, notes: "Praised front desk staff." },
  { id: "SH002", guestId: "G001", checkIn: "2026-02-10", checkOut: "2026-02-13", room: "412", nights: 3, spend: 760, rating: 5, notes: "" },
  { id: "SH003", guestId: "G002", checkIn: "2026-03-28", checkOut: "2026-03-31", room: "501", nights: 3, spend: 1800, rating: 4, notes: "Champagne was late." },
  { id: "SH004", guestId: "G003", checkIn: "2026-04-01", checkOut: "2026-04-02", room: "215", nights: 1, spend: 210, rating: 4, notes: "" },
  { id: "SH005", guestId: "G004", checkIn: "2026-04-02", checkOut: "2026-04-08", room: "501", nights: 6, spend: 2800, rating: 5, notes: "Loved the spa." },
];

const campaigns: Campaign[] = [
  { id: "CAM001", name: "Ramadan Special Package", type: "Email", status: "Sent", sent: 2840, opened: 1240, clicked: 380, revenue: 28400, scheduledDate: "2026-03-01", segment: "Gold & Platinum" },
  { id: "CAM002", name: "Birthday Month Offer", type: "Email", status: "Active", sent: 124, opened: 88, clicked: 42, revenue: 9200, scheduledDate: "2026-04-01", segment: "All Tiers" },
  { id: "CAM003", name: "Eid Al-Fitr Getaway", type: "SMS + Email", status: "Scheduled", sent: 0, opened: 0, clicked: 0, revenue: 0, scheduledDate: "2026-04-20", segment: "All Tiers" },
  { id: "CAM004", name: "Corporate Appreciation Week", type: "Email", status: "Draft", sent: 0, opened: 0, clicked: 0, revenue: 0, scheduledDate: "", segment: "Business Frequent" },
  { id: "CAM005", name: "Long Weekend Escape", type: "Push + Email", status: "Sent", sent: 1820, opened: 790, clicked: 220, revenue: 18600, scheduledDate: "2026-03-20", segment: "Silver & Gold" },
];

const complaints: Complaint[] = [
  { id: "CP001", guest: "Sarah Al-Rashid", room: "501", category: "Service Delay", description: "Champagne arrival for anniversary was 45 minutes late.", date: "2026-03-31", assignedTo: "Ahmed Al-Mansouri", status: "Resolved", resolution: "Comp bottle of wine + apology card delivered.", rating: 4 },
  { id: "CP002", guest: "James Harrington", room: "215", category: "Room Issue", description: "AC not cooling properly. Reported at 23:00.", date: "2026-04-01", assignedTo: "Mohammed Al-Rashid", status: "Resolved", resolution: "AC unit repaired. Room upgrade offered.", rating: 5 },
  { id: "CP003", guest: "Nguyen Family", room: "322", category: "Billing Dispute", description: "Charged for minibar items they did not consume.", date: "2026-04-02", assignedTo: "Ravi Sharma", status: "In Progress", resolution: "", rating: 0 },
  { id: "CP004", guest: "Raj Patel", room: "118", category: "Cleanliness", description: "Bathroom was not cleaned during turndown service.", date: "2026-04-02", assignedTo: "Ling Wei", status: "Open", resolution: "", rating: 0 },
];

const tierData = [
  { name: "Platinum", value: 12, color: "#8b5cf6" },
  { name: "Gold", value: 28, color: "#f59e0b" },
  { name: "Silver", value: 55, color: "#94a3b8" },
  { name: "Standard", value: 205, color: "#e2e8f0" },
];

const getTierColor = (tier: Guest["tier"]) => {
  switch (tier) {
    case "Platinum": return "bg-purple-100 text-purple-700";
    case "Gold": return "bg-amber-100 text-amber-700";
    case "Silver": return "bg-muted text-muted-foreground";
    case "Standard": return "bg-secondary text-muted-foreground";
  }
};

const getComplaintStatusColor = (s: Complaint["status"]) => {
  switch (s) {
    case "Resolved": return "bg-emerald-100 text-emerald-700";
    case "In Progress": return "bg-blue-100 text-blue-700";
    case "Open": return "bg-red-100 text-red-700";
    case "Escalated": return "bg-orange-100 text-orange-700";
  }
};

export function CRM({ aiEnabled, activeSubmenu = "Overview" }: CRMProps) {
  const [guestSearch, setGuestSearch] = useState("");
  const [guestTierFilter, setGuestTierFilter] = useState("All");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [complaintFilter, setComplaintFilter] = useState("All");

  const filteredGuests = guests.filter(g => {
    const matchSearch = !guestSearch || g.name.toLowerCase().includes(guestSearch.toLowerCase()) || g.email.toLowerCase().includes(guestSearch.toLowerCase());
    const matchTier = guestTierFilter === "All" || g.tier === guestTierFilter;
    return matchSearch && matchTier;
  });

  const totalGuests = guests.length;
  const vipGuests = guests.filter(g => g.tier === "Platinum" || g.tier === "Gold").length;
  const birthdayThisMonth = guests.filter(g => new Date(g.birthday).getMonth() === new Date().getMonth()).length;
  const openComplaints = complaints.filter(c => c.status !== "Resolved").length;

  return (
    <PageShell
      search={<SectionSearch value={guestSearch} onChange={setGuestSearch} placeholder="Search guests, emails..." />}
      header={<SectionHeader title="CRM" subtitle={`Guest relationship management — ${totalGuests} profiles active`} icon={Heart} actions={<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> New Guest Profile</button>} />}
      kpi={<KpiStrip items={[{color:"bg-blue-500",value:300,label:"Total Profiles"},{color:"bg-amber-500",value:vipGuests,label:"VIP (Gold+)"},{color:"bg-pink-500",value:birthdayThisMonth,label:"Birthdays This Month"},{color:"bg-red-500",value:openComplaints,label:"Open Complaints"},{color:"bg-emerald-500",value:guests.filter(g=>g.nextArrival).length,label:"Upcoming Arrivals"}]} />}
    >
      <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {activeSubmenu === "Overview" && (
          <motion.div key="Overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <SectionHeader title="Guest Tier Breakdown" />
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={tierData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {tierData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 flex-1">
                    {tierData.map(tier => (
                      <div key={tier.name} className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground"><span className="w-3 h-3 rounded-full" style={{ background: tier.color }} />{tier.name}</span>
                        <span className="font-semibold text-foreground">{tier.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <SectionHeader title="Upcoming Birthdays" />
                <div className="space-y-3">
                  {guests.filter(g => g.birthday).slice(0, 5).map(g => {
                    const bday = new Date(g.birthday);
                    const daysUntil = Math.floor((new Date(`2026-${String(bday.getMonth()+1).padStart(2,'0')}-${String(bday.getDate()).padStart(2,'0')}`).getTime() - new Date().getTime()) / 86400000);
                    return (
                      <div key={g.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{g.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{g.name}</p>
                          <p className="text-xs text-muted-foreground">{g.birthday.slice(5)} · {g.tier}</p>
                        </div>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", daysUntil <= 7 ? "bg-pink-100 text-pink-700" : "bg-secondary text-muted-foreground")}>{daysUntil >= 0 ? `in ${daysUntil}d` : `${Math.abs(daysUntil)}d ago`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* In-House VIPs */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <SectionHeader title="In-House VIP Guests" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guests.filter(g => g.tier === "Platinum" || g.tier === "Gold").slice(0, 6).map(g => (
                  <div key={g.id} className="bg-secondary/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">{g.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{g.name}</p>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTierColor(g.tier))}>{g.tier}</span>
                      </div>
                      {g.dnd && <BellOff className="w-4 h-4 text-amber-500 ml-auto flex-shrink-0" aria-label="DND" />}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {g.preferences.slice(0, 3).map(p => <span key={p} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">{p}</span>)}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{g.notes || "No special notes."}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* GUEST PROFILES */}
        {activeSubmenu === "Guest Profiles" && (
          <motion.div key="Guest Profiles" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <SectionHeader title="Guest Profiles" subtitle={`${filteredGuests.length} profiles`} />

            <div className="flex gap-3 flex-wrap items-center">
              {["All", "Platinum", "Gold", "Silver", "Standard"].map(t => (
                <button key={t} onClick={() => setGuestTierFilter(t)} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", guestTierFilter === t ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary/50")}>{t}</button>
              ))}
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-secondary/50">
                  <tr>{["Guest", "Nationality", "Tier", "Total Stays", "Total Spend", "Last Stay", "Next Arrival", "DND", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredGuests.map(g => (
                    <tr key={g.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedGuest(g === selectedGuest ? null : g)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{g.name.charAt(0)}</div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{g.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{g.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{g.nationality}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getTierColor(g.tier))}>{g.tier}</span></td>
                      <td className="px-4 py-3 font-semibold text-foreground">{g.totalStays}</td>
                      <td className="px-4 py-3 font-bold text-foreground">BHD {g.totalSpend.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{g.lastStay}</td>
                      <td className="px-4 py-3">
                        {g.nextArrival ? <span className="text-sm text-blue-600 font-medium">{g.nextArrival}</span> : <span className="text-sm text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {g.dnd ? <BellOff className="w-4 h-4 text-amber-500" /> : <Bell className="w-4 h-4 text-muted-foreground" />}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><MessageSquare className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Guest Detail Panel */}
            {selectedGuest && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">{selectedGuest.name.charAt(0)}</div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selectedGuest.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedGuest.nationality} · {selectedGuest.segment}</p>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium mt-1 inline-block", getTierColor(selectedGuest.tier))}>{selectedGuest.tier} Member</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedGuest(null)}><XCircle className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Stays", value: selectedGuest.totalStays },
                    { label: "Total Nights", value: selectedGuest.totalNights },
                    { label: "Total Spend", value: `BHD ${selectedGuest.totalSpend.toLocaleString()}` },
                    { label: "Birthday", value: selectedGuest.birthday },
                    { label: "Phone", value: selectedGuest.phone },
                    { label: "Email", value: selectedGuest.email },
                    { label: "Source", value: selectedGuest.source },
                    { label: "DND", value: selectedGuest.dnd ? "Yes" : "No" },
                  ].map(item => (
                    <div key={item.label} className="bg-secondary/30 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground text-sm mt-0.5 truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
                {selectedGuest.preferences.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Preferences</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedGuest.preferences.map(p => <span key={p} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs">{p}</span>)}
                    </div>
                  </div>
                )}
                {selectedGuest.notes && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">{selectedGuest.notes}</div>}
              </div>
            )}
          </motion.div>
        )}

        {/* CAMPAIGNS */}
        {activeSubmenu === "Campaigns" && (
          <motion.div key="Campaigns" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <SectionHeader title="Email & Campaign Manager" subtitle={`${campaigns.length} campaigns · BHD ${campaigns.reduce((s, c) => s + c.revenue, 0).toLocaleString()} attributed revenue`} />

            <div className="space-y-4">
              {campaigns.map(cam => (
                <div key={cam.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold text-foreground">{cam.name}</h4>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{cam.type}</span>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", cam.status === "Sent" ? "bg-emerald-100 text-emerald-700" : cam.status === "Active" ? "bg-blue-100 text-blue-700" : cam.status === "Scheduled" ? "bg-purple-100 text-purple-700" : "bg-muted text-muted-foreground")}>{cam.status}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Segment: {cam.segment} · {cam.scheduledDate || "Not scheduled"}</p>
                    </div>
                    {cam.sent > 0 && (
                      <div className="flex gap-6 text-center flex-shrink-0">
                        <div>
                          <p className="text-lg font-bold text-foreground">{cam.sent.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Sent</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{Math.round(cam.opened / cam.sent * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground">{Math.round(cam.clicked / cam.sent * 100)}%</p>
                          <p className="text-xs text-muted-foreground">Click Rate</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-emerald-600">BHD {cam.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* COMPLAINTS */}
        {activeSubmenu === "Complaints" && (
          <motion.div key="Complaints" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <SectionHeader title="Complaint & Resolution Tracker" subtitle={`${complaints.filter(c => c.status !== "Resolved").length} open · ${complaints.filter(c => c.status === "Resolved").length} resolved`} />

            <div className="flex gap-2">
              {["All", "Open", "In Progress", "Resolved", "Escalated"].map(f => (
                <button key={f} onClick={() => setComplaintFilter(f)} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", complaintFilter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary/50")}>{f}</button>
              ))}
            </div>

            <div className="space-y-4">
              {complaints.filter(c => complaintFilter === "All" || c.status === complaintFilter).map(comp => (
                <div key={comp.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold text-foreground">{comp.guest}</h4>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">Room {comp.room}</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{comp.category}</span>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getComplaintStatusColor(comp.status))}>{comp.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{comp.description}</p>
                      {comp.resolution && <p className="text-sm text-emerald-600 font-medium">✓ {comp.resolution}</p>}
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                        <span>{comp.date}</span>
                        <span>Assigned: {comp.assignedTo}</span>
                      </div>
                    </div>
                    {comp.rating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {[1,2,3,4,5].map(s => <Star key={s} className={cn("w-4 h-4", s <= comp.rating ? "fill-amber-400 text-amber-400" : "text-border")} />)}
                      </div>
                    )}
                    {comp.status !== "Resolved" && (
                      <button className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm hover:bg-emerald-200 transition-colors flex-shrink-0">Mark Resolved</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STAY HISTORY */}
        {activeSubmenu === "Stay History" && (
          <motion.div key="Stay History" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }} className="space-y-6">
            <SectionHeader title="Guest Stay History" subtitle={`${stayHistory.length} recorded stays`} />
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-secondary/50">
                  <tr>{["Guest", "Room", "Check-In", "Check-Out", "Nights", "Spend", "Rating", "Notes"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {stayHistory.map(stay => {
                    const guest = guests.find(g => g.id === stay.guestId);
                    return (
                      <tr key={stay.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground text-sm">{guest?.name || "Unknown"}</td>
                        <td className="px-4 py-3 font-bold text-foreground">{stay.room}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{stay.checkIn}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{stay.checkOut}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{stay.nights}</td>
                        <td className="px-4 py-3 font-bold text-foreground">BHD {stay.spend}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={cn("w-3.5 h-3.5", s <= stay.rating ? "fill-amber-400 text-amber-400" : "text-border")} />)}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{stay.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
