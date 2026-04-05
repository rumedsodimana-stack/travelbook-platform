import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Users, Bed, Star,
  Building, Download, RefreshCw, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, BarChart2, Target, Leaf,
  Droplets, Zap, Recycle, ClipboardList, FileText, Globe,
  Calendar, Eye, Shield, Activity, Award, Sparkles, Crown,
  Percent, Coffee, UtensilsCrossed, Waves, ChevronUp, ChevronDown,
  Search, ChevronRight, Plus,
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface InsightsProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const revenueMonths = [
  { month: "Oct", rooms: 182000, fb: 64000, events: 28000, spa: 18000, other: 9000 },
  { month: "Nov", rooms: 198000, fb: 72000, events: 35000, spa: 21000, other: 11000 },
  { month: "Dec", rooms: 245000, fb: 98000, events: 68000, spa: 29000, other: 14000 },
  { month: "Jan", rooms: 212000, fb: 78000, events: 42000, spa: 24000, other: 12000 },
  { month: "Feb", rooms: 228000, fb: 82000, events: 39000, spa: 26000, other: 13000 },
  { month: "Mar", rooms: 251000, fb: 91000, events: 55000, spa: 31000, other: 16000 },
];
const revenueTotal = revenueMonths.map(m => ({ ...m, total: m.rooms + m.fb + m.events + m.spa + m.other }));

const kpiTrend = [
  { month: "Oct", occ: 72, adr: 145, revpar: 104, nps: 78 },
  { month: "Nov", occ: 76, adr: 152, revpar: 116, nps: 80 },
  { month: "Dec", occ: 91, adr: 178, revpar: 162, nps: 82 },
  { month: "Jan", occ: 81, adr: 159, revpar: 129, nps: 79 },
  { month: "Feb", occ: 84, adr: 163, revpar: 137, nps: 83 },
  { month: "Mar", occ: 88, adr: 171, revpar: 150, nps: 86 },
];

const channelMix = [
  { name: "Direct Booking", value: 34, color: "#7c3aed" },
  { name: "Booking.com", value: 28, color: "#3b82f6" },
  { name: "Corporate", value: 18, color: "#10b981" },
  { name: "Expedia", value: 12, color: "#f59e0b" },
  { name: "Travel Agent", value: 8, color: "#6b7280" },
];

const deptScorecard = [
  { dept: "Front Desk", revenue: 251000, budget: 240000, satisfaction: 9.1, efficiency: 94, trend: "up" },
  { dept: "Food & Beverage", revenue: 91000, budget: 88000, satisfaction: 8.7, efficiency: 88, trend: "up" },
  { dept: "Events", revenue: 55000, budget: 58000, satisfaction: 9.3, efficiency: 91, trend: "down" },
  { dept: "Spa & Wellness", revenue: 31000, budget: 29000, satisfaction: 9.5, efficiency: 96, trend: "up" },
  { dept: "Housekeeping", revenue: 0, budget: 0, satisfaction: 9.0, efficiency: 97, trend: "up" },
  { dept: "Maintenance", revenue: 0, budget: 0, satisfaction: 8.8, efficiency: 93, trend: "flat" },
];

const forecastData = [
  { month: "Apr", optimistic: 468000, base: 441000, conservative: 412000, actual: null },
  { month: "May", optimistic: 495000, base: 462000, conservative: 428000, actual: null },
  { month: "Jun", optimistic: 512000, base: 478000, conservative: 441000, actual: null },
  { month: "Jul", optimistic: 538000, base: 501000, conservative: 462000, actual: null },
  { month: "Aug", optimistic: 521000, base: 488000, conservative: 451000, actual: null },
  { month: "Sep", optimistic: 489000, base: 458000, conservative: 422000, actual: null },
];

const plData = [
  { dept: "Rooms", revenue: 251000, cogs: 38000, labor: 42000, overhead: 18000 },
  { dept: "F&B", revenue: 91000, cogs: 31000, labor: 28000, overhead: 9000 },
  { dept: "Events", revenue: 55000, cogs: 12000, labor: 18000, overhead: 6000 },
  { dept: "Spa", revenue: 31000, cogs: 8000, labor: 11000, overhead: 4000 },
  { dept: "Other", revenue: 16000, cogs: 3000, labor: 5000, overhead: 2000 },
];

const esgMetrics = [
  { label: "Carbon Footprint", current: 186, target: 170, unit: "tCO₂e", icon: "🌿", trend: -4.2 },
  { label: "Water Usage", current: 42800, target: 40000, unit: "m³", icon: "💧", trend: -2.1 },
  { label: "Electricity (kWh)", current: 312000, target: 295000, unit: "kWh", icon: "⚡", trend: -5.8 },
  { label: "Waste Diverted", current: 74, target: 80, unit: "%", icon: "♻️", trend: +6.1 },
  { label: "Solar Coverage", current: 28, target: 40, unit: "%", icon: "☀️", trend: +12.0 },
  { label: "Food Waste", current: 2.4, target: 1.8, unit: "kg/cover", icon: "🥗", trend: -8.3 },
];

const radarData = [
  { metric: "Revenue", A: 88, B: 72 },
  { metric: "Guest Sat.", A: 91, B: 81 },
  { metric: "Occupancy", A: 88, B: 76 },
  { metric: "F&B", A: 85, B: 78 },
  { metric: "Events", A: 79, B: 65 },
  { metric: "ESG", A: 74, B: 69 },
];

const auditLog = [
  { id: "AL001", user: "Sarah Mitchell", action: "Rate Override", target: "Room 501 — BHD 220 → 185", timestamp: "2026-04-02 14:32", risk: "Medium" },
  { id: "AL002", user: "Ahmed Al-Mansouri", action: "Discount Applied", target: "Invoice INV-2026-0891 — 15% corp rate", timestamp: "2026-04-02 13:18", risk: "Low" },
  { id: "AL003", user: "System", action: "Night Audit Run", target: "April 1, 2026 audit completed", timestamp: "2026-04-02 02:01", risk: "None" },
  { id: "AL004", user: "Ling Wei", action: "Guest Profile Edit", target: "Sheikh Khalid Al-Zayed — tier changed", timestamp: "2026-04-01 18:45", risk: "Medium" },
  { id: "AL005", user: "Mohammed Al-Rashid", action: "PO Approved", target: "PO-2026-0042 — BHD 14,200 HVAC Parts", timestamp: "2026-04-01 16:22", risk: "Low" },
  { id: "AL006", user: "Elena Marchetti", action: "User Role Changed", target: "Aisha Al-Farsi promoted to Supervisor", timestamp: "2026-04-01 11:05", risk: "High" },
  { id: "AL007", user: "System", action: "Backup Complete", target: "Full DB snapshot — 99.8% integrity", timestamp: "2026-04-01 03:00", risk: "None" },
  { id: "AL008", user: "Priya Sharma", action: "Invoice Voided", target: "INV-2026-0888 — BHD 430 voided", timestamp: "2026-03-31 17:48", risk: "High" },
];

const latestMonth = revenueTotal[revenueTotal.length - 1];
const prevMonth = revenueTotal[revenueTotal.length - 2];
const latestKPI = kpiTrend[kpiTrend.length - 1];
const prevKPI = kpiTrend[kpiTrend.length - 2];

// ── Helper ────────────────────────────────────────────────────────────────────
const Delta = ({ v, prev, fmt = (x: number) => x.toLocaleString() }: { v: number; prev: number; fmt?: (x: number) => string }) => {
  const pct = ((v - prev) / prev * 100).toFixed(1);
  const up = v >= prev;
  return (
    <span className={cn("flex items-center gap-0.5 text-xs font-medium", up ? "text-emerald-600" : "text-red-500")}>
      {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{Math.abs(Number(pct))}% vs last month
    </span>
  );
};

export function Insights({ aiEnabled, activeSubmenu = "Overview" }: InsightsProps) {
  const [forecastScenario, setForecastScenario] = useState<"base" | "optimistic" | "conservative">("base");
  const [search, setSearch] = useState("");

  return (
    <AnimatePresence mode="wait">

        {/* ── OVERVIEW ─────────────────────────────────────── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search insights..." />}
              header={<SectionHeader title="GM Dashboard" subtitle="March 2026 · Singularity Grand Manama" icon={BarChart2} actions={<div className="flex gap-2"><button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-secondary/50 text-sm text-muted-foreground"><RefreshCw className="w-4 h-4"/>Refresh</button><button className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition-colors"><Download className="w-4 h-4"/>Board Report</button></div>} />}
              kpi={<KpiStrip items={[
                {color:"bg-emerald-500",value:`BHD ${(latestMonth.total/1000).toFixed(0)}k`,label:"Total Revenue"},
                {color:"bg-blue-500",value:`${latestKPI.occ}%`,label:"Occupancy"},
                {color:"bg-violet-500",value:`BHD ${latestKPI.revpar}`,label:"RevPAR"},
                {color:"bg-amber-500",value:latestKPI.nps,label:"Guest NPS"},
                {color:"bg-indigo-500",value:`BHD ${latestKPI.adr}`,label:"ADR"},
              ]} />}
            >

            {/* Revenue + KPI trend charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Revenue by Department — 6 Months" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueTotal} margin={{left:0,right:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)" />
                    <XAxis dataKey="month" tick={{fontSize:12}}/>
                    <YAxis tick={{fontSize:12}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                    <Tooltip formatter={(v:number)=>[`BHD ${(v/1000).toFixed(0)}k`,""]}/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    <Bar dataKey="rooms" name="Rooms" stackId="a" fill="#3b82f6"/>
                    <Bar dataKey="fb" name="F&B" stackId="a" fill="#f59e0b"/>
                    <Bar dataKey="events" name="Events" stackId="a" fill="#10b981"/>
                    <Bar dataKey="spa" name="Spa" stackId="a" fill="#8b5cf6" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Key Performance Indicators" />
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={kpiTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)"/>
                    <XAxis dataKey="month" tick={{fontSize:12}}/>
                    <YAxis tick={{fontSize:12}}/>
                    <Tooltip/>
                    <Legend wrapperStyle={{fontSize:11}}/>
                    <Line type="monotone" dataKey="occ" name="Occupancy %" stroke="#3b82f6" strokeWidth={2} dot={{r:3}}/>
                    <Line type="monotone" dataKey="revpar" name="RevPAR (BHD)" stroke="#7c3aed" strokeWidth={2} dot={{r:3}}/>
                    <Line type="monotone" dataKey="nps" name="NPS" stroke="#10b981" strokeWidth={2} dot={{r:3}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Channel mix + Dept performance snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Booking Channel Mix" />
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={channelMix} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={2}>
                      {channelMix.map((e,i)=><Cell key={i} fill={e.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v:number,n:string)=>[`${v}%`,n]}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">{channelMix.map(c=>(
                  <div key={c.name} className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full" style={{background:c.color}}/>{c.name}</span>
                    <span className="font-semibold text-foreground">{c.value}%</span>
                  </div>
                ))}</div>
              </div>
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Department Snapshot" />
                <div className="space-y-3">
                  {deptScorecard.filter(d=>d.revenue>0).map(d=>{
                    const pct = d.budget>0?Math.round((d.revenue/d.budget)*100):null;
                    return (
                      <div key={d.dept} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground w-28 shrink-0">{d.dept}</span>
                        <div className="flex-1">
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full",pct&&pct>=100?"bg-emerald-500":"bg-violet-500")} style={{width:`${Math.min(pct||0,100)}%`}}/>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-foreground w-20 text-right">BHD {(d.revenue/1000).toFixed(0)}k</span>
                        <span className={cn("text-xs w-14 text-right",d.trend==="up"?"text-emerald-600":d.trend==="down"?"text-red-500":"text-muted-foreground")}>{d.trend==="up"?"↑ On track":d.trend==="down"?"↓ Below":"→ Flat"}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── REVENUE ANALYTICS ────────────────────────────── */}
        {activeSubmenu === "Revenue Analytics" && (
          <motion.div key="revenue" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search revenue..." />}
              header={<SectionHeader title="Revenue Analytics" subtitle="6-month performance · March 2026" icon={BarChart2} actions={<button className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium"><Download className="w-4 h-4"/>Export</button>} />}
              kpi={<KpiStrip items={[
                {color:"bg-emerald-500",value:`BHD ${(latestMonth.total/1000).toFixed(0)}k`,label:"Mar Revenue"},
                {color:"bg-blue-500",value:`BHD ${latestKPI.adr}`,label:"ADR"},
                {color:"bg-violet-500",value:`BHD ${latestKPI.revpar}`,label:"RevPAR"},
                {color:"bg-amber-500",value:`${latestKPI.occ}%`,label:"Occupancy"},
                {color:"bg-indigo-500",value:`BHD ${(revenueTotal.reduce((s,m)=>s+m.total,0)/1000).toFixed(0)}k`,label:"6M Total"},
              ]} />}
            >
            {/* Stacked area chart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Revenue Trend by Stream" />
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTotal}>
                  <defs>
                    {[["roomsGrad","#3b82f6"],["fbGrad","#f59e0b"],["evGrad","#10b981"],["spaGrad","#8b5cf6"]].map(([id,c])=>(
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.4}/><stop offset="95%" stopColor={c} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)"/>
                  <XAxis dataKey="month" tick={{fontSize:12}}/>
                  <YAxis tick={{fontSize:12}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip formatter={(v:number,n:string)=>[`BHD ${(v/1000).toFixed(0)}k`,n]}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Area type="monotone" dataKey="rooms" name="Rooms" stroke="#3b82f6" fill="url(#roomsGrad)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="fb" name="F&B" stroke="#f59e0b" fill="url(#fbGrad)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="events" name="Events" stroke="#10b981" fill="url(#evGrad)" strokeWidth={2}/>
                  <Area type="monotone" dataKey="spa" name="Spa" stroke="#8b5cf6" fill="url(#spaGrad)" strokeWidth={2}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Channel mix + monthly breakdown table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Booking Channel Mix" />
                <div className="space-y-3">
                  {channelMix.map(c=>(
                    <div key={c.name}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-foreground font-medium">{c.name}</span><span className="font-bold text-foreground">{c.value}%</span></div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${c.value}%`,background:c.color}}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border"><SectionHeader title="Monthly Revenue Breakdown" /></div>
                <table className="w-full text-sm">
                  <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                    {["Month","Rooms","F&B","Events","Spa","Total","vs Prev"].map(h=><th key={h} className="text-right px-4 py-3 font-medium first:text-left">{h}</th>)}
                  </tr></thead>
                  <tbody className="divide-y divide-border/50">
                    {revenueTotal.map((m,i)=>{
                      const prev = i>0?revenueTotal[i-1].total:null;
                      const pct = prev?((m.total-prev)/prev*100).toFixed(1):null;
                      return (
                        <tr key={m.month} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-foreground">{m.month}</td>
                          {[m.rooms,m.fb,m.events,m.spa].map((v,j)=><td key={j} className="px-4 py-2.5 text-right text-muted-foreground">{(v/1000).toFixed(0)}k</td>)}
                          <td className="px-4 py-2.5 text-right font-bold text-foreground">{(m.total/1000).toFixed(0)}k</td>
                          <td className={cn("px-4 py-2.5 text-right text-xs font-semibold",pct===null?"text-muted-foreground":Number(pct)>=0?"text-emerald-600":"text-red-500")}>{pct===null?"—":(Number(pct)>=0?"+":"")+pct+"%"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── DEPARTMENT SCORECARD ─────────────────────────── */}
        {activeSubmenu === "Department Scorecard" && (
          <motion.div key="scorecard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search departments..." />}
              header={<SectionHeader title="Department Scorecard" subtitle="Performance across all departments · March 2026" icon={BarChart2} />}
              kpi={<KpiStrip items={[{color:"bg-emerald-500",value:deptScorecard.filter(d=>d.trend==="up").length,label:"On Track"},{color:"bg-red-500",value:deptScorecard.filter(d=>d.trend==="down").length,label:"Below Target"},{color:"bg-slate-500",value:deptScorecard.filter(d=>d.trend==="flat").length,label:"Flat"},{color:"bg-violet-500",value:(deptScorecard.reduce((s,d)=>s+d.satisfaction,0)/deptScorecard.length).toFixed(1),label:"Avg Satisfaction"},{color:"bg-blue-500",value:Math.round(deptScorecard.reduce((s,d)=>s+d.efficiency,0)/deptScorecard.length)+"%",label:"Avg Efficiency"}]} />}
            >
            {/* Scorecard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptScorecard.map(d => {
                const pct = d.budget > 0 ? Math.round((d.revenue / d.budget) * 100) : null;
                return (
                  <div key={d.dept} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-foreground">{d.dept}</span>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", d.trend==="up"?"bg-emerald-100 text-emerald-700":d.trend==="down"?"bg-red-100 text-red-700":"bg-muted text-muted-foreground")}>{d.trend==="up"?"↑ On Track":d.trend==="down"?"↓ Below Target":"→ Flat"}</span>
                    </div>
                    {d.revenue > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Revenue vs Budget</span><span className="font-semibold text-foreground">BHD {(d.revenue/1000).toFixed(0)}k / {(d.budget/1000).toFixed(0)}k</span></div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all",pct&&pct>=100?"bg-emerald-500":"bg-violet-500")} style={{width:`${Math.min(pct||0,100)}%`}}/></div>
                        <div className="text-right text-xs text-muted-foreground mt-0.5">{pct}% of budget</div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-secondary/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground">Guest Satisfaction</p>
                        <p className="text-xl font-bold text-foreground mt-0.5">{d.satisfaction}</p>
                        <div className="flex justify-center mt-1">{[1,2,3,4,5].map(s=><Star key={s} className={cn("w-2.5 h-2.5",s<=Math.round(d.satisfaction/2)?"text-amber-400 fill-amber-400":"text-muted-foreground")}/>)}</div>
                      </div>
                      <div className="bg-secondary/40 rounded-xl p-3 text-center">
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className="text-xl font-bold text-foreground mt-0.5">{d.efficiency}%</p>
                        <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden"><div className={cn("h-full rounded-full",d.efficiency>=90?"bg-emerald-500":d.efficiency>=80?"bg-amber-500":"bg-red-500")} style={{width:`${d.efficiency}%`}}/></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Radar comparison */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Singularity vs Market Average" />
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--color-border,#e2e8f0)"/>
                  <PolarAngleAxis dataKey="metric" tick={{fontSize:12}}/>
                  <Radar name="Singularity Grand" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.3} strokeWidth={2}/>
                  <Radar name="Market Average" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} strokeWidth={1.5} strokeDasharray="4 4"/>
                  <Legend wrapperStyle={{fontSize:12}}/>
                  <Tooltip/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── FORECAST ─────────────────────────────────────── */}
        {activeSubmenu === "Forecast" && (
          <motion.div key="forecast" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search forecast..." />}
              header={<SectionHeader title="Revenue Forecast" subtitle="Apr–Sep 2026 · AI-driven scenario modelling" icon={BarChart2} actions={<div className="flex gap-2">{(["base","optimistic","conservative"] as const).map(s=>(<button key={s} onClick={()=>setForecastScenario(s)} className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold border capitalize transition-colors", forecastScenario===s?s==="optimistic"?"bg-emerald-600 text-white border-emerald-600":s==="conservative"?"bg-amber-500 text-white border-amber-500":"bg-violet-600 text-white border-violet-600":"border-border text-muted-foreground hover:bg-secondary")}>{s}</button>))}</div>} />}
              kpi={<KpiStrip items={[
                {color:"bg-violet-500",value:`BHD ${((forecastData[0][forecastScenario]!+forecastData[1][forecastScenario]!+forecastData[2][forecastScenario]!)/1000).toFixed(0)}k`,label:"Q2 2026 Forecast"},
                {color:"bg-blue-500",value:"Jul",label:"Peak Month"},
                {color:"bg-emerald-500",value:`BHD ${(forecastData.reduce((s,m)=>s+m[forecastScenario]!,0)/forecastData.length/1000).toFixed(0)}k`,label:"Avg Monthly"},
                {color:"bg-amber-500",value:`BHD ${(forecastData[0][forecastScenario]!/1000).toFixed(0)}k`,label:"Apr Forecast"},
                {color:"bg-rose-500",value:forecastScenario[0].toUpperCase()+forecastScenario.slice(1),label:"Active Scenario"},
              ]} />}
            >
            {/* Forecast chart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Forecast vs Scenarios" />
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/><stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/></linearGradient>
                    <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border,#e2e8f0)"/>
                  <XAxis dataKey="month" tick={{fontSize:12}}/>
                  <YAxis tick={{fontSize:12}} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                  <Tooltip formatter={(v:number,n:string)=>[`BHD ${(v/1000).toFixed(0)}k`,n]}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                  <Area type="monotone" dataKey="optimistic" name="Optimistic" stroke="#10b981" fill="url(#optGrad)" strokeWidth={2} strokeDasharray="6 3"/>
                  <Area type="monotone" dataKey="base" name="Base Case" stroke="#7c3aed" fill="url(#baseGrad)" strokeWidth={2.5}/>
                  <Area type="monotone" dataKey="conservative" name="Conservative" stroke="#f59e0b" fill="url(#consGrad)" strokeWidth={2} strokeDasharray="6 3"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Forecast assumptions */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="AI Forecast Assumptions" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[["Market Demand","GCC business travel demand +12% YoY based on IATA forward bookings"],["Regional Events","Bahrain Grand Prix (Apr), Gulf Hotels Expo (May) expected to drive +8-15% spike"],["Competition","2 new hotels opening in Manama Q3 — conservative scenario factors -4% ADR pressure"],["Seasonal Pattern","Summer softness Jun–Aug modelled at 72-78% occ; corporate recovery Sep"],["Currency","BHD/USD stable; GBP/EUR forex assumption flat YoY for European guests"],["Direct Booking","Loyalty programme growth driving +3% direct mix shift, protecting margins"]].map(([k,v])=>(
                  <div key={k} className="bg-secondary/30 rounded-xl p-3">
                    <p className="text-xs font-semibold text-foreground mb-1">{k}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v}</p>
                  </div>
                ))}
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── P&L SUMMARY ──────────────────────────────────── */}
        {activeSubmenu === "P&L Summary" && (
          <motion.div key="pl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search P&L..." />}
              header={<SectionHeader title="P&L Summary" subtitle="Departmental profit & loss · March 2026" icon={BarChart2} actions={<button className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium"><Download className="w-4 h-4"/>Export PDF</button>} />}
              kpi={(() => {
                const totRev = plData.reduce((s,d)=>s+d.revenue,0);
                const totCogs = plData.reduce((s,d)=>s+d.cogs,0);
                const totLabor = plData.reduce((s,d)=>s+d.labor,0);
                const totOverhead = plData.reduce((s,d)=>s+d.overhead,0);
                const gp = totRev - totCogs;
                const np = totRev - totCogs - totLabor - totOverhead;
                return (
                  <KpiStrip items={[
                    {color:"bg-emerald-500",value:`BHD ${(totRev/1000).toFixed(0)}k`,label:"Total Revenue"},
                    {color:"bg-rose-500",value:`BHD ${(totCogs/1000).toFixed(0)}k`,label:"Cost of Sales"},
                    {color:"bg-orange-500",value:`BHD ${(totLabor/1000).toFixed(0)}k`,label:"Labour Cost"},
                    {color:"bg-blue-500",value:`BHD ${(gp/1000).toFixed(0)}k`,label:"Gross Profit"},
                    {color:"bg-violet-500",value:`BHD ${(np/1000).toFixed(0)}k`,label:"Net Profit"},
                  ]} />
                );
              })()}
            >
            {/* P&L table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  {["Department","Revenue","Cost of Sales","Gross Profit","Labour","Overhead","Net Profit","Margin%"].map(h=><th key={h} className="text-right px-4 py-3 font-medium first:text-left">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {plData.map(d=>{
                    const gp = d.revenue - d.cogs;
                    const np = gp - d.labor - d.overhead;
                    const margin = Math.round(np/d.revenue*100);
                    return (
                      <tr key={d.dept} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{d.dept}</td>
                        <td className="px-4 py-3 text-right text-foreground font-medium">{(d.revenue/1000).toFixed(0)}k</td>
                        <td className="px-4 py-3 text-right text-red-500">({(d.cogs/1000).toFixed(0)}k)</td>
                        <td className="px-4 py-3 text-right text-blue-600 font-medium">{(gp/1000).toFixed(0)}k</td>
                        <td className="px-4 py-3 text-right text-orange-500">({(d.labor/1000).toFixed(0)}k)</td>
                        <td className="px-4 py-3 text-right text-muted-foreground">({(d.overhead/1000).toFixed(0)}k)</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-600">{(np/1000).toFixed(0)}k</td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold",margin>=40?"bg-emerald-100 text-emerald-700":margin>=25?"bg-blue-100 text-blue-700":"bg-amber-100 text-amber-700")}>{margin}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-secondary/70 font-bold text-foreground">
                    <td className="px-4 py-3">Total</td>
                    {[plData.reduce((s,d)=>s+d.revenue,0),plData.reduce((s,d)=>s+d.cogs,0)].map((v,i)=><td key={i} className={cn("px-4 py-3 text-right",i===1?"text-red-500":"text-foreground")}>{i===1?"(":""}{(v/1000).toFixed(0)}k{i===1?")":""}</td>)}
                    <td className="px-4 py-3 text-right text-blue-600">{((plData.reduce((s,d)=>s+d.revenue,0)-plData.reduce((s,d)=>s+d.cogs,0))/1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 text-right text-orange-500">({(plData.reduce((s,d)=>s+d.labor,0)/1000).toFixed(0)}k)</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">({(plData.reduce((s,d)=>s+d.overhead,0)/1000).toFixed(0)}k)</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{((plData.reduce((s,d)=>s+d.revenue,0)-plData.reduce((s,d)=>s+d.cogs+d.labor+d.overhead,0))/1000).toFixed(0)}k</td>
                    <td className="px-4 py-3 text-right"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">{Math.round((plData.reduce((s,d)=>s+d.revenue-d.cogs-d.labor-d.overhead,0)/plData.reduce((s,d)=>s+d.revenue,0))*100)}%</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── ESG ──────────────────────────────────────────── */}
        {activeSubmenu === "ESG" && (
          <motion.div key="esg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search ESG..." />}
              header={<SectionHeader title="ESG & Sustainability" subtitle="Environmental, Social & Governance · March 2026" icon={BarChart2} actions={<button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium"><Download className="w-4 h-4"/>ESG Report</button>} />}
              kpi={<KpiStrip items={esgMetrics.slice(0,5).map((m, i) => {
                const esgColors = ["bg-green-500","bg-blue-500","bg-yellow-500","bg-emerald-500","bg-amber-500"];
                return { color: esgColors[i % esgColors.length], value: `${m.current.toLocaleString()} ${m.unit}`, label: m.label };
              })} />}
            >
            {/* ESG metric detail cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {esgMetrics.map(m => {
                const onTrack = (m.label === "Waste Diverted" || m.label === "Solar Coverage")
                  ? m.current >= m.target * 0.9
                  : m.current <= m.target * 1.1;
                return (
                  <div key={m.label} className="relative overflow-hidden rounded-2xl bg-card border border-border p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-muted-foreground text-sm">{m.label}</p>
                        <p className="text-3xl font-bold mt-1 text-foreground">
                          {m.current.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">{m.unit}</span>
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">Target: {m.target.toLocaleString()} {m.unit}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-2xl">{m.icon}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${onTrack ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                          {onTrack ? "On Track" : "Off Target"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* ESG initiatives */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Sustainability Initiatives" />
              <div className="space-y-3">
                {[
                  { initiative: "Solar Panel Expansion", status: "In Progress", progress: 70, target: "Q2 2026", detail: "8 additional panels commissioned — targeting 40% solar coverage" },
                  { initiative: "Zero Single-Use Plastics", status: "Completed", progress: 100, target: "Jan 2026", detail: "All guest amenities now biodegradable. Eliminated 12,000 plastic items/month" },
                  { initiative: "EV Charging Stations", status: "Completed", progress: 100, target: "Feb 2026", detail: "8 EV chargers operational in guest parking" },
                  { initiative: "Green Key Certification", status: "Completed", progress: 100, target: "Mar 2026", detail: "Renewed for 2026-2027 — 4th consecutive year" },
                  { initiative: "Water Recycling System", status: "Planning", progress: 15, target: "Q4 2026", detail: "Greywater recycling for irrigation — projected 30% water reduction" },
                  { initiative: "Food Waste Programme", status: "In Progress", progress: 55, target: "Q3 2026", detail: "Food surplus donated to local NGO. Target: < 1.8 kg/cover" },
                ].map(i=>(
                  <div key={i.initiative} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-colors">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", i.status==="Completed"?"bg-emerald-500":i.status==="In Progress"?"bg-blue-500":"bg-amber-400")} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground text-sm">{i.initiative}</span>
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", i.status==="Completed"?"bg-emerald-100 text-emerald-700":i.status==="In Progress"?"bg-blue-100 text-blue-700":"bg-amber-100 text-amber-700")}>{i.status}</span>
                        <span className="text-xs text-muted-foreground">· {i.target}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{i.detail}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="h-1.5 w-20 bg-secondary rounded-full overflow-hidden"><div className={cn("h-full rounded-full",i.progress===100?"bg-emerald-500":"bg-blue-500")} style={{width:`${i.progress}%`}}/></div>
                      <span className="text-xs font-semibold text-foreground w-8 text-right">{i.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── AUDIT TRAIL ──────────────────────────────────── */}
        {activeSubmenu === "Audit Trail" && (
          <motion.div key="audit" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search audit trail..." />}
              header={<SectionHeader title="System Audit Trail" subtitle="All system actions, overrides and sensitive changes" icon={BarChart2} actions={<button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/50"><Download className="w-4 h-4"/>Export Log</button>} />}
              kpi={<KpiStrip items={[{color:"bg-red-500",value:auditLog.filter(a=>a.risk==="High").length,label:"High Risk"},{color:"bg-amber-500",value:auditLog.filter(a=>a.risk==="Medium").length,label:"Medium Risk"},{color:"bg-emerald-500",value:auditLog.filter(a=>a.risk==="Low").length,label:"Low Risk"},{color:"bg-slate-500",value:auditLog.filter(a=>a.risk==="None").length,label:"No Risk"},{color:"bg-blue-500",value:auditLog.length,label:"Total Actions"}]} />}
            >
            {/* Risk filter pills */}
            <div className="flex gap-2">
              {["All","High","Medium","Low","None"].map(r=>(
                <button key={r} className={cn("px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors",r==="All"?"bg-violet-600 text-white border-violet-600":"border-border text-muted-foreground hover:bg-secondary")}>{r} Risk</button>
              ))}
            </div>
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wide">
                  {["Ref","User","Action","Target","Timestamp","Risk"].map(h=><th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}
                </tr></thead>
                <tbody className="divide-y divide-border/50">
                  {auditLog.map(entry=>(
                    <tr key={entry.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{entry.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{entry.user}</td>
                      <td className="px-4 py-3 text-foreground">{entry.action}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[240px] truncate">{entry.target}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{entry.timestamp}</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold",entry.risk==="High"?"bg-red-100 text-red-700":entry.risk==="Medium"?"bg-amber-100 text-amber-700":entry.risk==="Low"?"bg-blue-100 text-blue-700":"bg-muted text-muted-foreground")}>{entry.risk}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── BOARD REPORT ─────────────────────────────────── */}
        {activeSubmenu === "Board Report" && (
          <motion.div key="board" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.25 }}>
            <PageShell
              search={<SectionSearch value={search} onChange={setSearch} placeholder="Search report..." />}
              header={<SectionHeader title="Board Report" subtitle="Auto-generated executive summary · March 2026" icon={BarChart2} actions={<div className="flex gap-2"><button className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:bg-secondary/50"><Eye className="w-4 h-4"/>Preview</button><button className="flex items-center gap-2 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium"><Download className="w-4 h-4"/>Download PDF</button></div>} />}
              kpi={<KpiStrip items={[{color:"bg-emerald-500",value:`BHD ${(latestMonth.total/1000).toFixed(0)}k`,label:"Revenue"},{color:"bg-blue-500",value:`${latestKPI.occ}%`,label:"Occupancy"},{color:"bg-violet-500",value:latestKPI.nps,label:"NPS"},{color:"bg-amber-500",value:"38%",label:"Net Margin"},{color:"bg-rose-500",value:"485",label:"Loyalty Members"}]} />}
            >
            {/* Report sections */}
            <div className="space-y-4">
              {[
                { title: "1. Financial Highlights", icon: <DollarSign className="w-4 h-4 text-emerald-500"/>, color: "border-emerald-200", content: `Total revenue for March 2026 reached BHD ${(latestMonth.total/1000).toFixed(0)}k, a ${(((latestMonth.total-prevMonth.total)/prevMonth.total)*100).toFixed(1)}% increase vs February. Room revenue contributed ${Math.round(latestMonth.rooms/latestMonth.total*100)}% of total revenue at BHD ${(latestMonth.rooms/1000).toFixed(0)}k. Net profit margin held at 38%, driven by strong F&B performance and cost discipline across all departments.` },
                { title: "2. Operational KPIs", icon: <BarChart2 className="w-4 h-4 text-blue-500"/>, color: "border-blue-200", content: `Occupancy reached ${latestKPI.occ}%, ADR BHD ${latestKPI.adr}, and RevPAR BHD ${latestKPI.revpar} — all exceeding budget targets. NPS score of ${latestKPI.nps} places Singularity Grand in the top 10% of GCC luxury hotels. Housekeeping efficiency maintained at 97%, with zero guest complaints related to room quality.` },
                { title: "3. Guest Intelligence", icon: <Crown className="w-4 h-4 text-amber-500"/>, color: "border-amber-200", content: `485 active loyalty members, including 22 Platinum Elite. Average satisfaction score 9.1/10 across 127 review responses. Sheikh Khalid Al-Zayed celebrated his 50th stay this month — personalised recognition delivered. Repeat guest ratio reached 34%, the highest in property history.` },
                { title: "4. Commercial & Events", icon: <Calendar className="w-4 h-4 text-violet-500"/>, color: "border-violet-200", content: `Events revenue of BHD ${(latestMonth.events/1000).toFixed(0)}k, slightly below budget (-5%) due to one conference postponement. Pipeline for Q2 is strong: 3 confirmed corporate events, 2 weddings, and the Grand Gala contracted for BHD 95,000. Procurement savings of BHD 14,200 from consolidated supplier negotiations.` },
                { title: "5. ESG Progress", icon: <Leaf className="w-4 h-4 text-emerald-500"/>, color: "border-emerald-200", content: `Green Key certification renewed for the 4th consecutive year. Solar coverage reached 28% (target 40% by Q3). Carbon footprint at 186 tCO₂e — above target, addressed via HVAC upgrade scheduled May 2026. Zero-single-use-plastic initiative 100% complete. Food waste reduced 8.3% YoY.` },
                { title: "6. Outlook & Risks", icon: <Target className="w-4 h-4 text-red-500"/>, color: "border-red-200", content: `Q2 forecast: BHD 441–495k (base–optimistic) with Bahrain Grand Prix expected to drive a 12-15% spike in April. Two new hotel openings in Manama in Q3 — proactive rate strategy and loyalty activation planned. FX risk: GBP softness may affect UK corporate spend. Board action requested: approval for water recycling system capex BHD 180,000.` },
              ].map(section=>(
                <div key={section.title} className={cn("bg-card rounded-2xl border-l-4 p-5 shadow-sm",section.color)}>
                  <div className="flex items-center gap-2 mb-2">{section.icon}<h3 className="font-bold text-foreground">{section.title}</h3></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
            <div className="bg-secondary/40 rounded-2xl p-4 text-center text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 inline mr-1.5 text-violet-500"/>Report auto-generated by Singularity AI · Reviewed by GM before distribution · Approved for board circulation
            </div>
            </PageShell>
          </motion.div>
        )}

        {/* ── KNOWLEDGE BASE ─────────────────────────────── */}
        {activeSubmenu === "Knowledge Base" && <KnowledgeBaseView />}

      </AnimatePresence>
  );
}

function KnowledgeBaseView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAIResponse, setShowAIResponse] = useState(false);

  const documents = [
    { id: 1, title: "Front Desk Manual", category: "Procedures", pages: 28, lastAccessed: "2026-03-24" },
    { id: 2, title: "F&B Training Guide", category: "Training", pages: 45, lastAccessed: "2026-03-23" },
    { id: 3, title: "Employee Handbook", category: "Policies", pages: 62, lastAccessed: "2026-03-22" },
    { id: 4, title: "Fire Safety Procedure", category: "Compliance", pages: 18, lastAccessed: "2026-03-21" },
    { id: 5, title: "Supplier Contracts Index", category: "Contracts", pages: 35, lastAccessed: "2026-03-20" },
    { id: 6, title: "Q4 2025 Audit Report", category: "Reports", pages: 52, lastAccessed: "2026-03-19" },
    { id: 7, title: "Q3 2025 Audit Report", category: "Reports", pages: 48, lastAccessed: "2026-03-15" },
    { id: 8, title: "Brand Guidelines", category: "Procedures", pages: 41, lastAccessed: "2026-03-18" },
    { id: 9, title: "F&B Menu Engineering Guide", category: "Training", pages: 55, lastAccessed: "2026-03-17" },
    { id: 10, title: "Revenue Management Playbook", category: "Procedures", pages: 72, lastAccessed: "2026-03-14" },
    { id: 11, title: "Health & Safety Policy", category: "Policies", pages: 39, lastAccessed: "2026-03-12" },
    { id: 12, title: "IT Security Policy", category: "Compliance", pages: 44, lastAccessed: "2026-03-11" },
    { id: 13, title: "Housekeeping Standards", category: "Procedures", pages: 31, lastAccessed: "2026-03-10" },
    { id: 14, title: "Guest Complaint Protocol", category: "Procedures", pages: 22, lastAccessed: "2026-03-09" },
    { id: 15, title: "Procurement Policy", category: "Policies", pages: 27, lastAccessed: "2026-03-08" },
  ];

  const recentSearches = ["check-in procedure", "overtime policy", "supplier payment terms", "VIP protocol"];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Procedures", "Policies", "Contracts", "Reports", "Training", "Compliance"];

  return (
    <motion.div key="knowledge-base" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <SectionHeader title="Knowledge Base" />
          <p className="text-sm text-muted-foreground mt-0.5">Find everything you need about hotel operations</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAIResponse(e.target.value.length > 0);
            }}
            placeholder="Search documents or ask anything about hotel operations..."
            className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
          />
        </div>
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Response Card */}
      {showAIResponse && searchQuery.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-200 p-5">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-2">AI Response</p>
              <p className="text-sm text-foreground mb-3">
                Based on your search "{searchQuery}", here is what I found: Check-in procedures are documented in the Front Desk Manual (28 pages) and follow our standard 3-step verification process.
              </p>
              <div className="flex gap-2">
                <span className="inline-block px-2 py-1 bg-white rounded-lg text-xs font-medium text-violet-700 border border-violet-200">From: Front Desk Manual</span>
                <span className="inline-block px-2 py-1 bg-white rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200">Confidence: 94%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Searches */}
      {searchQuery.length === 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search) => (
              <button
                key={search}
                onClick={() => setSearchQuery(search)}
                className="px-3 py-1.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground hover:bg-secondary transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Document Grid */}
      <div>
        <p className="text-sm font-medium text-foreground mb-4">{filteredDocs.length} Documents Found</p>
        <div className="grid grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-card rounded-2xl border border-border p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className="bg-violet-100 rounded-xl p-2.5 shrink-0">
                  <FileText className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-violet-600 transition-colors truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{doc.category} • {doc.pages} pages</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Updated {new Date(doc.lastAccessed).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Accessed */}
      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <SectionHeader title="Recently Accessed" />
        </div>
        <div className="divide-y divide-border/50">
          {documents.slice(0, 5).map((doc, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-secondary/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-violet-100 rounded-lg p-2">
                  <FileText className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{doc.category} • {doc.lastAccessed}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
