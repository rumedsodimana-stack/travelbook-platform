import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Calendar, Clock, Users, DollarSign, MapPin, Mic2,
  CheckCircle2, AlertCircle, Star, ChevronRight, Search,
  Filter, Plus, Edit2, Trash2, Download, Eye, Send,
  Coffee, Music, Video, Wifi, Projector, Volume2,
  Award, TrendingUp, BarChart2, FileText, Settings, Package
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface EventsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

type EventStatus = "Confirmed" | "Tentative" | "Cancelled" | "Completed" | "In Progress";
type EventType = "Wedding" | "Conference" | "Gala" | "Meeting" | "Birthday" | "Corporate" | "Exhibition" | "Seminar";
type SetupStyle = "Theatre" | "Classroom" | "Banquet" | "Cocktail" | "U-Shape" | "Boardroom" | "Cabaret";

interface HotelEvent {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  client: string;
  contact: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  attendees: number;
  capacity: number;
  setupStyle: SetupStyle;
  revenue: number;
  deposit: number;
  depositPaid: boolean;
  coordinator: string;
  notes: string;
}

interface AVEquipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  available: number;
  assignedTo: string;
  condition: "Excellent" | "Good" | "Fair" | "Needs Service";
  lastChecked: string;
  rate: number;
}

interface CateringOrder {
  id: string;
  eventId: string;
  eventName: string;
  menuType: "Breakfast" | "Lunch" | "Dinner" | "Cocktail" | "Coffee Break" | "Custom";
  items: { name: string; qty: number; unit: string; price: number }[];
  guestCount: number;
  specialRequests: string;
  status: "Draft" | "Confirmed" | "In Prep" | "Served" | "Billed";
  totalValue: number;
  scheduledTime: string;
}

interface AttendeeRecord {
  id: string;
  eventId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  rsvpStatus: "Confirmed" | "Pending" | "Declined";
  checkedIn: boolean;
  checkInTime?: string;
  tableNo?: string;
  dietaryReq: string;
  vip: boolean;
}

interface BanquetSetup {
  id: string;
  eventId: string;
  eventName: string;
  venue: string;
  setupStyle: SetupStyle;
  tables: number;
  chairs: number;
  stage: boolean;
  danceFloor: boolean;
  podium: boolean;
  dressing: string;
  setupStart: string;
  setupEnd: string;
  assignedTo: string;
  checklist: { task: string; done: boolean }[];
  status: "Pending" | "In Progress" | "Ready" | "Struck";
}

interface PostEventDebrief {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  attendedCount: number;
  expectedCount: number;
  clientRating: number;
  coordinatorNotes: string;
  issuesRaised: string[];
  followUpRequired: boolean;
  invoiceSent: boolean;
  totalBilled: number;
  totalCollected: number;
  outstanding: number;
  npsScore: number;
}

// ── Sample Data ──────────────────────────────────────────────
const eventsData: HotelEvent[] = [
  { id: "EVT001", name: "Al-Rashid Wedding Reception", type: "Wedding", status: "Confirmed", client: "Fahad Al-Rashid", contact: "+973 3321 4455", date: "2026-04-05", startTime: "18:00", endTime: "23:59", venue: "Grand Ballroom", attendees: 320, capacity: 400, setupStyle: "Banquet", revenue: 28500, deposit: 8550, depositPaid: true, coordinator: "Layla Hassan", notes: "Gold & white theme. No pork. Halal certified catering only." },
  { id: "EVT002", name: "TechForward Summit 2026", type: "Conference", status: "Confirmed", client: "TechForward Corp", contact: "+973 1700 8800", date: "2026-04-08", startTime: "08:00", endTime: "17:00", venue: "Convention Hall A", attendees: 180, capacity: 200, setupStyle: "Theatre", revenue: 14200, deposit: 4260, depositPaid: true, coordinator: "Omar Khalid", notes: "Requires 4K projector, live streaming setup, simultaneous translation." },
  { id: "EVT003", name: "Royal Bank Annual Gala", type: "Gala", status: "Confirmed", client: "Royal Bank of Bahrain", contact: "+973 1756 6600", date: "2026-04-12", startTime: "19:30", endTime: "23:00", venue: "Grand Ballroom", attendees: 250, capacity: 400, setupStyle: "Banquet", revenue: 32000, deposit: 9600, depositPaid: true, coordinator: "Layla Hassan", notes: "VIP seating plan required. DJ + live band. Red carpet entrance." },
  { id: "EVT004", name: "HR Leaders Workshop", type: "Seminar", status: "Tentative", client: "Gulf HR Association", contact: "+973 3987 2211", date: "2026-04-15", startTime: "09:00", endTime: "13:00", venue: "Meeting Room 3", attendees: 45, capacity: 50, setupStyle: "U-Shape", revenue: 3800, deposit: 1140, depositPaid: false, coordinator: "Sara Al-Mansoori", notes: "Coffee breaks at 10:30 and 12:00." },
  { id: "EVT005", name: "Sunrise Birthday Bash", type: "Birthday", status: "Confirmed", client: "Nadia Karim", contact: "+973 3645 9900", date: "2026-04-18", startTime: "20:00", endTime: "02:00", venue: "Rooftop Terrace", attendees: 80, capacity: 100, setupStyle: "Cocktail", revenue: 7500, deposit: 2250, depositPaid: true, coordinator: "Omar Khalid", notes: "Surprise setup. Pink & gold décor. Custom birthday cake." },
  { id: "EVT006", name: "Bahrain Fintech Expo", type: "Exhibition", status: "Confirmed", client: "FinConnect Ltd", contact: "+973 1788 3344", date: "2026-04-22", startTime: "10:00", endTime: "18:00", venue: "Convention Hall B", attendees: 400, capacity: 450, setupStyle: "Cabaret", revenue: 45000, deposit: 13500, depositPaid: true, coordinator: "Sara Al-Mansoori", notes: "20 exhibition booths. Requires heavy power load + fiber internet." },
  { id: "EVT007", name: "Board Strategy Retreat", type: "Meeting", status: "Completed", client: "Manazel Properties", contact: "+973 3112 7788", date: "2026-03-28", startTime: "08:00", endTime: "18:00", venue: "Executive Boardroom", attendees: 12, capacity: 14, setupStyle: "Boardroom", revenue: 4200, deposit: 1260, depositPaid: true, coordinator: "Layla Hassan", notes: "Confidential session. No external staff in room during presentations." },
  { id: "EVT008", name: "Al-Noor Corporate Dinner", type: "Corporate", status: "In Progress", client: "Al-Noor Group", contact: "+973 1744 5500", date: "2026-04-02", startTime: "19:00", endTime: "22:30", venue: "Jasmine Banquet Hall", attendees: 120, capacity: 150, setupStyle: "Banquet", revenue: 11000, deposit: 3300, depositPaid: true, coordinator: "Omar Khalid", notes: "3-course meal. Client CEO will give speech at 20:00." },
  { id: "EVT009", name: "Startup Pitch Night", type: "Corporate", status: "Tentative", client: "Bahrain Startup Hub", contact: "+973 3456 7890", date: "2026-04-25", startTime: "17:00", endTime: "21:00", venue: "Convention Hall A", attendees: 150, capacity: 200, setupStyle: "Theatre", revenue: 8500, deposit: 2550, depositPaid: false, coordinator: "Sara Al-Mansoori", notes: "Requires panel mic setup, pitch timer screen, investor lounge." },
  { id: "EVT010", name: "Luxury Brand Showcase", type: "Exhibition", status: "Confirmed", client: "LuxEdge Brands", contact: "+973 1799 1122", date: "2026-04-30", startTime: "14:00", endTime: "20:00", venue: "Grand Ballroom Foyer", attendees: 200, capacity: 250, setupStyle: "Cocktail", revenue: 18000, deposit: 5400, depositPaid: true, coordinator: "Layla Hassan", notes: "Requires ambient lighting, champagne reception, branded displays." },
];

const avEquipment: AVEquipment[] = [
  { id: "AV001", name: "4K Laser Projector", category: "Visual", quantity: 4, available: 2, assignedTo: "TechForward Summit", condition: "Excellent", lastChecked: "2026-03-30", rate: 150 },
  { id: "AV002", name: "LED Video Wall (5x3m)", category: "Visual", quantity: 2, available: 0, assignedTo: "Bahrain Fintech Expo", condition: "Excellent", lastChecked: "2026-03-28", rate: 800 },
  { id: "AV003", name: "Wireless Handheld Mic", category: "Audio", quantity: 12, available: 8, assignedTo: "Multiple", condition: "Good", lastChecked: "2026-04-01", rate: 25 },
  { id: "AV004", name: "Lapel Microphone", category: "Audio", quantity: 8, available: 5, assignedTo: "HR Workshop", condition: "Good", lastChecked: "2026-03-29", rate: 30 },
  { id: "AV005", name: "Line Array Speaker System", category: "Audio", quantity: 3, available: 1, assignedTo: "Royal Bank Gala", condition: "Excellent", lastChecked: "2026-03-31", rate: 400 },
  { id: "AV006", name: "60\" Smart Display Screen", category: "Visual", quantity: 6, available: 4, assignedTo: "HR Workshop", condition: "Good", lastChecked: "2026-03-25", rate: 80 },
  { id: "AV007", name: "Live Streaming Encoder", category: "Broadcast", quantity: 2, available: 1, assignedTo: "TechForward Summit", condition: "Excellent", lastChecked: "2026-04-01", rate: 200 },
  { id: "AV008", name: "Stage Lighting Rig", category: "Lighting", quantity: 4, available: 2, assignedTo: "Royal Bank Gala", condition: "Good", lastChecked: "2026-03-27", rate: 350 },
  { id: "AV009", name: "DJ Equipment Set", category: "Audio", quantity: 2, available: 1, assignedTo: "Sunrise Birthday", condition: "Good", lastChecked: "2026-03-20", rate: 300 },
  { id: "AV010", name: "Podium with Built-in Mic", category: "Furniture", quantity: 3, available: 2, assignedTo: "TechForward Summit", condition: "Excellent", lastChecked: "2026-04-01", rate: 50 },
  { id: "AV011", name: "Portable PA System", category: "Audio", quantity: 5, available: 3, assignedTo: "Multiple", condition: "Fair", lastChecked: "2026-03-15", rate: 120 },
  { id: "AV012", name: "Translation Receiver Units (x20)", category: "Broadcast", quantity: 2, available: 1, assignedTo: "TechForward Summit", condition: "Good", lastChecked: "2026-03-28", rate: 250 },
];

const cateringOrders: CateringOrder[] = [
  { id: "CAT001", eventId: "EVT001", eventName: "Al-Rashid Wedding", menuType: "Dinner", items: [{ name: "Mezze Platter", qty: 40, unit: "pax", price: 12 }, { name: "Grilled Ouzi Lamb", qty: 320, unit: "pax", price: 45 }, { name: "Wedding Cake (5-tier)", qty: 1, unit: "unit", price: 1200 }], guestCount: 320, specialRequests: "Halal certified. No alcohol. Nut-free section required.", status: "Confirmed", totalValue: 19140, scheduledTime: "19:30" },
  { id: "CAT002", eventId: "EVT002", eventName: "TechForward Summit", menuType: "Coffee Break", items: [{ name: "Coffee & Tea Station", qty: 180, unit: "pax", price: 8 }, { name: "Assorted Pastries", qty: 180, unit: "pax", price: 6 }, { name: "Finger Sandwiches", qty: 180, unit: "pax", price: 9 }], guestCount: 180, specialRequests: "Vegan options required. 2 breaks (10:30 and 15:00).", status: "Confirmed", totalValue: 8280, scheduledTime: "10:30" },
  { id: "CAT003", eventId: "EVT003", eventName: "Royal Bank Gala", menuType: "Dinner", items: [{ name: "Lobster Bisque", qty: 250, unit: "pax", price: 22 }, { name: "Tenderloin Steak", qty: 200, unit: "pax", price: 68 }, { name: "Salmon en Papillote", qty: 50, unit: "pax", price: 55 }, { name: "Chocolate Fondant", qty: 250, unit: "pax", price: 18 }], guestCount: 250, specialRequests: "10 guests with gluten intolerance. Premium wine pairings.", status: "Confirmed", totalValue: 40750, scheduledTime: "20:00" },
  { id: "CAT004", eventId: "EVT005", eventName: "Sunrise Birthday", menuType: "Cocktail", items: [{ name: "Canapés Selection", qty: 80, unit: "pax", price: 25 }, { name: "Birthday Cake Custom", qty: 1, unit: "unit", price: 650 }, { name: "Mocktail Bar", qty: 80, unit: "pax", price: 15 }], guestCount: 80, specialRequests: "Surprise setup — no birthday banners visible until 20:30.", status: "In Prep", totalValue: 2650, scheduledTime: "20:00" },
  { id: "CAT005", eventId: "EVT008", eventName: "Al-Noor Corporate Dinner", menuType: "Dinner", items: [{ name: "Prawn Cocktail Starter", qty: 120, unit: "pax", price: 18 }, { name: "Herb-crusted Chicken", qty: 90, unit: "pax", price: 42 }, { name: "Grilled Seabass", qty: 30, unit: "pax", price: 55 }, { name: "Crème Brûlée", qty: 120, unit: "pax", price: 14 }], guestCount: 120, specialRequests: "3-course plated service. CEO speech at 20:00 — pause service.", status: "Served", totalValue: 10170, scheduledTime: "19:30" },
];

const attendees: AttendeeRecord[] = [
  { id: "ATT001", eventId: "EVT003", name: "Sheikh Khalid Al-Zayed", company: "Royal Bank Board", email: "k.alzayed@rbb.bh", phone: "+973 3900 1100", rsvpStatus: "Confirmed", checkedIn: true, checkInTime: "19:28", tableNo: "Table 1", dietaryReq: "Halal", vip: true },
  { id: "ATT002", eventId: "EVT003", name: "Maryam Al-Dosari", company: "CEO, Royal Bank", email: "m.aldosari@rbb.bh", phone: "+973 3901 2200", rsvpStatus: "Confirmed", checkedIn: true, checkInTime: "19:35", tableNo: "Table 1", dietaryReq: "None", vip: true },
  { id: "ATT003", eventId: "EVT002", name: "James Chen", company: "TechForward Corp", email: "j.chen@techforward.com", phone: "+44 7700 900123", rsvpStatus: "Confirmed", checkedIn: true, checkInTime: "07:55", tableNo: "Row 1", dietaryReq: "Vegetarian", vip: false },
  { id: "ATT004", eventId: "EVT002", name: "Priya Sharma", company: "AI Ventures", email: "p.sharma@aiventures.io", phone: "+91 9876 543210", rsvpStatus: "Confirmed", checkedIn: false, dietaryReq: "Vegan", vip: false },
  { id: "ATT005", eventId: "EVT001", name: "Fahad Al-Rashid", company: "Groom", email: "f.alrashid@gmail.com", phone: "+973 3321 4455", rsvpStatus: "Confirmed", checkedIn: false, tableNo: "Head Table", dietaryReq: "Halal", vip: true },
  { id: "ATT006", eventId: "EVT006", name: "David Müller", company: "FinConnect EU", email: "d.muller@finconnect.eu", phone: "+49 172 3456789", rsvpStatus: "Confirmed", checkedIn: true, checkInTime: "10:05", dietaryReq: "Gluten-free", vip: true },
  { id: "ATT007", eventId: "EVT008", name: "Ahmed Al-Noor", company: "Al-Noor Group CEO", email: "a.alnoor@alnoorgroup.bh", phone: "+973 3112 7788", rsvpStatus: "Confirmed", checkedIn: true, checkInTime: "18:55", tableNo: "Head Table", dietaryReq: "Halal", vip: true },
  { id: "ATT008", eventId: "EVT004", name: "Noura Al-Mansoori", company: "Gulf HR Assoc.", email: "n.almansoori@gulfhr.org", phone: "+971 50 234 5678", rsvpStatus: "Confirmed", checkedIn: false, dietaryReq: "None", vip: false },
];

const banquetSetups: BanquetSetup[] = [
  { id: "BS001", eventId: "EVT001", eventName: "Al-Rashid Wedding", venue: "Grand Ballroom", setupStyle: "Banquet", tables: 32, chairs: 320, stage: true, danceFloor: true, podium: false, dressing: "Gold & white organza, floral centrepieces, fairy lights canopy", setupStart: "08:00", setupEnd: "15:00", assignedTo: "Banquet Team A", checklist: [{ task: "Table linen pressed & laid", done: true }, { task: "Centrepieces placed", done: true }, { task: "Stage rigged & tested", done: true }, { task: "Dance floor installed", done: true }, { task: "Lighting programmed", done: false }, { task: "Entrance red carpet laid", done: false }, { task: "Sound check", done: false }], status: "In Progress" },
  { id: "BS002", eventId: "EVT002", eventName: "TechForward Summit", venue: "Convention Hall A", setupStyle: "Theatre", tables: 0, chairs: 200, stage: true, danceFloor: false, podium: true, dressing: "Corporate blue banners, branded roll-ups", setupStart: "06:00", setupEnd: "07:30", assignedTo: "Banquet Team B", checklist: [{ task: "Chairs aligned in rows", done: true }, { task: "Stage & podium set", done: true }, { task: "AV tested", done: true }, { task: "Registration desk set up", done: true }, { task: "Coffee break station ready", done: true }, { task: "WiFi credentials distributed", done: false }], status: "Ready" },
  { id: "BS003", eventId: "EVT003", eventName: "Royal Bank Gala", venue: "Grand Ballroom", setupStyle: "Banquet", tables: 25, chairs: 250, stage: true, danceFloor: true, podium: true, dressing: "Deep red & gold, crystal chandeliers, rose centrepieces", setupStart: "09:00", setupEnd: "17:00", assignedTo: "Banquet Team A + C", checklist: [{ task: "Table linen & silverware laid", done: false }, { task: "Floral centrepieces placed", done: false }, { task: "Stage & dance floor installed", done: false }, { task: "Lighting & LEDs programmed", done: false }, { task: "Red carpet entrance", done: false }, { task: "VIP lounge dressed", done: false }, { task: "Full AV & band stage setup", done: false }], status: "Pending" },
];

const postEventDebriefs: PostEventDebrief[] = [
  { id: "PED001", eventId: "EVT007", eventName: "Board Strategy Retreat", date: "2026-03-28", attendedCount: 12, expectedCount: 12, clientRating: 5, coordinatorNotes: "Everything ran perfectly. Client very impressed with AV and food quality.", issuesRaised: ["Minor delay in lunch service (10 mins)"], followUpRequired: false, invoiceSent: true, totalBilled: 4200, totalCollected: 4200, outstanding: 0, npsScore: 9 },
  { id: "PED002", eventId: "EVT008", eventName: "Al-Noor Corporate Dinner", date: "2026-04-02", attendedCount: 110, expectedCount: 120, clientRating: 4, coordinatorNotes: "Good evening overall. 10 no-shows. CEO speech started 15 mins late.", issuesRaised: ["Main course slightly delayed", "1 mic feedback issue during speech"], followUpRequired: true, invoiceSent: false, totalBilled: 11000, totalCollected: 3300, outstanding: 7700, npsScore: 8 },
];

const revenueByMonth = [
  { month: "Nov", weddings: 28000, corporate: 18000, conferences: 12000, social: 8000 },
  { month: "Dec", weddings: 42000, corporate: 22000, conferences: 8000, social: 12000 },
  { month: "Jan", weddings: 35000, corporate: 25000, conferences: 15000, social: 9000 },
  { month: "Feb", weddings: 38000, corporate: 30000, conferences: 18000, social: 7000 },
  { month: "Mar", weddings: 31000, corporate: 28000, conferences: 22000, social: 11000 },
  { month: "Apr", weddings: 64000, corporate: 35000, conferences: 25000, social: 18000 },
];

const eventTypePie = [
  { name: "Weddings", value: 38, color: "#ec4899" },
  { name: "Corporate", value: 28, color: "#6366f1" },
  { name: "Conferences", value: 18, color: "#0ea5e9" },
  { name: "Social", value: 10, color: "#f59e0b" },
  { name: "Exhibitions", value: 6, color: "#10b981" },
];

const venueUtilization = [
  { venue: "Grand Ballroom", jan: 72, feb: 78, mar: 65, apr: 88 },
  { venue: "Convention Hall A", jan: 55, feb: 62, mar: 70, apr: 75 },
  { venue: "Convention Hall B", jan: 40, feb: 48, mar: 58, apr: 82 },
  { venue: "Jasmine Banquet", jan: 68, feb: 71, mar: 60, apr: 70 },
  { venue: "Rooftop Terrace", jan: 30, feb: 35, mar: 55, apr: 65 },
];

// ── Helper Components ────────────────────────────────────────
const StatusBadge = ({ status }: { status: EventStatus }) => {
  const map: Record<EventStatus, string> = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Tentative: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
    Completed: "bg-blue-100 text-blue-700",
    "In Progress": "bg-purple-100 text-purple-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[status])}>{status}</span>;
};

const TypeBadge = ({ type }: { type: EventType }) => {
  const map: Record<EventType, string> = {
    Wedding: "bg-pink-100 text-pink-700",
    Conference: "bg-blue-100 text-blue-700",
    Gala: "bg-purple-100 text-purple-700",
    Meeting: "bg-slate-100 text-slate-700",
    Birthday: "bg-orange-100 text-orange-700",
    Corporate: "bg-indigo-100 text-indigo-700",
    Exhibition: "bg-violet-100 text-violet-600",
    Seminar: "bg-cyan-100 text-cyan-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[type])}>{type}</span>;
};

// ── Main Component ───────────────────────────────────────────
export function Events({ aiEnabled, activeSubmenu = "Overview" }: EventsProps) {
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<HotelEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeRecord | null>(null);
  const [fxAmount, setFxAmount] = useState("1000");
  const [activeFloor, setActiveFloor] = useState("Grand Ballroom");

  const filteredEvents = eventsData.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || e.status === filterStatus;
    const matchType = filterType === "All" || e.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalRevenue = eventsData.reduce((s, e) => s + e.revenue, 0);
  const confirmed = eventsData.filter(e => e.status === "Confirmed").length;
  const tentative = eventsData.filter(e => e.status === "Tentative").length;
  const totalAttendees = eventsData.reduce((s, e) => s + e.attendees, 0);

  const venues = ["Grand Ballroom", "Convention Hall A", "Convention Hall B", "Jasmine Banquet Hall", "Rooftop Terrace", "Executive Boardroom", "Meeting Room 3"];

  // Floor plan room layout data
  const floorPlanSeats: Record<string, { tables: number; cap: number; color: string }> = {
    "Grand Ballroom": { tables: 40, cap: 500, color: "#6366f1" },
    "Convention Hall A": { tables: 0, cap: 250, color: "#0ea5e9" },
    "Convention Hall B": { tables: 20, cap: 300, color: "#0ea5e9" },
    "Jasmine Banquet Hall": { tables: 15, cap: 180, color: "#10b981" },
    "Rooftop Terrace": { tables: 10, cap: 120, color: "#f59e0b" },
    "Executive Boardroom": { tables: 1, cap: 16, color: "#ec4899" },
    "Meeting Room 3": { tables: 1, cap: 50, color: "#8b5cf6" },
  };

  return (
    <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search events..." />}
            header={<SectionHeader icon={Calendar} title="Events Overview" subtitle="Live event metrics and schedules" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:`BHD ${(totalRevenue/1000).toFixed(1)}k`,label:"Total Event Revenue"},
              {color:"bg-emerald-500",value:confirmed,label:"Confirmed Events"},
              {color:"bg-blue-500",value:totalAttendees.toLocaleString(),label:"Total Attendees"},
              {color:"bg-pink-500",value:"74%",label:"Venue Utilisation"},
              {color:"bg-amber-500",value:tentative,label:"Tentative"},
            ]} />}
          >

            {/* Revenue Chart + Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Revenue by Event Type (6 Months)" />
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip formatter={(v: number) => [`BHD ${v.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="weddings" name="Weddings" fill="#ec4899" radius={[4,4,0,0]} stackId="a" />
                    <Bar dataKey="corporate" name="Corporate" fill="#6366f1" radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="conferences" name="Conferences" fill="#0ea5e9" radius={[0,0,0,0]} stackId="a" />
                    <Bar dataKey="social" name="Social" fill="#f59e0b" radius={[4,4,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Event Mix" />
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={eventTypePie} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                      {eventTypePie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {eventTypePie.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <SectionHeader title="Upcoming & Active Events" />
                <button className="text-xs text-primary flex items-center gap-1">View All <ChevronRight size={14} /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Event", "Type", "Date & Time", "Venue", "Attendees", "Revenue", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {eventsData.filter(e => e.status !== "Completed" && e.status !== "Cancelled").map(ev => (
                      <tr key={ev.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedEvent(ev)}>
                        <td className="px-4 py-3 font-medium text-foreground">{ev.name}</td>
                        <td className="px-4 py-3"><TypeBadge type={ev.type} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.date} · {ev.startTime}–{ev.endTime}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.venue}</td>
                        <td className="px-4 py-3 text-foreground">{ev.attendees} / {ev.capacity}</td>
                        <td className="px-4 py-3 font-medium text-foreground">BHD {ev.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── EVENT TIMELINE ── */}
        {activeSubmenu === "Event Timeline" && (
          <motion.div key="timeline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search timeline..." />}
            header={<SectionHeader icon={Calendar} title="Event Timeline — April 2026" subtitle="Calendar view of scheduled events" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:eventsData.length,label:"Total Events"},
              {color:"bg-emerald-500",value:confirmed,label:"Confirmed"},
              {color:"bg-amber-500",value:tentative,label:"Tentative"},
              {color:"bg-blue-500",value:eventsData.filter(e=>e.status==="In Progress").length,label:"In Progress"},
              {color:"bg-rose-500",value:eventsData.filter(e=>e.status==="Cancelled").length,label:"Cancelled"},
            ]} />}
          >
            <div className="flex gap-2 mb-4">
                {["Week", "Month", "Quarter"].map(v => (
                  <button key={v} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", v === "Month" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>{v}</button>
                ))}
              </div>

            {/* Gantt-style grid */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  {/* Day headers */}
                  <div className="grid border-b border-border bg-secondary/30" style={{ gridTemplateColumns: "200px repeat(30, 1fr)" }}>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground">Event</div>
                    {Array.from({ length: 30 }, (_, i) => (
                      <div key={i} className={cn("py-2 text-center text-xs font-medium", i + 1 === 2 ? "text-primary font-bold" : "text-muted-foreground")}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  {/* Event rows */}
                  {eventsData.map(ev => {
                    const day = parseInt(ev.date.split("-")[2]) - 1;
                    const statusColors: Record<EventStatus, string> = {
                      Confirmed: "bg-emerald-400",
                      Tentative: "bg-amber-400",
                      "In Progress": "bg-purple-400",
                      Completed: "bg-blue-400",
                      Cancelled: "bg-red-400",
                    };
                    return (
                      <div key={ev.id} className="grid border-b border-border/50 hover:bg-secondary/20 transition-colors" style={{ gridTemplateColumns: "200px repeat(30, 1fr)" }}>
                        <div className="px-4 py-3 flex flex-col justify-center">
                          <span className="text-sm font-medium text-foreground truncate">{ev.name}</span>
                          <span className="text-xs text-muted-foreground">{ev.venue}</span>
                        </div>
                        {Array.from({ length: 30 }, (_, i) => (
                          <div key={i} className="py-3 px-0.5 flex items-center">
                            {i === day && (
                              <div className={cn("w-full h-7 rounded-md flex items-center px-2 cursor-pointer", statusColors[ev.status])}
                                style={{ minWidth: 0 }}
                                title={`${ev.name} · ${ev.startTime}–${ev.endTime}`}>
                                <span className="text-white text-[10px] font-medium truncate">{ev.attendees}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-4 border-t border-border bg-secondary/20">
                <LegendBar items={[
                  { label: "Confirmed", color: "bg-emerald-100 border-emerald-200" },
                  { label: "Tentative", color: "bg-amber-100 border-amber-200" },
                  { label: "In Progress", color: "bg-purple-100 border-purple-200" },
                  { label: "Completed", color: "bg-blue-100 border-blue-200" },
                  { label: "Cancelled", color: "bg-red-100 border-red-200" },
                ]} />
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Calendar size={18} className="text-primary" /> Today's Events — April 2, 2026</h3>
              {eventsData.filter(e => e.date === "2026-04-02").length === 0 ? (
                <p className="text-muted-foreground text-sm">No events today.</p>
              ) : (
                <div className="space-y-3">
                  {eventsData.filter(e => e.date === "2026-04-02").map(ev => (
                    <div key={ev.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-bold text-foreground">{ev.startTime}</p>
                        <p className="text-xs text-muted-foreground">{ev.endTime}</p>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ev.name}</p>
                        <p className="text-sm text-muted-foreground">{ev.venue} · {ev.attendees} guests · {ev.coordinator}</p>
                      </div>
                      <StatusBadge status={ev.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── FLOOR PLAN ── */}
        {activeSubmenu === "Floor Plan" && (
          <motion.div key="floorplan" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search venues..." />}
            header={<SectionHeader icon={Calendar} title="Floor Plan & Layout Editor" subtitle="Venue layout and seating management" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:venues.length,label:"Total Venues"},
              {color:"bg-emerald-500",value:floorPlanSeats[activeFloor]?.cap ?? 0,label:"Selected Capacity"},
              {color:"bg-blue-500",value:floorPlanSeats[activeFloor]?.tables ?? 0,label:"Tables"},
              {color:"bg-amber-500",value:eventsData.filter(e=>e.venue===activeFloor).length,label:"Booked Events"},
              {color:"bg-pink-500",value:"74%",label:"Avg Utilisation"},
            ]} />}
          >

            {/* Venue Selector */}
            <div className="flex gap-2 flex-wrap">
              {venues.map(v => (
                <button key={v} onClick={() => setActiveFloor(v)} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", activeFloor === v ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70")}>{v}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Visual Floor Plan */}
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">{activeFloor}</h3>
                  <div className="flex gap-2">
                    {["Banquet", "Theatre", "Cocktail", "U-Shape", "Boardroom"].map(s => (
                      <button key={s} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-lg text-xs hover:bg-secondary/70 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
                {/* Simulated floor plan grid */}
                <div className="relative bg-secondary/30 rounded-xl border-2 border-dashed border-border" style={{ height: 340 }}>
                  {/* Stage area */}
                  {(activeFloor === "Grand Ballroom" || activeFloor === "Convention Hall A") && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-purple-200 border-2 border-purple-400 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-700">STAGE</span>
                    </div>
                  )}
                  {/* Tables grid */}
                  {floorPlanSeats[activeFloor] && Array.from({ length: Math.min(floorPlanSeats[activeFloor].tables, 20) }, (_, i) => {
                    const col = i % 5;
                    const row = Math.floor(i / 5);
                    const bookedEventToday = eventsData.find(e => e.venue === activeFloor && e.date === "2026-04-02");
                    const isOccupied = bookedEventToday && i < Math.floor(bookedEventToday.attendees / 8);
                    return (
                      <div key={i} className={cn("absolute w-14 h-14 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                        isOccupied ? "bg-emerald-100 border-emerald-400" : "bg-white border-border hover:border-primary"
                      )} style={{ left: 40 + col * 90, top: 80 + row * 80 }}>
                        <span className="text-xs font-medium text-foreground">{i + 1}</span>
                      </div>
                    );
                  })}
                  {/* Dance floor */}
                  {activeFloor === "Grand Ballroom" && (
                    <div className="absolute bottom-12 right-8 w-32 h-24 bg-amber-100 border-2 border-amber-400 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-amber-700">DANCE FLOOR</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <LegendBar items={[
                      { label: "Occupied", color: "bg-emerald-100 border-emerald-200" },
                      { label: "Available", color: "bg-white border-border" },
                    ]} />
                  </div>
                </div>
              </div>

              {/* Venue Details */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <SectionHeader title="Venue Specs" />
                  <div className="space-y-3 text-sm">
                    {[
                      ["Capacity", `${floorPlanSeats[activeFloor]?.cap ?? 0} guests`],
                      ["Tables", `${floorPlanSeats[activeFloor]?.tables ?? 0}`],
                      ["Area", activeFloor === "Grand Ballroom" ? "850 m²" : activeFloor.includes("Convention") ? "420 m²" : "180 m²"],
                      ["Ceiling Height", activeFloor === "Grand Ballroom" ? "6.5 m" : "3.2 m"],
                      ["Natural Light", activeFloor === "Rooftop Terrace" ? "Yes" : "No"],
                      ["A/C Zones", "4"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <h3 className="font-semibold text-foreground mb-3">Events in {activeFloor}</h3>
                  <div className="space-y-2">
                    {eventsData.filter(e => e.venue === activeFloor).map(ev => (
                      <div key={ev.id} className="p-3 bg-secondary/30 rounded-xl">
                        <p className="text-sm font-medium text-foreground truncate">{ev.name}</p>
                        <p className="text-xs text-muted-foreground">{ev.date} · {ev.attendees} guests</p>
                        <div className="mt-1"><StatusBadge status={ev.status} /></div>
                      </div>
                    ))}
                    {eventsData.filter(e => e.venue === activeFloor).length === 0 && (
                      <p className="text-sm text-muted-foreground">No events booked.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── AV & EQUIPMENT ── */}
        {activeSubmenu === "AV & Equipment" && (
          <motion.div key="av" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search equipment..." />}
            header={<SectionHeader icon={Calendar} title="AV & Equipment Management" subtitle="Audio-visual inventory and allocation" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:avEquipment.reduce((s,a)=>s+a.quantity,0),label:"Total Items"},
              {color:"bg-emerald-500",value:avEquipment.reduce((s,a)=>s+a.available,0),label:"Available"},
              {color:"bg-amber-500",value:avEquipment.reduce((s,a)=>s+(a.quantity-a.available),0),label:"In Use"},
              {color:"bg-rose-500",value:avEquipment.filter(a=>a.condition==="Needs Service").length,label:"Needs Service"},
              {color:"bg-blue-500",value:avEquipment.filter(a=>a.condition==="Excellent"||a.condition==="Good").length,label:"Good Condition"},
            ]} />}
          >

            {/* Equipment table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Item", "Category", "Qty", "Available", "Assigned To", "Condition", "Rate/Day", "Last Checked"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {avEquipment.map(item => {
                      const condColor: Record<string, string> = {
                        Excellent: "bg-emerald-100 text-emerald-700",
                        Good: "bg-blue-100 text-blue-700",
                        Fair: "bg-amber-100 text-amber-700",
                        "Needs Service": "bg-red-100 text-red-700",
                      };
                      return (
                        <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                          <td className="px-4 py-3 text-foreground">{item.quantity}</td>
                          <td className="px-4 py-3">
                            <span className={cn("font-medium", item.available === 0 ? "text-red-500" : item.available < item.quantity / 2 ? "text-amber-500" : "text-emerald-500")}>{item.available}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.assignedTo}</td>
                          <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", condColor[item.condition])}>{item.condition}</span></td>
                          <td className="px-4 py-3 text-foreground">BHD {item.rate}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.lastChecked}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AV Checklist per Event */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CheckCircle2 size={18} className="text-primary" /> Equipment Assignment Checklist</h3>
              <div className="space-y-3">
                {eventsData.filter(e => e.status === "Confirmed" || e.status === "In Progress").slice(0, 4).map(ev => (
                  <div key={ev.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{ev.name}</p>
                      <p className="text-xs text-muted-foreground">{ev.date} · {ev.venue}</p>
                    </div>
                    <div className="flex gap-2">
                      {[{ icon: Video, label: "Visual" }, { icon: Volume2, label: "Audio" }, { icon: Wifi, label: "Network" }].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 rounded-lg text-xs text-emerald-700">
                          <Icon size={12} />{label}
                        </div>
                      ))}
                    </div>
                    <button className="text-xs text-primary hover:underline">Manage</button>
                  </div>
                ))}
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── CATERING ORDERS ── */}
        {activeSubmenu === "Catering Orders" && (
          <motion.div key="catering" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search catering orders..." />}
            header={<SectionHeader icon={Calendar} title="Catering Orders" subtitle="Food and beverage event orders" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:cateringOrders.length,label:"Total Orders"},
              {color:"bg-emerald-500",value:`BHD ${cateringOrders.reduce((s,o)=>s+o.totalValue,0).toLocaleString()}`,label:"Catering Revenue"},
              {color:"bg-blue-500",value:cateringOrders.reduce((s,o)=>s+o.guestCount,0).toLocaleString(),label:"Guests to Serve"},
              {color:"bg-amber-500",value:cateringOrders.filter(o=>o.status==="Draft").length,label:"Pending Confirmation"},
              {color:"bg-rose-500",value:cateringOrders.filter(o=>o.status==="In Prep").length,label:"In Prep"},
            ]} />}
          >

            {/* Summary KPIs kept as inline cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Orders", value: cateringOrders.length, color: "text-indigo-600" },
                { label: "Catering Revenue", value: `BHD ${cateringOrders.reduce((s, o) => s + o.totalValue, 0).toLocaleString()}`, color: "text-emerald-600" },
                { label: "Guests to Serve", value: cateringOrders.reduce((s, o) => s + o.guestCount, 0).toLocaleString(), color: "text-blue-600" },
                { label: "Pending Confirmation", value: cateringOrders.filter(o => o.status === "Draft").length, color: "text-amber-600" },
              ].map(c => (
                <div key={c.label} className="bg-card rounded-2xl shadow-sm border border-border p-4">
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className={cn("text-2xl font-bold mt-1", c.color)}>{c.value}</p>
                </div>
              ))}
            </div>

            {/* Orders */}
            <div className="space-y-4">
              {cateringOrders.map(order => {
                const statusColor: Record<string, string> = {
                  Draft: "bg-slate-100 text-slate-700",
                  Confirmed: "bg-emerald-100 text-emerald-700",
                  "In Prep": "bg-amber-100 text-amber-700",
                  Served: "bg-blue-100 text-blue-700",
                  Billed: "bg-purple-100 text-purple-700",
                };
                return (
                  <div key={order.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{order.eventName}</h3>
                          <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusColor[order.status])}>{order.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.menuType} · {order.guestCount} guests · Scheduled: {order.scheduledTime}</p>
                      </div>
                      <p className="font-bold text-foreground text-lg">BHD {order.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {["Item", "Qty", "Unit", "Unit Price", "Total"].map(h => <th key={h} className="pb-2 text-left text-xs text-muted-foreground font-medium">{h}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {order.items.map((item, i) => (
                            <tr key={i}>
                              <td className="py-2 text-foreground">{item.name}</td>
                              <td className="py-2 text-foreground">{item.qty}</td>
                              <td className="py-2 text-muted-foreground">{item.unit}</td>
                              <td className="py-2 text-foreground">BHD {item.price}</td>
                              <td className="py-2 font-medium text-foreground">BHD {(item.qty * item.price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {order.specialRequests && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                        <strong>Special Requests:</strong> {order.specialRequests}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      {order.status === "Draft" && <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">Confirm Order</button>}
                      {order.status === "Confirmed" && <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">Mark In Prep</button>}
                      <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70 transition-colors">Edit</button>
                      <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70 transition-colors">Print Order</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── ATTENDANCE ── */}
        {activeSubmenu === "Attendance" && (
          <motion.div key="attendance" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search attendees..." />}
            header={<SectionHeader icon={Calendar} title="Attendance & Guest Check-In" subtitle="RSVP tracking and event check-in" />}
            kpi={<KpiStrip items={[
              {color:"bg-blue-500",value:attendees.length,label:"Total RSVPs"},
              {color:"bg-emerald-500",value:attendees.filter(a=>a.checkedIn).length,label:"Checked In"},
              {color:"bg-amber-500",value:attendees.filter(a=>a.vip).length,label:"VIP Guests"},
              {color:"bg-rose-500",value:attendees.filter(a=>!a.checkedIn&&a.rsvpStatus==="Confirmed").length,label:"No-Shows"},
              {color:"bg-indigo-500",value:attendees.filter(a=>a.rsvpStatus==="Pending").length,label:"Pending RSVP"},
            ]} />}
          >

            {/* Event selector */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">Filter by Event:</span>
                {eventsData.map(ev => (
                  <button key={ev.id} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-xs font-medium hover:bg-secondary/70 transition-colors">{ev.name.substring(0, 20)}...</button>
                ))}
              </div>
            </div>

            {/* Attendee table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Name", "Event", "Company", "RSVP", "Check-In", "Table", "Dietary", "VIP"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {attendees.map(att => (
                      <tr key={att.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedAttendee(att)}>
                        <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2 mt-0.5">
                          {att.vip && <Star size={12} className="text-amber-500 fill-amber-500 flex-shrink-0" />}
                          {att.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{eventsData.find(e => e.id === att.eventId)?.name.substring(0, 22)}...</td>
                        <td className="px-4 py-3 text-muted-foreground">{att.company}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", att.rsvpStatus === "Confirmed" ? "bg-emerald-100 text-emerald-700" : att.rsvpStatus === "Declined" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>{att.rsvpStatus}</span>
                        </td>
                        <td className="px-4 py-3">
                          {att.checkedIn ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs"><CheckCircle2 size={14} /> {att.checkInTime}</span>
                          ) : (
                            <span className="text-muted-foreground text-xs">–</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{att.tableNo || "–"}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{att.dietaryReq || "None"}</td>
                        <td className="px-4 py-3">{att.vip ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">VIP</span> : "–"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── BANQUET SETUP ── */}
        {activeSubmenu === "Banquet Setup" && (
          <motion.div key="banquet" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search setups..." />}
            header={<SectionHeader icon={Calendar} title="Banquet Setup Management" subtitle="Setup briefs and checklists" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:banquetSetups.length,label:"Total Setups"},
              {color:"bg-emerald-500",value:banquetSetups.filter(b=>b.status==="Ready").length,label:"Ready"},
              {color:"bg-amber-500",value:banquetSetups.filter(b=>b.status==="In Progress").length,label:"In Progress"},
              {color:"bg-blue-500",value:banquetSetups.filter(b=>b.status==="Pending").length,label:"Pending"},
              {color:"bg-rose-500",value:banquetSetups.filter(b=>b.status==="Struck").length||0,label:"Struck"},
            ]} />}
          >

            {banquetSetups.map(setup => {
              const doneCount = setup.checklist.filter(t => t.done).length;
              const pct = Math.round((doneCount / setup.checklist.length) * 100);
              const statusMap: Record<string, string> = {
                Ready: "bg-emerald-100 text-emerald-700",
                "In Progress": "bg-amber-100 text-amber-700",
                Pending: "bg-slate-100 text-slate-700",
                Struck: "bg-blue-100 text-blue-700",
              };
              return (
                <div key={setup.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{setup.eventName}</h3>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[setup.status])}>{setup.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{setup.venue} · {setup.setupStyle} · Setup: {setup.setupStart}–{setup.setupEnd} · {setup.assignedTo}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1"><Edit2 size={12} /> Edit</button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-sm">
                    {[
                      { label: "Tables", value: setup.tables },
                      { label: "Chairs", value: setup.chairs },
                      { label: "Stage", value: setup.stage ? "Yes" : "No" },
                      { label: "Dance Floor", value: setup.danceFloor ? "Yes" : "No" },
                    ].map(item => (
                      <div key={item.label} className="p-3 bg-secondary/30 rounded-xl">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {setup.dressing && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-800">
                      <strong>Décor/Dressing:</strong> {setup.dressing}
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">Setup Checklist</p>
                      <span className="text-sm text-muted-foreground">{doneCount}/{setup.checklist.length} complete</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {setup.checklist.map((task, i) => (
                      <div key={i} className={cn("flex items-center gap-2 p-2.5 rounded-lg text-sm", task.done ? "bg-emerald-50" : "bg-secondary/30")}>
                        {task.done ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> : <AlertCircle size={16} className="text-muted-foreground flex-shrink-0" />}
                        <span className={task.done ? "text-emerald-700 line-through" : "text-foreground"}>{task.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </PageShell>
          </motion.div>
        )}

        {/* ── POST-EVENT DEBRIEF ── */}
        {activeSubmenu === "Post-Event" && (
          <motion.div key="postevent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search debriefs..." />}
            header={<SectionHeader icon={Calendar} title="Post-Event Debrief & Billing" subtitle="Event reviews and financial reconciliation" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:postEventDebriefs.length,label:"Total Debriefs"},
              {color:"bg-emerald-500",value:postEventDebriefs.filter(d=>d.clientRating>=4).length,label:"High Rated"},
              {color:"bg-blue-500",value:`BHD ${postEventDebriefs.reduce((s,d)=>s+d.totalBilled,0).toLocaleString()}`,label:"Total Billed"},
              {color:"bg-amber-500",value:`BHD ${postEventDebriefs.reduce((s,d)=>s+d.totalCollected,0).toLocaleString()}`,label:"Total Collected"},
              {color:"bg-rose-500",value:`BHD ${postEventDebriefs.reduce((s,d)=>s+(d.totalBilled-d.totalCollected),0).toLocaleString()}`,label:"Outstanding"},
            ]} />}
          >

            {postEventDebriefs.map(debrief => {
              const attendancePct = Math.round((debrief.attendedCount / debrief.expectedCount) * 100);
              const collectionPct = Math.round((debrief.totalCollected / debrief.totalBilled) * 100);
              return (
                <div key={debrief.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{debrief.eventName}</h3>
                      <p className="text-sm text-muted-foreground">{debrief.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={16} className={i < debrief.clientRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />
                      ))}
                      <span className="ml-1 text-sm font-medium text-foreground">{debrief.clientRating}/5</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    {[
                      { label: "Attendance", value: `${debrief.attendedCount}/${debrief.expectedCount}`, sub: `${attendancePct}%`, color: attendancePct >= 90 ? "text-emerald-600" : "text-amber-600" },
                      { label: "NPS Score", value: debrief.npsScore, sub: debrief.npsScore >= 9 ? "Promoter" : debrief.npsScore >= 7 ? "Passive" : "Detractor", color: debrief.npsScore >= 9 ? "text-emerald-600" : "text-amber-600" },
                      { label: "Total Billed", value: `BHD ${debrief.totalBilled.toLocaleString()}`, sub: "", color: "text-foreground" },
                      { label: "Outstanding", value: `BHD ${debrief.outstanding.toLocaleString()}`, sub: `${collectionPct}% collected`, color: debrief.outstanding > 0 ? "text-red-600" : "text-emerald-600" },
                    ].map(item => (
                      <div key={item.label} className="p-4 bg-secondary/30 rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
                        {item.sub && <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>}
                      </div>
                    ))}
                  </div>
                  {debrief.coordinatorNotes && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">Coordinator Notes</p>
                      <p className="text-sm text-blue-700">{debrief.coordinatorNotes}</p>
                    </div>
                  )}
                  {debrief.issuesRaised.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
                      <p className="text-sm font-medium text-amber-800 mb-2">Issues Raised</p>
                      {debrief.issuesRaised.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-amber-700">
                          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {!debrief.invoiceSent && <button className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors flex items-center gap-1"><Send size={14} /> Send Invoice</button>}
                    {debrief.outstanding > 0 && <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">Chase Payment</button>}
                    <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70 transition-colors">View Full Report</button>
                    {debrief.followUpRequired && <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">Follow-Up Required</span>}
                  </div>
                </div>
              );
            })}

            {/* Empty state for events without debrief */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Events Awaiting Debrief" />
              <div className="space-y-2">
                {eventsData.filter(e => e.status === "Confirmed" && !postEventDebriefs.find(d => d.eventId === e.id)).slice(0, 3).map(ev => (
                  <div key={ev.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-foreground">{ev.name}</p>
                      <p className="text-xs text-muted-foreground">{ev.date} · {ev.attendees} guests</p>
                    </div>
                    <button className="text-xs text-primary hover:underline">Start Debrief</button>
                  </div>
                ))}
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── ALL EVENTS (Event List) ── */}
        {activeSubmenu === "All Events" && (
          <motion.div key="allevents" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search all events..." />}
            header={<SectionHeader icon={Calendar} title="All Events" subtitle="Complete event directory" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:eventsData.length,label:"Total Events"},
              {color:"bg-emerald-500",value:confirmed,label:"Confirmed"},
              {color:"bg-amber-500",value:tentative,label:"Tentative"},
              {color:"bg-blue-500",value:eventsData.filter(e=>e.status==="Completed").length,label:"Completed"},
              {color:"bg-rose-500",value:eventsData.filter(e=>e.status==="Cancelled").length,label:"Cancelled"},
            ]} />}
          >

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
              <div className="flex flex-wrap items-center gap-3">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {["All", "Confirmed", "Tentative", "In Progress", "Completed", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {["All", "Wedding", "Conference", "Gala", "Meeting", "Birthday", "Corporate", "Exhibition", "Seminar"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Full table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Event", "Type", "Client", "Date", "Venue", "Attendees", "Revenue", "Deposit", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredEvents.map(ev => (
                      <tr key={ev.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{ev.name}</p>
                          <p className="text-xs text-muted-foreground">{ev.startTime}–{ev.endTime} · {ev.coordinator}</p>
                        </td>
                        <td className="px-4 py-3"><TypeBadge type={ev.type} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.client}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.date}</td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.venue}</td>
                        <td className="px-4 py-3 text-foreground">
                          <div className="flex flex-col">
                            <span>{ev.attendees}/{ev.capacity}</span>
                            <div className="h-1.5 bg-secondary rounded-full mt-1 w-16">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${(ev.attendees / ev.capacity) * 100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">BHD {ev.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ev.depositPaid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>{ev.depositPaid ? "Paid" : "Pending"}</span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredEvents.length} of {eventsData.length} events</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map(p => <button key={p} className={cn("w-8 h-8 rounded-lg text-sm font-medium", p === 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>{p}</button>)}
                </div>
              </div>
            </div>

            {/* Event Detail Panel */}
            {selectedEvent && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedEvent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedEvent.date} · {selectedEvent.venue}</p>
                  </div>
                  <button onClick={() => setSelectedEvent(null)} className="text-muted-foreground hover:text-foreground text-sm">✕ Close</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  {[["Client", selectedEvent.client], ["Contact", selectedEvent.contact], ["Setup Style", selectedEvent.setupStyle], ["Coordinator", selectedEvent.coordinator], ["Start Time", selectedEvent.startTime], ["End Time", selectedEvent.endTime], ["Deposit", `BHD ${selectedEvent.deposit.toLocaleString()} (${selectedEvent.depositPaid ? "Paid" : "Pending"})`], ["Revenue", `BHD ${selectedEvent.revenue.toLocaleString()}`]].map(([k, v]) => (
                    <div key={k} className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                {selectedEvent.notes && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                    <strong>Notes:</strong> {selectedEvent.notes}
                  </div>
                )}
              </div>
            )}
          </PageShell>
          </motion.div>
        )}

        {/* ── REPORTS ── */}
        {activeSubmenu === "Reports" && (
          <motion.div key="evtreports" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search reports..." />}
            header={<SectionHeader icon={Calendar} title="Events Reports & Analytics" subtitle="Performance metrics and trends" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:"BHD 172,400",label:"YTD Events Revenue"},
              {color:"bg-emerald-500",value:"BHD 17,200",label:"Avg Revenue/Event"},
              {color:"bg-blue-500",value:"81%",label:"Avg Attendance Rate"},
              {color:"bg-amber-500",value:"4.6/5",label:"Client Satisfaction"},
              {color:"bg-pink-500",value:eventsData.length,label:"Total Events"},
            ]} />}
          >

            {/* KPI Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "YTD Events Revenue", value: "BHD 172,400", change: "+24%", up: true },
                { label: "Avg Revenue/Event", value: "BHD 17,200", change: "+8%", up: true },
                { label: "Avg Attendance Rate", value: "81%", change: "+3%", up: true },
                { label: "Client Satisfaction", value: "4.6/5", change: "+0.2", up: true },
              ].map(k => (
                <div key={k.label} className="bg-card rounded-2xl shadow-sm border border-border p-4">
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{k.value}</p>
                  <p className={cn("text-xs mt-1 font-medium", k.up ? "text-emerald-600" : "text-red-500")}>{k.up ? "↑" : "↓"} {k.change} vs last quarter</p>
                </div>
              ))}
            </div>

            {/* Revenue trend */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Revenue by Event Category (6 Months)" />
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <Tooltip formatter={(v: number) => [`BHD ${v.toLocaleString()}`, ""]} />
                  <Legend />
                  <Area type="monotone" dataKey="weddings" name="Weddings" stroke="#ec4899" fill="#fce7f3" strokeWidth={2} />
                  <Area type="monotone" dataKey="corporate" name="Corporate" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} />
                  <Area type="monotone" dataKey="conferences" name="Conferences" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Venue utilization */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Venue Utilization by Month (%)" />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={venueUtilization}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="venue" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend />
                  <Bar dataKey="jan" name="Jan" fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar dataKey="feb" name="Feb" fill="#0ea5e9" radius={[4,4,0,0]} />
                  <Bar dataKey="mar" name="Mar" fill="#10b981" radius={[4,4,0,0]} />
                  <Bar dataKey="apr" name="Apr" fill="#f59e0b" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top events by revenue */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Top Events by Revenue" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Event", "Type", "Date", "Attendees", "Revenue", "Deposit", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[...eventsData].sort((a, b) => b.revenue - a.revenue).map(ev => (
                      <tr key={ev.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{ev.name}</td>
                        <td className="px-4 py-3"><TypeBadge type={ev.type} /></td>
                        <td className="px-4 py-3 text-muted-foreground">{ev.date}</td>
                        <td className="px-4 py-3 text-foreground">{ev.attendees}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">BHD {ev.revenue.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", ev.depositPaid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>{ev.depositPaid ? "Paid" : "Pending"}</span>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={ev.status} /></td>
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
