import React, { useState, useMemo } from "react";
import {
  DollarSign, TrendingUp, BarChart2, Percent, Building2,
  Download, Filter, Search, ArrowUpRight, ArrowDownRight, Calendar,
  RefreshCw, Tag, Wifi, WifiOff, ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface SalesRevenueProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: number;
  gradient: string;
  icon: React.ReactNode;
}

interface TopAccount {
  id: string;
  company: string;
  contact: string;
  roomNights: number;
  revenue: number;
  channel: string;
  yoy: number;
}

interface RoomTypeRow {
  id: string;
  roomType: string;
  available: number;
  sold: number;
  occupancy: number;
  adr: number;
  revpar: number;
  totalRevenue: number;
}

interface ReservationRow {
  id: string;
  bookingId: string;
  guestCompany: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  value: number;
  source: string;
  status: string;
  salesRep: string;
}

interface CorporateAccount {
  id: string;
  company: string;
  contact: string;
  industry: string;
  rnYtd: number;
  revenueYtd: number;
  rateCode: string;
  contractExpiry: string;
  status: string;
}

interface RateCode {
  id: string;
  code: string;
  name: string;
  type: string;
  rack: number;
  corporate: number;
  ota: number;
  active: boolean;
}

interface Promotion {
  id: string;
  name: string;
  discount: number;
  startDate: string;
  endDate: string;
  channels: string;
  minStay: number;
  bookings: number;
  status: string;
}

interface ChannelRow {
  id: string;
  channel: string;
  status: string;
  roomsAvailable: number;
  currentRate: number;
  lastSync: string;
  bookingsMtd: number;
  revenueMtd: number;
  commission: number;
}

interface ForecastRow {
  id: string;
  month: string;
  forecastOcc: number;
  forecastAdr: number;
  forecastRevpar: number;
  forecastRevenue: number;
  budget: number;
  variancePct: number;
  demandLevel: string;
}

interface GroupQuote {
  id: string;
  rfpId: string;
  groupName: string;
  eventType: string;
  checkIn: string;
  checkOut: string;
  roomsRequired: number;
  fbIncluded: boolean;
  totalValue: number;
  status: string;
  decisionDate: string;
  salesManager: string;
}

interface CompetitorRow {
  id: string;
  hotelName: string;
  roomType: string;
  tonight: number;
  tomorrow: number;
  thisWeekend: number;
  nextWeek: number;
  adr: number;
  positioning: string;
  isOurHotel?: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const revenueByMonth = [
  { month: "Apr", revenue: 312000, budget: 300000 },
  { month: "May", revenue: 298000, budget: 310000 },
  { month: "Jun", revenue: 341000, budget: 320000 },
  { month: "Jul", revenue: 375000, budget: 350000 },
  { month: "Aug", revenue: 389000, budget: 370000 },
  { month: "Sep", revenue: 362000, budget: 360000 },
  { month: "Oct", revenue: 347000, budget: 345000 },
  { month: "Nov", revenue: 321000, budget: 330000 },
  { month: "Dec", revenue: 398000, budget: 380000 },
  { month: "Jan", revenue: 276000, budget: 280000 },
  { month: "Feb", revenue: 304000, budget: 295000 },
  { month: "Mar", revenue: 408000, budget: 390000 },
];

const revenueBySource = [
  { source: "Direct", revenue: 1240000 },
  { source: "OTA", revenue: 980000 },
  { source: "Corporate", revenue: 1120000 },
  { source: "Walk-in", revenue: 312000 },
  { source: "GDS", revenue: 478000 },
];

const topAccounts: TopAccount[] = [
  { id: "a1", company: "Dangote Industries Ltd", contact: "Fatima Dangote", roomNights: 412, revenue: 128400, channel: "Corporate", yoy: 14.2 },
  { id: "a2", company: "MTN Group", contact: "Sipho Nkosi", roomNights: 388, revenue: 114960, channel: "GDS", yoy: 8.7 },
  { id: "a3", company: "Sanlam Financial", contact: "Anele Dlamini", roomNights: 356, revenue: 108340, channel: "Corporate", yoy: 22.1 },
  { id: "a4", company: "Vodacom Business", contact: "Thabo Molefe", roomNights: 298, revenue: 91240, channel: "Corporate", yoy: -3.4 },
  { id: "a5", company: "Naspers / Prosus", contact: "Caro van der Berg", roomNights: 276, revenue: 87120, channel: "Direct", yoy: 18.9 },
  { id: "a6", company: "Standard Bank Group", contact: "Zanele Mokoena", roomNights: 264, revenue: 83520, channel: "GDS", yoy: 5.2 },
  { id: "a7", company: "Discovery Health", contact: "Ravi Naidoo", roomNights: 241, revenue: 76076, channel: "Corporate", yoy: 31.4 },
  { id: "a8", company: "Anglo American PLC", contact: "James Whitfield", roomNights: 224, revenue: 71680, channel: "GDS", yoy: -7.8 },
  { id: "a9", company: "Shoprite Holdings", contact: "Nomvula Dube", roomNights: 212, revenue: 67180, channel: "Corporate", yoy: 9.3 },
  { id: "a10", company: "FirstRand Limited", contact: "Priya Govender", roomNights: 198, revenue: 63360, channel: "Direct", yoy: 4.6 },
  { id: "a11", company: "Sasol Energy", contact: "Kobus Louw", roomNights: 187, revenue: 60060, channel: "Corporate", yoy: -1.2 },
  { id: "a12", company: "African Rainbow Minerals", contact: "Lungile Sithole", roomNights: 174, revenue: 55680, channel: "GDS", yoy: 16.7 },
];

const yearOverYear = [
  { month: "Apr", thisYear: 312000, lastYear: 278000 },
  { month: "May", thisYear: 298000, lastYear: 261000 },
  { month: "Jun", thisYear: 341000, lastYear: 304000 },
  { month: "Jul", thisYear: 375000, lastYear: 342000 },
  { month: "Aug", thisYear: 389000, lastYear: 351000 },
  { month: "Sep", thisYear: 362000, lastYear: 329000 },
  { month: "Oct", thisYear: 347000, lastYear: 312000 },
  { month: "Nov", thisYear: 321000, lastYear: 291000 },
  { month: "Dec", thisYear: 398000, lastYear: 362000 },
  { month: "Jan", thisYear: 276000, lastYear: 248000 },
  { month: "Feb", thisYear: 304000, lastYear: 277000 },
  { month: "Mar", thisYear: 408000, lastYear: 372000 },
];

const roomTypeData: RoomTypeRow[] = [
  { id: "rt1", roomType: "Deluxe King", available: 3650, sold: 3029, occupancy: 83.0, adr: 248, revpar: 205, totalRevenue: 751192 },
  { id: "rt2", roomType: "Superior Twin", available: 2920, sold: 2278, occupancy: 78.0, adr: 232, revpar: 181, totalRevenue: 528496 },
  { id: "rt3", roomType: "Executive Suite", available: 1460, sold: 1138, occupancy: 77.9, adr: 498, revpar: 388, totalRevenue: 566724 },
  { id: "rt4", roomType: "Presidential Suite", available: 365, sold: 271, occupancy: 74.2, adr: 1240, revpar: 920, totalRevenue: 336040 },
  { id: "rt5", roomType: "Junior Suite", available: 1825, sold: 1494, occupancy: 81.8, adr: 348, revpar: 285, totalRevenue: 519912 },
  { id: "rt6", roomType: "Studio Room", available: 2190, sold: 1664, occupancy: 76.0, adr: 198, revpar: 151, totalRevenue: 329472 },
  { id: "rt7", roomType: "Accessible Room", available: 730, sold: 554, occupancy: 75.9, adr: 218, revpar: 165, totalRevenue: 120772 },
];

const reservations: ReservationRow[] = [
  { id: "r1", bookingId: "BK-2024-8821", guestCompany: "Dangote Industries", guestName: "Abubakar Musa", roomType: "Executive Suite", checkIn: "2024-04-08", checkOut: "2024-04-11", nights: 3, value: 4986, source: "Corporate", status: "Confirmed", salesRep: "Lebo Moagi" },
  { id: "r2", bookingId: "BK-2024-8822", guestCompany: "Individual", guestName: "Sofia Mendes", roomType: "Deluxe King", checkIn: "2024-04-09", checkOut: "2024-04-12", nights: 3, value: 1488, source: "Direct", status: "Confirmed", salesRep: "Direct" },
  { id: "r3", bookingId: "BK-2024-8823", guestCompany: "MTN Group", guestName: "Kojo Asante", roomType: "Superior Twin", checkIn: "2024-04-10", checkOut: "2024-04-13", nights: 3, value: 2088, source: "GDS", status: "Confirmed", salesRep: "Thandi Ndlovu" },
  { id: "r4", bookingId: "BK-2024-8824", guestCompany: "Individual", guestName: "Yuki Tanaka", roomType: "Junior Suite", checkIn: "2024-04-10", checkOut: "2024-04-14", nights: 4, value: 2784, source: "OTA", status: "Pending", salesRep: "OTA" },
  { id: "r5", bookingId: "BK-2024-8825", guestCompany: "Standard Bank", guestName: "Zanele Mokoena", roomType: "Deluxe King", checkIn: "2024-04-11", checkOut: "2024-04-13", nights: 2, value: 992, source: "Corporate", status: "Confirmed", salesRep: "Lebo Moagi" },
  { id: "r6", bookingId: "BK-2024-8826", guestCompany: "Individual", guestName: "Emmanuel Okafor", roomType: "Studio Room", checkIn: "2024-04-11", checkOut: "2024-04-15", nights: 4, value: 1584, source: "OTA", status: "Confirmed", salesRep: "OTA" },
  { id: "r7", bookingId: "BK-2024-8827", guestCompany: "Sanlam", guestName: "Pieter de Klerk", roomType: "Executive Suite", checkIn: "2024-04-12", checkOut: "2024-04-14", nights: 2, value: 3324, source: "Corporate", status: "Hold", salesRep: "Thandi Ndlovu" },
  { id: "r8", bookingId: "BK-2024-8828", guestCompany: "Individual", guestName: "Amara Diallo", roomType: "Deluxe King", checkIn: "2024-04-13", checkOut: "2024-04-16", nights: 3, value: 1488, source: "Walk-in", status: "Confirmed", salesRep: "Front Desk" },
  { id: "r9", bookingId: "BK-2024-8829", guestCompany: "Naspers", guestName: "Caro van der Berg", roomType: "Junior Suite", checkIn: "2024-04-14", checkOut: "2024-04-17", nights: 3, value: 2088, source: "Direct", status: "Confirmed", salesRep: "Lebo Moagi" },
  { id: "r10", bookingId: "BK-2024-8830", guestCompany: "Anglo American", guestName: "James Whitfield", roomType: "Presidential Suite", checkIn: "2024-04-15", checkOut: "2024-04-18", nights: 3, value: 11160, source: "GDS", status: "Confirmed", salesRep: "Thandi Ndlovu" },
  { id: "r11", bookingId: "BK-2024-8831", guestCompany: "Individual", guestName: "Ngozi Adeyemi", roomType: "Superior Twin", checkIn: "2024-04-16", checkOut: "2024-04-18", nights: 2, value: 928, source: "OTA", status: "Pending", salesRep: "OTA" },
  { id: "r12", bookingId: "BK-2024-8832", guestCompany: "Discovery Health", guestName: "Ravi Naidoo", roomType: "Deluxe King", checkIn: "2024-04-17", checkOut: "2024-04-20", nights: 3, value: 1488, source: "Corporate", status: "Confirmed", salesRep: "Lebo Moagi" },
  { id: "r13", bookingId: "BK-2024-8833", guestCompany: "Individual", guestName: "Isabelle Laurent", roomType: "Studio Room", checkIn: "2024-04-18", checkOut: "2024-04-21", nights: 3, value: 1188, source: "Direct", status: "Confirmed", salesRep: "Direct" },
  { id: "r14", bookingId: "BK-2024-8834", guestCompany: "Sasol", guestName: "Kobus Louw", roomType: "Deluxe King", checkIn: "2024-04-19", checkOut: "2024-04-22", nights: 3, value: 1488, source: "Corporate", status: "Cancelled", salesRep: "Thandi Ndlovu" },
  { id: "r15", bookingId: "BK-2024-8835", guestCompany: "Individual", guestName: "Tariq Al-Rashid", roomType: "Junior Suite", checkIn: "2024-04-20", checkOut: "2024-04-23", nights: 3, value: 2088, source: "OTA", status: "Confirmed", salesRep: "OTA" },
  { id: "r16", bookingId: "BK-2024-8836", guestCompany: "FirstRand", guestName: "Priya Govender", roomType: "Executive Suite", checkIn: "2024-04-21", checkOut: "2024-04-24", nights: 3, value: 4986, source: "Corporate", status: "Confirmed", salesRep: "Lebo Moagi" },
];

const corporateAccounts: CorporateAccount[] = [
  { id: "c1", company: "Dangote Industries Ltd", contact: "Fatima Dangote", industry: "Manufacturing", rnYtd: 412, revenueYtd: 128400, rateCode: "CORP-DAN01", contractExpiry: "2024-12-31", status: "Active" },
  { id: "c2", company: "MTN Group", contact: "Sipho Nkosi", industry: "Telecommunications", rnYtd: 388, revenueYtd: 114960, rateCode: "CORP-MTN01", contractExpiry: "2025-03-31", status: "Active" },
  { id: "c3", company: "Sanlam Financial Services", contact: "Anele Dlamini", industry: "Financial Services", rnYtd: 356, revenueYtd: 108340, rateCode: "CORP-SAN01", contractExpiry: "2024-09-30", status: "Renewal Due" },
  { id: "c4", company: "Vodacom Business", contact: "Thabo Molefe", industry: "Telecommunications", rnYtd: 298, revenueYtd: 91240, rateCode: "CORP-VOD01", contractExpiry: "2025-06-30", status: "Active" },
  { id: "c5", company: "Naspers / Prosus", contact: "Caro van der Berg", industry: "Technology / Media", rnYtd: 276, revenueYtd: 87120, rateCode: "CORP-NAS01", contractExpiry: "2024-12-31", status: "Active" },
  { id: "c6", company: "Standard Bank Group", contact: "Zanele Mokoena", industry: "Banking", rnYtd: 264, revenueYtd: 83520, rateCode: "CORP-STB01", contractExpiry: "2025-01-31", status: "Active" },
  { id: "c7", company: "Discovery Health", contact: "Ravi Naidoo", industry: "Healthcare / Insurance", rnYtd: 241, revenueYtd: 76076, rateCode: "CORP-DIS01", contractExpiry: "2024-11-30", status: "Active" },
  { id: "c8", company: "Anglo American PLC", contact: "James Whitfield", industry: "Mining", rnYtd: 224, revenueYtd: 71680, rateCode: "CORP-ANG01", contractExpiry: "2024-06-30", status: "Expired" },
  { id: "c9", company: "Shoprite Holdings", contact: "Nomvula Dube", industry: "Retail", rnYtd: 212, revenueYtd: 67180, rateCode: "CORP-SHP01", contractExpiry: "2025-03-31", status: "Active" },
  { id: "c10", company: "FirstRand Limited", contact: "Priya Govender", industry: "Banking", rnYtd: 198, revenueYtd: 63360, rateCode: "CORP-FRD01", contractExpiry: "2025-02-28", status: "Active" },
  { id: "c11", company: "Sasol Energy", contact: "Kobus Louw", industry: "Energy / Petrochemicals", rnYtd: 187, revenueYtd: 60060, rateCode: "CORP-SAS01", contractExpiry: "2024-08-31", status: "Renewal Due" },
  { id: "c12", company: "African Rainbow Minerals", contact: "Lungile Sithole", industry: "Mining", rnYtd: 174, revenueYtd: 55680, rateCode: "CORP-ARM01", contractExpiry: "2025-05-31", status: "Active" },
];

const rateCodes: RateCode[] = [
  { id: "rc1", code: "BAR", name: "Best Available Rate", type: "Public", rack: 320, corporate: 295, ota: 310, active: true },
  { id: "rc2", code: "CORP-TIER1", name: "Corporate Tier 1", type: "Corporate", rack: 320, corporate: 248, ota: 0, active: true },
  { id: "rc3", code: "CORP-TIER2", name: "Corporate Tier 2", type: "Corporate", rack: 320, corporate: 268, ota: 0, active: true },
  { id: "rc4", code: "GOV-RATE", name: "Government Rate", type: "Government", rack: 320, corporate: 224, ota: 0, active: true },
  { id: "rc5", code: "RACK", name: "Rack Rate", type: "Public", rack: 420, corporate: 420, ota: 420, active: true },
  { id: "rc6", code: "PKG-BB", name: "Bed & Breakfast Package", type: "Package", rack: 348, corporate: 325, ota: 340, active: true },
  { id: "rc7", code: "PKG-HB", name: "Half Board Package", type: "Package", rack: 428, corporate: 405, ota: 418, active: false },
  { id: "rc8", code: "NGO-RATE", name: "NGO / Non-Profit Rate", type: "Negotiated", rack: 320, corporate: 212, ota: 0, active: true },
  { id: "rc9", code: "SENIOR", name: "Senior Citizen Discount", type: "Promotional", rack: 320, corporate: 288, ota: 0, active: false },
  { id: "rc10", code: "AAA", name: "AAA / Auto Club Rate", type: "Loyalty", rack: 320, corporate: 280, ota: 0, active: true },
];

const promotions: Promotion[] = [
  { id: "p1", name: "Spring Escape", discount: 20, startDate: "2024-04-01", endDate: "2024-04-30", channels: "Direct, OTA", minStay: 2, bookings: 84, status: "Active" },
  { id: "p2", name: "Long Weekend Deal", discount: 15, startDate: "2024-04-26", endDate: "2024-04-29", channels: "Direct", minStay: 3, bookings: 46, status: "Active" },
  { id: "p3", name: "Corporate Q2 Promo", discount: 10, startDate: "2024-04-01", endDate: "2024-06-30", channels: "Corporate", minStay: 1, bookings: 138, status: "Active" },
  { id: "p4", name: "Summer Sun Package", discount: 25, startDate: "2024-06-01", endDate: "2024-08-31", channels: "All", minStay: 3, bookings: 0, status: "Upcoming" },
  { id: "p5", name: "Festive Season Rate", discount: 0, startDate: "2024-12-15", endDate: "2025-01-05", channels: "Direct", minStay: 4, bookings: 0, status: "Upcoming" },
  { id: "p6", name: "Valentine's Retreat", discount: 18, startDate: "2024-02-10", endDate: "2024-02-16", channels: "Direct, OTA", minStay: 2, bookings: 62, status: "Expired" },
];

const channels: ChannelRow[] = [
  { id: "ch1", channel: "Booking.com", status: "Connected", roomsAvailable: 48, currentRate: 296, lastSync: "2 min ago", bookingsMtd: 214, revenueMtd: 63344, commission: 15 },
  { id: "ch2", channel: "Expedia", status: "Connected", roomsAvailable: 48, currentRate: 304, lastSync: "5 min ago", bookingsMtd: 178, revenueMtd: 54112, commission: 18 },
  { id: "ch3", channel: "Airbnb", status: "Connected", roomsAvailable: 12, currentRate: 312, lastSync: "8 min ago", bookingsMtd: 86, revenueMtd: 26832, commission: 14 },
  { id: "ch4", channel: "Hotels.com", status: "Connected", roomsAvailable: 48, currentRate: 288, lastSync: "12 min ago", bookingsMtd: 142, revenueMtd: 40896, commission: 15 },
  { id: "ch5", channel: "Agoda", status: "Paused", roomsAvailable: 0, currentRate: 292, lastSync: "2 days ago", bookingsMtd: 38, revenueMtd: 11096, commission: 12 },
  { id: "ch6", channel: "Direct Website", status: "Connected", roomsAvailable: 60, currentRate: 268, lastSync: "Live", bookingsMtd: 312, revenueMtd: 83616, commission: 0 },
  { id: "ch7", channel: "GDS (Sabre/Amadeus)", status: "Connected", roomsAvailable: 60, currentRate: 314, lastSync: "30 min ago", bookingsMtd: 96, revenueMtd: 30144, commission: 10 },
  { id: "ch8", channel: "Walk-in / Front Desk", status: "Connected", roomsAvailable: 60, currentRate: 320, lastSync: "Live", bookingsMtd: 54, revenueMtd: 17280, commission: 0 },
];

const forecastRows: ForecastRow[] = [
  { id: "f1", month: "April 2024", forecastOcc: 80.2, forecastAdr: 271, forecastRevpar: 217, forecastRevenue: 412000, budget: 390000, variancePct: 5.6, demandLevel: "High" },
  { id: "f2", month: "May 2024", forecastOcc: 77.8, forecastAdr: 264, forecastRevpar: 205, forecastRevenue: 391000, budget: 375000, variancePct: 4.3, demandLevel: "Medium" },
  { id: "f3", month: "June 2024", forecastOcc: 82.4, forecastAdr: 278, forecastRevpar: 229, forecastRevenue: 436000, budget: 420000, variancePct: 3.8, demandLevel: "High" },
  { id: "f4", month: "July 2024", forecastOcc: 88.6, forecastAdr: 298, forecastRevpar: 264, forecastRevenue: 503000, budget: 480000, variancePct: 4.8, demandLevel: "High" },
  { id: "f5", month: "August 2024", forecastOcc: 91.2, forecastAdr: 312, forecastRevpar: 285, forecastRevenue: 543000, budget: 520000, variancePct: 4.4, demandLevel: "High" },
  { id: "f6", month: "September 2024", forecastOcc: 84.3, forecastAdr: 284, forecastRevpar: 239, forecastRevenue: 456000, budget: 440000, variancePct: 3.6, demandLevel: "High" },
  { id: "f7", month: "October 2024", forecastOcc: 78.9, forecastAdr: 268, forecastRevpar: 211, forecastRevenue: 402000, budget: 395000, variancePct: 1.8, demandLevel: "Medium" },
  { id: "f8", month: "November 2024", forecastOcc: 74.1, forecastAdr: 254, forecastRevpar: 188, forecastRevenue: 358000, budget: 362000, variancePct: -1.1, demandLevel: "Medium" },
  { id: "f9", month: "December 2024", forecastOcc: 86.7, forecastAdr: 342, forecastRevpar: 297, forecastRevenue: 565000, budget: 540000, variancePct: 4.6, demandLevel: "High" },
  { id: "f10", month: "January 2025", forecastOcc: 68.4, forecastAdr: 241, forecastRevpar: 165, forecastRevenue: 314000, budget: 320000, variancePct: -1.9, demandLevel: "Low" },
  { id: "f11", month: "February 2025", forecastOcc: 72.6, forecastAdr: 258, forecastRevpar: 187, forecastRevenue: 357000, budget: 345000, variancePct: 3.5, demandLevel: "Medium" },
  { id: "f12", month: "March 2025", forecastOcc: 83.8, forecastAdr: 288, forecastRevpar: 241, forecastRevenue: 459000, budget: 435000, variancePct: 5.5, demandLevel: "High" },
];

const forecastChartData = forecastRows.map((r) => ({
  month: r.month.split(" ")[0],
  forecasted: r.forecastRevenue,
  budget: r.budget,
  actual: r.month.includes("2024") && ["April", "May", "June"].includes(r.month.split(" ")[0])
    ? Math.round(r.forecastRevenue * 0.98)
    : undefined,
}));

const groupQuotes: GroupQuote[] = [
  { id: "gq1", rfpId: "RFP-2024-0041", groupName: "Dangote Family Reunion", eventType: "Social Event", checkIn: "2024-06-14", checkOut: "2024-06-17", roomsRequired: 45, fbIncluded: true, totalValue: 198000, status: "Confirmed", decisionDate: "2024-03-15", salesManager: "Lebo Moagi" },
  { id: "gq2", rfpId: "RFP-2024-0042", groupName: "MTN Pan-Africa Summit", eventType: "Conference", checkIn: "2024-05-20", checkOut: "2024-05-24", roomsRequired: 120, fbIncluded: true, totalValue: 524000, status: "Confirmed", decisionDate: "2024-02-28", salesManager: "Thandi Ndlovu" },
  { id: "gq3", rfpId: "RFP-2024-0043", groupName: "SA Mining Expo Delegates", eventType: "Trade Show", checkIn: "2024-07-08", checkOut: "2024-07-11", roomsRequired: 80, fbIncluded: false, totalValue: 312000, status: "Negotiating", decisionDate: "2024-04-30", salesManager: "Lebo Moagi" },
  { id: "gq4", rfpId: "RFP-2024-0044", groupName: "Discovery Health Annual Retreat", eventType: "Corporate Retreat", checkIn: "2024-08-12", checkOut: "2024-08-15", roomsRequired: 60, fbIncluded: true, totalValue: 264000, status: "Proposal Sent", decisionDate: "2024-05-15", salesManager: "Thandi Ndlovu" },
  { id: "gq5", rfpId: "RFP-2024-0045", groupName: "Wits University Graduation", eventType: "Academic", checkIn: "2024-04-10", checkOut: "2024-04-14", roomsRequired: 35, fbIncluded: false, totalValue: 129000, status: "Confirmed", decisionDate: "2024-02-14", salesManager: "Sipho Radebe" },
  { id: "gq6", rfpId: "RFP-2024-0046", groupName: "Naspers Board Offsite", eventType: "Board Meeting", checkIn: "2024-05-06", checkOut: "2024-05-08", roomsRequired: 18, fbIncluded: true, totalValue: 89400, status: "Confirmed", decisionDate: "2024-03-20", salesManager: "Lebo Moagi" },
  { id: "gq7", rfpId: "RFP-2024-0047", groupName: "AU Economic Forum", eventType: "Government", checkIn: "2024-09-23", checkOut: "2024-09-27", roomsRequired: 200, fbIncluded: true, totalValue: 980000, status: "Prospect", decisionDate: "2024-06-01", salesManager: "Thandi Ndlovu" },
  { id: "gq8", rfpId: "RFP-2024-0048", groupName: "Standard Bank Leadership", eventType: "Corporate Training", checkIn: "2024-06-03", checkOut: "2024-06-05", roomsRequired: 42, fbIncluded: true, totalValue: 188000, status: "Negotiating", decisionDate: "2024-04-15", salesManager: "Sipho Radebe" },
  { id: "gq9", rfpId: "RFP-2024-0049", groupName: "Nigeria Tech Week Delegates", eventType: "Tech Event", checkIn: "2024-10-14", checkOut: "2024-10-18", roomsRequired: 90, fbIncluded: false, totalValue: 356000, status: "Proposal Sent", decisionDate: "2024-07-01", salesManager: "Lebo Moagi" },
  { id: "gq10", rfpId: "RFP-2024-0050", groupName: "Sasol Energy Partners", eventType: "Corporate Meeting", checkIn: "2024-05-27", checkOut: "2024-05-29", roomsRequired: 28, fbIncluded: true, totalValue: 124000, status: "Lost", decisionDate: "2024-03-31", salesManager: "Thandi Ndlovu" },
  { id: "gq11", rfpId: "RFP-2024-0051", groupName: "Pan-African Women Leaders Forum", eventType: "Non-Profit Conference", checkIn: "2024-11-04", checkOut: "2024-11-07", roomsRequired: 55, fbIncluded: true, totalValue: 214000, status: "Prospect", decisionDate: "2024-08-01", salesManager: "Sipho Radebe" },
  { id: "gq12", rfpId: "RFP-2024-0052", groupName: "Telkom Innovation Sprint", eventType: "Hackathon / Workshop", checkIn: "2024-07-22", checkOut: "2024-07-24", roomsRequired: 30, fbIncluded: false, totalValue: 108000, status: "Proposal Sent", decisionDate: "2024-05-30", salesManager: "Lebo Moagi" },
];

const competitors: CompetitorRow[] = [
  { id: "co0", hotelName: "Singularity Grand Hotel", roomType: "Deluxe King", tonight: 248, tomorrow: 262, thisWeekend: 298, nextWeek: 271, adr: 268, positioning: "At Market", isOurHotel: true },
  { id: "co1", hotelName: "The Michelangelo Hotel", roomType: "Deluxe Room", tonight: 268, tomorrow: 285, thisWeekend: 320, nextWeek: 292, adr: 284, positioning: "Above Market" },
  { id: "co2", hotelName: "The Pivot Hotel Montecasino", roomType: "Standard King", tonight: 224, tomorrow: 238, thisWeekend: 278, nextWeek: 248, adr: 241, positioning: "Below Market" },
  { id: "co3", hotelName: "Radisson Blu Gautrain", roomType: "Superior Room", tonight: 244, tomorrow: 258, thisWeekend: 294, nextWeek: 264, adr: 261, positioning: "At Market" },
  { id: "co4", hotelName: "Sandton Sun Hotel", roomType: "Deluxe Room", tonight: 258, tomorrow: 272, thisWeekend: 308, nextWeek: 278, adr: 274, positioning: "Above Market" },
  { id: "co5", hotelName: "InterContinental JNB", roomType: "Classic Room", tonight: 276, tomorrow: 292, thisWeekend: 332, nextWeek: 304, adr: 296, positioning: "Above Market" },
  { id: "co6", hotelName: "Garden Court Sandton City", roomType: "Standard Room", tonight: 198, tomorrow: 211, thisWeekend: 248, nextWeek: 218, adr: 212, positioning: "Below Market" },
];

const compTrendData = [
  { day: "Mon", singularity: 248, michelangelo: 268, sandtonSun: 258 },
  { day: "Tue", singularity: 252, michelangelo: 272, sandtonSun: 262 },
  { day: "Wed", singularity: 258, michelangelo: 276, sandtonSun: 268 },
  { day: "Thu", singularity: 262, michelangelo: 281, sandtonSun: 274 },
  { day: "Fri", singularity: 284, michelangelo: 308, sandtonSun: 296 },
  { day: "Sat", singularity: 298, michelangelo: 320, sandtonSun: 312 },
  { day: "Sun", singularity: 268, michelangelo: 290, sandtonSun: 281 },
];

const barGridDays = ["Mon 8", "Tue 9", "Wed 10", "Thu 11", "Fri 12", "Sat 13", "Sun 14"];
const barGridRoomTypes = ["Deluxe King", "Superior Twin", "Junior Suite", "Executive Suite", "Presidential Suite"];
const barGridRates: Record<string, number[]> = {
  "Deluxe King":        [248, 248, 254, 262, 298, 312, 278],
  "Superior Twin":      [232, 232, 238, 246, 278, 292, 261],
  "Junior Suite":       [348, 348, 358, 368, 418, 435, 392],
  "Executive Suite":    [498, 498, 512, 528, 598, 624, 562],
  "Presidential Suite": [1240, 1240, 1240, 1280, 1480, 1480, 1350],
};

// ─── Helper Components ──────────────────────────────────────────────────────────

function StatCard({ label, value, subtext, trend, gradient, icon }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-2xl p-5 text-white shadow-sm", gradient)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {subtext && <p className="mt-1 text-xs text-white/70">{subtext}</p>}
        </div>
        <div className="rounded-xl bg-white/20 p-2.5">{icon}</div>
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          {trend >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          <span>{Math.abs(trend)}% vs last year</span>
        </div>
      )}
    </motion.div>
  );
}

function channelBadge(channel: string) {
  const map: Record<string, string> = {
    Corporate: "bg-blue-100 text-blue-700",
    OTA: "bg-orange-100 text-orange-700",
    Direct: "bg-green-100 text-green-700",
    GDS: "bg-purple-100 text-purple-700",
    "Walk-in": "bg-muted text-foreground",
  };
  return map[channel] ?? "bg-muted text-muted-foreground";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Hold: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
    Active: "bg-green-100 text-green-700",
    "Renewal Due": "bg-yellow-100 text-yellow-700",
    Expired: "bg-red-100 text-red-700",
    Connected: "bg-green-100 text-green-700",
    Paused: "bg-yellow-100 text-yellow-700",
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-blue-100 text-blue-700",
    Prospect: "bg-purple-100 text-purple-700",
    "Proposal Sent": "bg-blue-100 text-blue-700",
    Negotiating: "bg-orange-100 text-orange-700",
    Lost: "bg-red-100 text-red-700",
    "At Market": "bg-muted text-foreground",
    "Above Market": "bg-red-100 text-red-700",
    "Below Market": "bg-green-100 text-green-700",
    Upcoming: "bg-indigo-100 text-indigo-700",
    Expired2: "bg-muted text-muted-foreground",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

function Badge({ label }: { label: string }) {
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusBadge(label))}>
      {label}
    </span>
  );
}

function fmt(n: number) {
  return n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(2)}M`
    : n >= 1_000
    ? `$${(n / 1_000).toFixed(0)}K`
    : `$${n}`;
}

function fmtFull(n: number) {
  return `$${n.toLocaleString()}`;
}

function rateColor(rate: number, base: number) {
  const pct = ((rate - base) / base) * 100;
  if (pct > 10) return "bg-red-100 text-red-800";
  if (pct > 0) return "bg-orange-100 text-orange-800";
  if (pct < -10) return "bg-green-100 text-green-800";
  if (pct < 0) return "bg-blue-100 text-blue-800";
  return "bg-muted text-foreground";
}

// ─── Sub-view: Overview ─────────────────────────────────────────────────────────

function Overview() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search sales..." />}
      header={<SectionHeader icon={TrendingUp} title="Sales & Revenue Overview" subtitle="Key performance indicators and revenue trends" />}
      kpi={<KpiStrip
        items={[
          { color: "bg-emerald-500", value: "$4.13M", label: "Total Revenue YTD" },
          { color: "bg-blue-500", value: "$268", label: "Average Daily Rate" },
          { color: "bg-violet-500", value: "$214", label: "RevPAR" },
          { color: "bg-amber-500", value: "79.8%", label: "Occupancy Rate" },
          { color: "bg-rose-500", value: "+5.6%", label: "vs Budget" },
        ]}
      />}
    >

        {/* Revenue vs Budget Line Chart */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title="Revenue vs Budget — Last 12 Months"
              subtitle="Monthly actual revenue compared to budget targets"
              actions={
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
              }
            />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueByMonth} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Actual" />
              <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Budget" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-emerald-500 inline-block" />Actual Revenue</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-violet-500 inline-block" />Budget</span>
          </div>
        </div>

        {/* Revenue by Source Bar Chart */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <SectionHeader title="Revenue by Source" subtitle="Annual contribution by booking channel" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueBySource} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="source" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Producing Accounts */}
        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <SectionHeader
              title="Top Producing Accounts"
              actions={
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                  <Filter className="h-3.5 w-3.5" /> Filter
                </button>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Room Nights</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Channel</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">YoY %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {topAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="truncate max-w-[180px] block font-medium text-foreground" title={acc.company}>{acc.company}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="truncate max-w-[140px] block" title={acc.contact}>{acc.contact}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{acc.roomNights}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">{fmtFull(acc.revenue)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-medium", channelBadge(acc.channel))}>{acc.channel}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("flex items-center justify-end gap-0.5 text-xs font-medium", acc.yoy >= 0 ? "text-emerald-600" : "text-red-500")}>
                        {acc.yoy >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {Math.abs(acc.yoy)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </PageShell>
  );
}

// ─── Sub-view: Revenue Analysis ─────────────────────────────────────────────────

function RevenueAnalysis() {
  const totals = useMemo(() => ({
    available: roomTypeData.reduce((s, r) => s + r.available, 0),
    sold: roomTypeData.reduce((s, r) => s + r.sold, 0),
    totalRevenue: roomTypeData.reduce((s, r) => s + r.totalRevenue, 0),
  }), []);
  const avgOcc = ((totals.sold / totals.available) * 100).toFixed(1);
  const avgAdr = Math.round(totals.totalRevenue / totals.sold);
  const avgRevpar = Math.round(totals.totalRevenue / totals.available);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search revenue..." />}
      header={<SectionHeader icon={TrendingUp} title="Revenue Analysis" subtitle="Year-over-year performance and room type breakdown" />}
      kpi={<KpiStrip
        items={[
          { color: "bg-emerald-500", value: "+5.6%", label: "Revenue vs Budget" },
          { color: "bg-blue-500", value: "+12.4%", label: "YOY Growth" },
          { color: "bg-violet-500", value: "March", label: "Best Month" },
          { color: "bg-amber-500", value: "82.3%", label: "Room Rev Share" },
          { color: "bg-rose-500", value: `$${avgAdr}`, label: "Avg Daily Rate" },
        ]}
      />}
    >

        {/* Year over Year Area Chart */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <SectionHeader title="This Year vs Last Year" subtitle="Monthly revenue comparison" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={yearOverYear} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="thisYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="thisYear" stroke="#10b981" strokeWidth={2.5} fill="url(#thisYear)" name="This Year" />
              <Area type="monotone" dataKey="lastYear" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" fill="url(#lastYear)" name="Last Year" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Room Type Bar */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <SectionHeader title="Revenue by Room Type" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={roomTypeData.map((r) => ({ name: r.roomType, revenue: r.totalRevenue }))}
              margin={{ top: 5, right: 20, left: -5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Detail Table */}
        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <SectionHeader title="Room Type Performance" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Room Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Available</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Sold</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground min-w-[140px]">Occupancy %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">ADR</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">RevPAR</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {roomTypeData.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{row.roomType}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground font-mono">{row.available.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground font-mono">{row.sold.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-1.5 min-w-[80px]">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${row.occupancy}%` }} />
                        </div>
                        <span className="text-xs font-mono text-foreground w-10 text-right">{row.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${row.adr}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${row.revpar}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{fmtFull(row.totalRevenue)}</td>
                  </tr>
                ))}
                <tr className="bg-secondary/30 font-semibold border-t-2 border-border">
                  <td className="px-4 py-3 text-foreground">Total</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{totals.available.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{totals.sold.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{avgOcc}% avg</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">${avgAdr}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">${avgRevpar}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-foreground">{fmtFull(totals.totalRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
    </PageShell>
  );
}

// ─── Sub-view: Reservations Pipeline ────────────────────────────────────────────

function ReservationsPipeline() {
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const sources = ["All", "Corporate", "OTA", "Direct", "GDS", "Walk-in"];
  const statuses = ["All", "Confirmed", "Pending", "Hold", "Cancelled"];

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const srcOk = sourceFilter === "All" || r.source === sourceFilter;
      const stOk = statusFilter === "All" || r.status === statusFilter;
      return srcOk && stOk;
    });
  }, [sourceFilter, statusFilter]);

  const totalValue = filtered.reduce((s, r) => s + r.value, 0);
  const confirmed = filtered.filter((r) => r.status === "Confirmed").length;

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search pipeline..." />}
      header={<SectionHeader icon={TrendingUp} title="Reservations Pipeline" subtitle="Booking flow and pipeline value" />}
      kpi={<KpiStrip items={[
        { color: "bg-blue-500", value: filtered.length.toString(), label: "Total Bookings" },
        { color: "bg-emerald-500", value: confirmed.toString(), label: "Confirmed" },
        { color: "bg-violet-500", value: fmt(totalValue), label: "Pipeline Value" },
        { color: "bg-amber-500", value: filtered.length ? `$${Math.round(totalValue / filtered.length).toLocaleString()}` : "$0", label: "Avg Booking" },
        { color: "bg-rose-500", value: filtered.filter(r => r.status === "Pending").length.toString(), label: "Pending" },
      ]} />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Source:</span>
            {sources.map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  sourceFilter === s ? "bg-blue-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Status:</span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  statusFilter === s ? "bg-violet-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Booking ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Guest / Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Room Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Check Out</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Nights</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Sales Rep</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.bookingId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground truncate max-w-[140px]" title={r.guestName}>{r.guestName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]" title={r.guestCompany}>{r.guestCompany}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.roomType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.checkIn}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.checkOut}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{r.nights}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">{fmtFull(r.value)}</td>
                    <td className="px-4 py-3"><span className={cn("px-3 py-1 rounded-full text-xs font-medium", channelBadge(r.source))}>{r.source}</span></td>
                    <td className="px-4 py-3"><Badge label={r.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[100px]" title={r.salesRep}>{r.salesRep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Corporate Accounts ───────────────────────────────────────────────

function CorporateAccounts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "Active", "Renewal Due", "Expired"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return corporateAccounts.filter((c) => {
      const matchSearch = c.company.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search accounts..." />}
      header={<SectionHeader icon={TrendingUp} title="Corporate Accounts" subtitle="Manage corporate client accounts and contracts" />}
      kpi={<KpiStrip items={[
        { color: "bg-blue-500", value: corporateAccounts.length.toString(), label: "Total Accounts" },
        { color: "bg-emerald-500", value: corporateAccounts.filter(c => c.status === "Active").length.toString(), label: "Active" },
        { color: "bg-amber-500", value: corporateAccounts.filter(c => c.status === "Renewal Due").length.toString(), label: "Renewal Due" },
        { color: "bg-red-500", value: corporateAccounts.filter(c => c.status === "Expired").length.toString(), label: "Expired" },
        { color: "bg-violet-500", value: fmt(corporateAccounts.reduce((s, c) => s + c.revenueYtd, 0)), label: "Total Revenue" },
      ]} />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="corporate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
        {/* Header Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  statusFilter === s ? "bg-blue-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Industry</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">RN YTD</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Revenue YTD</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rate Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground truncate max-w-[180px] block" title={c.company}>{c.company}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="truncate max-w-[140px] block" title={c.contact}>{c.contact}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="truncate max-w-[160px] block" title={c.industry}>{c.industry}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{c.rnYtd}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">{fmtFull(c.revenueYtd)}</td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs bg-secondary px-2 py-0.5 rounded text-foreground">{c.rateCode}</code>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.contractExpiry}</td>
                    <td className="px-4 py-3"><Badge label={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Rate Management ───────────────────────────────────────────────────

function RateManagement() {
  const [activeTab, setActiveTab] = useState<"codes" | "bar" | "promotions">("codes");
  const tabs = [
    { key: "codes" as const, label: "Rate Codes" },
    { key: "bar" as const, label: "BAR Grid" },
    { key: "promotions" as const, label: "Promotions" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search rates..." />}
      header={<SectionHeader icon={TrendingUp} title="Rate Management" subtitle="Rate codes, BAR grid, and promotions" />}
      kpi={<KpiStrip items={[
        { color: "bg-blue-500", value: rateCodes.length.toString(), label: "Rate Codes" },
        { color: "bg-emerald-500", value: rateCodes.filter(r => r.active).length.toString(), label: "Active" },
        { color: "bg-amber-500", value: rateCodes.filter(r => !r.active).length.toString(), label: "Inactive" },
        { color: "bg-violet-500", value: "3", label: "Promotions" },
        { color: "bg-rose-500", value: "5", label: "Room Types" },
      ]} />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="rates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "codes" && (
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <SectionHeader title="Rate Code Directory" />
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                <Tag className="h-3.5 w-3.5" /> Add Rate Code
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Rack</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Corporate</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">OTA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {rateCodes.map((rc) => (
                    <tr key={rc.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <code className="font-mono text-xs bg-secondary px-2 py-0.5 rounded text-foreground">{rc.code}</code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{rc.name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground">{rc.type}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">${rc.rack}</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">${rc.corporate}</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">{rc.ota > 0 ? `$${rc.ota}` : "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", rc.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>
                          {rc.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "bar" && (
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <SectionHeader title="Best Available Rate Grid — Next 7 Days" />
              <p className="text-xs text-muted-foreground mt-0.5">Color-coded by pricing relative to base: green = below, orange = above, red = significantly above</p>
            </div>
            <div className="overflow-x-auto p-5">
              <table className="w-full text-sm border-separate border-spacing-1">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground px-2 py-1.5">Room Type</th>
                    {barGridDays.map((d) => (
                      <th key={d} className="text-center text-xs font-medium text-muted-foreground px-2 py-1.5 min-w-[80px]">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {barGridRoomTypes.map((rt) => {
                    const baseRate = barGridRates[rt][0];
                    return (
                      <tr key={rt}>
                        <td className="text-sm font-medium text-foreground px-2 py-1.5 whitespace-nowrap pr-4">{rt}</td>
                        {barGridRates[rt].map((rate, idx) => (
                          <td key={`${rt}-${idx}`} className="text-center px-1 py-1">
                            <span className={cn("px-2.5 py-1 rounded-lg text-xs font-mono font-semibold", rateColor(rate, baseRate))}>
                              ${rate}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "promotions" && (
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <SectionHeader title="Promotions" />
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                <Tag className="h-3.5 w-3.5" /> New Promotion
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">End Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Channels</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Min Stay</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Bookings</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {promotions.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-mono font-semibold">{p.discount}%</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.startDate}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.endDate}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{p.channels}</td>
                      <td className="px-4 py-3 text-right font-mono text-muted-foreground">{p.minStay}N</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">{p.bookings}</td>
                      <td className="px-4 py-3">
                        <Badge label={p.status === "Expired" ? "Expired" : p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Channel Manager ───────────────────────────────────────────────────

function ChannelManager() {
  const [syncing, setSyncing] = useState<string | null>(null);

  function handleSync(id: string) {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 1800);
  }

  const totalBookings = channels.reduce((s, c) => s + c.bookingsMtd, 0);
  const totalRevenue = channels.reduce((s, c) => s + c.revenueMtd, 0);
  const connected = channels.filter((c) => c.status === "Connected").length;

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search channels..." />}
      header={<SectionHeader icon={TrendingUp} title="Channel Manager" subtitle="Distribution channel connections and performance" />}
      kpi={<KpiStrip
        items={[
          { color: "bg-emerald-500", value: `${connected}/${channels.length}`, label: "Channels Connected" },
          { color: "bg-blue-500", value: totalBookings.toString(), label: "Bookings MTD" },
          { color: "bg-violet-500", value: fmt(totalRevenue), label: "Revenue MTD" },
          { color: "bg-amber-500", value: channels.filter(c => c.status === "Disconnected").length.toString(), label: "Disconnected" },
          { color: "bg-rose-500", value: syncing ? "Syncing..." : "Idle", label: "Sync Status" },
        ]}
      />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="channels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <SectionHeader
              title="Channel Connections"
              actions={
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Sync All
                </button>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Rooms Available</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Current Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Sync</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Bookings MTD</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Revenue MTD</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Commission %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {channels.map((ch) => (
                  <tr key={ch.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {ch.status === "Connected" ? <Wifi className="h-4 w-4 text-emerald-500" /> : <WifiOff className="h-4 w-4 text-yellow-500" />}
                        <span className="font-medium text-foreground">{ch.channel}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge label={ch.status} /></td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{ch.roomsAvailable}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">${ch.currentRate}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{ch.lastSync}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{ch.bookingsMtd}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">{fmtFull(ch.revenueMtd)}</td>
                    <td className="px-4 py-3 text-right">
                      {ch.commission > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-mono">{ch.commission}%</span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">Free</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSync(ch.id)}
                        disabled={syncing === ch.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary/50 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={cn("h-3 w-3", syncing === ch.id && "animate-spin")} />
                        {syncing === ch.id ? "Syncing..." : "Sync"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Forecast ──────────────────────────────────────────────────────────

function Forecast() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search forecast..." />}
      header={<SectionHeader icon={TrendingUp} title="12-Month Demand Forecast" subtitle="Forecasted vs Budget vs Actual revenue" />}
      kpi={<KpiStrip items={[
        { color: "bg-blue-500", value: "$3.8M", label: "Forecasted Rev" },
        { color: "bg-violet-500", value: "$3.6M", label: "Budget" },
        { color: "bg-emerald-500", value: "$3.9M", label: "Actual" },
        { color: "bg-amber-500", value: "+5.2%", label: "vs Budget" },
        { color: "bg-rose-500", value: "82%", label: "Avg Occupancy" },
      ]} />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="forecast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
        {/* Forecast Area Chart */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <SectionHeader title="12-Month Demand Forecast" />
              <p className="text-xs text-muted-foreground mt-0.5">Forecasted vs Budget vs Actual revenue</p>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={forecastChartData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
              <defs>
                <linearGradient id="fcastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${v / 1000}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, ""]} />
              <Area type="monotone" dataKey="forecasted" stroke="#3b82f6" strokeWidth={2.5} fill="url(#fcastGrad)" name="Forecasted" />
              <Line type="monotone" dataKey="budget" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Budget" />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="none" name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-blue-500 inline-block" />Forecasted</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-violet-500 inline-block" />Budget</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-emerald-500 inline-block" />Actual</span>
          </div>
        </div>

        {/* Forecast Table */}
        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border">
            <SectionHeader title="Monthly Forecast Detail" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Occ %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">ADR</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">RevPAR</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Forecast Revenue</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Budget</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Variance %</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Demand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {forecastRows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{row.month}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{row.forecastOcc}%</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${row.forecastAdr}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${row.forecastRevpar}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{fmtFull(row.forecastRevenue)}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{fmtFull(row.budget)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn("flex items-center justify-end gap-0.5 text-xs font-medium font-mono", row.variancePct >= 0 ? "text-emerald-600" : "text-red-500")}>
                        {row.variancePct >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {Math.abs(row.variancePct)}%
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge label={row.demandLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Group Quotes ──────────────────────────────────────────────────────

function GroupQuotes() {
  const [statusFilter, setStatusFilter] = useState("All");
  const statuses = ["All", "Prospect", "Proposal Sent", "Negotiating", "Confirmed", "Lost"];

  const filtered = useMemo(() => {
    return groupQuotes.filter((g) => statusFilter === "All" || g.status === statusFilter);
  }, [statusFilter]);

  const totalValue = filtered.reduce((s, g) => s + g.totalValue, 0);
  const confirmed = groupQuotes.filter((g) => g.status === "Confirmed").reduce((s, g) => s + g.totalValue, 0);
  const pipeline = groupQuotes.filter((g) => ["Prospect", "Proposal Sent", "Negotiating"].includes(g.status)).reduce((s, g) => s + g.totalValue, 0);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search quotes..." />}
      header={<SectionHeader icon={TrendingUp} title="Group Quotes" subtitle="RFP pipeline and group booking management" />}
      kpi={<KpiStrip
        items={[
          { color: "bg-emerald-500", value: fmt(confirmed), label: "Confirmed Value" },
          { color: "bg-blue-500", value: fmt(pipeline), label: "Active Pipeline" },
          { color: "bg-violet-500", value: filtered.length.toString(), label: "Showing RFPs" },
          { color: "bg-amber-500", value: groupQuotes.filter(g => g.status === "Negotiating").length.toString(), label: "Negotiating" },
          { color: "bg-red-500", value: groupQuotes.filter(g => g.status === "Lost").length.toString(), label: "Lost" },
        ]}
      />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

        {/* Status filter */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                statusFilter === s ? "bg-violet-500 text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">RFP ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Group Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Event Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Check Out</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Rooms</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">F&B</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Total Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Decision Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Sales Manager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{g.rfpId}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground truncate max-w-[160px] block" title={g.groupName}>{g.groupName}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{g.eventType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{g.checkIn}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{g.checkOut}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{g.roomsRequired}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", g.fbIncluded ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
                        {g.fbIncluded ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">{fmtFull(g.totalValue)}</td>
                    <td className="px-4 py-3"><Badge label={g.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{g.decisionDate}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{g.salesManager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Sub-view: Competitor Rate Intelligence ──────────────────────────────────────

function CompetitorIntelligence() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search competitors..." />}
      header={<SectionHeader icon={TrendingUp} title="Competitor Rate Intelligence" subtitle="Comp set rate comparison and market positioning" />}
      kpi={<KpiStrip
        items={[
          { color: "bg-blue-500", value: "$248", label: "Our Rate Tonight" },
          { color: "bg-violet-500", value: "$245", label: "Market Average" },
          { color: "bg-emerald-500", value: "At Market", label: "Our Positioning" },
          { color: "bg-amber-500", value: competitors.length.toString(), label: "Comp Set Size" },
          { color: "bg-rose-500", value: "+1.2%", label: "vs Market" },
        ]}
      />}
    >
    <AnimatePresence mode="wait">
      <motion.div key="comp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

        {/* Comp Set Rate Table */}
        <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <SectionHeader
              title="Competitor Rate Comparison"
              subtitle="Sandton CBD comp set — rates for Deluxe / Standard room type"
              actions={
                <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Rates
                </button>
              }
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Hotel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Room Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Tonight</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Tomorrow</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">This Weekend</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Next Week</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">ADR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Positioning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {competitors.map((c) => (
                  <tr
                    key={c.id}
                    className={cn(
                      "transition-colors",
                      c.isOurHotel ? "bg-blue-50/50 hover:bg-blue-50/80" : "hover:bg-secondary/30"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.isOurHotel && <ChevronRight className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />}
                        <span className={cn("font-medium truncate max-w-[180px]", c.isOurHotel ? "text-blue-700" : "text-foreground")} title={c.hotelName}>
                          {c.hotelName}
                        </span>
                        {c.isOurHotel && <span className="px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-medium">Us</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{c.roomType}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-foreground">${c.tonight}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${c.tomorrow}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${c.thisWeekend}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">${c.nextWeek}</td>
                    <td className="px-4 py-3 text-right font-mono font-medium text-foreground">${c.adr}</td>
                    <td className="px-4 py-3"><Badge label={c.positioning} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate Trend Chart */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-5">
          <SectionHeader title="7-Day Rate Trend — Top 3 Comp Set" subtitle="Nightly rate tracking for Singularity, Michelangelo, and Sandton Sun" />
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={compTrendData} margin={{ top: 5, right: 20, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[180, 340]} tickFormatter={(v: number) => `$${v}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => [`$${value}`, ""]} />
              <Line type="monotone" dataKey="singularity" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Singularity (Us)" />
              <Line type="monotone" dataKey="michelangelo" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Michelangelo" />
              <Line type="monotone" dataKey="sandtonSun" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Sandton Sun" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-blue-500 inline-block" />Singularity (Us)</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-amber-500 inline-block" />Michelangelo</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-4 rounded-full bg-violet-500 inline-block" />Sandton Sun</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
    </PageShell>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────────

export function SalesRevenue({ aiEnabled, activeSubmenu = "Overview" }: SalesRevenueProps) {
  const subviewMap: Record<string, React.ReactNode> = {
    Overview: <Overview />,
    "Revenue Analysis": <RevenueAnalysis />,
    "Reservations Pipeline": <ReservationsPipeline />,
    "Corporate Accounts": <CorporateAccounts />,
    "Rate Management": <RateManagement />,
    "Channel Manager": <ChannelManager />,
    Forecast: <Forecast />,
    "Group Quotes": <GroupQuotes />,
    "Group Management": <GroupManagementView />,
    "Comp Set": <CompetitorIntelligence />,
    "Sales Pipeline": <ReservationsPipeline />,
    "Competitor Rate Intelligence": <CompetitorIntelligence />,
  };

  const currentView = subviewMap[activeSubmenu] ?? subviewMap["Overview"];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSubmenu}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.18 }}
      >
        {currentView}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Group Management View ──────────────────────────────────────────────────

// ─── Group Management View ──────────────────────────────────────────────────

function GroupManagementView() {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"blocks" | "rooming">("blocks");

  const statCards = [
    { label: "Active Groups", value: "8", trend: "+12%", icon: Building2, gradient: "from-violet-400 to-violet-500" },
    { label: "Rooms Blocked", value: "142", trend: "+8%", icon: BarChart2, gradient: "from-blue-400 to-blue-500" },
    { label: "Pick-up Rate", value: "73%", trend: "+5%", icon: TrendingUp, gradient: "from-emerald-400 to-emerald-500" },
    { label: "Group Revenue MTD", value: "BHD 48,200", trend: "+18%", icon: DollarSign, gradient: "from-amber-400 to-amber-500" },
  ];

  const groupBlocks = [
    {
      id: 1,
      name: "Acme Corp Retreat",
      org: "Acme Corporation",
      arrival: "2026-04-10",
      departure: "2026-04-12",
      blocked: 35,
      picked: 28,
      rate: 165,
      status: "Confirmed",
      contact: "John Smith",
      roomTypes: ["Deluxe Room (20)", "Suite (8)", "Presidential (2)"],
      roomingSubmitted: 28,
      roomingTotal: 35,
      notes: "CEO conference, special rate negotiated",
    },
    {
      id: 2,
      name: "Silva Wedding Block",
      org: "Silva Family",
      arrival: "2026-04-18",
      departure: "2026-04-20",
      blocked: 42,
      picked: 38,
      rate: 195,
      status: "Confirmed",
      contact: "Maria Silva",
      roomTypes: ["Deluxe Room (25)", "Suite (12)", "Family Room (5)"],
      roomingSubmitted: 38,
      roomingTotal: 42,
      notes: "Wedding celebration, includes welcome cocktail",
    },
    {
      id: 3,
      name: "Tech Conference MENA",
      org: "Tech Summit Ltd",
      arrival: "2026-05-05",
      departure: "2026-05-08",
      blocked: 85,
      picked: 72,
      rate: 155,
      status: "Confirmed",
      contact: "Ahmed Hassan",
      roomTypes: ["Standard Room (50)", "Deluxe Room (30)", "Suite (5)"],
      roomingSubmitted: 65,
      roomingTotal: 85,
      notes: "3-day conference, bulk rooming list pending",
    },
    {
      id: 4,
      name: "Global Tours Group",
      org: "Global Travel Ltd",
      arrival: "2026-04-15",
      departure: "2026-04-22",
      blocked: 28,
      picked: 18,
      rate: 135,
      status: "Tentative",
      contact: "Robert Jones",
      roomTypes: ["Standard Room (20)", "Deluxe Room (8)"],
      roomingSubmitted: 15,
      roomingTotal: 28,
      notes: "Tour operator group, subject to confirmation",
    },
    {
      id: 5,
      name: "Medical Association Meeting",
      org: "African Medical Assoc",
      arrival: "2026-04-25",
      departure: "2026-04-27",
      blocked: 56,
      picked: 42,
      rate: 175,
      status: "Confirmed",
      contact: "Dr. Amara Okafor",
      roomTypes: ["Deluxe Room (35)", "Suite (15)", "Presidential (1)"],
      roomingSubmitted: 40,
      roomingTotal: 56,
      notes: "Professional association, group rate applied",
    },
    {
      id: 6,
      name: "Corporate Incentive Trip",
      org: "Premium Banking Ltd",
      arrival: "2026-05-12",
      departure: "2026-05-16",
      blocked: 48,
      picked: 0,
      rate: 185,
      status: "Cancelled",
      contact: "Lisa Chen",
      roomTypes: ["Suite (25)", "Deluxe Room (20)", "Presidential (3)"],
      roomingSubmitted: 0,
      roomingTotal: 0,
      notes: "Cancelled due to budget constraints",
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-green-100 text-green-700";
      case "Tentative": return "bg-amber-100 text-amber-700";
      case "Cancelled": return "bg-red-100 text-red-700 line-through";
      default: return "bg-muted text-foreground";
    }
  };

  const pickupPercentage = (picked: number, blocked: number) =>
    Math.round((picked / blocked) * 100);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search groups..." />}
      header={<SectionHeader icon={TrendingUp} title="Group Management" subtitle="Manage group bookings and block allocations" actions={
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
          <span>+</span> New Group Block
        </button>
      } />}
      kpi={<KpiStrip items={[
        { color: "bg-violet-500", value: "8", label: "Active Groups" },
        { color: "bg-blue-500", value: "142", label: "Rooms Blocked" },
        { color: "bg-emerald-500", value: "73%", label: "Pick-up Rate" },
        { color: "bg-amber-500", value: "BHD 48,200", label: "Group Rev MTD" },
        { color: "bg-rose-500", value: "+18%", label: "Growth" },
      ]} />}
    >
      {/* Stat Cards */}
      <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`bg-gradient-to-r ${card.gradient} rounded-2xl p-6 text-white relative overflow-hidden`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/20 rounded-xl p-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-white/70">{card.trend}</span>
                </div>
                <div className="text-3xl font-bold">{card.value}</div>
                <div className="text-sm text-white/80 mt-1">{card.label}</div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
            </div>
          );
        })}
      </div>

      {/* Group Blocks Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="Group Blocks" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50">
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Group Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Organization</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Arrival</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Departure</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Blocked</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Picked</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Rate</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {groupBlocks.map((group) => (
                <React.Fragment key={group.id}>
                  <motion.tr
                    className="hover:bg-secondary/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{group.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{group.org}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{group.arrival}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{group.departure}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{group.blocked}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">{group.picked}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">BHD {group.rate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={cn("inline-block px-2 py-1 rounded-full text-xs font-medium", getStatusBadgeColor(group.status))}>
                        {group.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-violet-600 hover:text-violet-700 font-medium">View</button>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {expandedGroup === group.id && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-secondary/20"
                      >
                        <td colSpan={9} className="px-6 py-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Contact Person</p>
                                <p className="font-medium text-foreground">{group.contact}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Rooming List Status</p>
                                <p className="font-medium text-foreground">{group.roomingSubmitted} of {group.roomingTotal} submitted</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pick-up Rate</p>
                                <p className="font-medium text-foreground">{pickupPercentage(group.picked, group.blocked)}%</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Room Types Blocked</p>
                              <div className="flex flex-wrap gap-2">
                                {group.roomTypes.map((type) => (
                                  <span key={type} className="inline-block px-2 py-1 rounded-lg bg-secondary/50 text-xs text-foreground">
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Notes</p>
                              <p className="text-sm text-foreground">{group.notes}</p>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-border/50">
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTab("blocks"); }}
                                className={cn(
                                  "px-3 py-1.5 text-xs font-medium rounded-xl transition-colors",
                                  activeTab === "blocks"
                                    ? "bg-violet-600 text-white"
                                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                )}
                              >
                                Block Details
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveTab("rooming"); }}
                                className={cn(
                                  "px-3 py-1.5 text-xs font-medium rounded-xl transition-colors",
                                  activeTab === "rooming"
                                    ? "bg-violet-600 text-white"
                                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                                )}
                              >
                                Rooming List
                              </button>
                              <button className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-medium rounded-xl transition-colors">
                                Group Invoice
                              </button>
                            </div>
                            {activeTab === "rooming" && (
                              <div className="text-sm text-muted-foreground text-center py-4 bg-secondary/30 rounded-xl">
                                Rooming list details for {group.name}
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </PageShell>
  );
}


export default SalesRevenue;
