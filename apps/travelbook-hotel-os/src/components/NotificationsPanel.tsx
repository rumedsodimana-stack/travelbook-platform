import React, { useState } from "react";
import {
  X, Bell, CheckCheck, AlertTriangle, Info, CheckCircle2,
  BellOff, Clock, Crown, Wrench, UtensilsCrossed, Bed,
  ShieldAlert, Package, Users, Calendar, ArrowRight,
} from "lucide-react";
import { cn } from "../lib/utils";

type Priority = "critical" | "high" | "medium" | "low";
type Category = "VIP" | "Maintenance" | "Housekeeping" | "F&B" | "Security" | "Procurement" | "HR" | "Events" | "System";

interface Notification {
  id: string;
  priority: Priority;
  category: Category;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionLabel?: string;
}

const notifications: Notification[] = [
  { id: "N01", priority: "critical", category: "VIP", title: "Sheikh Khalid Al-Zayed — Arriving in 45 min", message: "Room 1001 amenity setup not confirmed. Arabic dates, rose water, and Al-Oud diffuser required. Housekeeping not yet notified.", time: "Just now", read: false, actionLabel: "Alert Housekeeping" },
  { id: "N02", priority: "critical", category: "Maintenance", title: "Elevator A — Out of Service", message: "Elevator A fault detected on Floor 4. Engineer dispatched. ETA 25 min. 3 guests on Floor 8 may be affected during peak check-out.", time: "4 min ago", read: false, actionLabel: "View Work Order" },
  { id: "N03", priority: "high", category: "Housekeeping", title: "Rooms 205, 318, 421 — Overdue Cleaning", message: "3 departure rooms overdue by 90+ mins. New arrivals check in at 15:00 today. Supervisor Ling Wei has been notified.", time: "12 min ago", read: false, actionLabel: "Reassign Team" },
  { id: "N04", priority: "high", category: "Security", title: "Overstay Visitor — Lisa Wong", message: "Visitor Lisa Wong (Booking.com) checked in at 14:00, still on-site at 18:30. Host Ahmed Al-Mansouri has left the property.", time: "18 min ago", read: false, actionLabel: "Contact Security" },
  { id: "N05", priority: "high", category: "F&B", title: "Salmon Stock Critical — Dinner Service at Risk", message: "Salmon fillet stock at 4 units. Dinner service starts in 2.5 hrs. Al-Jazira Seafood contacted — delivery ETA 17:30.", time: "31 min ago", read: false, actionLabel: "Confirm Delivery" },
  { id: "N06", priority: "medium", category: "VIP", title: "Loyalty Upgrade — James Harrington", message: "Guest James Harrington (Room 412) reaches Platinum tier at check-out. Prepare personalised letter and tier welcome gift.", time: "45 min ago", read: false, actionLabel: "Prepare Gift" },
  { id: "N07", priority: "medium", category: "Procurement", title: "3 Items at Reorder Level", message: "Minibar sodas (42 units), bath sets (28 units), coffee capsules (15 units) all below par. Purchase orders ready for approval.", time: "1 hr ago", read: true, actionLabel: "Approve POs" },
  { id: "N08", priority: "medium", category: "Events", title: "AV Setup Unconfirmed — Al-Noor Conference", message: "Grand Ballroom event on April 5 (200 pax). AV team has not confirmed setup time. Event is in 3 days.", time: "2 hrs ago", read: true, actionLabel: "Follow Up" },
  { id: "N09", priority: "low", category: "HR", title: "Payroll Ready for Approval", message: "March payroll processed: 47 employees, BHD 124,800. 2 overtime exceptions flagged. Approval deadline April 5.", time: "3 hrs ago", read: true, actionLabel: "Review Payroll" },
  { id: "N10", priority: "low", category: "System", title: "Night Audit Completed — April 1", message: "Night audit ran successfully at 02:01. All folios balanced. No discrepancies. Report available in Finance.", time: "Yesterday", read: true },
];

const priorityConfig: Record<Priority, { bar: string; badge: string; label: string }> = {
  critical: { bar: "bg-red-500",    badge: "bg-red-100 text-red-700",    label: "Critical" },
  high:     { bar: "bg-orange-400", badge: "bg-orange-100 text-orange-700", label: "High" },
  medium:   { bar: "bg-amber-400",  badge: "bg-amber-100 text-amber-700",  label: "Medium" },
  low:      { bar: "bg-blue-400",   badge: "bg-blue-100 text-blue-700",    label: "Low" },
};

const categoryIcon: Record<Category, React.ReactNode> = {
  VIP:         <Crown className="w-3.5 h-3.5" />,
  Maintenance: <Wrench className="w-3.5 h-3.5" />,
  Housekeeping:<Bed className="w-3.5 h-3.5" />,
  "F&B":       <UtensilsCrossed className="w-3.5 h-3.5" />,
  Security:    <ShieldAlert className="w-3.5 h-3.5" />,
  Procurement: <Package className="w-3.5 h-3.5" />,
  HR:          <Users className="w-3.5 h-3.5" />,
  Events:      <Calendar className="w-3.5 h-3.5" />,
  System:      <Info className="w-3.5 h-3.5" />,
};

interface NotificationsPanelProps { onClose: () => void; }

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const [items, setItems] = useState(notifications);
  const [filter, setFilter] = useState<"All" | "Unread" | "Critical">("All");

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unreadCount = items.filter(n => !n.read).length;
  const criticalCount = items.filter(n => n.priority === "critical" && !n.read).length;

  const filtered = items.filter(n => {
    if (filter === "Unread") return !n.read;
    if (filter === "Critical") return n.priority === "critical" || n.priority === "high";
    return true;
  });

  return (
    <div className="w-96 bg-card border-l border-border h-full flex flex-col shadow-2xl z-30" style={{ animation: "slideInRight 0.25s ease-out" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h2 className="font-bold text-foreground text-base">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{unreadCount}</span>
            )}
          </div>
          {criticalCount > 0 && (
            <p className="text-xs text-red-600 font-medium mt-0.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/>{criticalCount} critical alert{criticalCount > 1 ? "s" : ""} need attention</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={markAllRead} title="Mark all read" className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"><CheckCheck className="w-4 h-4" /></button>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 py-2 border-b border-border flex gap-2">
        {(["All", "Unread", "Critical"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-colors", filter === f ? "bg-violet-600 text-white" : "text-muted-foreground hover:bg-secondary border border-border")}>
            {f}{f === "Unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <BellOff className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          filtered.map(n => {
            const pCfg = priorityConfig[n.priority];
            return (
              <div key={n.id} onClick={() => markRead(n.id)} className={cn("flex gap-0 cursor-pointer hover:bg-secondary/30 transition-colors relative", !n.read && "bg-violet-50/40 dark:bg-violet-950/20")}>
                {/* Priority bar */}
                <div className={cn("w-1 shrink-0 rounded-l", pCfg.bar)} />
                <div className="flex-1 px-4 py-3.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", pCfg.badge)}>
                        {categoryIcon[n.category]}{n.category}
                      </span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1"><Clock className="w-2.5 h-2.5"/>{n.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                  {n.actionLabel && (
                    <button className="mt-2 flex items-center gap-1 text-xs text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                      {n.actionLabel} <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <button className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center">View full audit log →</button>
      </div>
    </div>
  );
}

export { notifications };
export type { Notification };
