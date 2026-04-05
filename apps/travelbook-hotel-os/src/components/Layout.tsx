import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Menu,
  Hotel,
  Sparkles,
  ConciergeBell,
  Brush,
  UtensilsCrossed,
  TrendingUp,
  Users,
  Wrench,
  LineChart,
  Settings,
  LogOut,
  ChevronDown,
  Palette,
  UserCircle,
  Landmark,
  ShieldCheck,
  Radio,
  CalendarDays,
  Package,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "../lib/utils";
import { AgenticAIPanel } from "./AgenticAIPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { QuickActions } from "./QuickActions";
import { motion } from "motion/react";
import type { Department } from "../App";

interface LayoutProps {
  children: React.ReactNode;
  activeDepartment: Department;
  setActiveDepartment: (dept: Department) => void;
  activeSubmenu: string;
  setActiveSubmenu: (sub: string) => void;
  aiEnabled: boolean;
  setAiEnabled: (enabled: boolean) => void;
}

const DEPARTMENTS: { name: Department; icon: React.ElementType; submenus: string[] }[] = [
  { name: "Dashboard", icon: Hotel, submenus: ["Overview", "Reports", "Analytics"] },
  { name: "Front Desk", icon: ConciergeBell, submenus: ["Overview", "Rooms", "Arrivals", "Departures", "Reservations", "Timeline"] },
  { name: "Housekeeping", icon: Brush, submenus: ["Overview", "Room Status", "Tasks", "My Team", "Turndown Service", "Lost & Found", "Linen & Inventory", "Inspections", "Minibar", "Reports"] },
  { name: "Food & Beverage", icon: UtensilsCrossed, submenus: ["Overview", "Smart Menu (4D)", "POS", "Bar", "Table Management", "Room Service", "Inventory"] },
  { name: "Sales & Revenue", icon: TrendingUp, submenus: ["Overview", "Rate Management", "Channel Manager", "Comp Set", "Sales Pipeline", "Group Quotes", "Group Management", "Forecast"] },
  { name: "Team", icon: Users, submenus: ["Overview", "Employees", "Scheduling", "Leave Management", "Training & Certifications", "Performance Reviews", "Payroll", "Grievances", "Hiring", "Offboarding", "Time & Attendance", "Staff Transfers"] },
  { name: "Maintenance", icon: Wrench, submenus: ["Overview", "Work Orders", "Preventive Maintenance", "Asset Management", "Smart Rooms", "Energy & Utilities", "Access Control"] },
  { name: "Insights", icon: LineChart, submenus: ["Overview", "Revenue Analytics", "Department Scorecard", "Forecast", "P&L Summary", "ESG", "Audit Trail", "Board Report", "Knowledge Base"] },
  { name: "Guests", icon: UserCircle, submenus: ["Overview", "All Guests", "Arrivals Today", "VIP Intelligence", "Guest Moments", "Loyalty & Rewards", "Feedback", "Journey"] },
  { name: "Finance", icon: Landmark, submenus: ["Overview", "Night Audit", "Folios", "Receivables", "Payables", "Cashier", "Budget vs Actual", "FX Rates"] },
  { name: "Security", icon: ShieldCheck, submenus: ["Overview", "Incidents", "Visitor Management", "Key Management", "Patrol Log"] },
  { name: "Comms", icon: Radio, submenus: ["Overview", "Guest Requests", "Concierge", "Broadcast", "Staff Briefings", "Internal Messages", "Reports"] },
  { name: "Events", icon: CalendarDays, submenus: ["Overview", "Event Timeline", "Floor Plan", "AV & Equipment", "Catering Orders", "Attendance", "Banquet Setup", "Post-Event", "All Events", "Reports"] },
  { name: "Procurement", icon: Package, submenus: ["Overview", "Purchase Orders", "GRN & Receiving", "Suppliers", "Supplier Scorecard", "Supplier Comparison", "Stock Levels", "Reports"] },
  { name: "Portfolio", icon: Building2, submenus: ["Overview", "All Properties", "Transfers", "Consolidated P&L", "SOP Library", "Benchmarking", "Occupancy Heatmap", "Brand Standards"] },
  { name: "Settings", icon: SlidersHorizontal, submenus: ["Hotel Profile", "Room Types", "Rate Plans", "User Roles", "Integrations", "Appearance", "Billing"] },
];

export function Layout({
  children,
  activeDepartment,
  setActiveDepartment,
  activeSubmenu,
  setActiveSubmenu,
  aiEnabled,
  setAiEnabled
}: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredDept, setHoveredDept] = useState<Department | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Reset scroll to top whenever the user navigates to a different page
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [activeDepartment, activeSubmenu]);

  const displayDeptName = hoveredDept || activeDepartment;
  const displayDept = DEPARTMENTS.find(d => d.name === displayDeptName)!;

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <aside 
        className={cn(
          "flex h-full w-72 flex-shrink-0 transition-all duration-300 z-20 absolute md:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
        onMouseLeave={() => setHoveredDept(null)}
      >
        {/* Darker Left Strip (Main Menu) */}
        <div className="w-16 bg-[#0a1d26]/90 backdrop-blur-md h-full rounded-r-2xl z-20 flex flex-col items-center py-6 shadow-xl absolute left-0 top-0 border-r border-white/10">
          {/* Logo */}
          <div className="w-9 h-9 bg-amber-300/20 rounded-xl flex items-center justify-center mb-4 text-amber-300 font-bold text-lg shadow-inner shrink-0">
            O
          </div>

          {/* Main Menu Icons */}
          <div className="flex flex-col gap-1 w-full px-2 flex-1 overflow-y-auto scrollbar-hide">
            {DEPARTMENTS.map(dept => {
              const isActive = activeDepartment === dept.name;
              return (
                <button
                  key={dept.name}
                  onMouseEnter={() => setHoveredDept(dept.name)}
                  onClick={() => {
                    setActiveDepartment(dept.name);
                    setActiveSubmenu(dept.submenus[0]);
                  }}
                  className={cn(
                    "w-full h-9 rounded-xl flex items-center justify-center transition-all relative group shrink-0",
                    isActive ? "bg-amber-300 text-slate-950 shadow-md border border-amber-200/20" : "text-white/55 hover:text-white hover:bg-white/10"
                  )}
                  title={dept.name}
                >
                  <dept.icon className="w-5 h-5" />
                  {/* Tooltip */}
                  <span className="absolute left-14 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity border border-white/10">
                    {dept.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Submenu Area */}
        <div className="flex-1 bg-[#0a1d26]/80 backdrop-blur-xl h-full rounded-r-[40px] pl-16 flex flex-col z-10 py-6 transition-all border-r border-white/10">
          
          {/* User Profile */}
          <div className="flex items-center gap-3 px-6 mb-8 text-white">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0 shadow-sm">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className={cn("flex flex-col", !sidebarOpen && "md:hidden")}>
              <span className="font-medium text-sm whitespace-nowrap">Jane Doe</span>
              <span className="text-xs text-white/55 truncate max-w-[100px]">{displayDept.name}</span>
            </div>
            <button className={cn("ml-auto text-white/55 hover:text-white", !sidebarOpen && "md:hidden")}>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Submenu Title */}
          <div className="px-6 mb-4">
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider">{displayDept.name}</h3>
          </div>

          {/* Submenu Links */}
          <nav className="flex-1 flex flex-col gap-2 pl-6 overflow-y-auto scrollbar-hide relative">
            {displayDept.submenus.map(sub => {
              const isSubActive = activeSubmenu === sub && activeDepartment === displayDept.name;
              return (
                <button 
                  key={sub}
                  onClick={() => {
                    setActiveDepartment(displayDept.name);
                    setActiveSubmenu(sub);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-l-full transition-colors relative group text-left outline-none",
                    isSubActive ? "text-amber-300 font-medium" : "text-white hover:bg-white/10"
                  )}
                >
                  {isSubActive && (
                    <motion.div
                      layoutId="activeSubmenuBg"
                      className="absolute inset-0 bg-background rounded-l-full z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Top curve */}
                      <div className="absolute -top-4 right-0 w-4 h-4 bg-transparent rounded-br-full shadow-[4px_4px_0_4px_var(--background)]" />
                      {/* Bottom curve */}
                      <div className="absolute -bottom-4 right-0 w-4 h-4 bg-transparent rounded-tr-full shadow-[4px_-4px_0_4px_var(--background)]" />
                    </motion.div>
                  )}
                  <span className={cn("text-sm whitespace-nowrap relative z-10", !sidebarOpen && "md:hidden")}>{sub}</span>
                </button>
              )
            })}
          </nav>

          {/* Bottom Links */}
          <div className="mt-auto pl-6 flex flex-col gap-2 pt-4 border-t border-white/10 mx-4">
            {import.meta.env.DEV && (
              <a
                href="/style-guide"
                className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white transition-colors"
              >
                <Palette className="w-5 h-5 shrink-0" />
                <span className={cn("text-sm font-medium", !sidebarOpen && "md:hidden")}>Design System</span>
              </a>
            )}
            <button className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white transition-colors">
              <Settings className="w-5 h-5 shrink-0" />
              <span className={cn("text-sm font-medium", !sidebarOpen && "md:hidden")}>Settings</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white transition-colors">
              <LogOut className="w-5 h-5 shrink-0" />
              <span className={cn("text-sm font-medium", !sidebarOpen && "md:hidden")}>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Center Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-8 shrink-0">
          <button
            className="md:hidden text-muted-foreground hover:text-foreground mr-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="text-amber-300 font-bold text-sm tracking-wider uppercase hidden md:block">TravelBook Hotel OS</div>

          <div className="flex-1 flex justify-center max-w-3xl mx-auto">
            <div className="bg-card rounded-full shadow-sm flex items-center px-4 py-2 w-full border border-border">
              <select className="bg-transparent border-none outline-none text-sm text-muted-foreground pr-4 border-r border-border hidden sm:block cursor-pointer">
                <option>All Categories</option>
                <option>Guests</option>
                <option>Rooms</option>
                <option>Orders</option>
              </select>
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-foreground placeholder:text-muted-foreground" 
                placeholder="Search..." 
              />
              <button className="p-1 hover:bg-secondary rounded-full transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 ml-4 sm:ml-8">
            {/* AI Toggle */}
            <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-full shadow-sm">
              <Sparkles className={cn("h-4 w-4", aiEnabled ? "text-primary" : "text-muted-foreground")} />
              <span className="text-sm font-medium hidden sm:inline-block">Agentic AI</span>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                  aiEnabled ? "bg-primary" : "bg-input"
                )}
              >
                <span 
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                    aiEnabled ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button onClick={() => setNotifOpen(o => !o)} className="text-muted-foreground hover:text-foreground relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-destructive border-2 border-background"></span>
            </button>

            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hidden sm:block">
              <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Main */}
        <main ref={mainRef} className="flex-1 overflow-auto px-4 sm:px-8 pb-8">
          {children}
        </main>
      </div>

      {/* Right AI Sidebar */}
      {aiEnabled && (
        <AgenticAIPanel department={activeDepartment} onClose={() => setAiEnabled(false)} />
      )}

      {/* Notifications Panel */}
      {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}

      {/* Floating Quick Actions */}
      <QuickActions />

    </div>
  );
}


