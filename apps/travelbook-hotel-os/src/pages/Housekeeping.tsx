import React, { useMemo, useState } from "react";
import {
  Home,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Layers,
  Package,
  ClipboardList,
  Star,
  Coffee,
  Wind,
  Wrench,
  Bell,
  BarChart2,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell, RoomCard } from "../components/shared";

interface HousekeepingProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RoomStatus = "Dirty" | "Clean" | "Inspected" | "In Progress" | "OOS";
type TaskStatus = "Pending" | "In Progress" | "Completed" | "Skipped";
type TaskType = "Checkout" | "Stayover" | "Deep Clean" | "Turndown" | "Inspection";
type Priority = "High" | "Medium" | "Low";
type StaffStatus = "Active" | "Break" | "Off";
type FoundStatus = "Unclaimed" | "Claimed" | "Donated" | "Disposed";
type SupplyStatus = "Adequate" | "Low" | "Critical";
type CheckResult = "Pass" | "Fail" | "N/A" | "";

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const ROOMS: Array<{
  id: string;
  floor: number;
  type: string;
  status: RoomStatus;
  housekeeper: string;
  updatedMins: number;
  checkIn: boolean;
  checkOut: boolean;
  priority: Priority;
  vip: boolean;
}> = [
  { id: "101", floor: 1, type: "Standard", status: "Dirty", housekeeper: "Maria L.", updatedMins: 45, checkIn: false, checkOut: true, priority: "High", vip: false },
  { id: "102", floor: 1, type: "Standard", status: "In Progress", housekeeper: "Clara V.", updatedMins: 12, checkIn: false, checkOut: false, priority: "Medium", vip: false },
  { id: "103", floor: 1, type: "Deluxe", status: "Clean", housekeeper: "Maria L.", updatedMins: 60, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "104", floor: 1, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 90, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "105", floor: 1, type: "Suite", status: "Dirty", housekeeper: "Unassigned", updatedMins: 120, checkIn: false, checkOut: true, priority: "High", vip: true },
  { id: "106", floor: 1, type: "Standard", status: "OOS", housekeeper: "Maintenance", updatedMins: 240, checkIn: false, checkOut: false, priority: "High", vip: false },
  { id: "107", floor: 1, type: "Deluxe", status: "Dirty", housekeeper: "Unassigned", updatedMins: 80, checkIn: false, checkOut: true, priority: "Medium", vip: false },
  { id: "108", floor: 1, type: "Standard", status: "Clean", housekeeper: "Clara V.", updatedMins: 30, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "109", floor: 1, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 110, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "110", floor: 1, type: "Deluxe", status: "In Progress", housekeeper: "Emma R.", updatedMins: 8, checkIn: false, checkOut: false, priority: "Medium", vip: false },
  { id: "201", floor: 2, type: "Suite", status: "Dirty", housekeeper: "Unassigned", updatedMins: 50, checkIn: false, checkOut: true, priority: "High", vip: true },
  { id: "202", floor: 2, type: "Standard", status: "Clean", housekeeper: "Maria L.", updatedMins: 40, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "203", floor: 2, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 95, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "204", floor: 2, type: "Deluxe", status: "In Progress", housekeeper: "Emma R.", updatedMins: 18, checkIn: false, checkOut: false, priority: "Medium", vip: false },
  { id: "205", floor: 2, type: "Standard", status: "Dirty", housekeeper: "Unassigned", updatedMins: 65, checkIn: false, checkOut: true, priority: "Medium", vip: false },
  { id: "206", floor: 2, type: "Standard", status: "Clean", housekeeper: "Clara V.", updatedMins: 55, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "207", floor: 2, type: "Deluxe", status: "Dirty", housekeeper: "Unassigned", updatedMins: 100, checkIn: false, checkOut: true, priority: "High", vip: false },
  { id: "208", floor: 2, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 130, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "209", floor: 2, type: "Suite", status: "OOS", housekeeper: "Maintenance", updatedMins: 360, checkIn: false, checkOut: false, priority: "High", vip: false },
  { id: "210", floor: 2, type: "Standard", status: "In Progress", housekeeper: "Maria L.", updatedMins: 22, checkIn: false, checkOut: false, priority: "Medium", vip: false },
  { id: "301", floor: 3, type: "Deluxe", status: "Dirty", housekeeper: "Unassigned", updatedMins: 70, checkIn: false, checkOut: true, priority: "High", vip: false },
  { id: "302", floor: 3, type: "Standard", status: "Clean", housekeeper: "Emma R.", updatedMins: 35, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "303", floor: 3, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 105, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "304", floor: 3, type: "Suite", status: "Dirty", housekeeper: "Unassigned", updatedMins: 55, checkIn: false, checkOut: true, priority: "High", vip: true },
  { id: "305", floor: 3, type: "Standard", status: "In Progress", housekeeper: "Clara V.", updatedMins: 14, checkIn: false, checkOut: false, priority: "Medium", vip: false },
  { id: "306", floor: 3, type: "Deluxe", status: "Clean", housekeeper: "Maria L.", updatedMins: 48, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "307", floor: 3, type: "Standard", status: "Dirty", housekeeper: "Unassigned", updatedMins: 88, checkIn: false, checkOut: true, priority: "Medium", vip: false },
  { id: "308", floor: 3, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 115, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "309", floor: 3, type: "Deluxe", status: "Clean", housekeeper: "Emma R.", updatedMins: 28, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "310", floor: 3, type: "Standard", status: "In Progress", housekeeper: "Clara V.", updatedMins: 5, checkIn: false, checkOut: false, priority: "Low", vip: false },
  { id: "401", floor: 4, type: "Presidential Suite", status: "Dirty", housekeeper: "Maria L.", updatedMins: 60, checkIn: false, checkOut: true, priority: "High", vip: true },
  { id: "402", floor: 4, type: "Suite", status: "In Progress", housekeeper: "Emma R.", updatedMins: 25, checkIn: false, checkOut: false, priority: "High", vip: true },
  { id: "403", floor: 4, type: "Deluxe", status: "Clean", housekeeper: "Clara V.", updatedMins: 45, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "404", floor: 4, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 125, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "405", floor: 4, type: "Suite", status: "Dirty", housekeeper: "Unassigned", updatedMins: 75, checkIn: false, checkOut: true, priority: "High", vip: false },
  { id: "406", floor: 4, type: "Deluxe", status: "OOS", housekeeper: "Maintenance", updatedMins: 480, checkIn: false, checkOut: false, priority: "High", vip: false },
  { id: "407", floor: 4, type: "Standard", status: "Clean", housekeeper: "Maria L.", updatedMins: 38, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "408", floor: 4, type: "Deluxe", status: "Dirty", housekeeper: "Unassigned", updatedMins: 92, checkIn: false, checkOut: true, priority: "Medium", vip: false },
  { id: "409", floor: 4, type: "Standard", status: "Inspected", housekeeper: "Supervisor", updatedMins: 140, checkIn: true, checkOut: false, priority: "Low", vip: false },
  { id: "410", floor: 4, type: "Presidential Suite", status: "In Progress", housekeeper: "Emma R.", updatedMins: 32, checkIn: false, checkOut: false, priority: "High", vip: true },
];

const TASKS: Array<{
  id: string;
  room: string;
  type: TaskType;
  assignedTo: string;
  priority: Priority;
  status: TaskStatus;
  notes: string;
  dueTime: string;
}> = [
  { id: "HK-001", room: "101", type: "Checkout", assignedTo: "Maria L.", priority: "High", status: "Completed", notes: "Extra towels left", dueTime: "10:00" },
  { id: "HK-002", room: "105", type: "Checkout", assignedTo: "Unassigned", priority: "High", status: "Pending", notes: "VIP arrival at 14:00", dueTime: "12:00" },
  { id: "HK-003", room: "201", type: "Checkout", assignedTo: "Clara V.", priority: "High", status: "In Progress", notes: "VIP — extra amenities", dueTime: "11:00" },
  { id: "HK-004", room: "304", type: "Checkout", assignedTo: "Unassigned", priority: "High", status: "Pending", notes: "VIP suite — thorough clean", dueTime: "11:30" },
  { id: "HK-005", room: "401", type: "Checkout", assignedTo: "Maria L.", priority: "High", status: "In Progress", notes: "Presidential — full refresh", dueTime: "12:00" },
  { id: "HK-006", room: "102", type: "Stayover", assignedTo: "Clara V.", priority: "Medium", status: "In Progress", notes: "DND until 10am", dueTime: "13:00" },
  { id: "HK-007", room: "204", type: "Stayover", assignedTo: "Emma R.", priority: "Medium", status: "In Progress", notes: "Guest requested extra coffee", dueTime: "13:00" },
  { id: "HK-008", room: "305", type: "Stayover", assignedTo: "Clara V.", priority: "Low", status: "In Progress", notes: "", dueTime: "14:00" },
  { id: "HK-009", room: "402", type: "Stayover", assignedTo: "Emma R.", priority: "High", status: "In Progress", notes: "VIP — white gloves standard", dueTime: "12:30" },
  { id: "HK-010", room: "106", type: "Deep Clean", assignedTo: "Maintenance", priority: "High", status: "Pending", notes: "Pipe leak — OOS since yesterday", dueTime: "16:00" },
  { id: "HK-011", room: "209", type: "Deep Clean", assignedTo: "Maintenance", priority: "High", status: "Pending", notes: "Carpet replacement", dueTime: "17:00" },
  { id: "HK-012", room: "406", type: "Deep Clean", assignedTo: "Maintenance", priority: "High", status: "Pending", notes: "AC servicing required", dueTime: "18:00" },
  { id: "HK-013", room: "103", type: "Inspection", assignedTo: "Supervisor", priority: "Low", status: "Completed", notes: "Passed all checks", dueTime: "11:00" },
  { id: "HK-014", room: "104", type: "Inspection", assignedTo: "Supervisor", priority: "Low", status: "Completed", notes: "Minor — replaced amenities", dueTime: "11:15" },
  { id: "HK-015", room: "203", type: "Inspection", assignedTo: "Supervisor", priority: "Medium", status: "Pending", notes: "Post clean-up check", dueTime: "14:00" },
  { id: "HK-016", room: "303", type: "Inspection", assignedTo: "Supervisor", priority: "Low", status: "Completed", notes: "All clear", dueTime: "12:00" },
  { id: "HK-017", room: "404", type: "Inspection", assignedTo: "Supervisor", priority: "Low", status: "Pending", notes: "", dueTime: "15:00" },
  { id: "HK-018", room: "301", type: "Turndown", assignedTo: "Unassigned", priority: "Medium", status: "Pending", notes: "Guest requested 20:00", dueTime: "20:00" },
  { id: "HK-019", room: "402", type: "Turndown", assignedTo: "Emma R.", priority: "High", status: "Pending", notes: "VIP — chocolates + robe", dueTime: "19:30" },
  { id: "HK-020", room: "405", type: "Turndown", assignedTo: "Unassigned", priority: "Medium", status: "Pending", notes: "Extra pillow requested", dueTime: "20:30" },
];

const STAFF: Array<{
  name: string;
  assigned: number;
  completed: number;
  rate: number;
  status: StaffStatus;
  shiftStart: string;
  currentRoom: string;
}> = [
  { name: "Maria L.", assigned: 12, completed: 8, rate: 2.4, status: "Active", shiftStart: "07:00", currentRoom: "401" },
  { name: "Clara V.", assigned: 10, completed: 7, rate: 2.1, status: "Active", shiftStart: "07:00", currentRoom: "305" },
  { name: "Emma R.", assigned: 11, completed: 6, rate: 1.9, status: "Break", shiftStart: "07:00", currentRoom: "—" },
  { name: "James K.", assigned: 9, completed: 9, rate: 2.8, status: "Active", shiftStart: "08:00", currentRoom: "202" },
  { name: "Sofia P.", assigned: 8, completed: 5, rate: 1.7, status: "Active", shiftStart: "08:00", currentRoom: "107" },
  { name: "Aiden T.", assigned: 0, completed: 0, rate: 0, status: "Off", shiftStart: "—", currentRoom: "—" },
];

const TURNDOWN: Array<{
  room: string;
  guest: string;
  vip: boolean;
  requests: string;
  assigned: string;
  status: string;
  timeCompleted: string;
}> = [
  { room: "101", guest: "Mr. Johnson", vip: false, requests: "Extra pillow", assigned: "Maria L.", status: "Completed", timeCompleted: "19:45" },
  { room: "201", guest: "Ms. Al-Rashid", vip: true, requests: "Champagne, roses, robe fold", assigned: "Clara V.", status: "Completed", timeCompleted: "19:20" },
  { room: "301", guest: "Dr. Chen", vip: false, requests: "None", assigned: "Unassigned", status: "Pending", timeCompleted: "—" },
  { room: "402", guest: "Lord Ashworth", vip: true, requests: "Chocolates, pillow menu, aromatherapy", assigned: "Emma R.", status: "In Progress", timeCompleted: "—" },
  { room: "405", guest: "Ms. Torres", vip: false, requests: "Extra blanket", assigned: "Unassigned", status: "Pending", timeCompleted: "—" },
  { room: "103", guest: "Mr. & Mrs. Patel", vip: false, requests: "None", assigned: "Maria L.", status: "Completed", timeCompleted: "20:00" },
  { room: "208", guest: "Mr. Williams", vip: false, requests: "Extra hangers", assigned: "Clara V.", status: "Completed", timeCompleted: "20:10" },
  { room: "304", guest: "Ms. Nakamura", vip: true, requests: "Yukata, hot tea, sleep spray", assigned: "Emma R.", status: "Pending", timeCompleted: "—" },
];

const LOST_FOUND: Array<{
  id: string;
  description: string;
  category: string;
  location: string;
  foundBy: string;
  dateFound: string;
  guest: string;
  contact: string;
  status: FoundStatus;
  claimDate: string;
}> = [
  { id: "LF-001", description: "Apple AirPods Pro (white case)", category: "Electronics", location: "Room 205", foundBy: "Clara V.", dateFound: "2026-03-28", guest: "Mr. Davis", contact: "+1 555-0192", status: "Claimed", claimDate: "2026-03-29" },
  { id: "LF-002", description: "Blue silk scarf (Hermes)", category: "Clothing", location: "Room 401", foundBy: "Maria L.", dateFound: "2026-03-30", guest: "Ms. Laurent", contact: "+33 6 12 34 56 78", status: "Unclaimed", claimDate: "—" },
  { id: "LF-003", description: "Gold bracelet with diamond clasp", category: "Jewelry", location: "Pool area", foundBy: "James K.", dateFound: "2026-03-31", guest: "Unknown", contact: "—", status: "Unclaimed", claimDate: "—" },
  { id: "LF-004", description: "UK passport (surname: Morrison)", category: "Documents", location: "Room 102", foundBy: "Clara V.", dateFound: "2026-03-29", guest: "Mr. Morrison", contact: "+44 7700 900123", status: "Claimed", claimDate: "2026-03-29" },
  { id: "LF-005", description: "Samsung Galaxy S24 (black)", category: "Electronics", location: "Restaurant", foundBy: "Staff", dateFound: "2026-04-01", guest: "Unknown", contact: "—", status: "Unclaimed", claimDate: "—" },
  { id: "LF-006", description: "Grey wool blazer (Hugo Boss, L)", category: "Clothing", location: "Room 307", foundBy: "Emma R.", dateFound: "2026-03-27", guest: "Mr. Schneider", contact: "+49 171 1234567", status: "Donated", claimDate: "2026-04-01" },
  { id: "LF-007", description: "Ray-Ban Aviator sunglasses", category: "Other", location: "Lobby", foundBy: "Concierge", dateFound: "2026-03-30", guest: "Unknown", contact: "—", status: "Unclaimed", claimDate: "—" },
  { id: "LF-008", description: "Kindle Paperwhite (pink case)", category: "Electronics", location: "Room 304", foundBy: "Maria L.", dateFound: "2026-04-01", guest: "Ms. Nakamura", contact: "+81 90-1234-5678", status: "Claimed", claimDate: "2026-04-02" },
  { id: "LF-009", description: "Child's stuffed bear (blue)", category: "Other", location: "Room 109", foundBy: "Clara V.", dateFound: "2026-03-26", guest: "Patel family", contact: "+91 98765 43210", status: "Claimed", claimDate: "2026-03-26" },
  { id: "LF-010", description: "Stethoscope in black pouch", category: "Other", location: "Room 202", foundBy: "James K.", dateFound: "2026-03-31", guest: "Dr. Okonkwo", contact: "+234 803 123 4567", status: "Unclaimed", claimDate: "—" },
  { id: "LF-011", description: "Leather wallet (brown, Louis Vuitton)", category: "Other", location: "Room 201", foundBy: "Clara V.", dateFound: "2026-04-02", guest: "Ms. Al-Rashid", contact: "+971 50 123 4567", status: "Unclaimed", claimDate: "—" },
  { id: "LF-012", description: "Business documents (Acme Corp)", category: "Documents", location: "Meeting Room B", foundBy: "Staff", dateFound: "2026-03-28", guest: "Unknown", contact: "—", status: "Disposed", claimDate: "2026-04-01" },
  { id: "LF-013", description: "Pearl necklace (white)", category: "Jewelry", location: "Spa", foundBy: "Spa staff", dateFound: "2026-03-25", guest: "Unknown", contact: "—", status: "Unclaimed", claimDate: "—" },
  { id: "LF-014", description: "Black laptop bag (empty)", category: "Other", location: "Bar", foundBy: "Bartender", dateFound: "2026-03-29", guest: "Unknown", contact: "—", status: "Donated", claimDate: "2026-04-01" },
  { id: "LF-015", description: "Prescription glasses (tortoise shell)", category: "Other", location: "Room 106", foundBy: "Maintenance", dateFound: "2026-04-01", guest: "Unknown", contact: "—", status: "Unclaimed", claimDate: "—" },
];

const LINENS: Array<{
  item: string;
  par: number;
  current: number;
  inLaundry: number;
  condemned: number;
}> = [
  { item: "King Bed Sheets", par: 120, current: 98, inLaundry: 34, condemned: 4 },
  { item: "Queen Bed Sheets", par: 80, current: 72, inLaundry: 20, condemned: 2 },
  { item: "Twin Bed Sheets", par: 60, current: 55, inLaundry: 12, condemned: 1 },
  { item: "Pillow Cases (Standard)", par: 200, current: 165, inLaundry: 48, condemned: 6 },
  { item: "Pillow Cases (King)", par: 100, current: 88, inLaundry: 22, condemned: 3 },
  { item: "Bath Towels (Large)", par: 300, current: 210, inLaundry: 88, condemned: 12 },
  { item: "Hand Towels", par: 200, current: 175, inLaundry: 55, condemned: 8 },
  { item: "Face Cloths", par: 160, current: 140, inLaundry: 40, condemned: 5 },
  { item: "Bath Robes", par: 100, current: 82, inLaundry: 24, condemned: 6 },
  { item: "Pool Towels", par: 150, current: 118, inLaundry: 45, condemned: 9 },
  { item: "Duvet Covers (King)", par: 80, current: 62, inLaundry: 28, condemned: 3 },
  { item: "Duvet Covers (Queen)", par: 60, current: 52, inLaundry: 14, condemned: 2 },
];

const SUPPLIES: Array<{
  item: string;
  category: string;
  current: number;
  min: number;
  unit: string;
  lastRestocked: string;
  status: SupplyStatus;
}> = [
  { item: "Shampoo (50ml)", category: "Amenities", current: 480, min: 200, unit: "units", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Conditioner (50ml)", category: "Amenities", current: 440, min: 200, unit: "units", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Body Wash (50ml)", category: "Amenities", current: 510, min: 200, unit: "units", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Hand Lotion (30ml)", category: "Amenities", current: 160, min: 150, unit: "units", lastRestocked: "2026-03-28", status: "Low" },
  { item: "Dental Kit", category: "Amenities", current: 220, min: 150, unit: "units", lastRestocked: "2026-03-30", status: "Adequate" },
  { item: "Shaving Kit", category: "Amenities", current: 180, min: 100, unit: "units", lastRestocked: "2026-03-29", status: "Adequate" },
  { item: "Toilet Paper (rolls)", category: "Paper", current: 320, min: 200, unit: "rolls", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Facial Tissues (boxes)", category: "Paper", current: 140, min: 120, unit: "boxes", lastRestocked: "2026-03-28", status: "Low" },
  { item: "Notepad & Pen Sets", category: "Guest", current: 85, min: 80, unit: "sets", lastRestocked: "2026-03-25", status: "Low" },
  { item: "Coffee Pods (assorted)", category: "Guest", current: 610, min: 300, unit: "pods", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Tea Bags (assorted)", category: "Guest", current: 420, min: 200, unit: "bags", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Bottled Water (500ml)", category: "Guest", current: 180, min: 200, unit: "bottles", lastRestocked: "2026-03-30", status: "Critical" },
  { item: "All-Purpose Cleaner (L)", category: "Cleaning", current: 22, min: 15, unit: "litres", lastRestocked: "2026-03-27", status: "Adequate" },
  { item: "Disinfectant Spray (L)", category: "Cleaning", current: 18, min: 20, unit: "litres", lastRestocked: "2026-03-22", status: "Critical" },
  { item: "Toilet Cleaner (L)", category: "Cleaning", current: 12, min: 10, unit: "litres", lastRestocked: "2026-03-28", status: "Adequate" },
  { item: "Glass Cleaner (L)", category: "Cleaning", current: 9, min: 8, unit: "litres", lastRestocked: "2026-03-25", status: "Adequate" },
  { item: "Microfibre Cloths", category: "Cleaning", current: 45, min: 40, unit: "units", lastRestocked: "2026-03-20", status: "Adequate" },
  { item: "Mop Heads", category: "Cleaning", current: 8, min: 10, unit: "units", lastRestocked: "2026-03-15", status: "Critical" },
  { item: "Bin Liners (large)", category: "Cleaning", current: 280, min: 200, unit: "units", lastRestocked: "2026-04-01", status: "Adequate" },
  { item: "Shoe Shine Kits", category: "Guest", current: 55, min: 50, unit: "kits", lastRestocked: "2026-03-28", status: "Adequate" },
];

const MINIBAR: Array<{
  room: string;
  lastRestocked: string;
  missing: string;
  added: string;
  revenue: number;
  restockedBy: string;
  date: string;
  status: string;
}> = [
  { room: "101", lastRestocked: "2026-04-01", missing: "2x Beer, 1x Pringles", added: "2x Beer, 1x Pringles", revenue: 18.50, restockedBy: "Maria L.", date: "2026-04-02", status: "Completed" },
  { room: "103", lastRestocked: "2026-04-01", missing: "None", added: "None", revenue: 0, restockedBy: "Maria L.", date: "2026-04-02", status: "No Charge" },
  { room: "201", lastRestocked: "2026-03-31", missing: "1x Champagne, 3x Water", added: "1x Champagne, 3x Water", revenue: 52.00, restockedBy: "Clara V.", date: "2026-04-01", status: "Completed" },
  { room: "202", lastRestocked: "2026-04-01", missing: "2x Whisky mini", added: "2x Whisky mini", revenue: 22.00, restockedBy: "James K.", date: "2026-04-02", status: "Completed" },
  { room: "304", lastRestocked: "2026-03-31", missing: "Full bar consumed", added: "Full restock", revenue: 148.75, restockedBy: "Emma R.", date: "2026-04-01", status: "Completed" },
  { room: "305", lastRestocked: "2026-04-02", missing: "None", added: "None", revenue: 0, restockedBy: "Clara V.", date: "2026-04-02", status: "No Charge" },
  { room: "401", lastRestocked: "2026-03-30", missing: "1x Cognac, 2x Wine, 4x Water", added: "Full restock", revenue: 210.00, restockedBy: "Maria L.", date: "2026-04-01", status: "Completed" },
  { room: "402", lastRestocked: "2026-04-01", missing: "Pending check", added: "—", revenue: 0, restockedBy: "Emma R.", date: "—", status: "Pending" },
  { room: "405", lastRestocked: "2026-04-01", missing: "1x Gin mini, 1x Tonic", added: "1x Gin mini, 1x Tonic", revenue: 14.00, restockedBy: "Clara V.", date: "2026-04-02", status: "Completed" },
  { room: "204", lastRestocked: "2026-04-02", missing: "Pending check", added: "—", revenue: 0, restockedBy: "Unassigned", date: "—", status: "Pending" },
  { room: "208", lastRestocked: "2026-03-31", missing: "None", added: "None", revenue: 0, restockedBy: "Clara V.", date: "2026-04-01", status: "No Charge" },
  { room: "410", lastRestocked: "2026-03-29", missing: "Full bar + snacks", added: "Full restock", revenue: 285.50, restockedBy: "Emma R.", date: "2026-04-01", status: "Completed" },
];

const CHECKLIST_CATEGORIES = [
  {
    name: "Bathroom",
    icon: "🚿",
    items: [
      "Toilet clean and sanitised",
      "Basin and taps clean",
      "Shower/bath cleaned and grout checked",
      "Tiles wiped and spot-free",
      "Towels fresh, folded, and stocked",
      "Amenities restocked (shampoo, soap etc.)",
      "Mirror streak-free",
      "Floor mopped and dry",
    ],
  },
  {
    name: "Bedroom",
    icon: "🛏",
    items: [
      "Bed made to standard (hospital corners)",
      "Linens fresh and crease-free",
      "Duvet evenly spread",
      "Pillows plumped and correctly placed",
      "Carpet/floor vacuumed",
      "Furniture dusted and polished",
      "Windows and sills clean",
      "Wardrobe tidy — hangers spaced",
      "Minibar stocked and checked",
      "Lighting functional (all bulbs)",
    ],
  },
  {
    name: "General",
    icon: "🏨",
    items: [
      "Room temperature set (20°C default)",
      "No odours (fresh scent)",
      "No noise issues reported",
      "Door locks functional",
      "In-room safe functional",
      "TV and remotes functional",
    ],
  },
];

const PIE_DATA = [
  { name: "Dirty", value: 12, color: "#f87171" },
  { name: "In Progress", value: 7, color: "#fb923c" },
  { name: "Clean", value: 10, color: "#34d399" },
  { name: "Inspected", value: 8, color: "#60a5fa" },
  { name: "OOS", value: 3, color: "#a78bfa" },
];

const HOURLY_DATA = [
  { hour: "07:00", completed: 0 },
  { hour: "08:00", completed: 3 },
  { hour: "09:00", completed: 6 },
  { hour: "10:00", completed: 9 },
  { hour: "11:00", completed: 7 },
  { hour: "12:00", completed: 5 },
  { hour: "13:00", completed: 4 },
  { hour: "14:00", completed: 3 },
  { hour: "15:00", completed: 2 },
  { hour: "16:00", completed: 1 },
];

const PRIORITY_ROOMS = [
  { room: "105", type: "Suite", reason: "VIP Check-in 14:00", assigned: "Unassigned", deadline: "12:00" },
  { room: "201", type: "Suite", reason: "VIP Checkout — Ambassador", assigned: "Clara V.", deadline: "11:00" },
  { room: "304", type: "Suite", reason: "VIP Arrival 13:30", assigned: "Unassigned", deadline: "11:30" },
  { room: "401", type: "Presidential", reason: "Checkout — full refresh", assigned: "Maria L.", deadline: "12:00" },
  { room: "402", type: "Suite", reason: "VIP in-house — daily clean", assigned: "Emma R.", deadline: "12:30" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatMins = (mins: number) => {
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
};

const statusColors: Record<RoomStatus, string> = {
  Dirty: "bg-red-100 text-red-700 border-red-200",
  "In Progress": "bg-orange-100 text-orange-700 border-orange-200",
  Clean: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inspected: "bg-blue-100 text-blue-700 border-blue-200",
  OOS: "bg-purple-100 text-purple-700 border-purple-200",
};

const statusCardBorders: Record<RoomStatus, string> = {
  Dirty: "border-l-4 border-l-red-400",
  "In Progress": "border-l-4 border-l-orange-400",
  Clean: "border-l-4 border-l-emerald-400",
  Inspected: "border-l-4 border-l-blue-400",
  OOS: "border-l-4 border-l-purple-400",
};

const priorityColors: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const taskStatusColors: Record<TaskStatus, string> = {
  Pending: "bg-slate-100 text-slate-600",
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Skipped: "bg-secondary text-muted-foreground",
};

const supplyStatusColors: Record<SupplyStatus, string> = {
  Adequate: "bg-emerald-100 text-emerald-700",
  Low: "bg-yellow-100 text-yellow-700",
  Critical: "bg-red-100 text-red-700",
};

const staffStatusColors: Record<StaffStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Break: "bg-yellow-100 text-yellow-700",
  Off: "bg-secondary text-muted-foreground",
};

const foundStatusColors: Record<FoundStatus, string> = {
  Unclaimed: "bg-orange-100 text-orange-700",
  Claimed: "bg-emerald-100 text-emerald-700",
  Donated: "bg-blue-100 text-blue-700",
  Disposed: "bg-secondary text-muted-foreground",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <div className={cn("rounded-2xl p-5 text-white shadow-sm", gradient)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
          {sub && <p className="mt-1 text-xs text-white/70">{sub}</p>}
        </div>
        <div className="rounded-xl bg-white/20 p-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function Overview() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search housekeeping..." />}
      header={<SectionHeader icon={Home} title="Housekeeping Overview" subtitle="Live room status, tasks, and team performance" />}
      kpi={<KpiStrip items={[{color:"bg-red-500",value:12,label:"Rooms to Clean"},{color:"bg-orange-500",value:7,label:"In Progress"},{color:"bg-emerald-500",value:10,label:"Completed"},{color:"bg-blue-500",value:8,label:"Inspected & Ready"},{color:"bg-purple-500",value:3,label:"Out of Service"}]} />}
      legend={<LegendBar items={[
        { color: "bg-red-100 border-red-200", label: "Dirty (12)" },
        { color: "bg-orange-100 border-orange-200", label: "In Progress (7)" },
        { color: "bg-emerald-100 border-emerald-200", label: "Clean (10)" },
        { color: "bg-blue-100 border-blue-200", label: "Inspected (8)" },
        { color: "bg-purple-100 border-purple-200", label: "OOS (3)" },
      ]} />}
    >

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <SectionHeader title="Room Status Breakdown" className="mb-4" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <SectionHeader title="Rooms Completed by Hour" className="mb-4" />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={HOURLY_DATA} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {HOURLY_DATA.map((_, i) => (
                  <Cell key={i} fill={i < 5 ? "#34d399" : "#60a5fa"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <SectionHeader title="Priority Rooms" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Room", "Type", "Priority Reason", "Assigned To", "Deadline"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRIORITY_ROOMS.map((r) => (
                <tr key={r.room} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-foreground">{r.room}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.type}</td>
                  <td className="px-4 py-3 text-foreground">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium",
                      r.assigned === "Unassigned" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                    )}>{r.assigned}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-red-600">{r.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Room Status ──────────────────────────────────────────────────────────────

const hkRoomBg: Record<RoomStatus, string> = {
  Dirty: "bg-red-100 border-red-200 text-red-900",
  "In Progress": "bg-orange-100 border-orange-200 text-orange-900",
  Clean: "bg-emerald-100 border-emerald-200 text-emerald-900",
  Inspected: "bg-blue-100 border-blue-200 text-blue-900",
  OOS: "bg-purple-100 border-purple-200 text-purple-900",
};

const hkDotColors: Record<RoomStatus, string> = {
  Dirty: "bg-red-500",
  "In Progress": "bg-orange-500",
  Clean: "bg-emerald-500",
  Inspected: "bg-blue-500",
  OOS: "bg-purple-500",
};

function RoomStatusView() {
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");

  const filtered = useMemo(() =>
    ROOMS.filter((r) =>
      (floorFilter === "all" || r.floor === floorFilter) &&
      (statusFilter === "all" || r.status === statusFilter)
    ), [floorFilter, statusFilter]);

  const counts = useMemo(() =>
    (["Dirty", "In Progress", "Clean", "Inspected", "OOS"] as RoomStatus[]).reduce(
      (acc, s) => ({ ...acc, [s]: ROOMS.filter((r) => r.status === s).length }),
      {} as Record<RoomStatus, number>
    ), []);

  const floors = [1, 2, 3, 4];
  const hkStatuses = ["Dirty", "In Progress", "Clean", "Inspected", "OOS"] as RoomStatus[];

  const legendLabels: Record<RoomStatus, string> = {
    Dirty: "Dirty",
    "In Progress": "In Progress",
    Clean: "Clean",
    Inspected: "Inspected",
    OOS: "Out of Service",
  };

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search rooms..." />}
      header={<SectionHeader icon={Home} title="Room Status" subtitle="Real-time housekeeping status by floor" />}
      kpi={<KpiStrip items={hkStatuses.map((s) => ({
        color: hkDotColors[s],
        value: counts[s],
        label: s,
      }))} />}
      legend={<LegendBar items={hkStatuses.map((s) => ({
        color: hkRoomBg[s].split(" ").slice(0, 2).join(" "),
        label: legendLabels[s],
      }))} />}
    >

      {/* Floor plan card */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        {/* Floor tabs + status filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFloorFilter("all")}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", floorFilter === "all" ? "bg-violet-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
            >All Floors</button>
            {floors.map(f => (
              <button
                key={f}
                onClick={() => setFloorFilter(f)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", floorFilter === f ? "bg-violet-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
              >Floor {f}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors", statusFilter === "all" ? "bg-violet-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
            >All</button>
            {hkStatuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-medium transition-colors", statusFilter === s ? "bg-violet-600 text-white" : "bg-secondary text-secondary-foreground hover:bg-secondary/80")}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Room grid by floor */}
        {floors.filter(f => floorFilter === "all" || f === floorFilter).map(floor => {
          const floorRooms = filtered.filter(r => r.floor === floor);
          if (!floorRooms.length) return null;
          return (
            <div key={floor} className="mb-6 last:mb-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Floor {floor}</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-9 gap-3">
                {floorRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    roomNumber={room.id}
                    roomType={room.type}
                    status={room.status}
                    statusColor={hkRoomBg[room.status]}
                    details={[
                      { icon: User, text: room.housekeeper },
                      { icon: Clock, text: formatMins(room.updatedMins) },
                    ]}
                    badges={[
                      ...(room.vip ? [{ label: "VIP" }] : []),
                      ...(room.checkOut ? [{ label: "CO" }] : []),
                      ...(room.checkIn ? [{ label: "CI" }] : []),
                    ]}
                  />
                ))}
              </div>
            </div>
          );
        })}
        <p className="mt-2 text-right text-xs text-muted-foreground">{filtered.length} rooms</p>
      </div>
    </PageShell>
  );
}

// ─── Task List ────────────────────────────────────────────────────────────────

function TaskListView() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TaskType | "all">("all");

  const filtered = useMemo(() =>
    TASKS.filter((t) =>
      (statusFilter === "all" || t.status === statusFilter) &&
      (priorityFilter === "all" || t.priority === priorityFilter) &&
      (typeFilter === "all" || t.type === typeFilter)
    ), [statusFilter, priorityFilter, typeFilter]);

  const statCounts = useMemo(() => ({
    total: TASKS.length,
    pending: TASKS.filter((t) => t.status === "Pending").length,
    inProgress: TASKS.filter((t) => t.status === "In Progress").length,
    completed: TASKS.filter((t) => t.status === "Completed").length,
  }), []);

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks..." />}
      header={<SectionHeader icon={Home} title="Task List" subtitle="Housekeeping tasks and assignments" />}
      kpi={<KpiStrip items={[
        { color: "bg-slate-500", value: statCounts.total, label: "Total Tasks" },
        { color: "bg-slate-500", value: statCounts.pending, label: "Pending" },
        { color: "bg-orange-500", value: statCounts.inProgress, label: "In Progress" },
        { color: "bg-emerald-500", value: statCounts.completed, label: "Completed" },
        { color: "bg-blue-500", value: TASKS.filter(t => t.status === "Skipped").length, label: "Skipped" },
      ]} />}
    >
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          {(["all", "Pending", "In Progress", "Completed"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s as TaskStatus | "all")}
              className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Priority:</span>
          {(["all", "High", "Medium", "Low"] as const).map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p as Priority | "all")}
              className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", priorityFilter === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>
              {p === "all" ? "All" : p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Type:</span>
          {(["all", "Checkout", "Stayover", "Deep Clean", "Turndown", "Inspection"] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t as TaskType | "all")}
              className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", typeFilter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Task ID", "Room", "Type", "Assigned To", "Priority", "Status", "Notes", "Due Time", "Action"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((task) => (
                <tr key={task.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{task.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{task.room}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", {
                      "bg-red-100 text-red-700": task.type === "Checkout",
                      "bg-blue-100 text-blue-700": task.type === "Stayover",
                      "bg-purple-100 text-purple-700": task.type === "Deep Clean",
                      "bg-amber-100 text-amber-700": task.type === "Turndown",
                      "bg-violet-100 text-violet-700": task.type === "Inspection",
                    })}>{task.type}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{task.assignedTo}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", priorityColors[task.priority])}>{task.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", taskStatusColors[task.status])}>{task.status}</span>
                  </td>
                  <td className="max-w-[160px] px-4 py-3 text-xs text-muted-foreground truncate">{task.notes || "—"}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{task.dueTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {task.status === "Pending" && (
                        <>
                          <button className="rounded-xl bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-200 transition-colors">Assign</button>
                          <button className="rounded-xl bg-orange-100 px-2 py-1 text-[10px] font-semibold text-orange-700 hover:bg-orange-200 transition-colors">Start</button>
                        </>
                      )}
                      {task.status === "In Progress" && (
                        <button className="rounded-xl bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-200 transition-colors">Complete</button>
                      )}
                      {task.status === "Completed" && (
                        <span className="text-[10px] text-muted-foreground">Done</span>
                      )}
                    </div>
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

// ─── Supervisor Dashboard ─────────────────────────────────────────────────────

function SupervisorDashboard() {
  const inspectionQueue = useMemo(() =>
    ROOMS.filter((r) => r.status === "Clean").map((r) => ({
      room: r.id,
      type: r.type,
      housekeeper: r.housekeeper,
      waitMins: r.updatedMins,
      urgency: r.checkIn ? "High" : "Normal",
    })).sort((a, b) => (a.urgency === "High" ? -1 : 1)), []);

  const unassignedRooms = ROOMS.filter((r) => r.housekeeper === "Unassigned" && (r.status === "Dirty" || r.status === "Clean"));
  const availableStaff = STAFF.filter((s) => s.status === "Active");

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search team..." />}
      header={<SectionHeader icon={Home} title="Supervisor Dashboard" subtitle="Team performance and inspection queue" />}
      kpi={<KpiStrip items={[
        { color: "bg-blue-500", value: STAFF.filter(s => s.status === "Active").length, label: "Active Staff" },
        { color: "bg-amber-500", value: STAFF.filter(s => s.status === "Break").length, label: "On Break" },
        { color: "bg-slate-500", value: STAFF.filter(s => s.status === "Off").length, label: "Off Duty" },
        { color: "bg-emerald-500", value: inspectionQueue.length, label: "Pending Inspection" },
        { color: "bg-red-500", value: unassignedRooms.length, label: "Unassigned" },
      ]} />}
    >
      <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <User className="h-4 w-4 text-blue-500" />
          <SectionHeader title="Attendant Performance — Today" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Attendant", "Assigned", "Completed", "Rooms/Hr", "Current Room", "Shift Start", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {STAFF.map((s) => (
                <tr key={s.name} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-foreground">{s.assigned}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-emerald-600">{s.completed}</span>
                    <span className="text-muted-foreground"> / {s.assigned}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.rate > 0 ? (
                      <span className={cn("font-semibold", s.rate >= 2.5 ? "text-emerald-600" : s.rate >= 2.0 ? "text-yellow-600" : "text-red-600")}>
                        {s.rate.toFixed(1)}
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground">{s.currentRoom}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.shiftStart}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", staffStatusColors[s.status])}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <ClipboardList className="h-4 w-4 text-violet-500" />
            <SectionHeader title="Inspection Queue" />
            <span className="ml-auto rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">{inspectionQueue.length} rooms</span>
          </div>
          <div className="divide-y divide-border">
            {inspectionQueue.slice(0, 8).map((r) => (
              <div key={r.room} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-violet-700">{r.room}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{r.type} — Room {r.room}</p>
                  <p className="text-xs text-muted-foreground">Cleaned by {r.housekeeper} · {formatMins(r.waitMins)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    r.urgency === "High" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                  )}>{r.urgency}</span>
                  <button className="rounded-xl bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-200 transition-colors">Inspect</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Wrench className="h-4 w-4 text-violet-500" />
            <SectionHeader title="Room Reassignment" />
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground">Assign unassigned rooms to available attendants.</p>
            <div className="space-y-2">
              {unassignedRooms.slice(0, 6).map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-2.5">
                  <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-red-600">{r.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{r.type} · {r.priority} priority</p>
                    <p className="text-[10px] text-muted-foreground">{r.status} · {formatMins(r.updatedMins)}</p>
                  </div>
                  <select className="rounded-xl border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shrink-0">
                    <option value="">Assign to...</option>
                    {availableStaff.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {unassignedRooms.length > 6 && (
              <p className="text-center text-xs text-muted-foreground">+{unassignedRooms.length - 6} more unassigned rooms</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </PageShell>
  );
}

// ─── Turndown Service ─────────────────────────────────────────────────────────

function TurndownService() {
  const amenityChecklist = [
    "Bed turned down (60° fold)",
    "Pillow menu card placed",
    "Chocolates on nightstand",
    "Slippers positioned bedside",
    "Robe laid on bed (if requested)",
    "Blackout curtains closed",
    "Bedside lamp set to low",
    "TV guide / newspaper left",
    "Bathroom towels refreshed",
    "Bath mat replaced",
    "Turndown card left",
    "Do Not Disturb sign checked",
  ];

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search turndown..." />}
      header={<SectionHeader icon={Home} title="Evening Turndown Service" subtitle="Room-by-room turndown progress" />}
      kpi={<KpiStrip items={[{color:"bg-slate-500",value:TURNDOWN.filter((t) => t.status === "Pending").length,label:"Pending"},{color:"bg-amber-500",value:TURNDOWN.filter((t) => t.status === "In Progress").length,label:"In Progress"},{color:"bg-emerald-500",value:TURNDOWN.filter((t) => t.status === "Completed").length,label:"Completed"},{color:"bg-purple-500",value:TURNDOWN.filter((t) => t.vip).length,label:"VIP Rooms"},{color:"bg-red-500",value:TURNDOWN.filter((t) => t.assigned === "Unassigned").length,label:"Unassigned"}]} />}
    >
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Room", "Guest", "VIP", "Requests", "Assigned", "Status", "Completed"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TURNDOWN.map((t) => (
                <tr key={t.room} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-foreground">{t.room}</td>
                  <td className="px-4 py-3 text-foreground">{t.guest}</td>
                  <td className="px-4 py-3">
                    {t.vip ? <Star className="h-4 w-4 text-amber-500" fill="currentColor" /> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-muted-foreground truncate">{t.requests}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium",
                      t.assigned === "Unassigned" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                    )}>{t.assigned}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium",
                      t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "In Progress" ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-600"
                    )}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.timeCompleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <ClipboardList className="h-4 w-4 text-violet-500" />
          <SectionHeader title="Standard Turndown Amenity Placement" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-5">
          {amenityChecklist.map((item, i) => (
            <label key={i} className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors">
              <input type="checkbox" defaultChecked={i < 7} className="h-4 w-4 rounded accent-violet-500" />
              <span className="text-sm text-foreground">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

// ─── Lost & Found ─────────────────────────────────────────────────────────────

function LostAndFound() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<FoundStatus | "all">("all");

  const filtered = useMemo(() =>
    LOST_FOUND.filter((i) =>
      (categoryFilter === "all" || i.category === categoryFilter) &&
      (statusFilter === "all" || i.status === statusFilter)
    ), [categoryFilter, statusFilter]);

  const categories = [...new Set(LOST_FOUND.map((i) => i.category))];

  const stats = {
    total: LOST_FOUND.length,
    claimed: LOST_FOUND.filter((i) => i.status === "Claimed").length,
    unclaimed: LOST_FOUND.filter((i) => i.status === "Unclaimed").length,
    disposed: LOST_FOUND.filter((i) => i.status === "Disposed" || i.status === "Donated").length,
  };

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search lost & found..." />}
      header={<SectionHeader icon={Home} title="Lost & Found" subtitle="Track and manage found items" />}
      kpi={<KpiStrip items={[{color:"bg-slate-500",value:stats.total,label:"Total Items"},{color:"bg-emerald-500",value:stats.claimed,label:"Claimed"},{color:"bg-orange-500",value:stats.unclaimed,label:"Unclaimed"},{color:"bg-slate-500",value:stats.disposed,label:"Disposed / Donated"},{color:"bg-blue-500",value:categories.length,label:"Categories"}]} />}
    >
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground">Category:</span>
          <button onClick={() => setCategoryFilter("all")} className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", categoryFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>All</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", categoryFilter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>{c}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap ml-2">
          <span className="text-xs font-medium text-muted-foreground">Status:</span>
          {(["all", "Unclaimed", "Claimed", "Donated", "Disposed"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s as FoundStatus | "all")} className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Item ID", "Description", "Category", "Found Location", "Found By", "Date", "Guest", "Contact", "Status", "Claim Date"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.id}</td>
                  <td className="max-w-[180px] px-4 py-3 font-medium text-foreground truncate">{item.description}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", {
                      "bg-blue-100 text-blue-700": item.category === "Electronics",
                      "bg-purple-100 text-purple-700": item.category === "Clothing",
                      "bg-amber-100 text-amber-700": item.category === "Jewelry",
                      "bg-violet-100 text-violet-700": item.category === "Documents",
                      "bg-slate-100 text-slate-700": item.category === "Other",
                    })}>{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                  <td className="px-4 py-3 text-foreground">{item.foundBy}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.dateFound}</td>
                  <td className="px-4 py-3 text-foreground">{item.guest}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{item.contact}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", foundStatusColors[item.status])}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.claimDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Inventory & Supplies ─────────────────────────────────────────────────────

function InventorySupplies() {
  const [activeTab, setActiveTab] = useState<"linen" | "supplies">("linen");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredSupplies = useMemo(() =>
    SUPPLIES.filter((s) => categoryFilter === "all" || s.category === categoryFilter),
    [categoryFilter]);

  const supplyCategories = [...new Set(SUPPLIES.map((s) => s.category))];

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search inventory..." />}
      header={<SectionHeader icon={Home} title="Linen & Inventory" subtitle="Par levels, supplies, and stock management" />}
      kpi={<KpiStrip items={[
        { color: "bg-emerald-500", value: LINENS.length, label: "Linen Items" },
        { color: "bg-blue-500", value: SUPPLIES.length, label: "Supply Items" },
        { color: "bg-red-500", value: SUPPLIES.filter(s => s.status === "Critical").length, label: "Critical" },
        { color: "bg-amber-500", value: SUPPLIES.filter(s => s.status === "Low").length, label: "Low Stock" },
        { color: "bg-slate-500", value: SUPPLIES.filter(s => s.status === "Adequate").length, label: "Adequate" },
      ]} />}
    >
      <div className="flex gap-2 rounded-2xl border border-border bg-card p-1.5 w-fit">
        <button onClick={() => setActiveTab("linen")} className={cn("rounded-xl px-5 py-2 text-sm font-medium transition-all", activeTab === "linen" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Linen Par Levels</button>
        <button onClick={() => setActiveTab("supplies")} className={cn("rounded-xl px-5 py-2 text-sm font-medium transition-all", activeTab === "supplies" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>Supplies</button>
      </div>

      {activeTab === "linen" && (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Layers className="h-4 w-4 text-blue-500" />
            <SectionHeader title="Linen Par Levels" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  {["Item", "Par Stock", "Current Stock", "In Laundry", "Condemned", "Available", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {LINENS.map((l) => {
                  const available = l.current - l.inLaundry - l.condemned;
                  const pct = Math.round((available / l.par) * 100);
                  const status: SupplyStatus = pct >= 60 ? "Adequate" : pct >= 35 ? "Low" : "Critical";
                  const surplus = available - l.par;
                  return (
                    <tr key={l.item} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{l.item}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.par}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{l.current}</td>
                      <td className="px-4 py-3 text-blue-600">{l.inLaundry}</td>
                      <td className="px-4 py-3 text-red-500">{l.condemned}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{available}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", supplyStatusColors[status])}>{status}</span>
                          <span className={cn("text-xs font-semibold", surplus >= 0 ? "text-emerald-600" : "text-red-600")}>
                            {surplus >= 0 ? `+${surplus}` : surplus}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "supplies" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-medium text-emerald-700">Adequate</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{SUPPLIES.filter((s) => s.status === "Adequate").length}</p>
            </div>
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-xs font-medium text-yellow-700">Low Stock</p>
              <p className="mt-1 text-2xl font-bold text-yellow-700">{SUPPLIES.filter((s) => s.status === "Low").length}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs font-medium text-red-700">Critical</p>
              <p className="mt-1 text-2xl font-bold text-red-700">{SUPPLIES.filter((s) => s.status === "Critical").length}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">Category:</span>
            <button onClick={() => setCategoryFilter("all")} className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", categoryFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>All</button>
            {supplyCategories.map((c) => (
              <button key={c} onClick={() => setCategoryFilter(c)} className={cn("rounded-xl px-2.5 py-1 text-xs font-medium transition-colors", categoryFilter === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}>{c}</button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    {["Item", "Category", "Current", "Min Required", "Unit", "Last Restocked", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSupplies.map((s) => (
                    <tr key={s.item} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{s.item}</td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", {
                          "bg-violet-100 text-violet-700": s.category === "Amenities",
                          "bg-blue-100 text-blue-700": s.category === "Cleaning",
                          "bg-indigo-100 text-indigo-700": s.category === "Paper",
                          "bg-amber-100 text-amber-700": s.category === "Guest",
                        })}>{s.category}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{s.current}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.min}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.lastRestocked}</td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", supplyStatusColors[s.status])}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

// ─── Inspection Checklist ─────────────────────────────────────────────────────

function InspectionChecklist() {
  const [selectedRoom, setSelectedRoom] = useState("103");
  const [checks, setChecks] = useState<Record<string, CheckResult>>(() => {
    const initial: Record<string, CheckResult> = {};
    CHECKLIST_CATEGORIES.forEach((cat) => {
      cat.items.forEach((item) => {
        initial[`${cat.name}::${item}`] = "";
      });
    });
    return initial;
  });

  const setCheck = (cat: string, item: string, val: CheckResult) => {
    setChecks((prev) => ({ ...prev, [`${cat}::${item}`]: val }));
  };

  const inspectableRooms = ROOMS.filter((r) => r.status === "Clean" || r.status === "Inspected");

  const counts = useMemo(() => ({
    pass: Object.values(checks).filter((v) => v === "Pass").length,
    fail: Object.values(checks).filter((v) => v === "Fail").length,
    na: Object.values(checks).filter((v) => v === "N/A").length,
    total: Object.values(checks).length,
  }), [checks]);

  const fillAll = (result: CheckResult) => {
    setChecks((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => { next[k] = result; });
      return next;
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search inspections..." />}
      header={<SectionHeader icon={Home} title="Inspection Checklist" subtitle="Room inspection verification" />}
      kpi={<KpiStrip items={[
        { color: "bg-emerald-500", value: counts.pass, label: "Pass" },
        { color: "bg-red-500", value: counts.fail, label: "Fail" },
        { color: "bg-slate-500", value: counts.na, label: "N/A" },
        { color: "bg-blue-500", value: counts.total, label: "Total Checks" },
        { color: "bg-violet-500", value: inspectableRooms.length, label: "Inspectable Rooms" },
      ]} />}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-semibold text-foreground">Inspection Room:</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {inspectableRooms.map((r) => (
              <option key={r.id} value={r.id}>Room {r.id} — {r.type} ({r.status})</option>
            ))}
          </select>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => fillAll("Pass")} className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 transition-colors">Mark All Pass</button>
          <button onClick={() => fillAll("")} className="rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/70 transition-colors">Clear</button>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Inspection progress</span>
            <span className="font-semibold text-foreground">{counts.pass + counts.fail + counts.na} / {counts.total}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-violet-600 transition-all duration-300"
              style={{ width: `${((counts.pass + counts.fail + counts.na) / counts.total) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 text-center shrink-0">
          <div><p className="text-xs text-muted-foreground">Pass</p><p className="text-lg font-bold text-emerald-600">{counts.pass}</p></div>
          <div><p className="text-xs text-muted-foreground">Fail</p><p className="text-lg font-bold text-red-500">{counts.fail}</p></div>
          <div><p className="text-xs text-muted-foreground">N/A</p><p className="text-lg font-bold text-muted-foreground">{counts.na}</p></div>
        </div>
      </div>

      {CHECKLIST_CATEGORIES.map((cat) => (
        <div key={cat.name} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3 bg-muted/30">
            <span className="text-base">{cat.icon}</span>
            <h3 className="text-sm font-semibold text-foreground">{cat.name}</h3>
            <span className="ml-auto text-xs text-muted-foreground">{cat.items.length} checkpoints</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20">
                <tr>
                  <th className="px-5 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-full">Checkpoint</th>
                  {(["Pass", "Fail", "N/A"] as CheckResult[]).map((v) => (
                    <th key={v} className={cn("px-6 py-2 text-center text-xs font-semibold uppercase tracking-wide whitespace-nowrap",
                      v === "Pass" ? "text-emerald-600" : v === "Fail" ? "text-red-500" : "text-muted-foreground"
                    )}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cat.items.map((item) => {
                  const key = `${cat.name}::${item}`;
                  const current = checks[key];
                  return (
                    <tr key={item} className={cn("transition-colors hover:bg-muted/20",
                      current === "Pass" ? "bg-emerald-50/40" :
                      current === "Fail" ? "bg-red-50/40" :
                      current === "N/A" ? "bg-muted/40" : ""
                    )}>
                      <td className="px-5 py-2.5 text-foreground">{item}</td>
                      {(["Pass", "Fail", "N/A"] as CheckResult[]).map((v) => (
                        <td key={v} className="px-6 py-2.5 text-center">
                          <input
                            type="radio"
                            name={key}
                            value={v}
                            checked={current === v}
                            onChange={() => setCheck(cat.name, item, v)}
                            className={cn("h-4 w-4 cursor-pointer",
                              v === "Pass" ? "accent-emerald-500" : v === "Fail" ? "accent-red-500" : "accent-slate-400"
                            )}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <button className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">Save Draft</button>
        <button
          disabled={counts.fail > 0}
          className={cn("rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
            counts.fail === 0 && counts.pass > 0
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {counts.fail > 0 ? `${counts.fail} Fail(s) — Cannot Approve` : "Approve Room"}
        </button>
      </div>
    </PageShell>
  );
}

// ─── Minibar Restocking ───────────────────────────────────────────────────────

function MinibarRestocking() {
  const totalRevenue = MINIBAR.reduce((sum, m) => sum + m.revenue, 0);
  const pending = MINIBAR.filter((m) => m.status === "Pending").length;
  const completed = MINIBAR.filter((m) => m.status === "Completed").length;
  const noCharge = MINIBAR.filter((m) => m.status === "No Charge").length;

  const [searchQuery, setSearchQuery] = useState("");
  return (
    <PageShell
      search={<SectionSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search minibar..." />}
      header={<SectionHeader icon={Home} title="Minibar Restocking Log" subtitle="Daily minibar consumption and restocking" />}
      kpi={<KpiStrip items={[{color:"bg-violet-500",value:`$${totalRevenue.toFixed(2)}`,label:"Total Revenue"},{color:"bg-emerald-500",value:completed,label:"Restocked"},{color:"bg-orange-500",value:pending,label:"Pending Check"},{color:"bg-blue-500",value:noCharge,label:"No Charge"},{color:"bg-slate-500",value:MINIBAR.length,label:"Total Rooms"}]} />}
    >
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {["Room", "Last Restocked", "Items Missing", "Items Added", "Revenue", "Restocked By", "Date", "Status"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MINIBAR.map((m) => (
                <tr key={m.room} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-semibold text-foreground">{m.room}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.lastRestocked}</td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-foreground truncate">{m.missing}</td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-muted-foreground truncate">{m.added}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{m.revenue > 0 ? `$${m.revenue.toFixed(2)}` : "—"}</td>
                  <td className="px-4 py-3 text-foreground">{m.restockedBy}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.date}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium",
                      m.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      m.status === "Pending" ? "bg-orange-100 text-orange-700" :
                      "bg-slate-100 text-slate-600"
                    )}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border bg-muted/20 px-5 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total minibar revenue today</span>
          <span className="text-lg font-bold text-emerald-600">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Housekeeping({ aiEnabled, activeSubmenu }: HousekeepingProps) {
  const view = activeSubmenu || "Overview";

  const subviewMap: Record<string, { label: string; icon: React.ElementType; component: React.ReactNode }> = {
    "Overview": { label: "Overview", icon: BarChart2, component: <Overview /> },
    "Room Status": { label: "Room Status", icon: Home, component: <RoomStatusView /> },
    "Tasks": { label: "Tasks", icon: ClipboardList, component: <TaskListView /> },
    "My Team": { label: "My Team", icon: User, component: <SupervisorDashboard /> },
    "Turndown Service": { label: "Turndown Service", icon: Coffee, component: <TurndownService /> },
    "Lost & Found": { label: "Lost & Found", icon: Package, component: <LostAndFound /> },
    "Linen & Inventory": { label: "Linen & Inventory", icon: Layers, component: <InventorySupplies /> },
    "Inspections": { label: "Inspections", icon: CheckCircle2, component: <InspectionChecklist /> },
    "Minibar": { label: "Minibar", icon: Bell, component: <MinibarRestocking /> },
    "Reports": { label: "Reports", icon: BarChart2, component: <Overview /> },
  };

  const current = subviewMap[view] ?? subviewMap["Overview"];
  const Icon = current.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="space-y-6"
      >
        {current.component}
      </motion.div>
    </AnimatePresence>
  );
}
