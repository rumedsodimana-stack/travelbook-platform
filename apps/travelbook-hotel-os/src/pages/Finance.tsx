import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie,
} from "recharts";
import {
  DollarSign, TrendingUp, TrendingDown, FileText, CheckCircle2,
  AlertTriangle, Clock, Search, Plus, Download, RefreshCw, Eye,
  Edit2, ChevronDown, ArrowUpRight, ArrowDownRight, Banknote,
  CreditCard, Receipt, BookOpen, BarChart2, Shield, Globe,
  Calculator, Building, Calendar, Filter, XCircle, Wallet,
} from "lucide-react";
import { cn } from "../lib/utils";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface FinanceProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

interface DailyRevenue {
  date: string; rooms: number; fb: number; spa: number;
  events: number; other: number; total: number;
}

interface Folio {
  id: string; guestName: string; room: string; checkIn: string;
  checkOut: string; charges: number; payments: number;
  balance: number; status: "Open" | "Closed" | "Disputed";
}

interface AREntry {
  id: string; company: string; invoiceNo: string; amount: number;
  invoiceDate: string; dueDate: string; daysOverdue: number;
  status: "Current" | "Overdue 30" | "Overdue 60" | "Overdue 90+";
}

interface APEntry {
  id: string; supplier: string; invoiceNo: string; amount: number;
  invoiceDate: string; dueDate: string; category: string;
  status: "Pending" | "Approved" | "Paid" | "Disputed";
}

interface CashierBalance {
  id: string; cashier: string; shift: string; openingFloat: number;
  cashIn: number; cashOut: number; closingBalance: number;
  variance: number; status: "Balanced" | "Surplus" | "Short";
}

interface BudgetLine {
  department: string; budgeted: number; actual: number;
  variance: number; variancePct: number;
}

const revenueByDay: DailyRevenue[] = [
  { date: "Mar 27", rooms: 12400, fb: 4200, spa: 1100, events: 800, other: 300, total: 18800 },
  { date: "Mar 28", rooms: 13200, fb: 3900, spa: 950, events: 2200, other: 350, total: 20600 },
  { date: "Mar 29", rooms: 11800, fb: 4600, spa: 1300, events: 0, other: 420, total: 18120 },
  { date: "Mar 30", rooms: 14500, fb: 5100, spa: 1600, events: 3500, other: 500, total: 25200 },
  { date: "Mar 31", rooms: 15200, fb: 5800, spa: 2100, events: 1200, other: 600, total: 24900 },
  { date: "Apr 1", rooms: 16100, fb: 6200, spa: 1800, events: 2800, other: 700, total: 27600 },
  { date: "Apr 2", rooms: 14800, fb: 4900, spa: 1400, events: 0, other: 450, total: 21550 },
];

const folios: Folio[] = [
  { id: "FO2001", guestName: "Sarah Al-Rashid", room: "412", checkIn: "2026-03-31", checkOut: "2026-04-05", charges: 2450, payments: 2450, balance: 0, status: "Closed" },
  { id: "FO2002", guestName: "James Harrington", room: "301", checkIn: "2026-04-01", checkOut: "2026-04-06", charges: 1850, payments: 500, balance: 1350, status: "Open" },
  { id: "FO2003", guestName: "Mohammed Yasir", room: "117", checkIn: "2026-03-30", checkOut: "2026-04-03", charges: 3200, payments: 3200, balance: 0, status: "Closed" },
  { id: "FO2004", guestName: "Elena Marchetti", room: "501", checkIn: "2026-04-02", checkOut: "2026-04-08", charges: 4800, payments: 0, balance: 4800, status: "Open" },
  { id: "FO2005", guestName: "Nguyen Family", room: "322", checkIn: "2026-03-29", checkOut: "2026-04-02", charges: 1200, payments: 800, balance: 400, status: "Disputed" },
  { id: "FO2006", guestName: "David Chen", room: "215", checkIn: "2026-04-02", checkOut: "2026-04-04", charges: 760, payments: 760, balance: 0, status: "Closed" },
  { id: "FO2007", guestName: "Fatima Binte Sari", room: "409", checkIn: "2026-04-01", checkOut: "2026-04-07", charges: 2100, payments: 1000, balance: 1100, status: "Open" },
  { id: "FO2008", guestName: "Raj Patel", room: "118", checkIn: "2026-04-02", checkOut: "2026-04-03", charges: 350, payments: 350, balance: 0, status: "Closed" },
];

const arEntries: AREntry[] = [
  { id: "AR001", company: "Gulf Air Corporate", invoiceNo: "INV-2026-0341", amount: 12400, invoiceDate: "2026-03-01", dueDate: "2026-03-31", daysOverdue: 2, status: "Overdue 30" },
  { id: "AR002", company: "Bahrain Petroleum Co", invoiceNo: "INV-2026-0342", amount: 8750, invoiceDate: "2026-03-15", dueDate: "2026-04-14", daysOverdue: 0, status: "Current" },
  { id: "AR003", company: "ALBA (Aluminium Bahrain)", invoiceNo: "INV-2026-0331", amount: 23000, invoiceDate: "2026-01-15", dueDate: "2026-02-14", daysOverdue: 47, status: "Overdue 60" },
  { id: "AR004", company: "Bahrain Tourism Authority", invoiceNo: "INV-2026-0308", amount: 5600, invoiceDate: "2026-03-20", dueDate: "2026-04-19", daysOverdue: 0, status: "Current" },
  { id: "AR005", company: "NBB Bank — Events", invoiceNo: "INV-2026-0289", amount: 41200, invoiceDate: "2025-12-01", dueDate: "2025-12-31", daysOverdue: 93, status: "Overdue 90+" },
  { id: "AR006", company: "Zain Telecom", invoiceNo: "INV-2026-0350", amount: 3300, invoiceDate: "2026-04-01", dueDate: "2026-05-01", daysOverdue: 0, status: "Current" },
];

const apEntries: APEntry[] = [
  { id: "AP001", supplier: "Al-Rashid Food Supplies", invoiceNo: "SUP-1201", amount: 4500, invoiceDate: "2026-03-28", dueDate: "2026-04-07", category: "F&B", status: "Pending" },
  { id: "AP002", supplier: "Bahrain Laundry Services", invoiceNo: "SUP-0882", amount: 1800, invoiceDate: "2026-04-01", dueDate: "2026-04-11", category: "Housekeeping", status: "Approved" },
  { id: "AP003", supplier: "Gulf Power Solutions", invoiceNo: "SUP-2203", amount: 11200, invoiceDate: "2026-03-25", dueDate: "2026-04-05", category: "Engineering", status: "Paid" },
  { id: "AP004", supplier: "Zainab Amenities LLC", invoiceNo: "SUP-0643", amount: 2300, invoiceDate: "2026-04-01", dueDate: "2026-04-15", category: "Housekeeping", status: "Pending" },
  { id: "AP005", supplier: "Al-Noor Linens", invoiceNo: "SUP-1099", amount: 5600, invoiceDate: "2026-03-20", dueDate: "2026-04-04", category: "Housekeeping", status: "Disputed" },
  { id: "AP006", supplier: "Prestige Uniforms", invoiceNo: "SUP-0781", amount: 3400, invoiceDate: "2026-03-30", dueDate: "2026-04-20", category: "HR", status: "Approved" },
  { id: "AP007", supplier: "Bapco Fuel", invoiceNo: "SUP-3301", amount: 1100, invoiceDate: "2026-04-01", dueDate: "2026-04-10", category: "Engineering", status: "Paid" },
];

const cashierBalances: CashierBalance[] = [
  { id: "C01", cashier: "Ahmed Al-Mansouri", shift: "Morning", openingFloat: 500, cashIn: 8420, cashOut: 2100, closingBalance: 6820, variance: 0, status: "Balanced" },
  { id: "C02", cashier: "James Harrington", shift: "Afternoon", openingFloat: 500, cashIn: 4350, cashOut: 1200, closingBalance: 3656, variance: -6, status: "Short" },
  { id: "C03", cashier: "Aisha Khan", shift: "Night", openingFloat: 300, cashIn: 1100, cashOut: 800, closingBalance: 602, variance: 2, status: "Surplus" },
];

const budgetVsActual: BudgetLine[] = [
  { department: "Rooms", budgeted: 320000, actual: 328500, variance: 8500, variancePct: 2.7 },
  { department: "F&B", budgeted: 95000, actual: 88200, variance: -6800, variancePct: -7.2 },
  { department: "Spa & Wellness", budgeted: 28000, actual: 31400, variance: 3400, variancePct: 12.1 },
  { department: "Events & Banquets", budgeted: 55000, actual: 62100, variance: 7100, variancePct: 12.9 },
  { department: "Housekeeping", budgeted: -48000, actual: -51200, variance: -3200, variancePct: -6.7 },
  { department: "Engineering", budgeted: -35000, actual: -32800, variance: 2200, variancePct: 6.3 },
  { department: "Sales & Marketing", budgeted: -22000, actual: -24500, variance: -2500, variancePct: -11.4 },
  { department: "HR & Admin", budgeted: -55000, actual: -53200, variance: 1800, variancePct: 3.3 },
];

const fxRates = [
  { currency: "USD", buy: 0.378, sell: 0.376, flag: "🇺🇸" },
  { currency: "EUR", buy: 0.412, sell: 0.408, flag: "🇪🇺" },
  { currency: "GBP", buy: 0.485, sell: 0.479, flag: "🇬🇧" },
  { currency: "SAR", buy: 10.04, sell: 9.96, flag: "🇸🇦" },
  { currency: "AED", buy: 1.388, sell: 1.374, flag: "🇦🇪" },
  { currency: "INR", buy: 31.5, sell: 31.1, flag: "🇮🇳" },
  { currency: "KWD", buy: 0.116, sell: 0.114, flag: "🇰🇼" },
  { currency: "LKR", buy: 112.5, sell: 110.8, flag: "🇱🇰" },
];

const nightAuditChecklist = [
  { task: "Post room charges for all occupied rooms", done: true },
  { task: "Run no-show report and post no-show fees", done: true },
  { task: "Reconcile point-of-sale terminals", done: true },
  { task: "Balance cashier float — all shifts", done: true },
  { task: "Close daily revenue journals", done: true },
  { task: "Print end-of-day statistics report", done: false },
  { task: "Run trial balance report", done: false },
  { task: "Back up all daily transactions", done: false },
  { task: "Email daily revenue report to GM & Finance", done: false },
  { task: "Roll system date to next day", done: false },
];

const revenueByChannel = [
  { name: "Direct", value: 42, color: "#3b82f6" },
  { name: "OTA", value: 31, color: "#8b5cf6" },
  { name: "Corporate", value: 18, color: "#10b981" },
  { name: "GDS", value: 6, color: "#f59e0b" },
  { name: "Walk-in", value: 3, color: "#6b7280" },
];

const getFolioStatusColor = (s: Folio["status"]) => {
  switch (s) {
    case "Open": return "bg-blue-100 text-blue-700";
    case "Closed": return "bg-emerald-100 text-emerald-700";
    case "Disputed": return "bg-red-100 text-red-700";
  }
};

const getARStatusColor = (s: AREntry["status"]) => {
  switch (s) {
    case "Current": return "bg-emerald-100 text-emerald-700";
    case "Overdue 30": return "bg-amber-100 text-amber-700";
    case "Overdue 60": return "bg-orange-100 text-orange-700";
    case "Overdue 90+": return "bg-red-100 text-red-700";
  }
};

const getAPStatusColor = (s: APEntry["status"]) => {
  switch (s) {
    case "Paid": return "bg-emerald-100 text-emerald-700";
    case "Approved": return "bg-blue-100 text-blue-700";
    case "Pending": return "bg-amber-100 text-amber-700";
    case "Disputed": return "bg-red-100 text-red-700";
  }
};

export function Finance({ aiEnabled, activeSubmenu = "Overview" }: FinanceProps) {
  const [arFilter, setArFilter] = useState("All");
  const [apFilter, setApFilter] = useState("All");
  const [folioSearch, setFolioSearch] = useState("");
  const [search, setSearch] = useState("");

  const todayRevenue = revenueByDay[revenueByDay.length - 1];
  const totalAR = arEntries.reduce((s, a) => s + a.amount, 0);
  const totalAP = apEntries.filter(a => a.status !== "Paid").reduce((s, a) => s + a.amount, 0);

  return (
    <AnimatePresence mode="wait">
        {/* OVERVIEW */}
        {activeSubmenu === "Overview" && (
          <motion.div key="Overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search finance..." />}
              header={<SectionHeader title="Overview" subtitle={`Today's financial snapshot — ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}`} icon={Wallet} actions={<div className="flex gap-2"><button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><RefreshCw className="w-4 h-4" /> Refresh</button><button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><Download className="w-4 h-4" /> Export</button></div>} />}
              kpi={<KpiStrip items={[
                {color:"bg-emerald-500",value:`BHD ${todayRevenue.total.toLocaleString()}`,label:"Today's Revenue"},
                {color:"bg-blue-500",value:`BHD ${todayRevenue.rooms.toLocaleString()}`,label:"Room Revenue"},
                {color:"bg-amber-500",value:`BHD ${totalAR.toLocaleString()}`,label:"Outstanding AR"},
                {color:"bg-rose-500",value:`BHD ${totalAP.toLocaleString()}`,label:"Payables Due"},
                {color:"bg-violet-500",value:`BHD ${todayRevenue.fb.toLocaleString()}`,label:"F&B Revenue"},
              ]} />}
            >

            {/* Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-6">
                <SectionHeader title="Revenue by Department — 7 Days" />
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueByDay} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [`BHD ${v.toLocaleString()}`, ""]} />
                    <Bar dataKey="rooms" name="Rooms" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="fb" name="F&B" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="spa" name="Spa" stackId="a" fill="#8b5cf6" />
                    <Bar dataKey="events" name="Events" stackId="a" fill="#10b981" />
                    <Bar dataKey="other" name="Other" stackId="a" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <SectionHeader title="Revenue by Channel" />
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={revenueByChannel} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {revenueByChannel.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {revenueByChannel.map(ch => (
                    <div key={ch.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{ background: ch.color }} />{ch.name}</span>
                      <span className="font-medium text-foreground">{ch.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Today's Revenue Breakdown */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <SectionHeader title="Today's Revenue Breakdown" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Rooms", value: todayRevenue.rooms, pct: Math.round((todayRevenue.rooms / todayRevenue.total) * 100), color: "bg-blue-500" },
                  { label: "F&B", value: todayRevenue.fb, pct: Math.round((todayRevenue.fb / todayRevenue.total) * 100), color: "bg-amber-500" },
                  { label: "Spa", value: todayRevenue.spa, pct: Math.round((todayRevenue.spa / todayRevenue.total) * 100), color: "bg-purple-500" },
                  { label: "Events", value: todayRevenue.events, pct: Math.round((todayRevenue.events / todayRevenue.total) * 100), color: "bg-emerald-500" },
                  { label: "Other", value: todayRevenue.other, pct: Math.round((todayRevenue.other / todayRevenue.total) * 100), color: "bg-muted0" },
                ].map(item => (
                  <div key={item.label} className="bg-secondary/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold text-foreground">BHD {item.value.toLocaleString()}</p>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className={cn("h-1.5 rounded-full", item.color)} style={{ width: `${item.pct}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground">{item.pct}% of total</p>
                  </div>
                ))}
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* NIGHT AUDIT */}
        {activeSubmenu === "Night Audit" && (
          <motion.div key="Night Audit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search audit..." />}
              header={<SectionHeader title="Night Audit" subtitle={`April 2, 2026 — ${nightAuditChecklist.filter(t => t.done).length}/${nightAuditChecklist.length} tasks complete`} icon={Wallet} actions={<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><CheckCircle2 className="w-4 h-4" /> Run Audit</button>} />}
              kpi={<KpiStrip items={[{color:"bg-emerald-500",value:nightAuditChecklist.filter(t => t.done).length,label:"Completed"},{color:"bg-slate-500",value:nightAuditChecklist.filter(t => !t.done).length,label:"Remaining"},{color:"bg-blue-500",value:nightAuditChecklist.length,label:"Total Tasks"},{color:"bg-amber-500",value:`BHD ${todayRevenue.total.toLocaleString()}`,label:"Day Revenue"},{color:"bg-violet-500",value:"128,200",label:"Trial Balance"}]} />}
            >

            {/* Progress */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Audit Checklist" />
                <span className="text-sm text-muted-foreground">{nightAuditChecklist.filter(t => t.done).length} of {nightAuditChecklist.length} completed</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mb-6">
                <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(nightAuditChecklist.filter(t => t.done).length / nightAuditChecklist.length) * 100}%` }} />
              </div>
              <div className="space-y-2">
                {nightAuditChecklist.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer">
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors", item.done ? "bg-emerald-500" : "border-2 border-border")}>
                      {item.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={cn("text-sm", item.done ? "text-muted-foreground line-through" : "text-foreground")}>{item.task}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trial Balance Preview */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <SectionHeader title="Trial Balance — April 2, 2026" />
              </div>
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Debit (BHD)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credit (BHD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    { account: "Cash & Bank", debit: 21550, credit: 0 },
                    { account: "Accounts Receivable", debit: 94250, credit: 0 },
                    { account: "Inventory", debit: 12400, credit: 0 },
                    { account: "Rooms Revenue", debit: 0, credit: 14800 },
                    { account: "F&B Revenue", debit: 0, credit: 4900 },
                    { account: "Spa Revenue", debit: 0, credit: 1400 },
                    { account: "Accounts Payable", debit: 0, credit: 28900 },
                    { account: "Wages Payable", debit: 0, credit: 12800 },
                    { account: "VAT Payable", debit: 0, credit: 2980 },
                    { account: "Retained Earnings", debit: 0, credit: 62420 },
                  ].map(row => (
                    <tr key={row.account} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-foreground">{row.account}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-foreground">{row.debit > 0 ? `${row.debit.toLocaleString()}` : "—"}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-foreground">{row.credit > 0 ? `${row.credit.toLocaleString()}` : "—"}</td>
                    </tr>
                  ))}
                  <tr className="bg-secondary/50 font-bold">
                    <td className="px-4 py-3 text-sm text-foreground font-bold">TOTAL</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-foreground">128,200</td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-foreground">128,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* FOLIO MANAGEMENT */}
        {activeSubmenu === "Folios" && (
          <motion.div key="Folios" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={folioSearch} onChange={setFolioSearch} placeholder="Search guest, room, folio number..." />}
              header={<SectionHeader title="Folio Management" subtitle={`${folios.filter(f => f.status === "Open").length} open folios · BHD ${folios.filter(f => f.status === "Open").reduce((s, f) => s + f.balance, 0).toLocaleString()} outstanding`} icon={Wallet} actions={<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> New Folio</button>} />}
              kpi={<KpiStrip items={[
                {color:"bg-blue-500",value:folios.filter(f=>f.status==="Open").length,label:"Open Folios"},
                {color:"bg-amber-500",value:`BHD ${folios.filter(f=>f.status==="Open").reduce((s,f)=>s+f.balance,0).toLocaleString()}`,label:"Outstanding"},
                {color:"bg-emerald-500",value:folios.filter(f=>f.status==="Closed").length,label:"Closed Today"},
                {color:"bg-rose-500",value:folios.filter(f=>f.status==="Disputed").length,label:"Disputed"},
                {color:"bg-violet-500",value:folios.length,label:"Total Folios"},
              ]} />}
            >

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-secondary/50">
                  <tr>{["Folio No", "Guest", "Room", "Check-In", "Check-Out", "Charges", "Payments", "Balance", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {folios.filter(f => !folioSearch || f.guestName.toLowerCase().includes(folioSearch.toLowerCase()) || f.room.includes(folioSearch) || f.id.includes(folioSearch)).map(folio => (
                    <tr key={folio.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{folio.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{folio.guestName}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{folio.room}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{folio.checkIn}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{folio.checkOut}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">BHD {folio.charges.toLocaleString()}</td>
                      <td className="px-4 py-3 text-emerald-600 font-medium">BHD {folio.payments.toLocaleString()}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: folio.balance > 0 ? "var(--color-red-500, #ef4444)" : "#10b981" }}>
                        BHD {folio.balance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getFolioStatusColor(folio.status))}>{folio.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Receipt className="w-3.5 h-3.5 text-muted-foreground" /></button>
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

        {/* ACCOUNTS RECEIVABLE */}
        {activeSubmenu === "Receivables" && (
          <motion.div key="Receivables" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search receivables..." />}
              header={<SectionHeader title="Accounts Receivable" subtitle={`BHD ${totalAR.toLocaleString()} total outstanding`} icon={Wallet} actions={<div className="flex gap-2"><button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><Download className="w-4 h-4" /> AR Aging</button><button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> New Invoice</button></div>} />}
              kpi={<KpiStrip items={[
                {color:"bg-emerald-500",value:`BHD ${arEntries.filter(a=>a.status==="Current").reduce((s,a)=>s+a.amount,0).toLocaleString()}`,label:"Current"},
                {color:"bg-amber-500",value:`BHD ${arEntries.filter(a=>a.status==="Overdue 30").reduce((s,a)=>s+a.amount,0).toLocaleString()}`,label:"Overdue 30"},
                {color:"bg-orange-500",value:`BHD ${arEntries.filter(a=>a.status==="Overdue 60").reduce((s,a)=>s+a.amount,0).toLocaleString()}`,label:"Overdue 60"},
                {color:"bg-rose-500",value:`BHD ${arEntries.filter(a=>a.status==="Overdue 90+").reduce((s,a)=>s+a.amount,0).toLocaleString()}`,label:"Overdue 90+"},
                {color:"bg-blue-500",value:arEntries.length,label:"Total Invoices"},
              ]} />}
            >

            <div className="flex gap-2">
              {["All", "Current", "Overdue 30", "Overdue 60", "Overdue 90+"].map(f => (
                <button key={f} onClick={() => setArFilter(f)} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", arFilter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary/50")}>{f}</button>
              ))}
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-secondary/50">
                  <tr>{["Invoice No", "Company", "Amount", "Invoice Date", "Due Date", "Days Overdue", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {arEntries.filter(a => arFilter === "All" || a.status === arFilter).map(ar => (
                    <tr key={ar.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{ar.invoiceNo}</td>
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{ar.company}</td>
                      <td className="px-4 py-3 font-bold text-foreground">BHD {ar.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ar.invoiceDate}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ar.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className={cn("font-medium text-sm", ar.daysOverdue > 0 ? "text-red-600" : "text-emerald-600")}>{ar.daysOverdue > 0 ? `+${ar.daysOverdue}d` : "On time"}</span>
                      </td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getARStatusColor(ar.status))}>{ar.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">Remind</button>
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
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

        {/* ACCOUNTS PAYABLE */}
        {activeSubmenu === "Payables" && (
          <motion.div key="Payables" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search payables..." />}
              header={<SectionHeader title="Accounts Payable" subtitle={`BHD ${totalAP.toLocaleString()} due — ${apEntries.filter(a => a.status === "Pending").length} pending approval`} icon={Wallet} actions={<div className="flex gap-2"><button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><Download className="w-4 h-4" /> AP Report</button><button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> New Bill</button></div>} />}
              kpi={<KpiStrip items={[
                {color:"bg-red-500",value:`BHD ${totalAP.toLocaleString()}`,label:"Total Payable"},
                {color:"bg-amber-500",value:apEntries.filter(a => a.status === "Pending").length,label:"Pending Approval"},
                {color:"bg-blue-500",value:apEntries.filter(a => a.status === "Approved").length,label:"Approved to Pay"},
                {color:"bg-emerald-500",value:apEntries.filter(a => a.status === "Paid").length,label:"Paid This Month"},
                {color:"bg-rose-500",value:apEntries.filter(a => a.status === "Disputed").length,label:"Disputed"},
              ]} />}
            >

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Payable", value: `BHD ${totalAP.toLocaleString()}`, color: "from-red-400 to-red-500", icon: <Banknote size={20} /> },
                { label: "Pending Approval", value: apEntries.filter(a => a.status === "Pending").length, color: "from-amber-400 to-amber-500", icon: <Clock size={20} /> },
                { label: "Approved to Pay", value: apEntries.filter(a => a.status === "Approved").length, color: "from-blue-400 to-blue-500", icon: <CheckCircle2 size={20} /> },
                { label: "Paid This Month", value: apEntries.filter(a => a.status === "Paid").length, color: "from-emerald-400 to-emerald-500", icon: <CreditCard size={20} /> },
              ].map(c => (
                <div key={c.label} className={`bg-gradient-to-r ${c.color} rounded-2xl p-5 text-white relative overflow-hidden`}>
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{c.label}</p>
                      <p className="text-3xl font-bold mt-1">{c.value}</p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-xl">{c.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {["All", "Pending", "Approved", "Paid", "Disputed"].map(f => (
                <button key={f} onClick={() => setApFilter(f)} className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors", apFilter === f ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-secondary/50")}>{f}</button>
              ))}
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-secondary/50">
                  <tr>{["Invoice No", "Supplier", "Amount", "Category", "Invoice Date", "Due Date", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {apEntries.filter(a => apFilter === "All" || a.status === apFilter).map(ap => (
                    <tr key={ap.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{ap.invoiceNo}</td>
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{ap.supplier}</td>
                      <td className="px-4 py-3 font-bold text-foreground">BHD {ap.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ap.category}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ap.invoiceDate}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{ap.dueDate}</td>
                      <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getAPStatusColor(ap.status))}>{ap.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {ap.status === "Pending" && <button className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs hover:bg-blue-200 transition-colors">Approve</button>}
                          {ap.status === "Approved" && <button className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs hover:bg-emerald-200 transition-colors">Pay Now</button>}
                          <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
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

        {/* CASHIER */}
        {activeSubmenu === "Cashier" && (
          <motion.div key="Cashier" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search cashier..." />}
              header={<SectionHeader title="Cashier Balance" subtitle="April 2, 2026 — All shifts" icon={Wallet} actions={<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> Open Float</button>} />}
              kpi={<KpiStrip items={[
                {color:"bg-emerald-500",value:cashierBalances.filter(c => c.status === "Balanced").length,label:"Balanced"},{color:"bg-blue-500",value:cashierBalances.filter(c => c.status === "Surplus").length,label:"Surplus"},{color:"bg-red-500",value:cashierBalances.filter(c => c.status === "Short").length,label:"Short"},{color:"bg-amber-500",value:cashierBalances.length,label:"Total Shifts"},{color:"bg-violet-500",value:`BHD ${cashierBalances.reduce((s,c) => s + c.closingBalance, 0).toLocaleString()}`,label:"Total Balance"},
              ]} />}
            >

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cashierBalances.map(cb => (
                <div key={cb.id} className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{cb.cashier}</p>
                      <p className="text-xs text-muted-foreground">{cb.shift} Shift</p>
                    </div>
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", cb.status === "Balanced" ? "bg-emerald-100 text-emerald-700" : cb.status === "Surplus" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700")}>{cb.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Opening Float", value: cb.openingFloat },
                      { label: "Cash In", value: cb.cashIn },
                      { label: "Cash Out", value: cb.cashOut },
                      { label: "Closing Balance", value: cb.closingBalance },
                    ].map(item => (
                      <div key={item.label} className="bg-secondary/30 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-semibold text-foreground text-sm">BHD {item.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className={cn("rounded-xl p-3 flex items-center justify-between", cb.variance === 0 ? "bg-emerald-50" : cb.variance > 0 ? "bg-blue-50" : "bg-red-50")}>
                    <span className="text-sm font-medium text-foreground">Variance</span>
                    <span className={cn("text-sm font-bold", cb.variance === 0 ? "text-emerald-600" : cb.variance > 0 ? "text-blue-600" : "text-red-600")}>
                      {cb.variance > 0 ? "+" : ""}{cb.variance} BHD
                    </span>
                  </div>
                </div>
              ))}
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* BUDGET VS ACTUAL */}
        {activeSubmenu === "Budget vs Actual" && (
          <motion.div key="Budget vs Actual" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search budget..." />}
              header={<SectionHeader title="Budget vs Actual" subtitle="Q1 2026 — March close" icon={Wallet} actions={<button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><Download className="w-4 h-4" /> Export P&L</button>} />}
              kpi={<KpiStrip items={[
                {color:"bg-blue-500",value:`BHD ${Math.abs(budgetVsActual.reduce((s,r) => s + r.budgeted, 0)).toLocaleString()}`,label:"Total Budget"},
                {color:"bg-emerald-500",value:`BHD ${Math.abs(budgetVsActual.reduce((s,r) => s + r.actual, 0)).toLocaleString()}`,label:"Total Actual"},
                {color:"bg-amber-500",value:`BHD ${budgetVsActual.reduce((s,r) => s + r.variance, 0).toLocaleString()}`,label:"Net Variance"},
                {color:"bg-violet-500",value:budgetVsActual.filter(r => r.variance > 0).length,label:"Over Budget"},{color:"bg-rose-500",value:budgetVsActual.filter(r => r.variance < 0).length,label:"Under Budget"},
              ]} />}
            >

            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetVsActual} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="department" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [`BHD ${Math.abs(v).toLocaleString()}`, ""]} />
                  <Bar dataKey="budgeted" name="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actual" name="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>{["Department", "Budget (BHD)", "Actual (BHD)", "Variance (BHD)", "Variance %"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {budgetVsActual.map(row => (
                    <tr key={row.department} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{row.department}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">BHD {Math.abs(row.budgeted).toLocaleString()}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">BHD {Math.abs(row.actual).toLocaleString()}</td>
                      <td className={cn("px-4 py-3 font-medium", row.variance > 0 ? "text-emerald-600" : "text-red-600")}>
                        {row.variance > 0 ? "+" : ""}BHD {row.variance.toLocaleString()}
                      </td>
                      <td className={cn("px-4 py-3", row.variancePct > 0 ? "text-emerald-600" : "text-red-600")}>
                        <span className="flex items-center gap-1 text-sm font-medium">
                          {row.variancePct > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          {row.variancePct > 0 ? "+" : ""}{row.variancePct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* FX RATES */}
        {activeSubmenu === "FX Rates" && (
          <motion.div key="FX Rates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.2 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search currencies..." />}
              header={<SectionHeader title="Foreign Exchange Rates" subtitle="Base: BHD · Last updated: 02 Apr 2026 09:00" icon={Wallet} actions={<button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><RefreshCw className="w-4 h-4" /> Refresh Rates</button>} />}
              kpi={<KpiStrip items={[{color:"bg-blue-500",value:"0.376",label:"BHD/USD"},{color:"bg-emerald-500",value:"0.408",label:"BHD/EUR"},{color:"bg-amber-500",value:"0.474",label:"BHD/GBP"},{color:"bg-violet-500",value:"0.103",label:"BHD/SAR"},{color:"bg-rose-500",value:"0.0025",label:"BHD/JPY"}]} />}
            >

            {/* FX Calculator */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <SectionHeader title="Quick Conversion Calculator" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Amount</label>
                  <input type="number" defaultValue={100} className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">From Currency</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option>BHD</option>
                    {fxRates.map(fx => <option key={fx.currency}>{fx.currency}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">To Currency</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {fxRates.map(fx => <option key={fx.currency}>{fx.currency}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4 bg-secondary/30 rounded-xl p-4">
                <p className="text-2xl font-bold text-foreground">265.25 <span className="text-lg font-normal text-muted-foreground">USD</span></p>
                <p className="text-sm text-muted-foreground mt-0.5">100 BHD = 265.25 USD (rate: 2.6525)</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <SectionHeader title="Exchange Rate Board" />
                <span className="text-xs text-muted-foreground">All rates per 1 BHD</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                {fxRates.map((fx, i) => (
                  <div key={fx.currency} className={cn("p-5 space-y-2", i % 2 === 0 ? "bg-card" : "bg-secondary/20", "border-b border-r border-border last:border-r-0")}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{fx.flag}</span>
                      <span className="font-bold text-foreground text-lg">{fx.currency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Buy</span>
                      <span className="font-semibold text-emerald-600">{fx.buy.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sell</span>
                      <span className="font-semibold text-red-600">{fx.sell.toFixed(3)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Spread: {((fx.buy - fx.sell) / fx.buy * 100).toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
