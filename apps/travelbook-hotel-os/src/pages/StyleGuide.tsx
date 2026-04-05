import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, RefreshCw, Search, AlertCircle, Inbox } from "lucide-react";
import { cn } from "../lib/utils";

const SECTIONS = ["Colors", "Typography", "Buttons", "Badges", "Cards", "Forms", "Tables", "States"];

// ── Color data ──────────────────────────────────────────────────────────────
const LIGHT_TOKENS = [
  { name: "Primary", value: "#8b5cf6", cls: "bg-[#8b5cf6]", usage: "Buttons, active nav, highlights" },
  { name: "Primary Dark", value: "#7c3aed", cls: "bg-[#7c3aed]", usage: "Hover on primary elements" },
  { name: "Background", value: "#f3f4f6", cls: "bg-[#f3f4f6] border border-border", usage: "Page background" },
  { name: "Card", value: "#ffffff", cls: "bg-white border border-border", usage: "Card/panel backgrounds" },
  { name: "Border", value: "#e5e7eb", cls: "bg-[#e5e7eb]", usage: "Card borders, dividers" },
  { name: "Text Primary", value: "#1f2937", cls: "bg-[#1f2937]", usage: "Headings, body" },
  { name: "Text Muted", value: "#6b7280", cls: "bg-[#6b7280]", usage: "Labels, captions" },
  { name: "Success", value: "#10b981", cls: "bg-emerald-500", usage: "Clean status, success" },
  { name: "Warning", value: "#f59e0b", cls: "bg-amber-500", usage: "Pending, caution" },
  { name: "Danger", value: "#ef4444", cls: "bg-red-500", usage: "Error, cancelled, dirty" },
  { name: "Info", value: "#3b82f6", cls: "bg-blue-500", usage: "Informational badges" },
];

const KPI_GRADIENTS = [
  { name: "Arrivals", cls: "from-pink-500 to-rose-600", label: "45" },
  { name: "In-House", cls: "from-violet-500 to-purple-600", label: "128" },
  { name: "Departures", cls: "from-emerald-500 to-green-600", label: "32" },
  { name: "Revenue", cls: "from-amber-500 to-yellow-600", label: "$12,896" },
  { name: "Occupancy", cls: "from-blue-500 to-cyan-600", label: "76%" },
  { name: "ADR/RevPAR", cls: "from-indigo-500 to-violet-600", label: "$189" },
];

// ── Table sample data ────────────────────────────────────────────────────────
const TABLE_ROWS = [
  { room: "101", type: "Standard King", guest: "John Doe", status: "Confirmed", hk: "Clean" },
  { room: "102", type: "Standard Double", guest: "Jane Smith", status: "Pending", hk: "Dirty" },
  { room: "103", type: "Suite", guest: "Alice Johnson", status: "Checked-In", hk: "Clean" },
  { room: "104", type: "Standard King", guest: "—", status: "Cancelled", hk: "Inspected" },
  { room: "105", type: "Suite", guest: "Robert Brown", status: "Confirmed", hk: "Clean" },
];

const statusBadge = (status: string) => {
  switch (status) {
    case "Confirmed":
    case "Clean":
    case "Paid":
    case "Active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "Pending":
    case "Dirty":
    case "In Progress":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "Cancelled":
    case "Error":
    case "Overdue":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "Checked-In":
    case "Open":
    case "Info":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

export function StyleGuide() {
  const [activeSection, setActiveSection] = useState("Colors");
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const el = document.getElementById(`section-${section}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Design System</h1>
            <p className="text-sm text-muted-foreground">Live visual reference for all UI components and tokens</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/src/DESIGN_SYSTEM.md"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              DESIGN_SYSTEM.md
            </a>
          </div>
        </div>

        {/* Submenu tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto scrollbar-hide">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeSection === section
                  ? "bg-violet-600 text-white"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="p-6 space-y-12 max-w-5xl">

        {/* ── COLORS ──────────────────────────────────────────────────────── */}
        <section id="section-Colors">
          <h2 className="text-lg font-semibold text-foreground mb-1">Colors</h2>
          <p className="text-sm text-muted-foreground mb-6">Semantic color tokens used across the entire application.</p>

          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Light Mode Tokens</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {LIGHT_TOKENS.map((token) => (
              <div key={token.name} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className={cn("h-16 w-full", token.cls)} />
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground">{token.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{token.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{token.usage}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">KPI Gradient Cards</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {KPI_GRADIENTS.map((g) => (
              <div key={g.name} className={cn("rounded-2xl p-4 text-white bg-gradient-to-r", g.cls)}>
                <p className="text-xs text-white/80 mb-1">{g.name}</p>
                <p className="text-2xl font-bold">{g.label}</p>
                <p className="text-xs text-white/70 mt-1">from-{g.cls.split(" ")[0].replace("from-", "")} gradient</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TYPOGRAPHY ──────────────────────────────────────────────────── */}
        <section id="section-Typography">
          <h2 className="text-lg font-semibold text-foreground mb-1">Typography</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Font stack: <code className="bg-secondary px-1 py-0.5 rounded text-xs">system-ui, 'DM Sans', -apple-system, sans-serif</code>
          </p>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Page Title — text-xl font-semibold</p>
              <p className="text-xl font-semibold text-foreground">Analytic Overview</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Section Header — text-lg font-semibold</p>
              <p className="text-lg font-semibold text-foreground">Recent Reservations</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Card Label — text-xs font-medium uppercase tracking-wider</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Room Status</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Body — text-sm</p>
              <p className="text-sm text-foreground">Guest checked in at 14:32. Room 203 is now occupied. Housekeeping notified.</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Body Muted — text-sm text-muted-foreground</p>
              <p className="text-sm text-muted-foreground">Last updated 3 minutes ago · 18 rooms pending inspection</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Micro — text-xs text-muted-foreground</p>
              <p className="text-xs text-muted-foreground">+4% Last Month · Confidence: High</p>
            </div>
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6">
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">KPI Value — text-3xl font-bold text-white</p>
              <p className="text-3xl font-bold text-white">128</p>
            </div>
          </div>
        </section>

        {/* ── BUTTONS ─────────────────────────────────────────────────────── */}
        <section id="section-Buttons">
          <h2 className="text-lg font-semibold text-foreground mb-1">Buttons</h2>
          <p className="text-sm text-muted-foreground mb-6">Five variants — never use rounded-full or outline-only styles.</p>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
            {/* Primary */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Primary</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Check In Guest
                </button>
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Export Report
                </button>
              </div>
            </div>

            {/* Secondary */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Secondary</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  View Details
                </button>
                <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
            </div>

            {/* Danger */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Danger</p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Cancel Reservation
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Delete Record
                </button>
              </div>
            </div>

            {/* Ghost */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Ghost</p>
              <div className="flex flex-wrap gap-3">
                <button className="hover:bg-secondary text-muted-foreground rounded-lg px-3 py-2 text-sm transition-colors">
                  Cancel
                </button>
                <button className="hover:bg-secondary text-muted-foreground rounded-lg px-3 py-2 text-sm transition-colors">
                  Skip
                </button>
              </div>
            </div>

            {/* Icon */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Icon</p>
              <div className="flex flex-wrap gap-3">
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Disabled state */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Disabled State</p>
              <div className="flex flex-wrap gap-3">
                <button disabled className="bg-violet-600 text-white rounded-lg px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
                  Primary Disabled
                </button>
                <button disabled className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
                  Secondary Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── BADGES ──────────────────────────────────────────────────────── */}
        <section id="section-Badges">
          <h2 className="text-lg font-semibold text-foreground mb-1">Status Badges</h2>
          <p className="text-sm text-muted-foreground mb-6">Always <code className="bg-secondary px-1 py-0.5 rounded text-xs">rounded-full px-3 py-1 text-xs font-medium</code>. Never rounded-lg for badges.</p>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Success / Positive</p>
              <div className="flex flex-wrap gap-2">
                {["Confirmed", "Active", "Clean", "Paid", "Checked Out"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Warning / In Progress</p>
              <div className="flex flex-wrap gap-2">
                {["Pending", "In Progress", "Caution", "Dirty", "Reviewing"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Danger / Error</p>
              <div className="flex flex-wrap gap-2">
                {["Cancelled", "Error", "Dirty", "Overdue", "OOS"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Info / Active</p>
              <div className="flex flex-wrap gap-2">
                {["Checked-In", "Open", "Info", "In-House", "Assigned"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{s}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Neutral / Default</p>
              <div className="flex flex-wrap gap-2">
                {["Draft", "Default", "Unknown", "Inspected", "N/A"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CARDS ───────────────────────────────────────────────────────── */}
        <section id="section-Cards">
          <h2 className="text-lg font-semibold text-foreground mb-1">Cards</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Always <code className="bg-secondary px-1 py-0.5 rounded text-xs">rounded-2xl shadow-sm border border-border bg-card p-6</code>.
            Never <code className="bg-secondary px-1 py-0.5 rounded text-xs">rounded-lg</code>, no drop-shadow, no <code className="bg-secondary px-1 py-0.5 rounded text-xs">bg-white</code>.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Card */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Basic Card</p>
              <p className="text-lg font-semibold text-foreground">Room 203</p>
              <p className="text-sm text-muted-foreground mt-1">Suite · Alice Johnson · Checked In 14:32</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Checked-In</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Clean</span>
              </div>
            </div>

            {/* Card with header */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Maintenance Request</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
              </div>
              <div className="p-6">
                <p className="text-sm text-foreground">AC not cooling properly in Room 105.</p>
                <p className="text-xs text-muted-foreground mt-2">Reported by: Front Desk · 2h ago</p>
                <button className="mt-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Assign Technician
                </button>
              </div>
            </div>

            {/* KPI Card */}
            <div className="rounded-2xl p-6 shadow-sm text-white relative overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="text-white text-lg">🏨</span>
                  </div>
                  <p className="text-lg font-medium text-white/90">In-House</p>
                </div>
                <h3 className="text-3xl font-bold mb-1">128</h3>
                <p className="text-sm text-white/80">+1% Last Month</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/5 rounded-full" />
            </div>
          </div>
        </section>

        {/* ── FORMS ───────────────────────────────────────────────────────── */}
        <section id="section-Forms">
          <h2 className="text-lg font-semibold text-foreground mb-1">Forms</h2>
          <p className="text-sm text-muted-foreground mb-6">Input, select, textarea with label and error state patterns.</p>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Text Input — normal */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Guest Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setInputError(false);
                  }}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-muted-foreground"
                />
              </div>

              {/* Text Input — error */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="guest@example.com"
                  className="w-full bg-background border border-red-400 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-red-400 placeholder:text-muted-foreground"
                />
                <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
              </div>

              {/* Select */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Room Type</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
                  <option>Standard King</option>
                  <option>Standard Double</option>
                  <option>Suite</option>
                  <option>Presidential Suite</option>
                </select>
              </div>

              {/* Search Input */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search guests, rooms..."
                    className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1">Notes</label>
                <textarea
                  placeholder="Special requests, notes about the guest..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-muted-foreground resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Save Changes
              </button>
              <button className="hover:bg-secondary text-muted-foreground rounded-lg px-3 py-2 text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </section>

        {/* ── TABLES ──────────────────────────────────────────────────────── */}
        <section id="section-Tables">
          <h2 className="text-lg font-semibold text-foreground mb-1">Tables</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Wrapper: <code className="bg-secondary px-1 py-0.5 rounded text-xs">rounded-2xl overflow-hidden bg-card border border-border</code>. No animation on rows.
          </p>

          <div className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Reservations</h3>
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                New Reservation
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">HK</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.room} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{row.room}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.type}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{row.guest}</td>
                      <td className="px-6 py-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusBadge(row.status))}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusBadge(row.hk))}>{row.hk}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="hover:bg-secondary text-muted-foreground rounded-lg px-3 py-1.5 text-xs transition-colors">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── STATES ──────────────────────────────────────────────────────── */}
        <section id="section-States">
          <h2 className="text-lg font-semibold text-foreground mb-1">Loading & Empty States</h2>
          <p className="text-sm text-muted-foreground mb-6">Skeletons must appear immediately — never show a blank screen. Empty states need icon + message + action.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Loading Skeleton */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Loading Skeleton</p>
              <div className="space-y-3">
                <div className="bg-secondary rounded h-4 w-3/4 animate-pulse" />
                <div className="bg-secondary rounded h-4 w-full animate-pulse" />
                <div className="bg-secondary rounded h-4 w-5/6 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-secondary rounded-2xl h-20 animate-pulse" />
                <div className="bg-secondary rounded-2xl h-20 animate-pulse" />
                <div className="bg-secondary rounded-2xl h-20 animate-pulse" />
              </div>
            </div>

            {/* Empty State */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Empty State</p>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-5xl mb-4">
                  <Inbox className="w-12 h-12 text-muted-foreground mx-auto" />
                </div>
                <p className="text-lg font-semibold text-foreground mb-2">No reservations found</p>
                <p className="text-sm text-muted-foreground mb-6">There are no reservations matching your filters. Try adjusting your search criteria.</p>
                <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  New Reservation
                </button>
              </div>
            </div>

            {/* Error State */}
            <div className="bg-card rounded-2xl border border-red-200 p-6 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Error State</p>
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-600 mb-3">Unable to load reservation data</p>
              <button className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Retry
              </button>
            </div>

            {/* Modal Trigger */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center justify-center gap-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modal Pattern</p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Open Sample Modal
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* ── MODAL ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card rounded-2xl border border-border shadow-xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">New Reservation</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Guest Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Check-In</label>
                    <input
                      type="date"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">Check-Out</label>
                    <input
                      type="date"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Room Type</label>
                  <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
                    <option>Standard King</option>
                    <option>Standard Double</option>
                    <option>Suite</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                  Confirm Reservation
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="hover:bg-secondary text-muted-foreground rounded-lg px-4 py-2 text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
