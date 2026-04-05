import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Plus, X, UserCheck, Wrench, ShieldAlert, MessageSquare,
  Bed, UtensilsCrossed, Calendar, Package, ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "../lib/utils";

type ActionKey = "checkin" | "workorder" | "incident" | "message" | "roomstatus" | "foodorder" | "booking" | "stockrequest";

interface QuickAction {
  key: ActionKey;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const actions: QuickAction[] = [
  { key: "checkin",      label: "Check In Guest",    icon: <UserCheck className="w-4 h-4"/>,      color: "bg-emerald-500 hover:bg-emerald-600", description: "Walk-in or early arrival" },
  { key: "workorder",    label: "Raise Work Order",  icon: <Wrench className="w-4 h-4"/>,         color: "bg-blue-500 hover:bg-blue-600",       description: "Maintenance task or repair" },
  { key: "incident",     label: "Log Incident",      icon: <ShieldAlert className="w-4 h-4"/>,    color: "bg-red-500 hover:bg-red-600",         description: "Security or safety event" },
  { key: "message",      label: "Guest Message",     icon: <MessageSquare className="w-4 h-4"/>,  color: "bg-violet-500 hover:bg-violet-600",   description: "Send or respond to guest" },
  { key: "roomstatus",   label: "Update Room",       icon: <Bed className="w-4 h-4"/>,            color: "bg-indigo-500 hover:bg-indigo-600",   description: "Change room status" },
  { key: "foodorder",    label: "F&B Order",         icon: <UtensilsCrossed className="w-4 h-4"/>,color: "bg-amber-500 hover:bg-amber-600",     description: "Room service or restaurant" },
  { key: "booking",      label: "New Booking",       icon: <Calendar className="w-4 h-4"/>,       color: "bg-pink-500 hover:bg-pink-600",       description: "Manual reservation" },
  { key: "stockrequest", label: "Stock Request",     icon: <Package className="w-4 h-4"/>,        color: "bg-teal-500 hover:bg-teal-600",       description: "Request supplies or items" },
];

// Mini form fields per action type
const formFields: Record<ActionKey, { label: string; placeholder: string; type?: string }[]> = {
  checkin:      [{ label: "Guest Name", placeholder: "Full name" }, { label: "Room Number", placeholder: "e.g. 214" }, { label: "Nights", placeholder: "1", type: "number" }],
  workorder:    [{ label: "Location", placeholder: "Room / Area" }, { label: "Issue", placeholder: "Describe the fault" }, { label: "Priority", placeholder: "High / Medium / Low" }],
  incident:     [{ label: "Location", placeholder: "Where did it occur?" }, { label: "Description", placeholder: "What happened?" }, { label: "Reported By", placeholder: "Staff name" }],
  message:      [{ label: "Room or Guest", placeholder: "Room 214 or guest name" }, { label: "Channel", placeholder: "WhatsApp / In-App / SMS" }, { label: "Message", placeholder: "Type your message…" }],
  roomstatus:   [{ label: "Room Number", placeholder: "e.g. 318" }, { label: "New Status", placeholder: "Clean / Dirty / OOO / Inspected" }, { label: "Notes", placeholder: "Optional note" }],
  foodorder:    [{ label: "Room Number", placeholder: "e.g. 501" }, { label: "Items", placeholder: "e.g. Club sandwich, Sparkling water" }, { label: "Special Instructions", placeholder: "Allergies, timing…" }],
  booking:      [{ label: "Guest Name", placeholder: "Full name" }, { label: "Check-in Date", placeholder: "DD/MM/YYYY", type: "text" }, { label: "Room Type", placeholder: "Deluxe / Suite / Twin" }],
  stockrequest: [{ label: "Item", placeholder: "e.g. Bath amenity sets" }, { label: "Quantity", placeholder: "e.g. 50 units", type: "number" }, { label: "Department", placeholder: "Housekeeping / F&B…" }],
};

export function QuickActions() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ActionKey | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedAction = actions.find(a => a.key === selected);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSelected(null); setOpen(false); }, 1800);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40" onClick={() => { setOpen(false); setSelected(null); }} />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div key="panel" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden">
            <div className="px-4 py-3.5 border-b border-border flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600">
              <span className="text-white font-bold text-sm">Quick Actions</span>
              <button onClick={() => { setOpen(false); setSelected(null); }} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4"/></button>
            </div>

            <AnimatePresence mode="wait">
              {!selected ? (
                <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-3 grid grid-cols-2 gap-2">
                  {actions.map(action => (
                    <button key={action.key} onClick={() => setSelected(action.key)}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:bg-secondary/60 transition-all text-left group">
                      <div className={cn("p-2 rounded-lg text-white shrink-0 transition-colors", action.color)}>{action.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-tight">{action.label}</p>
                        <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-4">
                  <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground mb-3 flex items-center gap-1 transition-colors">
                    ← Back
                  </button>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn("p-2 rounded-xl text-white shrink-0", selectedAction?.color)}>{selectedAction?.icon}</div>
                    <div><p className="font-bold text-foreground text-sm">{selectedAction?.label}</p><p className="text-xs text-muted-foreground">{selectedAction?.description}</p></div>
                  </div>
                  {submitted ? (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2"/>
                      <p className="font-semibold text-foreground text-sm">Done!</p>
                      <p className="text-xs text-muted-foreground mt-1">Action logged and team notified</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {formFields[selected].map(field => (
                        <div key={field.label}>
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{field.label}</label>
                          <input type={field.type ?? "text"} placeholder={field.placeholder} required
                            className="mt-1 w-full px-3 py-2 text-xs border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-muted-foreground/60"/>
                        </div>
                      ))}
                      <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-1">
                        Submit <ArrowRight className="w-3.5 h-3.5"/>
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => { setOpen(o => !o); setSelected(null); }}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className={cn("fixed bottom-6 right-6 w-13 h-13 rounded-2xl shadow-lg flex items-center justify-center z-50 transition-colors",
          open ? "bg-gray-700 hover:bg-gray-800" : "bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        )}
        style={{ width: 52, height: 52 }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="w-6 h-6 text-white" />
        </motion.div>
      </motion.button>
    </>
  );
}
