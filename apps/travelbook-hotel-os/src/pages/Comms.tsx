import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  MessageSquare, Phone, Mail, Bell, Send, Search,
  CheckCircle2, AlertCircle, Clock, Star, Users,
  ChevronRight, Plus, Edit2, Trash2, Download,
  Archive, Filter, Mic2, MapPin, BookOpen, Radio,
  Megaphone, Smartphone, BellRing, Eye, RefreshCw, FileText, TrendingDown
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface CommsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

type RequestStatus = "Open" | "In Progress" | "Resolved" | "Escalated" | "Closed";
type RequestPriority = "Low" | "Medium" | "High" | "Urgent";
type MessageChannel = "WhatsApp" | "Email" | "In-App" | "SMS" | "Phone";

interface GuestRequest {
  id: string;
  guestName: string;
  room: string;
  requestType: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  assignedTo: string;
  channel: MessageChannel;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  responseTime?: number;
  rating?: number;
}

interface ConciergeEntry {
  id: string;
  guestName: string;
  room: string;
  requestType: string;
  details: string;
  status: "Pending" | "Confirmed" | "Done";
  assignedTo: string;
  bookedFor: string;
  vendor: string;
  cost?: number;
  createdAt: string;
  notes: string;
}

interface BroadcastMessage {
  id: string;
  title: string;
  body: string;
  channel: MessageChannel;
  audience: "All Guests" | "In-House" | "VIP" | "Specific Rooms" | "Staff";
  scheduledAt?: string;
  sentAt?: string;
  status: "Draft" | "Scheduled" | "Sent" | "Failed";
  recipients: number;
  opened: number;
  clicked: number;
}

interface StaffBriefing {
  id: string;
  title: string;
  department: string;
  date: string;
  time: string;
  presenter: string;
  content: string;
  attendees: string[];
  acknowledged: number;
  total: number;
  attachments: string[];
  status: "Upcoming" | "Published" | "Acknowledged";
}

interface InternalMessage {
  id: string;
  from: string;
  fromDept: string;
  to: string;
  toDept: string;
  subject: string;
  body: string;
  priority: RequestPriority;
  sentAt: string;
  read: boolean;
  thread: { sender: string; message: string; time: string }[];
}

// ── Sample Data ────────────────────────────────────────────────
const guestRequests: GuestRequest[] = [
  { id: "GR001", guestName: "James Chen", room: "501", requestType: "Extra Towels", description: "Guest requested 4 extra bath towels and 2 hand towels", priority: "Low", status: "Resolved", assignedTo: "Housekeeping", channel: "WhatsApp", createdAt: "2026-04-02 08:15", updatedAt: "2026-04-02 08:42", resolvedAt: "2026-04-02 08:42", responseTime: 27, rating: 5 },
  { id: "GR002", guestName: "Maryam Al-Khalifa", room: "712", requestType: "AC Malfunction", description: "Air conditioning not cooling, room temperature is 28°C", priority: "High", status: "In Progress", assignedTo: "Engineering", channel: "Phone", createdAt: "2026-04-02 09:30", updatedAt: "2026-04-02 09:45", responseTime: 15 },
  { id: "GR003", guestName: "David Müller", room: "305", requestType: "Late Checkout", description: "Requesting late checkout until 14:00 instead of 12:00", priority: "Medium", status: "Resolved", assignedTo: "Front Office", channel: "WhatsApp", createdAt: "2026-04-02 07:00", updatedAt: "2026-04-02 07:12", resolvedAt: "2026-04-02 07:12", responseTime: 12, rating: 5 },
  { id: "GR004", guestName: "Priya Sharma", room: "208", requestType: "Room Service", description: "Ordered vegetarian breakfast for 2, delivery to room by 07:30", priority: "Medium", status: "Resolved", assignedTo: "F&B", channel: "In-App", createdAt: "2026-04-02 07:00", updatedAt: "2026-04-02 07:28", resolvedAt: "2026-04-02 07:28", responseTime: 28, rating: 4 },
  { id: "GR005", guestName: "Sheikh Khalid Al-Zayed", room: "1001", requestType: "Airport Transfer", description: "VIP requires 2 SUVs for transfer to Bahrain International Airport at 15:00", priority: "Urgent", status: "In Progress", assignedTo: "Concierge", channel: "Phone", createdAt: "2026-04-02 10:00", updatedAt: "2026-04-02 10:05", responseTime: 5 },
  { id: "GR006", guestName: "Layla Nasser", room: "410", requestType: "Noise Complaint", description: "Guests in room 412 are being very loud, affecting sleep", priority: "High", status: "Resolved", assignedTo: "Security", channel: "Phone", createdAt: "2026-04-02 01:15", updatedAt: "2026-04-02 01:28", resolvedAt: "2026-04-02 01:28", responseTime: 13, rating: 4 },
  { id: "GR007", guestName: "Robert Park", room: "615", requestType: "WiFi Issue", description: "Cannot connect to hotel WiFi on laptop, tried multiple times", priority: "Medium", status: "Open", assignedTo: "IT", channel: "Email", createdAt: "2026-04-02 11:00", updatedAt: "2026-04-02 11:00" },
  { id: "GR008", guestName: "Fatima Al-Dosari", room: "903", requestType: "Flower Arrangement", description: "Birthday celebration — requesting fresh flowers in room and a card", priority: "Low", status: "In Progress", assignedTo: "Housekeeping", channel: "WhatsApp", createdAt: "2026-04-02 09:00", updatedAt: "2026-04-02 09:15" },
  { id: "GR009", guestName: "Ahmed Karim", room: "104", requestType: "Invoice Request", description: "Requesting itemized invoice for business expense reimbursement", priority: "Low", status: "Open", assignedTo: "Finance", channel: "Email", createdAt: "2026-04-02 10:45", updatedAt: "2026-04-02 10:45" },
  { id: "GR010", guestName: "Carlos Mendez", room: "316", requestType: "Iron & Board", description: "Needs iron and ironing board for conference presentation clothes", priority: "Medium", status: "Resolved", assignedTo: "Housekeeping", channel: "In-App", createdAt: "2026-04-02 06:30", updatedAt: "2026-04-02 06:50", resolvedAt: "2026-04-02 06:50", responseTime: 20, rating: 5 },
];

const conciergeLog: ConciergeEntry[] = [
  { id: "CON001", guestName: "Sheikh Khalid Al-Zayed", room: "1001", requestType: "Airport Transfer", details: "2 x GMC Yukon to BIA at 15:00 — VIP protocol", status: "Confirmed", assignedTo: "Omar Concierge", bookedFor: "2026-04-02 15:00", vendor: "Royal Limousine BH", cost: 180, createdAt: "2026-04-02 10:00", notes: "Meet & greet at lobby 14:45. Coordinate with security." },
  { id: "CON002", guestName: "James Chen", room: "501", requestType: "Restaurant Reservation", details: "Table for 4 at Nobu Bahrain, 20:00", status: "Confirmed", assignedTo: "Sara Concierge", bookedFor: "2026-04-02 20:00", vendor: "Nobu Restaurant", cost: 0, createdAt: "2026-04-02 08:00", notes: "Window table requested. One guest is celiac." },
  { id: "CON003", guestName: "David Müller", room: "305", requestType: "Desert Safari", details: "Private desert safari for 2 with 4x4 and dinner", status: "Confirmed", assignedTo: "Omar Concierge", bookedFor: "2026-04-03 15:00", vendor: "Desert Adventures BH", cost: 220, createdAt: "2026-04-01 14:00", notes: "Pickup from hotel at 15:00." },
  { id: "CON004", guestName: "Priya Sharma", room: "208", requestType: "Spa Booking", details: "Couples massage 60-min at hotel spa", status: "Done", assignedTo: "Sara Concierge", bookedFor: "2026-04-02 11:00", vendor: "Hotel Spa", cost: 95, createdAt: "2026-04-01 18:00", notes: "Couple requested jasmine oil — confirmed with spa." },
  { id: "CON005", guestName: "Carlos Mendez", room: "316", requestType: "Dry Cleaning", details: "3 suits for conference tomorrow — urgent", status: "Pending", assignedTo: "Housekeeping", bookedFor: "2026-04-02 18:00", vendor: "Hotel Laundry", cost: 55, createdAt: "2026-04-02 08:00", notes: "Express service requested by 18:00 today." },
];

const broadcastMessages: BroadcastMessage[] = [
  { id: "BM001", title: "Happy Birthday from The Singularity!", body: "Wishing you a wonderful birthday! A complimentary slice of cake awaits at the F&B outlet. Show this message to redeem.", channel: "WhatsApp", audience: "Specific Rooms", scheduledAt: "2026-04-02 08:00", sentAt: "2026-04-02 08:00", status: "Sent", recipients: 3, opened: 3, clicked: 2 },
  { id: "BM002", title: "Scheduled Maintenance Notice", body: "Dear Guest, please be advised that the rooftop pool will be closed for maintenance from 09:00–12:00 on April 4th. The indoor pool remains open. We apologise for any inconvenience.", channel: "Email", audience: "In-House", status: "Scheduled", scheduledAt: "2026-04-03 18:00", recipients: 87, opened: 0, clicked: 0 },
  { id: "BM003", title: "Welcome to Singularity Hotel", body: "Welcome, valued guest! Your comfort is our priority. Text us at any time for assistance. Enjoy complimentary high-speed WiFi: Network: Singularity_Guest / Password: welcome2026", channel: "WhatsApp", audience: "All Guests", sentAt: "2026-04-01 12:00", status: "Sent", recipients: 124, opened: 101, clicked: 88 },
  { id: "BM004", title: "Exclusive F&B Offer — Tonight Only", body: "Join us tonight at Jasmine Restaurant for a special 3-course dinner at BHD 28 per person. Reservations required. Call ext. 205 or reply to this message.", channel: "SMS", audience: "In-House", status: "Sent", sentAt: "2026-04-02 13:00", recipients: 87, opened: 65, clicked: 32 },
  { id: "BM005", title: "VIP Upgrade Notification", body: "Congratulations! We are pleased to upgrade your stay to a Suite. Your new room key will be ready at reception. Enjoy the complimentary minibar.", channel: "WhatsApp", audience: "VIP", status: "Draft", recipients: 0, opened: 0, clicked: 0 },
];

const staffBriefings: StaffBriefing[] = [
  { id: "SB001", title: "Morning Briefing — April 2, 2026", department: "All Departments", date: "2026-04-02", time: "07:30", presenter: "GM Hassan Al-Mansouri", content: "Today's occupancy: 87%. VIP arrivals: Sheikh Khalid Al-Zayed (1001), James Chen (501). Al-Noor Corporate Dinner tonight in Jasmine Banquet at 19:00 (120 pax). Engineering to complete AC fix in 712 before noon. Security briefed on VIP protocol.", attendees: ["Front Office", "Housekeeping", "F&B", "Engineering", "Security"], acknowledged: 28, total: 34, attachments: ["Today_VIP_List.pdf", "Event_Runsheet_AlNoor.pdf"], status: "Published" },
  { id: "SB002", title: "Royal Bank Gala Prep Briefing", department: "Events & F&B", date: "2026-04-03", time: "09:00", presenter: "Events Mgr Layla Hassan", content: "Gala on April 12 for 250 guests. Setup begins at 09:00 on the day. Full catering menu confirmed. DJ + band arriving by 16:00. Dress code: formal. Red carpet entrance. Parking management needed from 17:00.", attendees: ["Events", "F&B", "Housekeeping", "Security", "Valet"], acknowledged: 12, total: 22, attachments: ["Gala_RunSheet.pdf", "VIP_Seating_Plan.pdf", "Menu_Final.pdf"], status: "Published" },
  { id: "SB003", title: "Fire Evacuation Drill Notice", department: "All Departments", date: "2026-04-10", time: "10:00", presenter: "Chief Security Officer", content: "Mandatory fire evacuation drill on April 10. All staff to review evacuation routes. Assembly point: North Car Park. Guests to be guided calmly. Do not use lifts.", attendees: ["All Staff"], acknowledged: 0, total: 85, attachments: ["Evacuation_Routes.pdf"], status: "Upcoming" },
];

const internalMessages: InternalMessage[] = [
  { id: "IM001", from: "Chef Ahmed", fromDept: "F&B", to: "GM Hassan", toDept: "Management", subject: "Urgent: Seafood Delivery Short — Gala Dinner Risk", body: "The salmon order came in 10kg short. We need to either place an urgent order with an alternative supplier or adjust the gala menu. Please advise ASAP.", priority: "Urgent", sentAt: "2026-04-02 11:30", read: false, thread: [{ sender: "GM Hassan", message: "Contact Gulf Food first. If not resolved by 14:00, adjust menu and inform events team. Keep me posted.", time: "2026-04-02 11:45" }] },
  { id: "IM002", from: "Engineering Karim", fromDept: "Engineering", to: "Front Office", toDept: "Front Office", subject: "Room 712 AC — ETA 13:00", body: "Parts arrived. AC repair in Room 712 will be completed by 13:00. Please advise guest accordingly and offer comp F&B in the meantime.", priority: "High", sentAt: "2026-04-02 10:00", read: true, thread: [] },
  { id: "IM003", from: "Security Ali", fromDept: "Security", to: "Housekeeping", toDept: "Housekeeping", subject: "Lost Item Found — Room 615 Corridor", body: "Found a ladies' watch in corridor near Room 615. Item logged as LF-2026-0112. Please check with front office if any guest has reported a lost watch.", priority: "Medium", sentAt: "2026-04-01 22:10", read: true, thread: [{ sender: "Housekeeping Nadia", message: "No guest has reported. Item secured in Lost & Found cabinet. Thank you.", time: "2026-04-01 22:30" }] },
  { id: "IM004", from: "Events Sara", fromDept: "Events", to: "F&B", toDept: "F&B", subject: "Catering Confirmation for TechForward Summit", body: "Please confirm the coffee break stations for April 8 Summit at 10:30 and 15:00. 180 pax. Vegan options mandatory.", priority: "Medium", sentAt: "2026-04-02 09:00", read: false, thread: [] },
];

const responseTimeData = [
  { hour: "06:00", avg: 18, target: 15 },
  { hour: "08:00", avg: 12, target: 15 },
  { hour: "10:00", avg: 22, target: 15 },
  { hour: "12:00", avg: 28, target: 15 },
  { hour: "14:00", avg: 19, target: 15 },
  { hour: "16:00", avg: 14, target: 15 },
  { hour: "18:00", avg: 11, target: 15 },
  { hour: "20:00", avg: 9, target: 15 },
  { hour: "22:00", avg: 7, target: 15 },
];

const requestsByType = [
  { type: "Room Service", count: 28 }, { type: "Housekeeping", count: 22 }, { type: "Maintenance", count: 15 },
  { type: "Concierge", count: 18 }, { type: "Checkout/Invoice", count: 12 }, { type: "Noise/Complaint", count: 6 }, { type: "Other", count: 9 },
];

// ── Helper Components ─────────────────────────────────────────
const RequestStatusBadge = ({ status }: { status: RequestStatus }) => {
  const map: Record<RequestStatus, string> = {
    Open: "bg-blue-100 text-blue-700",
    "In Progress": "bg-amber-100 text-amber-700",
    Resolved: "bg-emerald-100 text-emerald-700",
    Escalated: "bg-red-100 text-red-700",
    Closed: "bg-slate-100 text-slate-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[status])}>{status}</span>;
};

const PriorityBadge = ({ priority }: { priority: RequestPriority }) => {
  const map: Record<RequestPriority, string> = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-blue-100 text-blue-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[priority])}>{priority}</span>;
};

// ── Main Component ────────────────────────────────────────────
export function Comms({ aiEnabled, activeSubmenu = "Overview" }: CommsProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<InternalMessage | null>(null);
  const [replyText, setReplyText] = useState("");

  const filteredRequests = guestRequests.filter(r => {
    const matchSearch = r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.requestType.toLowerCase().includes(search.toLowerCase()) ||
      r.room.includes(search);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchPriority = filterPriority === "All" || r.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const open = guestRequests.filter(r => r.status === "Open").length;
  const inProgress = guestRequests.filter(r => r.status === "In Progress").length;
  const resolved = guestRequests.filter(r => r.status === "Resolved").length;
  const avgResponseTime = Math.round(guestRequests.filter(r => r.responseTime).reduce((s, r) => s + (r.responseTime ?? 0), 0) / guestRequests.filter(r => r.responseTime).length);
  const unreadMessages = internalMessages.filter(m => !m.read).length;

  return (
    <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="commsov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search communications..." />}
            header={<SectionHeader icon={MessageSquare} title="Communications Overview" subtitle="Live messaging and request metrics" />}
            kpi={<KpiStrip items={[
              {color:"bg-blue-500",value:open,label:"Open Requests"},
              {color:"bg-emerald-500",value:resolved,label:"Resolved Today"},
              {color:"bg-amber-500",value:`${avgResponseTime}m`,label:"Avg Response Time"},
              {color:"bg-violet-500",value:unreadMessages,label:"Unread Messages"},
              {color:"bg-pink-500",value:inProgress,label:"In Progress"},
            ]} />}
          >

            {/* Response time chart + request types */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Response Time Today vs Target (minutes)" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip formatter={(v: number) => [`${v} min`, ""]} />
                    <Legend />
                    <Area type="monotone" dataKey="avg" name="Avg Response" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} />
                    <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Requests by Type" />
                <div className="space-y-2">
                  {requestsByType.map(item => (
                    <div key={item.type} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{item.type}</span>
                          <span className="font-medium text-foreground">{item.count}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(item.count / 28) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live feed of active requests */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <SectionHeader title="Active Guest Requests" />
                <button className="text-xs text-primary flex items-center gap-1">View All <ChevronRight size={14} /></button>
              </div>
              <div className="divide-y divide-border/50">
                {guestRequests.filter(r => r.status !== "Resolved" && r.status !== "Closed").map(req => (
                  <div key={req.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", req.priority === "Urgent" ? "bg-red-500" : req.priority === "High" ? "bg-orange-500" : req.priority === "Medium" ? "bg-blue-500" : "bg-slate-400")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground text-sm">{req.guestName}</p>
                        <span className="text-xs text-muted-foreground">· Rm {req.room}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{req.requestType} — {req.description.substring(0, 60)}...</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={req.priority} />
                      <RequestStatusBadge status={req.status} />
                      <span className="text-xs text-muted-foreground">{req.createdAt.split(" ")[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unread internal messages */}
            {unreadMessages > 0 && (
              <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                  <SectionHeader title={`Unread Internal Messages (${unreadMessages})`} />
                </div>
                <div className="divide-y divide-border/50">
                  {internalMessages.filter(m => !m.read).map(msg => (
                    <div key={msg.id} className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer bg-purple-50/50" onClick={() => setSelectedMessage(msg)}>
                      <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-2" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{msg.subject}</p>
                        <p className="text-xs text-muted-foreground">From {msg.from} ({msg.fromDept}) · {msg.sentAt.split(" ")[1]}</p>
                      </div>
                      <PriorityBadge priority={msg.priority} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </PageShell>
          </motion.div>
        )}

        {/* ── GUEST REQUESTS ── */}
        {activeSubmenu === "Guest Requests" && (
          <motion.div key="guestreq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search guest requests..." />}
            header={<SectionHeader icon={MessageSquare} title="Guest Request Tracker" subtitle="Track and resolve guest requests" />}
            kpi={<KpiStrip items={[
              {color:"bg-blue-500",value:open,label:"Open"},
              {color:"bg-amber-500",value:inProgress,label:"In Progress"},
              {color:"bg-emerald-500",value:resolved,label:"Resolved"},
              {color:"bg-rose-500",value:guestRequests.filter(r=>r.status==="Escalated").length,label:"Escalated"},
              {color:"bg-violet-500",value:`${avgResponseTime}m`,label:"Avg Response"},
            ]} />}
          >

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
              <div className="flex flex-wrap gap-3">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none">
                  {["All", "Open", "In Progress", "Resolved", "Escalated", "Closed"].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none">
                  {["All", "Low", "Medium", "High", "Urgent"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Request Table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Guest", "Room", "Request", "Priority", "Channel", "Assigned", "Created", "Response", "Status", "Rating"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredRequests.map(req => (
                      <tr key={req.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedRequest(req)}>
                        <td className="px-4 py-3 font-medium text-foreground">{req.guestName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.room}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{req.requestType}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{req.description}</p>
                        </td>
                        <td className="px-4 py-3"><PriorityBadge priority={req.priority} /></td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", req.channel === "WhatsApp" ? "bg-green-100 text-green-700" : req.channel === "Phone" ? "bg-blue-100 text-blue-700" : req.channel === "In-App" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-700")}>{req.channel}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{req.assignedTo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.createdAt.split(" ")[1]}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.responseTime ? `${req.responseTime}m` : "–"}</td>
                        <td className="px-4 py-3"><RequestStatusBadge status={req.status} /></td>
                        <td className="px-4 py-3">
                          {req.rating ? (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: req.rating }, (_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">–</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Detail Panel */}
            {selectedRequest && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedRequest.requestType} — Rm {selectedRequest.room}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRequest.guestName} · {selectedRequest.createdAt}</p>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="text-muted-foreground text-sm">✕</button>
                </div>
                <p className="text-sm text-foreground mb-4 p-3 bg-secondary/30 rounded-xl">{selectedRequest.description}</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[["Priority", selectedRequest.priority], ["Channel", selectedRequest.channel], ["Assigned To", selectedRequest.assignedTo], ["Status", selectedRequest.status]].map(([k, v]) => (
                    <div key={k} className="p-3 bg-secondary/30 rounded-xl text-sm">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {selectedRequest.status !== "Resolved" && <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Mark Resolved</button>}
                  <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">Reassign</button>
                  <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200">Escalate</button>
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70 flex items-center gap-1"><Send size={14} /> Reply to Guest</button>
                </div>
              </div>
            )}
          </PageShell>
          </motion.div>
        )}

        {/* ── CONCIERGE LOG ── */}
        {activeSubmenu === "Concierge" && (
          <motion.div key="concierge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search concierge tasks..." />}
            header={<SectionHeader icon={MessageSquare} title="Concierge Log" subtitle="Guest concierge tasks and bookings" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:conciergeLog.length,label:"Total Tasks"},
              {color:"bg-emerald-500",value:conciergeLog.filter(c=>c.status==="Confirmed").length,label:"Confirmed"},
              {color:"bg-amber-500",value:conciergeLog.filter(c=>c.status==="Pending").length,label:"Pending"},
              {color:"bg-blue-500",value:conciergeLog.filter(c=>c.status==="Done").length,label:"Completed"},
              {color:"bg-rose-500",value:conciergeLog.filter(c=>c.cost).reduce((s,c)=>s+(c.cost??0),0).toLocaleString(undefined,{style:"currency",currency:"USD",maximumFractionDigits:0}),label:"Total Cost"},
            ]} />}
          >

            <div className="space-y-4">
              {conciergeLog.map(entry => {
                const statusMap: Record<string, string> = {
                  Pending: "bg-amber-100 text-amber-700",
                  Confirmed: "bg-emerald-100 text-emerald-700",
                  Done: "bg-blue-100 text-blue-700",
                };
                return (
                  <div key={entry.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{entry.requestType}</h3>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[entry.status])}>{entry.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.guestName} · Rm {entry.room} · {entry.assignedTo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{entry.bookedFor}</p>
                        {entry.cost && <p className="text-xs text-muted-foreground">BHD {entry.cost}</p>}
                      </div>
                    </div>
                    <p className="text-sm text-foreground mb-3">{entry.details}</p>
                    {entry.notes && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-800 mb-3">
                        <strong>Notes:</strong> {entry.notes}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Vendor: {entry.vendor}</span>
                      <div className="flex gap-2">
                        {entry.status === "Pending" && <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600">Confirm</button>}
                        {entry.status === "Confirmed" && <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600">Mark Done</button>}
                        <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/70">Edit</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── BROADCAST / WHATSAPP ── */}
        {activeSubmenu === "Broadcast" && (
          <motion.div key="broadcast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search broadcasts..." />}
            header={<SectionHeader icon={MessageSquare} title="Guest Broadcast Messages" subtitle="Mass communication and campaigns" />}
            kpi={<KpiStrip items={[
              {color:"bg-emerald-500",value:broadcastMessages.filter(b=>b.status==="Sent").length,label:"Sent This Month"},
              {color:"bg-blue-500",value:broadcastMessages.filter(b=>b.status==="Scheduled").length,label:"Scheduled"},
              {color:"bg-indigo-500",value:broadcastMessages.reduce((s,b)=>s+b.recipients,0),label:"Total Recipients"},
              {color:"bg-amber-500",value:`${Math.round(broadcastMessages.filter(b=>b.recipients>0).reduce((s,b)=>s+(b.opened/Math.max(b.recipients,1))*100,0)/broadcastMessages.filter(b=>b.recipients>0).length)}%`,label:"Avg Open Rate"},
              {color:"bg-rose-500",value:broadcastMessages.filter(b=>b.status==="Draft").length,label:"Drafts"},
            ]} />}
          >

            <div className="space-y-4">
              {broadcastMessages.map(msg => {
                const statusMap: Record<string, string> = {
                  Draft: "bg-slate-100 text-slate-700",
                  Scheduled: "bg-blue-100 text-blue-700",
                  Sent: "bg-emerald-100 text-emerald-700",
                  Failed: "bg-red-100 text-red-700",
                };
                const channelColor: Record<string, string> = {
                  WhatsApp: "bg-green-100 text-green-700",
                  Email: "bg-blue-100 text-blue-700",
                  SMS: "bg-purple-100 text-purple-700",
                  "In-App": "bg-indigo-100 text-indigo-700",
                };
                const openRate = msg.recipients > 0 ? Math.round((msg.opened / msg.recipients) * 100) : 0;
                const clickRate = msg.recipients > 0 ? Math.round((msg.clicked / msg.recipients) * 100) : 0;
                return (
                  <div key={msg.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{msg.title}</h3>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[msg.status])}>{msg.status}</span>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", channelColor[msg.channel])}>{msg.channel}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Audience: {msg.audience} · {msg.sentAt ? `Sent ${msg.sentAt}` : msg.scheduledAt ? `Scheduled ${msg.scheduledAt}` : "Draft"}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{msg.body}</p>
                    {msg.status === "Sent" && (
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {[
                          { label: "Recipients", value: msg.recipients, pct: 100 },
                          { label: "Opened", value: msg.opened, pct: openRate },
                          { label: "Clicked", value: msg.clicked, pct: clickRate },
                        ].map(stat => (
                          <div key={stat.label} className="p-3 bg-secondary/30 rounded-xl text-center">
                            <p className="text-lg font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label} {stat.label !== "Recipients" && `(${stat.pct}%)`}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {msg.status === "Draft" && <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center gap-1"><Send size={14} /> Send Now</button>}
                      {msg.status === "Draft" && <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">Schedule</button>}
                      <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70"><Edit2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── STAFF BRIEFINGS ── */}
        {activeSubmenu === "Staff Briefings" && (
          <motion.div key="briefings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search briefings..." />}
            header={<SectionHeader icon={MessageSquare} title="Staff Briefings" subtitle="Team communications and updates" />}
            kpi={<KpiStrip items={[
              {color:"bg-blue-500",value:staffBriefings.length,label:"Total Briefings"},
              {color:"bg-emerald-500",value:staffBriefings.filter(b=>b.status==="Published").length,label:"Published"},
              {color:"bg-amber-500",value:staffBriefings.filter(b=>b.status==="Upcoming").length,label:"Upcoming"},
              {color:"bg-purple-500",value:staffBriefings.filter(b=>b.status==="Acknowledged").length,label:"Acknowledged"},
              {color:"bg-indigo-500",value:`${Math.round(staffBriefings.reduce((s,b)=>s+(b.acknowledged/b.total)*100,0)/staffBriefings.length)}%`,label:"Avg Ack Rate"},
            ]} />}
          >

            {staffBriefings.map(brief => {
              const ackPct = Math.round((brief.acknowledged / brief.total) * 100);
              const statusMap: Record<string, string> = {
                Upcoming: "bg-blue-100 text-blue-700",
                Published: "bg-emerald-100 text-emerald-700",
                Acknowledged: "bg-purple-100 text-purple-700",
              };
              return (
                <div key={brief.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{brief.title}</h3>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[brief.status])}>{brief.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{brief.department} · {brief.date} at {brief.time} · Presented by: {brief.presenter}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1"><Download size={12} /> Export</button>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl text-sm text-foreground mb-4 leading-relaxed">{brief.content}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Departments</p>
                      <div className="flex flex-wrap gap-1">
                        {brief.attendees.map(dept => <span key={dept} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{dept}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Acknowledgement</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", ackPct === 100 ? "bg-emerald-500" : ackPct > 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${ackPct}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground">{brief.acknowledged}/{brief.total}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Attachments</p>
                      <div className="flex flex-wrap gap-1">
                        {brief.attachments.map(att => (
                          <button key={att} className="flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-lg text-xs hover:bg-secondary/70 transition-colors">
                            <FileText size={10} />{att}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {brief.status === "Upcoming" && <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Publish</button>}
                    {brief.status === "Published" && <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70 flex items-center gap-1"><Bell size={14} /> Send Reminder</button>}
                    <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70">Edit</button>
                  </div>
                </div>
              );
            })}
          </PageShell>
          </motion.div>
        )}

        {/* ── INTERNAL MESSAGING ── */}
        {activeSubmenu === "Internal Messages" && (
          <motion.div key="internal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search internal messages..." />}
            header={<SectionHeader icon={MessageSquare} title="Internal Messages" subtitle="Staff-to-staff communication" />}
            kpi={<KpiStrip items={[
              {color:"bg-blue-500",value:internalMessages.length,label:"Total Messages"},
              {color:"bg-purple-500",value:unreadMessages,label:"Unread"},
              {color:"bg-emerald-500",value:internalMessages.filter(m=>m.read).length,label:"Read"},
              {color:"bg-amber-500",value:internalMessages.filter(m=>m.priority==="High"||m.priority==="Urgent").length,label:"High Priority"},
              {color:"bg-rose-500",value:internalMessages.filter(m=>m.priority==="Urgent").length,label:"Urgent"},
            ]} />}
          >

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
              {/* Message list */}
              <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                  {internalMessages.map(msg => (
                    <div key={msg.id} className={cn("p-4 cursor-pointer hover:bg-secondary/30 transition-colors", selectedMessage?.id === msg.id && "bg-secondary/50", !msg.read && "bg-purple-50/50")} onClick={() => setSelectedMessage(msg)}>
                      <div className="flex items-start gap-2">
                        {!msg.read && <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />}
                        <div className={cn("flex-1 min-w-0", msg.read && "ml-4")}>
                          <div className="flex items-center justify-between mb-1">
                            <p className={cn("text-sm truncate", !msg.read ? "font-semibold text-foreground" : "font-medium text-foreground")}>{msg.from}</p>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{msg.sentAt.split(" ")[1]}</span>
                          </div>
                          <p className="text-xs font-medium text-foreground truncate mb-0.5">{msg.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.body.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message thread */}
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col">
                {selectedMessage ? (
                  <>
                    <div className="p-5 border-b border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{selectedMessage.subject}</h3>
                          <p className="text-sm text-muted-foreground">From: {selectedMessage.from} ({selectedMessage.fromDept}) → {selectedMessage.to} ({selectedMessage.toDept})</p>
                          <p className="text-xs text-muted-foreground">{selectedMessage.sentAt}</p>
                        </div>
                        <PriorityBadge priority={selectedMessage.priority} />
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      <div className="p-4 bg-secondary/30 rounded-xl">
                        <p className="text-sm font-medium text-foreground mb-1">{selectedMessage.from}</p>
                        <p className="text-sm text-foreground">{selectedMessage.body}</p>
                      </div>
                      {selectedMessage.thread.map((t, i) => (
                        <div key={i} className="p-4 bg-primary/10 rounded-xl ml-8">
                          <p className="text-sm font-medium text-foreground mb-1">{t.sender} · {t.time.split(" ")[1]}</p>
                          <p className="text-sm text-foreground">{t.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-border">
                      <div className="flex gap-2">
                        <input value={replyText} onChange={e => setReplyText(e.target.value)} className="flex-1 px-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Type a reply..." />
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 flex items-center gap-1.5"><Send size={14} /> Send</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                      <p>Select a message to read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── REPORTS ── */}
        {activeSubmenu === "Reports" && (
          <motion.div key="commsrep" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search reports..." />}
            header={<SectionHeader icon={MessageSquare} title="Communications Reports" subtitle="Analytics and performance metrics" />}
            kpi={<KpiStrip items={[
              {color:"bg-emerald-500",value:"4.6/5",label:"Guest Satisfaction"},
              {color:"bg-blue-500",value:"94%",label:"Request Resolution Rate"},
              {color:"bg-violet-500",value:`${avgResponseTime}m`,label:"Avg Response Time"},
              {color:"bg-rose-500",value:"2%",label:"Escalation Rate"},
              {color:"bg-indigo-500",value:guestRequests.length,label:"Total Requests"},
            ]} />}
          >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Response Time Trend (Today)" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip formatter={(v: number) => [`${v} min`, ""]} />
                    <Area type="monotone" dataKey="avg" name="Response Time" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} />
                    <Area type="monotone" dataKey="target" name="Target (15m)" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Requests by Type (Today)" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={requestsByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" name="Requests" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Request log summary */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Full Request Log" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Guest", "Room", "Request", "Priority", "Assigned", "Response Time", "Status", "Rating"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {guestRequests.map(req => (
                      <tr key={req.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{req.guestName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.room}</td>
                        <td className="px-4 py-3 text-foreground">{req.requestType}</td>
                        <td className="px-4 py-3"><PriorityBadge priority={req.priority} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{req.assignedTo}</td>
                        <td className="px-4 py-3 text-muted-foreground">{req.responseTime ? `${req.responseTime}m` : "–"}</td>
                        <td className="px-4 py-3"><RequestStatusBadge status={req.status} /></td>
                        <td className="px-4 py-3">
                          {req.rating ? (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: req.rating }, (_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                          ) : <span className="text-muted-foreground">–</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

      </AnimatePresence>
  );
}
