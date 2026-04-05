import React, { useMemo } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  AlertCircle,
  Star,
  Shield,
  Activity,
  Heart,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";


interface HumanResourcesProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

// ─── Static Data ────────────────────────────────────────────────────────────

const attendanceTrend = [
  { date: "Mar 03", present: 82, absent: 8, late: 6 },
  { date: "Mar 04", present: 85, absent: 6, late: 5 },
  { date: "Mar 05", present: 80, absent: 9, late: 7 },
  { date: "Mar 06", present: 88, absent: 5, late: 3 },
  { date: "Mar 07", present: 76, absent: 12, late: 8 },
  { date: "Mar 08", present: 90, absent: 4, late: 2 },
  { date: "Mar 09", present: 72, absent: 14, late: 10 },
  { date: "Mar 10", present: 87, absent: 6, late: 5 },
  { date: "Mar 11", present: 89, absent: 5, late: 4 },
  { date: "Mar 12", present: 84, absent: 8, late: 6 },
  { date: "Mar 13", present: 91, absent: 3, late: 2 },
  { date: "Mar 14", present: 86, absent: 7, late: 5 },
  { date: "Mar 15", present: 79, absent: 10, late: 9 },
  { date: "Mar 16", present: 83, absent: 9, late: 6 },
  { date: "Mar 17", present: 93, absent: 2, late: 1 },
  { date: "Mar 18", present: 78, absent: 11, late: 9 },
  { date: "Mar 19", present: 88, absent: 5, late: 4 },
  { date: "Mar 20", present: 92, absent: 3, late: 1 },
  { date: "Mar 21", present: 85, absent: 8, late: 5 },
  { date: "Mar 22", present: 87, absent: 6, late: 5 },
  { date: "Mar 23", present: 81, absent: 10, late: 7 },
  { date: "Mar 24", present: 90, absent: 4, late: 2 },
  { date: "Mar 25", present: 77, absent: 13, late: 8 },
  { date: "Mar 26", present: 89, absent: 5, late: 4 },
  { date: "Mar 27", present: 94, absent: 2, late: 0 },
  { date: "Mar 28", present: 86, absent: 7, late: 5 },
  { date: "Mar 29", present: 82, absent: 9, late: 7 },
  { date: "Mar 30", present: 90, absent: 4, late: 3 },
  { date: "Mar 31", present: 88, absent: 6, late: 4 },
  { date: "Apr 01", present: 91, absent: 3, late: 2 },
];

const deptDistribution = [
  { name: "Front Office", value: 22, color: "#6366f1" },
  { name: "Housekeeping", value: 31, color: "#8b5cf6" },
  { name: "F&B", value: 28, color: "#a78bfa" },
  { name: "Maintenance", value: 14, color: "#c4b5fd" },
  { name: "Security", value: 8, color: "#7c3aed" },
  { name: "Finance", value: 6, color: "#4f46e5" },
  { name: "HR", value: 5, color: "#3730a3" },
];

const todayRoster = [
  { name: "Maria Santos", dept: "Front Office", role: "Receptionist", shift: "Morning", clockIn: "07:02", status: "On Duty" },
  { name: "James Reyes", dept: "Housekeeping", role: "Room Attendant", shift: "Morning", clockIn: "07:15", status: "On Duty" },
  { name: "Ana Cruz", dept: "F&B", role: "Waitstaff", shift: "Afternoon", clockIn: "15:00", status: "Scheduled" },
  { name: "Pedro Lim", dept: "Maintenance", role: "Technician", shift: "Morning", clockIn: "06:58", status: "On Duty" },
  { name: "Sofia Tan", dept: "Front Office", role: "Concierge", shift: "Morning", clockIn: "07:05", status: "On Duty" },
  { name: "Carlos Dela Cruz", dept: "Security", role: "Guard", shift: "Night", clockIn: "23:00", status: "Scheduled" },
  { name: "Rosa Mendez", dept: "Housekeeping", role: "Supervisor", shift: "Morning", clockIn: "06:45", status: "On Duty" },
  { name: "Miguel Torres", dept: "F&B", role: "Chef", shift: "Morning", clockIn: "06:30", status: "On Duty" },
  { name: "Luz Garcia", dept: "Finance", role: "Accountant", shift: "Morning", clockIn: "08:02", status: "Late" },
  { name: "Ramon Villanueva", dept: "HR", role: "HR Officer", shift: "Morning", clockIn: "—", status: "Absent" },
];

const staffDirectory = [
  { id: "EMP001", name: "Maria Santos", dept: "Front Office", role: "Senior Receptionist", email: "m.santos@singularity.ph", phone: "+63 917 123 4567", contract: "Full-time", joinDate: "2020-03-15", status: "Active" },
  { id: "EMP002", name: "James Reyes", dept: "Housekeeping", role: "Room Attendant", email: "j.reyes@singularity.ph", phone: "+63 918 234 5678", contract: "Full-time", joinDate: "2021-06-01", status: "Active" },
  { id: "EMP003", name: "Ana Cruz", dept: "F&B", role: "Waitstaff", email: "a.cruz@singularity.ph", phone: "+63 919 345 6789", contract: "Part-time", joinDate: "2022-09-10", status: "Active" },
  { id: "EMP004", name: "Pedro Lim", dept: "Maintenance", role: "Senior Technician", email: "p.lim@singularity.ph", phone: "+63 920 456 7890", contract: "Full-time", joinDate: "2019-11-20", status: "Active" },
  { id: "EMP005", name: "Sofia Tan", dept: "Front Office", role: "Concierge", email: "s.tan@singularity.ph", phone: "+63 921 567 8901", contract: "Full-time", joinDate: "2021-02-14", status: "Active" },
  { id: "EMP006", name: "Carlos Dela Cruz", dept: "Security", role: "Senior Guard", email: "c.delacruz@singularity.ph", phone: "+63 922 678 9012", contract: "Full-time", joinDate: "2020-07-05", status: "Active" },
  { id: "EMP007", name: "Rosa Mendez", dept: "Housekeeping", role: "Housekeeping Supervisor", email: "r.mendez@singularity.ph", phone: "+63 923 789 0123", contract: "Full-time", joinDate: "2018-04-22", status: "Active" },
  { id: "EMP008", name: "Miguel Torres", dept: "F&B", role: "Sous Chef", email: "m.torres@singularity.ph", phone: "+63 924 890 1234", contract: "Full-time", joinDate: "2019-08-30", status: "Active" },
  { id: "EMP009", name: "Luz Garcia", dept: "Finance", role: "Senior Accountant", email: "l.garcia@singularity.ph", phone: "+63 925 901 2345", contract: "Full-time", joinDate: "2020-01-08", status: "Active" },
  { id: "EMP010", name: "Ramon Villanueva", dept: "HR", role: "HR Officer", email: "r.villanueva@singularity.ph", phone: "+63 926 012 3456", contract: "Full-time", joinDate: "2021-03-17", status: "On Leave" },
  { id: "EMP011", name: "Elena Bautista", dept: "Front Office", role: "Night Auditor", email: "e.bautista@singularity.ph", phone: "+63 927 123 4567", contract: "Full-time", joinDate: "2022-11-05", status: "Active" },
  { id: "EMP012", name: "Jose Ramos", dept: "Housekeeping", role: "Laundry Attendant", email: "j.ramos@singularity.ph", phone: "+63 928 234 5678", contract: "Casual", joinDate: "2023-01-20", status: "Probation" },
  { id: "EMP013", name: "Carmen Flores", dept: "F&B", role: "Restaurant Manager", email: "c.flores@singularity.ph", phone: "+63 929 345 6789", contract: "Full-time", joinDate: "2017-06-12", status: "Active" },
  { id: "EMP014", name: "Antonio Pascual", dept: "Maintenance", role: "Plumber", email: "a.pascual@singularity.ph", phone: "+63 930 456 7890", contract: "Full-time", joinDate: "2020-09-03", status: "Active" },
  { id: "EMP015", name: "Maricel Hernandez", dept: "Security", role: "Security Supervisor", email: "m.hernandez@singularity.ph", phone: "+63 931 567 8901", contract: "Full-time", joinDate: "2019-04-18", status: "Active" },
  { id: "EMP016", name: "Fernando Aquino", dept: "Finance", role: "Finance Manager", email: "f.aquino@singularity.ph", phone: "+63 932 678 9012", contract: "Full-time", joinDate: "2016-10-25", status: "Active" },
  { id: "EMP017", name: "Patricia Domingo", dept: "HR", role: "HR Manager", email: "p.domingo@singularity.ph", phone: "+63 933 789 0123", contract: "Full-time", joinDate: "2015-08-14", status: "Active" },
  { id: "EMP018", name: "Ricardo Castro", dept: "F&B", role: "Bartender", email: "r.castro@singularity.ph", phone: "+63 934 890 1234", contract: "Part-time", joinDate: "2023-03-01", status: "Probation" },
  { id: "EMP019", name: "Cristina Lopez", dept: "Front Office", role: "Guest Relations Officer", email: "c.lopez@singularity.ph", phone: "+63 935 901 2345", contract: "Full-time", joinDate: "2021-07-19", status: "Active" },
  { id: "EMP020", name: "Eduardo Morales", dept: "Maintenance", role: "Electrician", email: "e.morales@singularity.ph", phone: "+63 936 012 3456", contract: "Full-time", joinDate: "2018-12-10", status: "On Leave" },
];

const attendanceRecords = [
  { date: "2026-04-01", employee: "Maria Santos", dept: "Front Office", clockIn: "07:02", clockOut: "15:08", hoursWorked: 8.1, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-04-01", employee: "James Reyes", dept: "Housekeeping", clockIn: "07:18", clockOut: "15:15", hoursWorked: 7.95, breakDuration: 0.5, overtime: 0, status: "Late" },
  { date: "2026-04-01", employee: "Pedro Lim", dept: "Maintenance", clockIn: "06:58", clockOut: "17:02", hoursWorked: 10.07, breakDuration: 1.0, overtime: 2.0, status: "Present" },
  { date: "2026-04-01", employee: "Sofia Tan", dept: "Front Office", clockIn: "07:05", clockOut: "15:10", hoursWorked: 8.08, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-04-01", employee: "Rosa Mendez", dept: "Housekeeping", clockIn: "06:45", clockOut: "15:00", hoursWorked: 8.25, breakDuration: 0.5, overtime: 0.25, status: "Present" },
  { date: "2026-04-01", employee: "Miguel Torres", dept: "F&B", clockIn: "06:30", clockOut: "14:45", hoursWorked: 8.25, breakDuration: 0.5, overtime: 0.25, status: "Present" },
  { date: "2026-04-01", employee: "Luz Garcia", dept: "Finance", clockIn: "08:32", clockOut: "17:35", hoursWorked: 9.05, breakDuration: 1.0, overtime: 1.0, status: "Late" },
  { date: "2026-04-01", employee: "Ramon Villanueva", dept: "HR", clockIn: "—", clockOut: "—", hoursWorked: 0, breakDuration: 0, overtime: 0, status: "Absent" },
  { date: "2026-04-01", employee: "Elena Bautista", dept: "Front Office", clockIn: "22:55", clockOut: "07:05", hoursWorked: 8.17, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-04-01", employee: "Carmen Flores", dept: "F&B", clockIn: "09:00", clockOut: "18:00", hoursWorked: 8.0, breakDuration: 1.0, overtime: 0, status: "Present" },
  { date: "2026-03-31", employee: "Maria Santos", dept: "Front Office", clockIn: "07:00", clockOut: "15:05", hoursWorked: 8.08, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-03-31", employee: "Fernando Aquino", dept: "Finance", clockIn: "08:02", clockOut: "17:00", hoursWorked: 8.97, breakDuration: 1.0, overtime: 0, status: "Present" },
  { date: "2026-03-31", employee: "Patricia Domingo", dept: "HR", clockIn: "08:00", clockOut: "17:30", hoursWorked: 9.5, breakDuration: 1.0, overtime: 0.5, status: "Present" },
  { date: "2026-03-31", employee: "Maricel Hernandez", dept: "Security", clockIn: "06:55", clockOut: "15:00", hoursWorked: 8.08, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-03-31", employee: "Antonio Pascual", dept: "Maintenance", clockIn: "07:10", clockOut: "16:00", hoursWorked: 8.83, breakDuration: 1.0, overtime: 0, status: "Late" },
  { date: "2026-03-31", employee: "Ricardo Castro", dept: "F&B", clockIn: "—", clockOut: "—", hoursWorked: 0, breakDuration: 0, overtime: 0, status: "Absent" },
  { date: "2026-03-30", employee: "Cristina Lopez", dept: "Front Office", clockIn: "07:00", clockOut: "15:00", hoursWorked: 8.0, breakDuration: 0.5, overtime: 0, status: "Present" },
  { date: "2026-03-30", employee: "Eduardo Morales", dept: "Maintenance", clockIn: "—", clockOut: "—", hoursWorked: 4.0, breakDuration: 0, overtime: 0, status: "Half Day" },
  { date: "2026-03-29", employee: "Jose Ramos", dept: "Housekeeping", clockIn: "—", clockOut: "—", hoursWorked: 0, breakDuration: 0, overtime: 0, status: "Holiday" },
  { date: "2026-03-29", employee: "Ana Cruz", dept: "F&B", clockIn: "15:00", clockOut: "23:05", hoursWorked: 8.08, breakDuration: 0.5, overtime: 0, status: "Present" },
];

const shiftStaff = [
  { name: "Maria Santos", dept: "Front Office" },
  { name: "James Reyes", dept: "Housekeeping" },
  { name: "Ana Cruz", dept: "F&B" },
  { name: "Pedro Lim", dept: "Maintenance" },
  { name: "Sofia Tan", dept: "Front Office" },
  { name: "Carlos Dela Cruz", dept: "Security" },
  { name: "Rosa Mendez", dept: "Housekeeping" },
  { name: "Miguel Torres", dept: "F&B" },
  { name: "Luz Garcia", dept: "Finance" },
  { name: "Elena Bautista", dept: "Front Office" },
  { name: "Carmen Flores", dept: "F&B" },
  { name: "Antonio Pascual", dept: "Maintenance" },
  { name: "Maricel Hernandez", dept: "Security" },
  { name: "Ricardo Castro", dept: "F&B" },
  { name: "Cristina Lopez", dept: "Front Office" },
];

const weeklyRoster: Record<string, string[]> = {
  "Maria Santos":     ["M", "M", "M", "A", "A", "O", "O"],
  "James Reyes":      ["M", "M", "M", "M", "O", "O", "M"],
  "Ana Cruz":         ["O", "A", "A", "A", "A", "A", "O"],
  "Pedro Lim":        ["M", "M", "O", "M", "M", "M", "O"],
  "Sofia Tan":        ["M", "O", "M", "M", "M", "O", "M"],
  "Carlos Dela Cruz": ["N", "N", "N", "O", "N", "N", "O"],
  "Rosa Mendez":      ["M", "M", "M", "M", "O", "M", "O"],
  "Miguel Torres":    ["M", "M", "A", "A", "A", "O", "O"],
  "Luz Garcia":       ["M", "M", "M", "M", "M", "O", "O"],
  "Elena Bautista":   ["O", "N", "N", "N", "N", "O", "N"],
  "Carmen Flores":    ["M", "M", "M", "M", "O", "M", "M"],
  "Antonio Pascual":  ["M", "O", "M", "M", "M", "O", "L"],
  "Maricel Hernandez":["M", "M", "O", "M", "M", "M", "O"],
  "Ricardo Castro":   ["O", "A", "A", "O", "A", "A", "A"],
  "Cristina Lopez":   ["M", "M", "M", "O", "M", "O", "M"],
};

const payrollRecords = [
  { employee: "Patricia Domingo", dept: "HR", basic: 55000, serviceCharge: 4200, overtime: 2100, transport: 1500, tax: 9800, social: 1100, status: "Processed" },
  { employee: "Fernando Aquino", dept: "Finance", basic: 60000, serviceCharge: 4500, overtime: 0, transport: 1500, tax: 11200, social: 1200, status: "Processed" },
  { employee: "Carmen Flores", dept: "F&B", basic: 52000, serviceCharge: 5800, overtime: 1500, transport: 1200, tax: 9100, social: 1040, status: "Processed" },
  { employee: "Rosa Mendez", dept: "Housekeeping", basic: 38000, serviceCharge: 3200, overtime: 900, transport: 1000, tax: 6300, social: 760, status: "Processed" },
  { employee: "Maricel Hernandez", dept: "Security", basic: 40000, serviceCharge: 2800, overtime: 1200, transport: 1000, tax: 6700, social: 800, status: "Processed" },
  { employee: "Maria Santos", dept: "Front Office", basic: 42000, serviceCharge: 4100, overtime: 600, transport: 1200, tax: 7200, social: 840, status: "Processed" },
  { employee: "Pedro Lim", dept: "Maintenance", basic: 38000, serviceCharge: 2200, overtime: 3200, transport: 1000, tax: 6800, social: 760, status: "Processed" },
  { employee: "Miguel Torres", dept: "F&B", basic: 48000, serviceCharge: 5200, overtime: 800, transport: 1200, tax: 8500, social: 960, status: "Processed" },
  { employee: "Luz Garcia", dept: "Finance", basic: 50000, serviceCharge: 3800, overtime: 2400, transport: 1500, tax: 9200, social: 1000, status: "Processed" },
  { employee: "Sofia Tan", dept: "Front Office", basic: 36000, serviceCharge: 3600, overtime: 0, transport: 1000, tax: 5900, social: 720, status: "Processed" },
  { employee: "Carlos Dela Cruz", dept: "Security", basic: 36000, serviceCharge: 2400, overtime: 1800, transport: 1000, tax: 6000, social: 720, status: "Pending" },
  { employee: "Elena Bautista", dept: "Front Office", basic: 36000, serviceCharge: 3200, overtime: 2400, transport: 1000, tax: 6200, social: 720, status: "Pending" },
  { employee: "Antonio Pascual", dept: "Maintenance", basic: 34000, serviceCharge: 2000, overtime: 600, transport: 1000, tax: 5500, social: 680, status: "Pending" },
  { employee: "Ricardo Castro", dept: "F&B", basic: 22000, serviceCharge: 2800, overtime: 0, transport: 800, tax: 3500, social: 440, status: "On Hold" },
  { employee: "Ramon Villanueva", dept: "HR", basic: 42000, serviceCharge: 3400, overtime: 0, transport: 1200, tax: 7100, social: 840, status: "Pending" },
  { employee: "Cristina Lopez", dept: "Front Office", basic: 38000, serviceCharge: 3900, overtime: 0, transport: 1000, tax: 6200, social: 760, status: "Processed" },
  { employee: "James Reyes", dept: "Housekeeping", basic: 30000, serviceCharge: 2800, overtime: 400, transport: 800, tax: 4800, social: 600, status: "Processed" },
  { employee: "Jose Ramos", dept: "Housekeeping", basic: 18000, serviceCharge: 1800, overtime: 0, transport: 600, tax: 2800, social: 360, status: "On Hold" },
];

const leaveRequests = [
  { id: "LV-0041", employee: "Ramon Villanueva", dept: "HR", type: "Annual", from: "2026-03-25", to: "2026-04-05", days: 10, reason: "Family vacation", status: "Approved", approvedBy: "Patricia Domingo" },
  { id: "LV-0042", employee: "Eduardo Morales", dept: "Maintenance", type: "Sick", from: "2026-03-30", to: "2026-04-02", days: 4, reason: "Medical procedure", status: "Approved", approvedBy: "Patricia Domingo" },
  { id: "LV-0043", employee: "Ana Cruz", dept: "F&B", type: "Emergency", from: "2026-04-03", to: "2026-04-04", days: 2, reason: "Family emergency", status: "Pending", approvedBy: "—" },
  { id: "LV-0044", employee: "Jose Ramos", dept: "Housekeeping", type: "Annual", from: "2026-04-10", to: "2026-04-14", days: 5, reason: "Personal travel", status: "Pending", approvedBy: "—" },
  { id: "LV-0045", employee: "Maricel Hernandez", dept: "Security", type: "Sick", from: "2026-04-01", to: "2026-04-01", days: 1, reason: "Fever and flu", status: "Approved", approvedBy: "Patricia Domingo" },
  { id: "LV-0046", employee: "Luz Garcia", dept: "Finance", type: "Annual", from: "2026-04-20", to: "2026-04-24", days: 5, reason: "Rest and recuperation", status: "Pending", approvedBy: "—" },
  { id: "LV-0047", employee: "Miguel Torres", dept: "F&B", type: "Emergency", from: "2026-03-28", to: "2026-03-29", days: 2, reason: "Flood damage to home", status: "Approved", approvedBy: "Fernando Aquino" },
  { id: "LV-0048", employee: "Maria Santos", dept: "Front Office", type: "Annual", from: "2026-05-01", to: "2026-05-07", days: 7, reason: "Vacation leave", status: "Pending", approvedBy: "—" },
  { id: "LV-0049", employee: "Pedro Lim", dept: "Maintenance", type: "Unpaid", from: "2026-04-15", to: "2026-04-16", days: 2, reason: "Personal matter", status: "Rejected", approvedBy: "Patricia Domingo" },
  { id: "LV-0050", employee: "Elena Bautista", dept: "Front Office", type: "Annual", from: "2026-04-05", to: "2026-04-07", days: 3, reason: "Rest day extension", status: "Approved", approvedBy: "Patricia Domingo" },
  { id: "LV-0051", employee: "Carmen Flores", dept: "F&B", type: "Maternity", from: "2026-05-15", to: "2026-08-13", days: 90, reason: "Maternity leave", status: "Approved", approvedBy: "Patricia Domingo" },
  { id: "LV-0052", employee: "Ricardo Castro", dept: "F&B", type: "Sick", from: "2026-04-02", to: "2026-04-03", days: 2, reason: "Stomach issues", status: "Pending", approvedBy: "—" },
  { id: "LV-0053", employee: "Sofia Tan", dept: "Front Office", type: "Annual", from: "2026-04-22", to: "2026-04-25", days: 4, reason: "Family reunion", status: "Pending", approvedBy: "—" },
  { id: "LV-0054", employee: "James Reyes", dept: "Housekeeping", type: "Sick", from: "2026-03-20", to: "2026-03-21", days: 2, reason: "Migraine", status: "Approved", approvedBy: "Rosa Mendez" },
  { id: "LV-0055", employee: "Cristina Lopez", dept: "Front Office", type: "Emergency", from: "2026-04-08", to: "2026-04-08", days: 1, reason: "Child hospitalization", status: "Pending", approvedBy: "—" },
];

const trainingRecords = [
  { employee: "Maria Santos", course: "Effective Guest Communication", category: "Skills", provider: "Hotel Academy PH", completed: "2025-10-15", expiry: "2027-10-15", score: 92, certNo: "CERT-2025-0101", status: "Valid" },
  { employee: "James Reyes", course: "Housekeeping Standards (ISO)", category: "Mandatory", provider: "Internal", completed: "2025-03-01", expiry: "2026-03-01", score: 85, certNo: "CERT-2025-0204", status: "Expired" },
  { employee: "Pedro Lim", course: "Electrical Safety & OSHA", category: "Compliance", provider: "DOLE Accredited", completed: "2025-08-20", expiry: "2026-08-20", score: 90, certNo: "CERT-2025-0380", status: "Valid" },
  { employee: "Rosa Mendez", course: "Supervisory Leadership Program", category: "Leadership", provider: "Hotel Academy PH", completed: "2024-11-10", expiry: "2026-11-10", score: 88, certNo: "CERT-2024-0512", status: "Valid" },
  { employee: "Miguel Torres", course: "Food Safety & HACCP Level 2", category: "Compliance", provider: "NSF International", completed: "2025-06-05", expiry: "2026-06-05", score: 95, certNo: "CERT-2025-0455", status: "Due Soon" },
  { employee: "Luz Garcia", course: "Anti-Money Laundering Compliance", category: "Compliance", provider: "BSP Accredited", completed: "2025-01-18", expiry: "2026-01-18", score: 87, certNo: "CERT-2025-0101", status: "Expired" },
  { employee: "Carlos Dela Cruz", course: "Crisis Management & First Response", category: "Mandatory", provider: "Red Cross PH", completed: "2025-09-12", expiry: "2027-09-12", score: 91, certNo: "CERT-2025-0618", status: "Valid" },
  { employee: "Patricia Domingo", course: "Strategic HR Management", category: "Leadership", provider: "PMAP", completed: "2025-04-22", expiry: "2028-04-22", score: 94, certNo: "CERT-2025-0303", status: "Valid" },
  { employee: "Fernando Aquino", course: "IFRS Financial Reporting", category: "Skills", provider: "PICPA", completed: "2025-07-30", expiry: "2027-07-30", score: 89, certNo: "CERT-2025-0499", status: "Valid" },
  { employee: "Elena Bautista", course: "Night Audit Procedures", category: "Skills", provider: "Internal", completed: "2026-01-10", expiry: "2028-01-10", score: 88, certNo: "CERT-2026-0022", status: "Valid" },
  { employee: "Carmen Flores", course: "Restaurant Management Excellence", category: "Leadership", provider: "Culinary Institute", completed: "2025-02-14", expiry: "2028-02-14", score: 96, certNo: "CERT-2025-0180", status: "Valid" },
  { employee: "Antonio Pascual", course: "Plumbing Systems Certification", category: "Mandatory", provider: "TESDA", completed: "2024-08-01", expiry: "2026-08-01", score: 82, certNo: "CERT-2024-0610", status: "Due Soon" },
  { employee: "Maricel Hernandez", course: "Security Operations Management", category: "Mandatory", provider: "PNP Accredited", completed: "2025-11-05", expiry: "2027-11-05", score: 90, certNo: "CERT-2025-0701", status: "Valid" },
  { employee: "Ricardo Castro", course: "Responsible Service of Alcohol", category: "Compliance", provider: "Internal", completed: "—", expiry: "—", score: 0, certNo: "—", status: "Not Completed" },
  { employee: "Ramon Villanueva", course: "Labor Law & Employment Relations", category: "Compliance", provider: "DOLE", completed: "2025-05-20", expiry: "2027-05-20", score: 91, certNo: "CERT-2025-0415", status: "Valid" },
  { employee: "Cristina Lopez", course: "Guest Experience Innovation", category: "Skills", provider: "Hotel Academy PH", completed: "2025-12-03", expiry: "2027-12-03", score: 87, certNo: "CERT-2025-0788", status: "Valid" },
  { employee: "James Reyes", course: "Chemical Handling & Safety", category: "Compliance", provider: "DOLE Accredited", completed: "—", expiry: "—", score: 0, certNo: "—", status: "Not Completed" },
  { employee: "Jose Ramos", course: "Housekeeping Standards (ISO)", category: "Mandatory", provider: "Internal", completed: "2026-02-15", expiry: "2028-02-15", score: 80, certNo: "CERT-2026-0044", status: "Valid" },
  { employee: "Ana Cruz", course: "Food & Beverage Service Standards", category: "Mandatory", provider: "Internal", completed: "2025-10-01", expiry: "2027-10-01", score: 86, certNo: "CERT-2025-0640", status: "Valid" },
  { employee: "Sofia Tan", course: "Upselling & Revenue Techniques", category: "Skills", provider: "Hotel Academy PH", completed: "2026-03-10", expiry: "2028-03-10", score: 93, certNo: "CERT-2026-0091", status: "Valid" },
];

const performanceReviews = [
  { employee: "Patricia Domingo", dept: "HR", period: "Q4 2025", reviewer: "GM Office", score: 4.7, kpisMet: 9, kpisTotal: 10, goals: "Expand HRIS capabilities", status: "Completed", date: "2026-01-15" },
  { employee: "Fernando Aquino", dept: "Finance", period: "Q4 2025", reviewer: "GM Office", score: 4.5, kpisMet: 9, kpisTotal: 10, goals: "Implement cost control dashboard", status: "Completed", date: "2026-01-18" },
  { employee: "Carmen Flores", dept: "F&B", period: "Q4 2025", reviewer: "F&B Director", score: 4.8, kpisMet: 10, kpisTotal: 10, goals: "Launch new tasting menu", status: "Completed", date: "2026-01-20" },
  { employee: "Rosa Mendez", dept: "Housekeeping", period: "Q4 2025", reviewer: "Rooms Division Mgr", score: 4.2, kpisMet: 8, kpisTotal: 10, goals: "Reduce laundry turnaround time", status: "Completed", date: "2026-01-22" },
  { employee: "Maricel Hernandez", dept: "Security", period: "Q4 2025", reviewer: "GM Office", score: 4.3, kpisMet: 8, kpisTotal: 10, goals: "Upgrade CCTV monitoring protocol", status: "Completed", date: "2026-01-25" },
  { employee: "Maria Santos", dept: "Front Office", period: "Q4 2025", reviewer: "FO Manager", score: 4.6, kpisMet: 9, kpisTotal: 10, goals: "Achieve 95% guest satisfaction", status: "Completed", date: "2026-01-28" },
  { employee: "Pedro Lim", dept: "Maintenance", period: "Q4 2025", reviewer: "Chief Engineer", score: 4.1, kpisMet: 7, kpisTotal: 10, goals: "PPM completion rate improvement", status: "Completed", date: "2026-01-30" },
  { employee: "Miguel Torres", dept: "F&B", period: "Q4 2025", reviewer: "Carmen Flores", score: 4.4, kpisMet: 8, kpisTotal: 10, goals: "Develop team culinary skills", status: "Completed", date: "2026-02-01" },
  { employee: "Luz Garcia", dept: "Finance", period: "Q4 2025", reviewer: "Fernando Aquino", score: 3.9, kpisMet: 7, kpisTotal: 10, goals: "Reduce month-end close to 3 days", status: "Completed", date: "2026-02-03" },
  { employee: "Elena Bautista", dept: "Front Office", period: "Q1 2026", reviewer: "FO Manager", score: 0, kpisMet: 0, kpisTotal: 8, goals: "Night audit accuracy improvement", status: "Pending", date: "—" },
  { employee: "Carlos Dela Cruz", dept: "Security", period: "Q1 2026", reviewer: "Maricel Hernandez", score: 0, kpisMet: 0, kpisTotal: 8, goals: "Incident response time targets", status: "Pending", date: "—" },
  { employee: "Antonio Pascual", dept: "Maintenance", period: "Q4 2025", reviewer: "Chief Engineer", score: 3.5, kpisMet: 6, kpisTotal: 10, goals: "Complete plumbing certification", status: "Completed", date: "2026-02-10" },
  { employee: "Ana Cruz", dept: "F&B", period: "Q1 2026", reviewer: "Carmen Flores", score: 0, kpisMet: 0, kpisTotal: 8, goals: "Upselling target achievement", status: "Overdue", date: "—" },
  { employee: "Sofia Tan", dept: "Front Office", period: "Q4 2025", reviewer: "FO Manager", score: 4.0, kpisMet: 7, kpisTotal: 9, goals: "Guest satisfaction scores", status: "Completed", date: "2026-02-12" },
  { employee: "Ramon Villanueva", dept: "HR", period: "Q4 2025", reviewer: "Patricia Domingo", score: 3.8, kpisMet: 7, kpisTotal: 10, goals: "Training completion rate", status: "Completed", date: "2026-02-14" },
];

const disciplinaryRecords = [
  { id: "DISC-0021", employee: "James Reyes", incident: "Tardiness", date: "2026-03-10", severity: "Warning", hrRep: "Ramon Villanueva", status: "Resolved", resolution: "Verbal warning issued; punctuality improved." },
  { id: "DISC-0022", employee: "Jose Ramos", incident: "Policy Violation", date: "2026-03-15", severity: "Written Warning", hrRep: "Patricia Domingo", status: "Resolved", resolution: "Written warning filed. Refresher training assigned." },
  { id: "DISC-0023", employee: "Ricardo Castro", incident: "Misconduct", date: "2026-03-20", severity: "Written Warning", hrRep: "Patricia Domingo", status: "Under Review", resolution: "Investigation ongoing." },
  { id: "DISC-0024", employee: "Ana Cruz", incident: "Performance", date: "2026-03-22", severity: "Warning", hrRep: "Ramon Villanueva", status: "Resolved", resolution: "Performance improvement plan initiated." },
  { id: "DISC-0025", employee: "Antonio Pascual", incident: "Tardiness", date: "2026-03-25", severity: "Final Warning", hrRep: "Patricia Domingo", status: "Active", resolution: "Pending 30-day monitoring period." },
  { id: "DISC-0026", employee: "Carlos Dela Cruz", incident: "Policy Violation", date: "2026-03-28", severity: "Warning", hrRep: "Ramon Villanueva", status: "Resolved", resolution: "Briefing on updated security protocols conducted." },
  { id: "DISC-0027", employee: "Ricardo Castro", incident: "Misconduct", date: "2026-04-01", severity: "Written Warning", hrRep: "Patricia Domingo", status: "Pending", resolution: "Awaiting HR committee review." },
  { id: "DISC-0028", employee: "Jose Ramos", incident: "Tardiness", date: "2026-04-01", severity: "Warning", hrRep: "Ramon Villanueva", status: "Pending", resolution: "Attendance review scheduled." },
];

const grievanceRecords = [
  { id: "GRIV-0011", employee: "Ana Cruz", category: "Scheduling Dispute", filed: "2026-03-08", status: "Resolved", resolution: "Shift adjusted; employee acknowledged." },
  { id: "GRIV-0012", employee: "Pedro Lim", category: "Unsafe Working Conditions", filed: "2026-03-12", status: "Resolved", resolution: "Equipment repaired; safety inspection completed." },
  { id: "GRIV-0013", employee: "Jose Ramos", category: "Workplace Harassment", filed: "2026-03-18", status: "Under Review", resolution: "HR mediation scheduled." },
  { id: "GRIV-0014", employee: "Elena Bautista", category: "Compensation Discrepancy", filed: "2026-03-22", status: "Resolved", resolution: "Payroll correction processed for March cycle." },
  { id: "GRIV-0015", employee: "Ricardo Castro", category: "Unfair Treatment", filed: "2026-03-25", status: "Escalated", resolution: "Escalated to GM. Committee review in progress." },
  { id: "GRIV-0016", employee: "Luz Garcia", category: "Scheduling Dispute", filed: "2026-03-28", status: "Open", resolution: "Under initial HR assessment." },
  { id: "GRIV-0017", employee: "James Reyes", category: "Inadequate Equipment", filed: "2026-04-01", status: "Open", resolution: "Facilities team notified." },
  { id: "GRIV-0018", employee: "Sofia Tan", category: "Compensation Discrepancy", filed: "2026-04-01", status: "Under Review", resolution: "Finance team verifying service charge computation." },
];

// ─── Helper Components ───────────────────────────────────────────────────────

const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("rounded-2xl p-5 text-white shadow-md", gradient)}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-white/75">{title}</p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-white/60">{sub}</p>
      </div>
      <div className="rounded-xl bg-white/20 p-2.5">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

const badgeStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Probation: "bg-blue-100 text-blue-700",
  "Full-time": "bg-indigo-100 text-indigo-700",
  "Part-time": "bg-violet-100 text-violet-700",
  Casual: "bg-pink-100 text-pink-700",
  Present: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-700",
  "Half Day": "bg-orange-100 text-orange-700",
  Holiday: "bg-sky-100 text-sky-700",
  "On Duty": "bg-emerald-100 text-emerald-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Processed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "On Hold": "bg-red-100 text-red-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Annual: "bg-indigo-100 text-indigo-700",
  Sick: "bg-red-100 text-red-700",
  Emergency: "bg-orange-100 text-orange-700",
  Maternity: "bg-pink-100 text-pink-700",
  Unpaid: "bg-secondary text-foreground",
  Valid: "bg-emerald-100 text-emerald-700",
  Expired: "bg-red-100 text-red-700",
  "Due Soon": "bg-amber-100 text-amber-700",
  "Not Completed": "bg-secondary text-foreground",
  Completed: "bg-emerald-100 text-emerald-700",
  Overdue: "bg-red-100 text-red-700",
  Mandatory: "bg-red-100 text-red-700",
  Skills: "bg-blue-100 text-blue-700",
  Compliance: "bg-orange-100 text-orange-700",
  Leadership: "bg-purple-100 text-purple-700",
  Warning: "bg-amber-100 text-amber-700",
  "Written Warning": "bg-orange-100 text-orange-700",
  "Final Warning": "bg-red-100 text-red-700",
  Termination: "bg-red-200 text-red-800",
  Resolved: "bg-emerald-100 text-emerald-700",
  "Under Review": "bg-blue-100 text-blue-700",
  Open: "bg-orange-100 text-orange-700",
  Escalated: "bg-red-100 text-red-700",
};

const Badge = ({ label }: { label: string }) => (
  <span
    className={cn(
      "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
      badgeStyles[label] ?? "bg-muted text-muted-foreground"
    )}
  >
    {label}
  </span>
);

const ShiftCell = ({ code }: { code: string }) => {
  const styles: Record<string, string> = {
    M: "bg-indigo-100 text-indigo-700",
    A: "bg-amber-100 text-amber-700",
    N: "bg-slate-200 text-slate-700",
    O: "bg-muted text-muted-foreground",
    L: "bg-rose-100 text-rose-700",
  };
  const labels: Record<string, string> = {
    M: "Morning 07:00–15:00",
    A: "Afternoon 15:00–23:00",
    N: "Night 23:00–07:00",
    O: "Day Off",
    L: "On Leave",
  };
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-center rounded-lg text-xs font-semibold",
        styles[code] ?? "bg-muted"
      )}
      title={labels[code]}
    >
      {code}
    </div>
  );
};

const StarRating = ({ score }: { score: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={cn(
          "h-3.5 w-3.5",
          s <= Math.round(score)
            ? "fill-amber-400 text-amber-400"
            : "fill-muted text-muted-foreground"
        )}
      />
    ))}
    <span className="ml-1 text-xs text-muted-foreground">
      {score > 0 ? score.toFixed(1) : "—"}
    </span>
  </div>
);

const SectionCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("rounded-2xl border border-border bg-card shadow-sm", className)}>
    {children}
  </div>
);

const TableWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">{children}</table>
  </div>
);

const Th = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={cn(
      "border-b border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className
    )}
  >
    {children}
  </th>
);

const Td = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={cn(
      "border-b border-border/50 px-4 py-3 text-sm text-foreground",
      className
    )}
  >
    {children}
  </td>
);

const avatarColors = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-violet-500",
];

const Avatar = ({
  name,
  size = "sm",
}: {
  name: string;
  size?: "sm" | "md";
}) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const colorIdx = name.charCodeAt(0) % avatarColors.length;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        avatarColors[colorIdx],
        size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
      )}
    >
      {initials}
    </div>
  );
};

const FilterBar = ({ children }: { children: React.ReactNode }) => (
  <SectionCard className="px-5 py-4">
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </SectionCard>
);

const SelectFilter = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <select
    className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

// ─── Sub-views ───────────────────────────────────────────────────────────────

const OverviewView = () => (
  <motion.div
    key="overview"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="space-y-6"
  >

    <div className="grid gap-4 lg:grid-cols-3">
      <SectionCard className="lg:col-span-2 p-5">
        <SectionHeader title="Attendance Trend — Last 30 Days" className="mb-4" />
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={attendanceTrend}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="hrPresentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="hrAbsentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#hrPresentGrad)"
              name="Present"
            />
            <Area
              type="monotone"
              dataKey="late"
              stroke="#f59e0b"
              strokeWidth={1.5}
              fill="none"
              name="Late"
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#f43f5e"
              strokeWidth={1.5}
              fill="url(#hrAbsentGrad)"
              name="Absent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard className="p-5">
        <SectionHeader title="Staff by Department" className="mb-4" />
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={deptDistribution}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {deptDistribution.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1">
          {deptDistribution.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-medium text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>

    <SectionCard>
      <div className="border-b border-border px-5 py-4">
        <SectionHeader title="Today's Roster" />
      </div>
      <TableWrap>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Department</Th>
            <Th>Role</Th>
            <Th>Shift</Th>
            <Th>Clock In</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {todayRoster.map((row, i) => (
            <tr key={i} className="hover:bg-muted/40 transition-colors">
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} />
                  <span className="font-medium">{row.name}</span>
                </div>
              </Td>
              <Td className="text-muted-foreground">{row.dept}</Td>
              <Td>{row.role}</Td>
              <Td>{row.shift}</Td>
              <Td className="font-mono text-xs">{row.clockIn}</Td>
              <Td>
                <Badge label={row.status} />
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </SectionCard>
  </motion.div>
);

const StaffDirectoryView = () => {
  const [search, setSearch] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const departments = useMemo(
    () => ["All", ...Array.from(new Set(staffDirectory.map((s) => s.dept))).sort()],
    []
  );

  const filtered = useMemo(
    () =>
      staffDirectory.filter(
        (s) =>
          (deptFilter === "All" || s.dept === deptFilter) &&
          (statusFilter === "All" || s.status === statusFilter) &&
          s.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, deptFilter, statusFilter]
  );

  return (
    <motion.div
      key="directory"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <FilterBar>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-44 bg-transparent outline-none placeholder:text-muted-foreground"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <SelectFilter
          value={deptFilter}
          onChange={setDeptFilter}
          options={departments}
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "Active", "On Leave", "Probation"]}
        />
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
        </span>
      </FilterBar>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Role</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Contract</Th>
              <Th>Join Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td className="font-mono text-xs text-muted-foreground">{emp.id}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={emp.name} />
                    <span className="font-medium whitespace-nowrap">{emp.name}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{emp.dept}</Td>
                <Td>{emp.role}</Td>
                <Td className="text-xs text-muted-foreground">{emp.email}</Td>
                <Td className="whitespace-nowrap text-xs text-muted-foreground">{emp.phone}</Td>
                <Td>
                  <Badge label={emp.contract} />
                </Td>
                <Td className="font-mono text-xs text-muted-foreground">{emp.joinDate}</Td>
                <Td>
                  <Badge label={emp.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const AttendanceView = () => {
  const [dateFilter, setDateFilter] = React.useState("All");
  const [deptFilter, setDeptFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");

  const dates = useMemo(
    () => ["All", ...Array.from(new Set(attendanceRecords.map((r) => r.date))).sort().reverse()],
    []
  );
  const depts = useMemo(
    () => ["All", ...Array.from(new Set(attendanceRecords.map((r) => r.dept))).sort()],
    []
  );

  const filtered = useMemo(
    () =>
      attendanceRecords.filter(
        (r) =>
          (dateFilter === "All" || r.date === dateFilter) &&
          (deptFilter === "All" || r.dept === deptFilter) &&
          (statusFilter === "All" || r.status === statusFilter)
      ),
    [dateFilter, deptFilter, statusFilter]
  );

  const todayStats = useMemo(() => {
    const today = attendanceRecords.filter((r) => r.date === "2026-04-01");
    return {
      present: today.filter((r) => r.status === "Present").length,
      late: today.filter((r) => r.status === "Late").length,
      absent: today.filter((r) => r.status === "Absent").length,
    };
  }, []);

  return (
    <motion.div
      key="attendance"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <FilterBar>
        <SelectFilter value={dateFilter} onChange={setDateFilter} options={dates} />
        <SelectFilter value={deptFilter} onChange={setDeptFilter} options={depts} />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "Present", "Late", "Absent", "Half Day", "Holiday"]}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records</span>
      </FilterBar>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Clock In</Th>
              <Th>Clock Out</Th>
              <Th>Hours</Th>
              <Th>Break</Th>
              <Th>Overtime</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td className="font-mono text-xs text-muted-foreground">{row.date}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{row.dept}</Td>
                <Td className="font-mono text-xs">{row.clockIn}</Td>
                <Td className="font-mono text-xs">{row.clockOut}</Td>
                <Td className="font-mono text-xs">
                  {row.hoursWorked > 0 ? `${row.hoursWorked.toFixed(2)}h` : "—"}
                </Td>
                <Td className="font-mono text-xs">
                  {row.breakDuration > 0 ? `${row.breakDuration}h` : "—"}
                </Td>
                <Td className="font-mono text-xs">
                  {row.overtime > 0 ? (
                    <span className="text-indigo-600">+{row.overtime}h</span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const ShiftSchedulingView = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const shiftCounts = useMemo(
    () =>
      days.map((_, di) =>
        shiftStaff.filter((s) => {
          const code = weeklyRoster[s.name]?.[di];
          return code !== "O" && code !== "L" && code !== undefined;
        }).length
      ),
    []
  );

  return (
    <motion.div
      key="shifts"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <SectionCard className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-border">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Staff Member
            </div>
            {days.map((d) => (
              <div
                key={d}
                className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>

          {shiftStaff.map((staff, si) => (
            <div
              key={si}
              className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 px-4 py-2">
                <Avatar name={staff.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">{staff.name}</p>
                  <p className="text-[10px] text-muted-foreground">{staff.dept}</p>
                </div>
              </div>
              {days.map((_, di) => (
                <div key={di} className="px-1.5 py-2">
                  <ShiftCell code={weeklyRoster[staff.name]?.[di] ?? "O"} />
                </div>
              ))}
            </div>
          ))}

          <div className="grid grid-cols-[200px_repeat(7,1fr)] bg-muted/30">
            <div className="px-4 py-3 text-xs font-semibold text-muted-foreground">
              Active Staff
            </div>
            {shiftCounts.map((count, di) => (
              <div key={di} className="flex items-center justify-center py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold",
                    count < 8
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {shiftCounts.some((c) => c < 8) && (
        <SectionCard className="border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Understaffing Alert
              </p>
              <p className="mt-0.5 text-xs text-amber-700">
                {days.filter((_, di) => shiftCounts[di] < 8).join(", ")} have fewer than 8 active
                staff members scheduled. Consider reassigning or calling in additional personnel.
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </motion.div>
  );
};

const PayrollView = () => {
  const [month, setMonth] = React.useState("March 2026");

  const processedRows = useMemo(
    () =>
      payrollRecords.map((r) => ({
        ...r,
        netPay: r.basic + r.serviceCharge + r.overtime + r.transport - r.tax - r.social,
      })),
    []
  );

  const totalPayroll = useMemo(
    () => processedRows.reduce((s, r) => s + r.netPay, 0),
    [processedRows]
  );
  const totalPaid = useMemo(
    () =>
      processedRows
        .filter((r) => r.status === "Processed")
        .reduce((s, r) => s + r.netPay, 0),
    [processedRows]
  );
  const totalPending = useMemo(
    () =>
      processedRows
        .filter((r) => r.status === "Pending")
        .reduce((s, r) => s + r.netPay, 0),
    [processedRows]
  );

  const fmt = (v: number) =>
    "₱" + v.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <motion.div
      key="payroll"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground">Pay Period:</label>
        <SelectFilter
          value={month}
          onChange={setMonth}
          options={["January 2026", "February 2026", "March 2026", "April 2026"]}
        />
      </div>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th className="text-right">Basic</Th>
              <Th className="text-right">Svc Chg</Th>
              <Th className="text-right">Overtime</Th>
              <Th className="text-right">Transport</Th>
              <Th className="text-right">Deductions</Th>
              <Th className="text-right">Net Pay</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {processedRows.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{row.dept}</Td>
                <Td className="text-right font-mono text-xs">{fmt(row.basic)}</Td>
                <Td className="text-right font-mono text-xs">{fmt(row.serviceCharge)}</Td>
                <Td className="text-right font-mono text-xs">
                  {row.overtime > 0 ? (
                    <span className="text-indigo-600">
                      {fmt(row.overtime)}
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="text-right font-mono text-xs">{fmt(row.transport)}</Td>
                <Td className="text-right font-mono text-xs text-red-600">
                  ({fmt(row.tax + row.social)})
                </Td>
                <Td className="text-right font-mono text-xs font-semibold">{fmt(row.netPay)}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const LeaveManagementView = () => {
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [typeFilter, setTypeFilter] = React.useState("All");

  const filtered = useMemo(
    () =>
      leaveRequests.filter(
        (r) =>
          (statusFilter === "All" || r.status === statusFilter) &&
          (typeFilter === "All" || r.type === typeFilter)
      ),
    [statusFilter, typeFilter]
  );

  const pendingCount = leaveRequests.filter((r) => r.status === "Pending").length;
  const annualLeaves = leaveRequests.filter((r) => r.type === "Annual");
  const annualAvgDays = Math.round(
    annualLeaves.reduce((s, r) => s + r.days, 0) / (annualLeaves.length || 1)
  );
  const approvedCount = leaveRequests.filter((r) => r.status === "Approved").length;
  const totalDaysTaken = leaveRequests
    .filter((r) => r.status === "Approved")
    .reduce((s, r) => s + r.days, 0);

  return (
    <motion.div
      key="leave"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <FilterBar>
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "Pending", "Approved", "Rejected"]}
        />
        <SelectFilter
          value={typeFilter}
          onChange={setTypeFilter}
          options={["All", "Annual", "Sick", "Emergency", "Maternity", "Unpaid"]}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} requests</span>
      </FilterBar>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Request ID</Th>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Type</Th>
              <Th>From</Th>
              <Th>To</Th>
              <Th>Days</Th>
              <Th>Reason</Th>
              <Th>Approved By</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td className="font-mono text-xs text-muted-foreground">{row.id}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{row.dept}</Td>
                <Td>
                  <Badge label={row.type} />
                </Td>
                <Td className="font-mono text-xs">{row.from}</Td>
                <Td className="font-mono text-xs">{row.to}</Td>
                <Td className="font-mono text-xs font-semibold">{row.days}d</Td>
                <Td className="max-w-[160px] truncate text-xs text-muted-foreground">
                  {row.reason}
                </Td>
                <Td className="text-xs text-muted-foreground">{row.approvedBy}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const TrainingView = () => {
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [categoryFilter, setCategoryFilter] = React.useState("All");

  const filtered = useMemo(
    () =>
      trainingRecords.filter(
        (r) =>
          (statusFilter === "All" || r.status === statusFilter) &&
          (categoryFilter === "All" || r.category === categoryFilter)
      ),
    [statusFilter, categoryFilter]
  );

  const complianceRate = Math.round(
    (trainingRecords.filter((r) => r.status === "Valid").length / trainingRecords.length) * 100
  );
  const expiredCount = trainingRecords.filter((r) => r.status === "Expired").length;
  const dueSoonCount = trainingRecords.filter((r) => r.status === "Due Soon").length;
  const notCompletedCount = trainingRecords.filter((r) => r.status === "Not Completed").length;

  return (
    <motion.div
      key="training"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <FilterBar>
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={["All", "Valid", "Expired", "Due Soon", "Not Completed"]}
        />
        <SelectFilter
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={["All", "Mandatory", "Skills", "Compliance", "Leadership"]}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records</span>
      </FilterBar>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Course</Th>
              <Th>Category</Th>
              <Th>Provider</Th>
              <Th>Completed</Th>
              <Th>Expiry</Th>
              <Th>Score</Th>
              <Th>Cert #</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="max-w-[200px]">
                  <span className="text-sm">{row.course}</span>
                </Td>
                <Td>
                  <Badge label={row.category} />
                </Td>
                <Td className="text-xs text-muted-foreground">{row.provider}</Td>
                <Td className="font-mono text-xs">{row.completed}</Td>
                <Td className="font-mono text-xs">{row.expiry}</Td>
                <Td className="font-mono text-xs">
                  {row.score > 0 ? (
                    <span
                      className={cn(
                        "font-semibold",
                        row.score >= 90
                          ? "text-emerald-600"
                          : row.score >= 75
                          ? "text-foreground"
                          : "text-amber-600"
                      )}
                    >
                      {row.score}%
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="font-mono text-xs text-muted-foreground">{row.certNo}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const PerformanceView = () => {
  const deptScores = useMemo(() => {
    const completed = performanceReviews.filter((r) => r.status === "Completed");
    const byDept: Record<string, number[]> = {};
    completed.forEach((r) => {
      if (!byDept[r.dept]) byDept[r.dept] = [];
      byDept[r.dept].push(r.score);
    });
    return Object.entries(byDept).map(([dept, scores]) => ({
      dept: dept.split(" ")[0],
      avg: parseFloat(
        (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      ),
    }));
  }, []);

  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4"
    >
      <SectionCard className="p-5">
        <SectionHeader title="Average Performance Score by Department" className="mb-4" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={deptScores} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="dept" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) => [v.toFixed(2), "Avg Score"]}
            />
            <Bar dataKey="avg" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Period</Th>
              <Th>Reviewer</Th>
              <Th>Score</Th>
              <Th>KPIs Met</Th>
              <Th>Development Goal</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {performanceReviews.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-muted-foreground">{row.dept}</Td>
                <Td className="text-xs">{row.period}</Td>
                <Td className="text-xs text-muted-foreground">{row.reviewer}</Td>
                <Td>
                  {row.status === "Completed" ? (
                    <StarRating score={row.score} />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </Td>
                <Td className="text-xs">
                  {row.status === "Completed" ? (
                    <span>
                      <span className="font-semibold text-foreground">{row.kpisMet}</span>
                      <span className="text-muted-foreground">/{row.kpisTotal}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—/{row.kpisTotal}</span>
                  )}
                </Td>
                <Td className="max-w-[180px] truncate text-xs text-muted-foreground">
                  {row.goals}
                </Td>
                <Td className="font-mono text-xs text-muted-foreground">{row.date}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </motion.div>
  );
};

const DisciplinaryView = () => (
  <motion.div
    key="disciplinary"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    className="space-y-6"
  >
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Shield className="h-4 w-4 text-red-500" />
        <SectionHeader title="Disciplinary Log" />
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          {disciplinaryRecords.length} cases
        </span>
      </div>
      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Case ID</Th>
              <Th>Employee</Th>
              <Th>Incident Type</Th>
              <Th>Date</Th>
              <Th>Severity</Th>
              <Th>HR Rep</Th>
              <Th>Status</Th>
              <Th>Resolution</Th>
            </tr>
          </thead>
          <tbody>
            {disciplinaryRecords.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td className="font-mono text-xs text-muted-foreground">{row.id}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-xs">{row.incident}</Td>
                <Td className="font-mono text-xs">{row.date}</Td>
                <Td>
                  <Badge label={row.severity} />
                </Td>
                <Td className="text-xs text-muted-foreground">{row.hrRep}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
                <Td className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {row.resolution}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </div>

    <div>
      <div className="mb-3 flex items-center gap-2">
        <Heart className="h-4 w-4 text-violet-500" />
        <SectionHeader title="Grievance Log" />
        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
          {grievanceRecords.length} cases
        </span>
      </div>
      <SectionCard>
        <TableWrap>
          <thead>
            <tr>
              <Th>Case ID</Th>
              <Th>Employee</Th>
              <Th>Issue Category</Th>
              <Th>Filed Date</Th>
              <Th>Status</Th>
              <Th>Resolution Notes</Th>
            </tr>
          </thead>
          <tbody>
            {grievanceRecords.map((row, i) => (
              <tr key={i} className="hover:bg-muted/40 transition-colors">
                <Td className="font-mono text-xs text-muted-foreground">{row.id}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={row.employee} />
                    <span className="whitespace-nowrap font-medium">{row.employee}</span>
                  </div>
                </Td>
                <Td className="text-sm">{row.category}</Td>
                <Td className="font-mono text-xs">{row.filed}</Td>
                <Td>
                  <Badge label={row.status} />
                </Td>
                <Td className="max-w-[240px] truncate text-xs text-muted-foreground">
                  {row.resolution}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </SectionCard>
    </div>
  </motion.div>
);

// ─── Tab Configuration ───────────────────────────────────────────────────────

const TABS = [
  { key: "overview", label: "Overview", icon: Activity },
  { key: "directory", label: "Staff Directory", icon: Users },
  { key: "attendance", label: "Attendance", icon: Clock },
  { key: "shifts", label: "Shift Scheduling", icon: Calendar },
  { key: "payroll", label: "Payroll", icon: DollarSign },
  { key: "leave", label: "Leave Mgmt", icon: Heart },
  { key: "training", label: "Training & Certs", icon: BookOpen },
  { key: "performance", label: "Performance", icon: Star },
  { key: "disciplinary", label: "Disciplinary", icon: Shield },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const submenuKeyMap: Record<string, TabKey> = {
  "Staff Directory": "directory",
  Attendance: "attendance",
  "Shift Scheduling": "shifts",
  Payroll: "payroll",
  "Leave Management": "leave",
  Training: "training",
  Performance: "performance",
  Disciplinary: "disciplinary",
};

// ─── Main Component ──────────────────────────────────────────────────────────

const HumanResources: React.FC<HumanResourcesProps> = ({ aiEnabled, activeSubmenu }) => {
  const defaultTab = useMemo<TabKey>(() => {
    if (activeSubmenu && submenuKeyMap[activeSubmenu]) {
      return submenuKeyMap[activeSubmenu];
    }
    return "overview";
  }, [activeSubmenu]);

  const [activeTab, setActiveTab] = React.useState<TabKey>(defaultTab);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (activeSubmenu && submenuKeyMap[activeSubmenu]) {
      setActiveTab(submenuKeyMap[activeSubmenu]);
    }
  }, [activeSubmenu]);

  const isShiftView = activeTab === "shifts";

  return (
    <PageShell
      search={<SectionSearch value={search} onChange={setSearch} placeholder="Search staff, schedules..." />}
      header={
        <SectionHeader
          title="Human Resources"
          subtitle="Staff management, scheduling, payroll & compliance — Singularity Hotel Group"
          icon={Users}
          actions={aiEnabled ? (
            <div className="flex items-center gap-2 rounded-2xl border border-indigo-300 bg-indigo-50 px-3 py-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-medium text-indigo-700">AI Insights Active</span>
            </div>
          ) : undefined}
        />
      }
      kpi={<KpiStrip items={[{color:"bg-indigo-500",value:"114",label:"Total Staff"},{color:"bg-emerald-500",value:"78",label:"On Duty Now"},{color:"bg-amber-500",value:"9",label:"On Leave"},{color:"bg-rose-500",value:"6",label:"Open Positions"},{color:"bg-blue-500",value:"92%",label:"Attendance Rate"}]} />}
      legend={isShiftView ? (
        <LegendBar items={[
          { color: "bg-indigo-100 border-indigo-200", label: "Morning" },
          { color: "bg-amber-100 border-amber-200", label: "Afternoon" },
          { color: "bg-slate-100 border-slate-200", label: "Night" },
          { color: "bg-muted border-border", label: "Day Off" },
          { color: "bg-rose-100 border-rose-200", label: "On Leave" },
        ]} />
      ) : undefined}
    >
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border bg-card p-1.5 mb-4">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all",
              activeTab === key
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && <OverviewView key="overview" />}
        {activeTab === "directory" && <StaffDirectoryView key="directory" />}
        {activeTab === "attendance" && <AttendanceView key="attendance" />}
        {activeTab === "shifts" && <ShiftSchedulingView key="shifts" />}
        {activeTab === "payroll" && <PayrollView key="payroll" />}
        {activeTab === "leave" && <LeaveManagementView key="leave" />}
        {activeTab === "training" && <TrainingView key="training" />}
        {activeTab === "performance" && <PerformanceView key="performance" />}
        {activeTab === "disciplinary" && <DisciplinaryView key="disciplinary" />}
      </AnimatePresence>
    </PageShell>
  );
};

export default HumanResources;
export { HumanResources };
