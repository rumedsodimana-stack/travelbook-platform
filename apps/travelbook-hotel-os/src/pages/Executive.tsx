import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, DollarSign, Users, Star, Percent,
  Download, FileText, CheckCircle2, AlertCircle, Clock, Target,
  Bell, ChevronUp, ChevronDown, ArrowUpRight, ArrowDownRight,
  Leaf, Shield, BarChart2, Search, Filter, Printer,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard } from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface ExecutiveProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const kpi90DayTrend = [
  { day: "Jan 01", occupancy: 72, adr: 248, revpar: 179 },
  { day: "Jan 08", occupancy: 74, adr: 252, revpar: 187 },
  { day: "Jan 15", occupancy: 71, adr: 244, revpar: 173 },
  { day: "Jan 22", occupancy: 76, adr: 258, revpar: 196 },
  { day: "Jan 29", occupancy: 78, adr: 261, revpar: 204 },
  { day: "Feb 05", occupancy: 80, adr: 265, revpar: 212 },
  { day: "Feb 12", occupancy: 77, adr: 259, revpar: 199 },
  { day: "Feb 19", occupancy: 82, adr: 272, revpar: 223 },
  { day: "Feb 26", occupancy: 79, adr: 266, revpar: 210 },
  { day: "Mar 05", occupancy: 83, adr: 271, revpar: 225 },
  { day: "Mar 12", occupancy: 81, adr: 268, revpar: 217 },
  { day: "Mar 19", occupancy: 80, adr: 267, revpar: 214 },
  { day: "Mar 26", occupancy: 79.8, adr: 268, revpar: 214 },
];

const departmentPerformance = [
  { dept: "Front Office", score: 94, trend: "up", status: "Excellent" },
  { dept: "Housekeeping", score: 91, trend: "up", status: "Excellent" },
  { dept: "Food & Beverage", score: 87, trend: "up", status: "Excellent" },
  { dept: "Spa & Wellness", score: 83, trend: "down", status: "Good" },
  { dept: "Engineering", score: 78, trend: "up", status: "Good" },
  { dept: "Sales & Marketing", score: 81, trend: "up", status: "Good" },
  { dept: "Finance", score: 76, trend: "down", status: "Average" },
  { dept: "Human Resources", score: 72, trend: "up", status: "Average" },
];

const reportsData = [
  { id: "R001", name: "Monthly Executive Performance Summary — March 2026", dept: "Executive", period: "Mar 2026", generatedBy: "Sarah Mitchell", date: "2026-04-01", status: "Ready" },
  { id: "R002", name: "Night Audit Consolidated Report", dept: "Finance", period: "Apr 01 2026", generatedBy: "Ravi Sharma", date: "2026-04-02", status: "Ready" },
  { id: "R003", name: "Quarterly RevPAR Benchmarking Q1 2026", dept: "Revenue", period: "Q1 2026", generatedBy: "System", date: "2026-04-02", status: "Generating" },
  { id: "R004", name: "Guest Satisfaction CSAT Deep-Dive", dept: "Guest Services", period: "Mar 2026", generatedBy: "Elena Marchetti", date: "2026-04-01", status: "Ready" },
  { id: "R005", name: "Payroll & Labour Cost Analysis", dept: "HR", period: "Mar 2026", generatedBy: "Aisha Al-Zayani", date: "2026-04-01", status: "Ready" },
  { id: "R006", name: "F&B Profitability and Menu Engineering", dept: "F&B", period: "Mar 2026", generatedBy: "Marco Bianchi", date: "2026-04-02", status: "Ready" },
  { id: "R007", name: "ESG Carbon & Water Consumption MTD", dept: "Engineering", period: "Mar 2026", generatedBy: "James Harrington", date: "2026-04-02", status: "Generating" },
  { id: "R008", name: "Competitive Set Rate Intelligence", dept: "Revenue", period: "Apr W1 2026", generatedBy: "System", date: "2026-04-03", status: "Scheduled" },
  { id: "R009", name: "Housekeeping Productivity & Quality Scores", dept: "Housekeeping", period: "Mar 2026", generatedBy: "Ling Wei", date: "2026-04-01", status: "Ready" },
  { id: "R010", name: "Sales Pipeline and Conversion Funnel", dept: "Sales", period: "Q1 2026", generatedBy: "Ahmed Al-Mansouri", date: "2026-04-01", status: "Ready" },
  { id: "R011", name: "Board Presentation Pack — Q1 2026", dept: "Executive", period: "Q1 2026", generatedBy: "Sarah Mitchell", date: "2026-04-05", status: "Scheduled" },
  { id: "R012", name: "Procurement Vendor Performance Scorecard", dept: "Procurement", period: "Mar 2026", generatedBy: "Priya Nair", date: "2026-04-02", status: "Ready" },
  { id: "R013", name: "Maintenance Work Order Summary", dept: "Engineering", period: "Mar 2026", generatedBy: "James Harrington", date: "2026-04-01", status: "Ready" },
  { id: "R014", name: "OTA Channel Contribution Analysis", dept: "Revenue", period: "Mar 2026", generatedBy: "System", date: "2026-04-01", status: "Ready" },
  { id: "R015", name: "Security Incident & Audit Log Export", dept: "Security", period: "Mar 2026", generatedBy: "David Kim", date: "2026-04-02", status: "Generating" },
  { id: "R016", name: "Annual Budget vs Actual Variance — YTD", dept: "Finance", period: "YTD 2026", generatedBy: "Ravi Sharma", date: "2026-04-02", status: "Ready" },
];

const kpiTargets = [
  { kpi: "Occupancy Rate", target: 80, current: 79.8, unit: "%", category: "Revenue" },
  { kpi: "Average Daily Rate", target: 265, current: 268, unit: "$", category: "Revenue" },
  { kpi: "RevPAR", target: 212, current: 214, unit: "$", category: "Revenue" },
  { kpi: "Total Revenue MTD", target: 400000, current: 388000, unit: "$K", category: "Financial" },
  { kpi: "GOP Margin", target: 42, current: 46.1, unit: "%", category: "Financial" },
  { kpi: "EBITDA Margin", target: 35, current: 33.8, unit: "%", category: "Financial" },
  { kpi: "Guest NPS", target: 80, current: 82, unit: "pts", category: "Guest" },
  { kpi: "Guest CSAT Overall", target: 4.5, current: 4.6, unit: "/5", category: "Guest" },
  { kpi: "TripAdvisor Ranking", target: 3, current: 4, unit: "rank", category: "Guest" },
  { kpi: "Staff Efficiency Index", target: 85, current: 87, unit: "%", category: "HR" },
  { kpi: "Employee Satisfaction", target: 75, current: 71, unit: "%", category: "HR" },
  { kpi: "Carbon Footprint (tCO₂e)", target: 170, current: 186, unit: "tCO₂e", category: "ESG" },
];

const announcements = [
  {
    id: "A001", priority: "High", depts: ["Executive", "All Staff"], unread: true,
    title: "Q1 2026 Results: Strong Outperformance vs Budget",
    content: "We are pleased to announce that Q1 2026 has closed with RevPAR of $214, exceeding budget by 4.5%. GOP margin reached 46.1%, well above the 42% target. Full board report will be circulated by April 5.",
    author: "Sarah Mitchell, GM", date: "Apr 2, 2026",
  },
  {
    id: "A002", priority: "Medium", depts: ["HR", "All Staff"], unread: true,
    title: "Updated Leave Policy Effective May 1, 2026",
    content: "Following the annual HR policy review, the annual leave entitlement for all full-time employees will increase from 21 to 24 days effective May 1. Department heads should review and acknowledge the updated policy.",
    author: "Aisha Al-Zayani, HR Director", date: "Apr 1, 2026",
  },
  {
    id: "A003", priority: "High", depts: ["Security", "Engineering"], unread: false,
    title: "Fire Safety Drill — April 10, 2026 at 10:00 AM",
    content: "The annual mandatory fire safety and evacuation drill will be conducted on April 10 at 10:00 AM. All operational teams must participate. Guest-facing staff to follow the standard communication protocol.",
    author: "David Kim, Security Manager", date: "Mar 31, 2026",
  },
  {
    id: "A004", priority: "Low", depts: ["F&B"], unread: false,
    title: "New Seasonal Menu Launch — Al Bahar Restaurant",
    content: "The Spring 2026 menu featuring locally sourced ingredients launches on April 15. Training sessions for all F&B staff will be held April 8–9. Please coordinate with Chef Marco for scheduling.",
    author: "Marco Bianchi, F&B Director", date: "Mar 30, 2026",
  },
  {
    id: "A005", priority: "Medium", depts: ["Revenue", "Front Office"], unread: true,
    title: "Rate Strategy Update: Extended Stay Promotion",
    content: "A new extended stay rate (7+ nights at 20% discount) has been approved for April–June 2026 targeting GCC corporate accounts. PMS rates have been updated. All front desk staff should be briefed by April 3.",
    author: "Elena Marchetti, Revenue Manager", date: "Mar 29, 2026",
  },
  {
    id: "A006", priority: "Low", depts: ["All Staff"], unread: false,
    title: "Employee of the Month — March 2026: Ling Wei",
    content: "Congratulations to Ling Wei from Housekeeping for outstanding performance in March, achieving a 99.1% room inspection pass rate and receiving 14 personal guest compliments. Please join us in recognizing this achievement.",
    author: "Sarah Mitchell, GM", date: "Mar 28, 2026",
  },
  {
    id: "A007", priority: "High", depts: ["Finance", "Executive"], unread: true,
    title: "External Audit Scheduled — April 14–18, 2026",
    content: "KPMG will conduct the annual financial audit April 14–18. Finance team to ensure all Q1 reconciliations are finalized by April 10. Department heads may be contacted for supporting documentation.",
    author: "Ravi Sharma, Financial Controller", date: "Mar 27, 2026",
  },
  {
    id: "A008", priority: "Medium", depts: ["Sales"], unread: false,
    title: "Arabian Travel Market — Team Attendance Confirmed",
    content: "Singularity Hotel will exhibit at ATM 2026 (May 5–8, Dubai). The sales team of 4 has been confirmed. Collateral and promotional packages must be submitted for design review by April 20.",
    author: "Ahmed Al-Mansouri, Sales Director", date: "Mar 26, 2026",
  },
];

const plData = {
  thisMonth: {
    label: "This Month (Mar 2026)",
    rows: [
      { account: "Room Revenue", actual: 288400, budget: 275000, type: "revenue" },
      { account: "F&B Revenue", actual: 64200, budget: 70000, type: "revenue" },
      { account: "Spa & Wellness Revenue", actual: 18500, budget: 16000, type: "revenue" },
      { account: "Events & Banqueting", actual: 12800, budget: 18000, type: "revenue" },
      { account: "Other Income", actual: 4100, budget: 4000, type: "revenue" },
      { account: "TOTAL REVENUE", actual: 388000, budget: 383000, type: "total" },
      { account: "Room Costs", actual: -52000, budget: -50000, type: "cost" },
      { account: "F&B Cost of Sales", actual: -22000, budget: -24000, type: "cost" },
      { account: "Spa Costs", actual: -6200, budget: -5800, type: "cost" },
      { account: "TOTAL COGS", actual: -80200, budget: -79800, type: "total" },
      { account: "GROSS PROFIT", actual: 307800, budget: 303200, type: "gop" },
      { account: "Gross Profit %", actual: 79.3, budget: 79.2, type: "percent" },
      { account: "Admin & General", actual: -38000, budget: -36000, type: "opex" },
      { account: "Sales & Marketing", actual: -31200, budget: -30000, type: "opex" },
      { account: "Utilities & Engineering", actual: -28400, budget: -27000, type: "opex" },
      { account: "Human Resources", actual: -22100, budget: -21500, type: "opex" },
      { account: "TOTAL OPEX", actual: -119700, budget: -114500, type: "total" },
      { account: "EBITDA", actual: 188100, budget: 188700, type: "ebitda" },
      { account: "EBITDA %", actual: 48.5, budget: 49.3, type: "percent" },
    ],
  },
};

const gopTrendMonthly = [
  { month: "Jul", gop: 38.2 }, { month: "Aug", gop: 41.5 }, { month: "Sep", gop: 43.1 },
  { month: "Oct", gop: 40.8 }, { month: "Nov", gop: 44.2 }, { month: "Dec", gop: 51.3 },
  { month: "Jan", gop: 42.0 }, { month: "Feb", gop: 45.7 }, { month: "Mar", gop: 46.1 },
];

const compSetData = [
  { hotel: "The Ritz-Carlton Bahrain", occ: 76.2, adr: 312, revpar: 238, rgi: 1.11, ari: 1.16, mpi: 1.04 },
  { hotel: "Four Seasons Hotel Bahrain Bay", occ: 72.8, adr: 298, revpar: 217, rgi: 1.03, ari: 1.11, mpi: 0.99 },
  { hotel: "Jumeirah Gulf of Bahrain Resort", occ: 68.4, adr: 275, revpar: 188, rgi: 0.94, ari: 1.02, mpi: 0.93 },
  { hotel: "Shangri-La Bahrain", occ: 74.1, adr: 282, revpar: 209, rgi: 1.01, ari: 1.05, mpi: 1.01 },
  { hotel: "Gulf Hotel Bahrain", occ: 81.3, adr: 198, revpar: 161, rgi: 0.87, ari: 0.74, mpi: 1.11 },
  { hotel: "InterContinental Bahrain", occ: 77.6, adr: 241, revpar: 187, rgi: 0.92, ari: 0.90, mpi: 1.06 },
  { hotel: "Singularity Hotel (Ours)", occ: 79.8, adr: 268, revpar: 214, rgi: 1.08, ari: 1.00, mpi: 1.09, isOurs: true },
];

const rgiTrendData = [
  { month: "Apr", ours: 0.98, market: 1.00 }, { month: "May", ours: 1.01, market: 1.00 },
  { month: "Jun", ours: 1.03, market: 1.00 }, { month: "Jul", ours: 1.00, market: 1.00 },
  { month: "Aug", ours: 1.04, market: 1.00 }, { month: "Sep", ours: 1.05, market: 1.00 },
  { month: "Oct", ours: 1.03, market: 1.00 }, { month: "Nov", ours: 1.06, market: 1.00 },
  { month: "Dec", ours: 1.10, market: 1.00 }, { month: "Jan", ours: 1.07, market: 1.00 },
  { month: "Feb", ours: 1.09, market: 1.00 }, { month: "Mar", ours: 1.08, market: 1.00 },
];

const npsTrend = [
  { month: "Apr", nps: 68 }, { month: "May", nps: 71 }, { month: "Jun", nps: 74 },
  { month: "Jul", nps: 70 }, { month: "Aug", nps: 73 }, { month: "Sep", nps: 76 },
  { month: "Oct", nps: 74 }, { month: "Nov", nps: 77 }, { month: "Dec", nps: 80 },
  { month: "Jan", nps: 78 }, { month: "Feb", nps: 80 }, { month: "Mar", nps: 82 },
];

const csatByDept = [
  { dept: "Front Office", score: 4.7, reviews: 312, responseRate: 94, trend: "up" },
  { dept: "Housekeeping", score: 4.6, reviews: 298, responseRate: 91, trend: "up" },
  { dept: "Food & Beverage", score: 4.4, reviews: 241, responseRate: 87, trend: "up" },
  { dept: "Concierge", score: 4.8, reviews: 118, responseRate: 96, trend: "up" },
  { dept: "Spa & Wellness", score: 4.5, reviews: 89, responseRate: 88, trend: "down" },
  { dept: "Room Service", score: 4.3, reviews: 176, responseRate: 82, trend: "down" },
  { dept: "Valet & Transport", score: 4.6, reviews: 134, responseRate: 90, trend: "up" },
  { dept: "Banqueting", score: 4.2, reviews: 67, responseRate: 79, trend: "down" },
];

const esgInitiatives = [
  { initiative: "LED Lighting Retrofit — All Areas", target: 100, current: 87, unit: "%", status: "On Track", lead: "Engineering" },
  { initiative: "Renewable Energy (Solar PV Phase 1)", target: 15, current: 8, unit: "% of consumption", status: "Behind", lead: "Engineering" },
  { initiative: "Single-Use Plastic Elimination", target: 100, current: 72, unit: "%", status: "On Track", lead: "F&B" },
  { initiative: "Water Recycling Programme", target: 40, current: 28, unit: "% recycled", status: "Behind", lead: "Engineering" },
  { initiative: "Zero Food Waste to Landfill", target: 100, current: 95, unit: "%", status: "On Track", lead: "F&B" },
  { initiative: "Green Key Certification Renewal", target: 1, current: 1, unit: "cert", status: "Completed", lead: "Executive" },
  { initiative: "ISO 14001 Environmental Management", target: 1, current: 0, unit: "cert", status: "Behind", lead: "HR" },
  { initiative: "EV Charging Stations Installation", target: 8, current: 8, unit: "units", status: "Completed", lead: "Engineering" },
  { initiative: "Local Supplier Procurement", target: 60, current: 44, unit: "%", status: "On Track", lead: "Procurement" },
  { initiative: "Bahraini Nationals Employment", target: 40, current: 28, unit: "%", status: "Behind", lead: "HR" },
];

const boardMetrics = [
  { category: "Financial", metric: "Total Revenue MTD", value: "$388,000", vs: "$383,000", variance: "+1.3%", delta: "positive" },
  { category: "Financial", metric: "GOP Margin", value: "46.1%", vs: "42.0%", variance: "+4.1pp", delta: "positive" },
  { category: "Financial", metric: "EBITDA", value: "$188,100", vs: "$188,700", variance: "-0.3%", delta: "neutral" },
  { category: "Financial", metric: "ADR", value: "$268", vs: "$265", variance: "+1.1%", delta: "positive" },
  { category: "Operational", metric: "Occupancy Rate", value: "79.8%", vs: "80.0%", variance: "-0.2pp", delta: "neutral" },
  { category: "Operational", metric: "RevPAR", value: "$214", vs: "$212", variance: "+0.9%", delta: "positive" },
  { category: "Operational", metric: "RGI (Revenue Gen Index)", value: "1.08", vs: "1.00", variance: "+8.0%", delta: "positive" },
  { category: "Operational", metric: "Staff Efficiency Index", value: "87%", vs: "85%", variance: "+2pp", delta: "positive" },
  { category: "Guest Experience", metric: "Net Promoter Score", value: "82", vs: "80", variance: "+2pts", delta: "positive" },
  { category: "Guest Experience", metric: "Overall CSAT", value: "4.6/5", vs: "4.5/5", variance: "+0.1", delta: "positive" },
  { category: "Guest Experience", metric: "TripAdvisor Ranking", value: "#4", vs: "#3", variance: "-1", delta: "negative" },
  { category: "Guest Experience", metric: "Online Review Volume", value: "1,435", vs: "1,200", variance: "+19.6%", delta: "positive" },
  { category: "HR", metric: "Employee Satisfaction", value: "71%", vs: "75%", variance: "-4pp", delta: "negative" },
  { category: "HR", metric: "Turnover Rate (MTD)", value: "2.1%", vs: "2.5%", variance: "-0.4pp", delta: "positive" },
  { category: "HR", metric: "Training Hours Per FTE", value: "4.2h", vs: "4.0h", variance: "+5.0%", delta: "positive" },
];

const auditRows = [
  { ts: "2026-04-02 11:42:18", user: "Ravi Sharma", module: "Finance", action: "Modified", record: "Budget Line — Sales & Marketing Q2", ip: "192.168.1.50", status: "Success" },
  { ts: "2026-04-02 11:15:04", user: "Elena Marchetti", module: "Revenue", action: "Created", record: "Rate Plan: SPRING26CORP — Apr–Jun 2026", ip: "192.168.1.30", status: "Success" },
  { ts: "2026-04-02 10:58:33", user: "Ling Wei", module: "Housekeeping", action: "Modified", record: "Room 418 Status: Dirty → Clean", ip: "192.168.1.25", status: "Success" },
  { ts: "2026-04-02 10:41:00", user: "Ahmed Al-Mansouri", module: "CRM", action: "Viewed", record: "VIP Guest Profile — Al-Khalifa, Bader", ip: "192.168.1.31", status: "Success" },
  { ts: "2026-04-02 10:12:55", user: "James Harrington", module: "Maintenance", action: "Created", record: "Work Order #WO2262 — HVAC Unit 3B", ip: "192.168.1.40", status: "Success" },
  { ts: "2026-04-02 09:50:20", user: "Sarah Mitchell", module: "Executive", action: "Viewed", record: "GM Dashboard — Q1 2026 Final Figures", ip: "192.168.1.1", status: "Success" },
  { ts: "2026-04-02 09:33:14", user: "Priya Nair", module: "Procurement", action: "Modified", record: "PO #PO8812 — Linen Supplier Invoice Approved", ip: "192.168.1.44", status: "Success" },
  { ts: "2026-04-02 09:10:07", user: "Unknown", module: "System", action: "Viewed", record: "Admin Panel — Unauthorized Access Attempt", ip: "45.33.12.104", status: "Failed" },
  { ts: "2026-04-02 08:55:45", user: "Marco Bianchi", module: "F&B", action: "Created", record: "Menu Item: Saffron Risotto — Al Bahar Spring Menu", ip: "192.168.1.22", status: "Success" },
  { ts: "2026-04-02 08:32:01", user: "David Kim", module: "Security", action: "Deleted", record: "Expired Access Card — ID: EMP0291 (Resigned)", ip: "192.168.1.60", status: "Success" },
  { ts: "2026-04-02 08:14:22", user: "Ahmed Al-Mansouri", module: "Front Desk", action: "Created", record: "Check-in — Reservation RES20041822, Room 312", ip: "192.168.1.12", status: "Success" },
  { ts: "2026-04-02 07:58:09", user: "Aisha Al-Zayani", module: "HR", action: "Modified", record: "Employee Record — Staff ID EMP0341, Salary Review", ip: "192.168.1.55", status: "Success" },
  { ts: "2026-04-02 07:30:00", user: "Sarah Mitchell", module: "Executive", action: "Viewed", record: "GM Daily Briefing Report — Apr 2 2026", ip: "192.168.1.1", status: "Success" },
  { ts: "2026-04-02 02:00:01", user: "System (Automated)", module: "Finance", action: "Created", record: "Night Audit Run — April 1 2026 Consolidated", ip: "127.0.0.1", status: "Success" },
  { ts: "2026-04-01 23:41:55", user: "Front Desk (POS)", module: "Front Desk", action: "Modified", record: "Folio FO20318 — Room 501 Late Checkout Charge", ip: "192.168.1.13", status: "Success" },
  { ts: "2026-04-01 21:17:30", user: "Elena Marchetti", module: "Revenue", action: "Deleted", record: "Archived Rate Plan: WINTER25PROMO — Expired", ip: "192.168.1.30", status: "Success" },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Ready: "bg-emerald-100 text-emerald-700",
    Generating: "bg-amber-100 text-amber-700",
    Scheduled: "bg-blue-100 text-blue-700",
    Excellent: "bg-emerald-100 text-emerald-700",
    Good: "bg-blue-100 text-blue-700",
    Average: "bg-amber-100 text-amber-700",
    "On Track": "bg-emerald-100 text-emerald-700",
    Behind: "bg-red-100 text-red-700",
    Completed: "bg-purple-100 text-purple-700",
    Success: "bg-emerald-100 text-emerald-700",
    Failed: "bg-red-100 text-red-700",
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-secondary text-muted-foreground",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", map[status] ?? "bg-secondary text-muted-foreground")}>
      {status}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  const map: Record<string, string> = {
    Created: "bg-emerald-100 text-emerald-700",
    Modified: "bg-blue-100 text-blue-700",
    Deleted: "bg-red-100 text-red-700",
    Viewed: "bg-secondary text-muted-foreground",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[action] ?? "bg-secondary text-muted-foreground")}>
      {action}
    </span>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={cn("w-3.5 h-3.5", n <= Math.round(score) ? "text-amber-400 fill-amber-400" : "text-border")}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

// ─── Sub-Views ────────────────────────────────────────────────────────────────

function DashboardView() {
  return (
    <motion.div key="Dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* 90-Day Multi-Line Chart */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SectionHeader title="90-Day KPI Trend — Occupancy / ADR / RevPAR" />
          <LegendBar items={[
            { color: "bg-blue-100 border-blue-200", label: "Occupancy %" },
            { color: "bg-emerald-100 border-emerald-200", label: "ADR $" },
            { color: "bg-purple-100 border-purple-200", label: "RevPAR $" },
          ]} />
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={kpi90DayTrend} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={[60, 90]} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            <Line yAxisId="right" type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Occupancy %" />
            <Line yAxisId="left" type="monotone" dataKey="adr" stroke="#10b981" strokeWidth={2.5} dot={false} name="ADR $" />
            <Line yAxisId="left" type="monotone" dataKey="revpar" stroke="#8b5cf6" strokeWidth={2.5} dot={false} name="RevPAR $" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Performance Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="Department Performance Scorecard" />
        </div>
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              {["Department", "Score", "Performance", "Trend", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {departmentPerformance.map((row) => (
              <tr key={row.dept} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground text-sm">{row.dept}</td>
                <td className="px-5 py-3 font-bold text-foreground">{row.score}</td>
                <td className="px-5 py-3 w-48">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={cn("h-2 rounded-full", row.score >= 90 ? "bg-emerald-500" : row.score >= 80 ? "bg-blue-500" : "bg-amber-500")}
                      style={{ width: `${row.score}%` }}
                    />
                  </div>
                </td>
                <td className="px-5 py-3">
                  {row.trend === "up"
                    ? <ChevronUp className="w-4 h-4 text-emerald-500" />
                    : <ChevronDown className="w-4 h-4 text-red-500" />}
                </td>
                <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function ReportsView() {
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const depts = useMemo(() => ["All", ...Array.from(new Set(reportsData.map((r) => r.dept)))], []);
  const statuses = ["All", "Ready", "Generating", "Scheduled"];

  const filtered = useMemo(() =>
    reportsData.filter((r) =>
      (deptFilter === "All" || r.dept === deptFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
    ), [deptFilter, statusFilter]);

  return (
    <motion.div key="Reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Reports Library" />
          <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} reports found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Department:</span>
          {depts.slice(0, 6).map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors",
                deptFilter === d ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70")}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors",
                statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70")}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-secondary/50">
            <tr>
              {["Report Name", "Department", "Period", "Generated By", "Date", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate max-w-[240px]" title={r.name}>{r.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{r.dept}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{r.period}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap truncate max-w-[160px]" title={r.generatedBy}>{r.generatedBy}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground whitespace-nowrap">{r.date}</td>
                <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3">
                  {r.status === "Ready" && (
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TargetsView() {
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");

  const onTrack = kpiTargets.filter((k) => {
    const isLower = k.kpi.toLowerCase().includes("carbon") || k.kpi.toLowerCase().includes("ranking");
    return isLower ? k.current <= k.target : k.current >= k.target;
  });
  const exceeded = kpiTargets.filter((k) => {
    const isLower = k.kpi.toLowerCase().includes("carbon") || k.kpi.toLowerCase().includes("ranking");
    return isLower ? k.current < k.target * 0.9 : k.current > k.target * 1.02;
  });
  const behind = kpiTargets.filter((k) => {
    const isLower = k.kpi.toLowerCase().includes("carbon") || k.kpi.toLowerCase().includes("ranking");
    return isLower ? k.current > k.target : k.current < k.target;
  });

  return (
    <motion.div key="Targets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Targets &amp; Goals" />
          <p className="text-muted-foreground text-sm mt-0.5">KPI progress tracking — {period === "monthly" ? "March 2026" : "Annual 2026"}</p>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
          <button onClick={() => setPeriod("monthly")} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", period === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Monthly</button>
          <button onClick={() => setPeriod("annual")} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", period === "annual" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>Annual</button>
        </div>
      </div>

      {/* KPI Progress List */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="KPI Progress" />
        </div>
        <div className="divide-y divide-border/50">
          {kpiTargets.map((k) => {
            const isLowerBetter = k.kpi.toLowerCase().includes("carbon") || k.kpi.toLowerCase().includes("ranking");
            const isAhead = isLowerBetter ? k.current < k.target : k.current >= k.target;
            const pct = isLowerBetter
              ? Math.max(0, Math.min(100, (1 - (k.current - k.target) / k.target) * 100))
              : Math.min(100, (k.current / k.target) * 100);
            const variancePct = ((k.current - k.target) / k.target) * 100 * (isLowerBetter ? -1 : 1);

            return (
              <div key={k.kpi} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{k.kpi}</span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{k.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Target: </span>
                      <span className="text-sm font-medium text-foreground">{typeof k.target === "number" && k.target > 1000 ? `$${(k.target / 1000).toFixed(0)}K` : k.target}{k.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Current: </span>
                      <span className="text-sm font-bold text-foreground">{typeof k.current === "number" && k.current > 1000 ? `$${(k.current / 1000).toFixed(0)}K` : k.current}{k.unit}</span>
                    </div>
                    <div className={cn("flex items-center gap-0.5 text-sm font-semibold", isAhead ? "text-emerald-600" : "text-red-600")}>
                      {isAhead ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(variancePct).toFixed(1)}%
                    </div>
                    <StatusBadge status={isAhead ? "On Track" : "Behind"} />
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className={cn("h-2.5 rounded-full transition-all", isAhead ? "bg-emerald-500" : "bg-red-500")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function AnnouncementsView() {
  const [tab, setTab] = useState<"All" | "Unread" | "High Priority">("All");

  const filtered = useMemo(() => announcements.filter((a) => {
    if (tab === "Unread") return a.unread;
    if (tab === "High Priority") return a.priority === "High";
    return true;
  }), [tab]);

  return (
    <motion.div key="Announcements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Announcements" />
          <p className="text-muted-foreground text-sm mt-0.5">{announcements.filter((a) => a.unread).length} unread</p>
        </div>
        <Bell className="w-5 h-5 text-muted-foreground" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-secondary rounded-xl p-1 w-fit">
        {(["All", "Unread", "High Priority"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-1.5 rounded-lg text-sm font-medium transition-colors", tab === t ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <div
            key={a.id}
            className={cn("bg-card rounded-2xl border p-5 relative", a.unread ? "border-primary/30 bg-primary/5" : "border-border")}
          >
            {a.unread && (
              <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
            )}
            <div className="flex items-start gap-3 flex-wrap mb-2">
              <StatusBadge status={a.priority} />
              {a.depts.map((d) => (
                <span key={d} className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{d}</span>
              ))}
            </div>
            <h4 className="font-semibold text-foreground mb-1.5">{a.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{a.content}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium">{a.author}</span>
              <span>·</span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function PLView() {
  const [period, setPeriod] = useState<"thisMonth" | "q1" | "ytd">("thisMonth");
  const data = plData.thisMonth;

  return (
    <motion.div key="PL" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Financial P&amp;L Summary" />
          <p className="text-muted-foreground text-sm mt-0.5">{data.label}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
            {(["thisMonth", "q1", "ytd"] as const).map((p, i) => (
              <button key={p} onClick={() => setPeriod(p)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", period === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {["This Month", "Q1 2026", "YTD"][i]}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="grid grid-cols-4 px-6 py-3 bg-secondary/50 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <div>Account</div><div className="text-right">Actual</div><div className="text-right">Budget</div><div className="text-right">Variance</div>
        </div>
        {data.rows.map((row, i) => {
          if (row.type === "percent") {
            return (
              <div key={`${row.account}-${i}`} className="grid grid-cols-4 px-6 py-2 border-b border-border/20 bg-secondary/10 text-xs text-muted-foreground">
                <div className="italic pl-2">{row.account}</div>
                <div className="text-right font-medium">{row.actual.toFixed(1)}%</div>
                <div className="text-right">{row.budget.toFixed(1)}%</div>
                <div className={cn("text-right font-medium", row.actual >= row.budget ? "text-emerald-600" : "text-red-600")}>
                  {(row.actual - row.budget).toFixed(1)}pp
                </div>
              </div>
            );
          }
          const isTotal = row.type === "total" || row.type === "gop" || row.type === "ebitda";
          const variance = row.actual - row.budget;
          return (
            <div key={`${row.account}-${i}`} className={cn("grid grid-cols-4 px-6 py-3 border-b border-border/30 hover:bg-secondary/20 transition-colors text-sm", isTotal ? "font-bold bg-secondary/20" : "", row.type === "ebitda" ? "bg-emerald-50/50" : "")}>
              <div className={cn(isTotal ? "text-foreground" : "text-foreground pl-2")}>
                {!isTotal && <span className="text-muted-foreground mr-2">—</span>}{row.account}
              </div>
              <div className={cn("text-right", row.actual < 0 ? "text-red-600" : "text-foreground")}>
                ${Math.abs(row.actual).toLocaleString()}
              </div>
              <div className="text-right text-muted-foreground">${Math.abs(row.budget).toLocaleString()}</div>
              <div className={cn("text-right font-medium", variance > 0 ? "text-emerald-600" : "text-red-600")}>
                {variance > 0 ? "+" : ""}${variance.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* GOP% Trend Bar Chart */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <SectionHeader title="Monthly GOP % Trend" className="mb-4" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={gopTrendMonthly} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis domain={[30, 60]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [`${v.toFixed(1)}%`, "GOP %"]} />
            <Bar dataKey="gop" fill="#10b981" radius={[4, 4, 0, 0]} name="GOP %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function MarketShareView() {
  return (
    <motion.div key="MarketShare" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Market Share Report" />
          <p className="text-muted-foreground text-sm mt-0.5">Competitive set analysis — March 2026</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Comp Set Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="Competitive Set Benchmarking" />
        </div>
        <table className="w-full min-w-[800px]">
          <thead className="bg-secondary/50">
            <tr>
              {["Hotel", "Occupancy", "ADR", "RevPAR", "RGI", "ARI", "MPI"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {compSetData.map((row) => (
              <tr
                key={row.hotel}
                className={cn("transition-colors", row.isOurs ? "bg-primary/5 font-semibold" : "hover:bg-secondary/30")}
              >
                <td className="px-5 py-3 text-sm truncate max-w-[200px]" title={row.hotel}>
                  {row.isOurs && <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2" />}
                  {row.hotel}
                </td>
                <td className="px-5 py-3 text-sm">{row.occ.toFixed(1)}%</td>
                <td className="px-5 py-3 text-sm">${row.adr}</td>
                <td className="px-5 py-3 text-sm">${row.revpar}</td>
                <td className="px-5 py-3 text-sm">
                  <span className={cn(row.rgi >= 1.0 ? "text-emerald-600" : "text-red-600")}>{row.rgi.toFixed(2)}</span>
                </td>
                <td className="px-5 py-3 text-sm">
                  <span className={cn(row.ari >= 1.0 ? "text-emerald-600" : "text-red-600")}>{row.ari.toFixed(2)}</span>
                </td>
                <td className="px-5 py-3 text-sm">
                  <span className={cn(row.mpi >= 1.0 ? "text-emerald-600" : "text-red-600")}>{row.mpi.toFixed(2)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RGI Trend Chart */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SectionHeader title="RGI Trend — Our Hotel vs Market Average (12 Months)" />
          <LegendBar items={[
            { color: "bg-violet-100 border-violet-200", label: "Singularity Hotel" },
            { color: "bg-slate-100 border-slate-200", label: "Market Avg (1.00)" },
          ]} />
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={rgiTrendData} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis domain={[0.9, 1.2]} tickFormatter={(v) => v.toFixed(2)} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [v.toFixed(2), ""]} />
            <Line type="monotone" dataKey="ours" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} name="Our RGI" />
            <Line type="monotone" dataKey="market" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" dot={false} name="Market Avg" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function GuestSatisfactionView() {
  return (
    <motion.div key="GuestSat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <SectionHeader title="Guest Satisfaction Trends" />
        <p className="text-muted-foreground text-sm mt-0.5">NPS &amp; CSAT analysis — 12-month rolling</p>
      </div>

      {/* NPS Trend */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SectionHeader title="Net Promoter Score (NPS) — 12 Month Trend" />
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">82</span>
            <span className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" /> +14 YoY
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={npsTrend} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis domain={[60, 90]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} formatter={(v: number) => [`${v}`, "NPS"]} />
            <Area type="monotone" dataKey="nps" stroke="#6366f1" fill="url(#npsGrad)" strokeWidth={2.5} name="NPS" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CSAT by Department */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="CSAT by Department" />
        </div>
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              {["Department", "Score", "Reviews", "Response Rate", "Trend"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {csatByDept.map((row) => (
              <tr key={row.dept} className="hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-3 font-medium text-foreground text-sm">{row.dept}</td>
                <td className="px-5 py-3"><StarRating score={row.score} /></td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{row.reviews.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-primary" style={{ width: `${row.responseRate}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{row.responseRate}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  {row.trend === "up"
                    ? <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium"><TrendingUp className="w-3.5 h-3.5" /> Up</span>
                    : <span className="flex items-center gap-1 text-red-600 text-xs font-medium"><TrendingDown className="w-3.5 h-3.5" /> Down</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <SectionHeader title="Top Positive Themes" className="mb-4" actions={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} />
          <ul className="space-y-2.5">
            {[
              { theme: "Warm & personalized service", count: 412 },
              { theme: "Room cleanliness and presentation", count: 387 },
              { theme: "Location and sea views", count: 341 },
              { theme: "Breakfast quality and variety", count: 289 },
              { theme: "Fast check-in experience", count: 267 },
            ].map((t) => (
              <li key={t.theme} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t.theme}</span>
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <SectionHeader title="Top Complaint Themes" className="mb-4" actions={<AlertCircle className="w-4 h-4 text-red-500" />} />
          <ul className="space-y-2.5">
            {[
              { theme: "Slow room service delivery time", count: 84 },
              { theme: "Wi-Fi connectivity issues", count: 71 },
              { theme: "Noise from adjacent rooms", count: 58 },
              { theme: "Limited parking availability", count: 49 },
              { theme: "Banquet event pacing", count: 37 },
            ].map((t) => (
              <li key={t.theme} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{t.theme}</span>
                <span className="text-xs font-medium bg-red-100 text-red-700 px-2.5 py-1 rounded-full">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function ESGView() {
  return (
    <motion.div key="ESG" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="ESG / Sustainability" />
          <p className="text-muted-foreground text-sm mt-0.5">Environmental, Social &amp; Governance — March 2026</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground">
          <Download className="w-4 h-4" /> ESG Report
        </button>
      </div>

      {/* Initiatives Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="Sustainability Initiatives" />
        </div>
        <table className="w-full min-w-[800px]">
          <thead className="bg-secondary/50">
            <tr>
              {["Initiative", "Target", "Current", "Unit", "Progress", "Status", "Lead"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {esgInitiatives.map((row) => {
              const pct = Math.min(100, (row.current / row.target) * 100);
              return (
                <tr key={row.initiative} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground truncate max-w-[240px]" title={row.initiative}>{row.initiative}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{row.target}</td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{row.current}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{row.unit}</td>
                  <td className="px-5 py-3 w-32">
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={cn("h-2 rounded-full", row.status === "Completed" ? "bg-purple-500" : row.status === "On Track" ? "bg-emerald-500" : "bg-red-500")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{pct.toFixed(0)}%</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{row.lead}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function BoardReportView() {
  const categories = useMemo(() => Array.from(new Set(boardMetrics.map((m) => m.category))), []);

  return (
    <motion.div key="Board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Board Report — Q1 2026" />
          <p className="text-muted-foreground text-sm mt-0.5">Confidential — For Board of Directors Use</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <SectionHeader title="Key Highlights — Q1 2026" className="mb-4" />
        <ul className="space-y-2.5">
          {[
            "RevPAR closed at $214, representing a 8.6% year-over-year increase driven by improved channel mix and corporate contract growth.",
            "GOP margin of 46.1% exceeded budget by 4.1 percentage points, reflecting disciplined cost management across all departments.",
            "Net Promoter Score improved to 82 (+14 points year-over-year), with Front Office and Concierge leading service excellence.",
            "Revenue Generation Index (RGI) reached 1.08, placing the property as the market share leader in the competitive set.",
            "ESG initiatives progressed with Green Key certification renewed and 8 EV charging stations commissioned on schedule.",
            "Employee turnover declined to 2.1% (below the 2.5% target), with the Bahraini Nationals employment ratio requiring further attention at 28% vs 40% target.",
          ].map((bullet, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
              <span className="text-primary mt-0.5 shrink-0">•</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics Table by Category */}
      {categories.map((cat) => (
        <div key={cat} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-3 bg-secondary/30 border-b border-border">
            <SectionHeader title={cat} />
          </div>
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                {["Metric", "Actual", "Budget / Target", "Variance", "Performance"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {boardMetrics.filter((m) => m.category === cat).map((row) => (
                <tr key={row.metric} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{row.metric}</td>
                  <td className="px-5 py-3 text-sm font-bold text-foreground">{row.value}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{row.vs}</td>
                  <td className="px-5 py-3 text-sm font-medium">
                    <span className={cn(row.delta === "positive" ? "text-emerald-600" : row.delta === "negative" ? "text-red-600" : "text-muted-foreground")}>
                      {row.variance}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {row.delta === "positive" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                    {row.delta === "negative" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    {row.delta === "neutral" && <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </motion.div>
  );
}

function AuditTrailView() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const modules = useMemo(() => ["All", ...Array.from(new Set(auditRows.map((r) => r.module)))], []);
  const actions = ["All", "Created", "Modified", "Deleted", "Viewed"];

  const filtered = useMemo(() =>
    auditRows.filter((r) =>
      (moduleFilter === "All" || r.module === moduleFilter) &&
      (actionFilter === "All" || r.action === actionFilter) &&
      (search === "" || r.user.toLowerCase().includes(search.toLowerCase()) || r.record.toLowerCase().includes(search.toLowerCase()))
    ), [moduleFilter, actionFilter, search]);

  return (
    <motion.div key="AuditTrail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <SectionHeader title="Audit Trail" />
          <p className="text-muted-foreground text-sm mt-0.5">System activity log — {filtered.length} records</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground">
          <Download className="w-4 h-4" /> Export Log
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search user or record…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Module:</span>
          {modules.map((m) => (
            <button key={m} onClick={() => setModuleFilter(m)} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors", moduleFilter === m ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70")}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Action:</span>
          {actions.map((a) => (
            <button key={a} onClick={() => setActionFilter(a)} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors", actionFilter === a ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:bg-secondary/70")}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-secondary/50">
            <tr>
              {["Timestamp", "User", "Module", "Action", "Record", "IP Address", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filtered.map((row, i) => (
              <tr key={`${row.ts}-${i}`} className={cn("hover:bg-secondary/30 transition-colors", row.status === "Failed" ? "bg-red-50/50" : "")}>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{row.ts}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap truncate max-w-[160px]" title={row.user}>{row.user}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{row.module}</span>
                </td>
                <td className="px-4 py-3"><ActionBadge action={row.action} /></td>
                <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-[220px]" title={row.record}>{row.record}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">{row.ip}</td>
                <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No records match your filters.</div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function Executive({ aiEnabled: _aiEnabled, activeSubmenu = "Dashboard" }: ExecutiveProps) {
  const [search, setSearch] = useState("");

  const subviewMap: Record<string, React.ReactNode> = {
    "Dashboard": <DashboardView />,
    "Reports": <ReportsView />,
    "Targets & Goals": <TargetsView />,
    "Announcements": <AnnouncementsView />,
    "Financial P&L Summary": <PLView />,
    "Market Share Report": <MarketShareView />,
    "Guest Satisfaction Trends": <GuestSatisfactionView />,
    "ESG / Sustainability": <ESGView />,
    "Board Report": <BoardReportView />,
    "Audit Trail": <AuditTrailView />,
  };

  const activeNode = subviewMap[activeSubmenu] ?? <DashboardView />;

  return (
    <PageShell
      search={<SectionSearch value={search} onChange={setSearch} placeholder="Search executive reports..." />}
      header={<SectionHeader title="Executive Dashboard" subtitle="GM Overview — April 2026 · Data as of today" icon={LayoutDashboard} actions={<button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 transition-colors text-sm text-muted-foreground"><Download className="w-4 h-4" /> Export GM Report</button>} />}
      kpi={<KpiStrip items={[
        {color:"bg-blue-500",value:"79.8%",label:"Occupancy"},
        {color:"bg-emerald-500",value:"$268",label:"ADR"},
        {color:"bg-violet-500",value:"$214",label:"RevPAR"},
        {color:"bg-amber-500",value:"$388K",label:"Revenue MTD"},
        {color:"bg-pink-500",value:"4.6/5",label:"Guest Score"},
      ]} />}
    >
      <AnimatePresence mode="wait">
        <motion.div key={activeSubmenu}>
          {activeNode}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}
