import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, X, ArrowRight, CheckCircle2, AlertTriangle,
  TrendingUp, RefreshCw, Loader2, Send, User, Bot,
  ChevronRight, Zap,
} from "lucide-react";
import { cn } from "../lib/utils";

interface AgenticAIPanelProps {
  department: string;
  onClose: () => void;
}

interface Insight {
  type: "warning" | "success" | "info";
  title: string;
  body: string;
  action: string;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
  time: string;
}

// ── Contextual insights per department ───────────────────────────────────────
function buildInsights(department: string): Insight[] {
  switch (department) {
    case "Front Desk":
      return [
        { type: "warning", title: "Overbooking Risk", body: "Standard Kings at 98% tonight — 2 walk-ins possible. Upgrading rooms 312 and 314 to Junior Suite proactively costs nothing and earns loyalty points.", action: "Upgrade Now" },
        { type: "info", title: "VIP Arrivals Today", body: "Sheikh Khalid Al-Zayed arrives at 15:30. Room 1001 needs Arabic dates, rose water, and a welcome note in Arabic. Housekeeping not yet notified.", action: "Alert Housekeeping" },
        { type: "success", title: "Check-Out Peak at 11AM", body: "14 departures before noon. Recommend opening a dedicated express check-out lane to reduce lobby congestion by ~35%.", action: "Open Express Lane" },
      ];
    case "Food & Beverage":
      return [
        { type: "success", title: "High-Margin Items to Push", body: "Grilled Salmon (+42%), Chef's Pasta (+38%), Chocolate Fondant (+55%) are your top margin items. Feature all three in tonight's daily specials.", action: "Update Specials" },
        { type: "warning", title: "Salmon Running Low", body: "At current consumption, salmon fillets will deplete in ~3 hours — before dinner service. 12 kg needed urgently from Al-Jazira Seafood.", action: "Order Now" },
        { type: "info", title: "Upsell Opportunity", body: "Table 8 ordered a bottle of Perrier. 73% of guests who order still water upgrade to sparkling when offered. Coach server to suggest.", action: "Coach Server" },
      ];
    case "Housekeeping":
      return [
        { type: "warning", title: "3 Rooms Falling Behind", body: "Rooms 205, 318, 421 are departure rooms not yet cleaned — checkout was 2+ hours ago. 2 new arrivals assigned to these rooms today.", action: "Reassign Team" },
        { type: "info", title: "Energy Waste Detected", body: "IoT sensors show AC running in 5 vacant rooms (301, 305, 412, 415, 501). Estimated cost: BHD 48/hr. Recommend auto-shutoff protocol.", action: "Auto-Shutoff" },
        { type: "success", title: "Linen Efficiency Win", body: "Opt-out linen programme saved 420 litres of water this week — equivalent to 3 days of guest consumption. On track for Green Key target.", action: "View ESG Impact" },
      ];
    case "Finance":
      return [
        { type: "success", title: "Revenue Ahead of Budget", body: "March revenue BHD 444k vs budget BHD 421k (+5.4%). Driven by events outperformance. Night audit balanced — zero discrepancies.", action: "View P&L" },
        { type: "warning", title: "3 Overdue Invoices", body: "Al-Noor Events (BHD 8,200, 45 days), Gulf Traders (BHD 3,100, 32 days), TechCorp (BHD 1,800, 30 days). Total at risk: BHD 13,100.", action: "Send Reminders" },
        { type: "info", title: "FX Opportunity", body: "GBP/BHD rate at 5-month high. 3 UK corporate accounts paying in GBP — invoicing now saves approximately BHD 820 vs invoicing next week.", action: "Invoice Today" },
      ];
    case "Guests":
      return [
        { type: "info", title: "Birthday in 6 Days", body: "Priya Sharma (Room 208) turns 32 on April 8. Suggested: complimentary birthday cake + Junior Suite upgrade. Budget: BHD 45.", action: "Create Moment" },
        { type: "warning", title: "Unanswered Review", body: "Ahmed Al-Farhan left a 3-star review on Booking.com 18 hours ago mentioning slow room service. No response yet — window closing.", action: "Respond Now" },
        { type: "success", title: "Loyalty Upgrade Alert", body: "James Harrington reaches Platinum tier after this stay (4,950 → 5,000 points). Notify him at check-out with a personalised letter.", action: "Prepare Letter" },
      ];
    case "Events":
      return [
        { type: "warning", title: "AV Setup Not Confirmed", body: "Grand Ballroom — Al-Noor Conference (Apr 5, 200 pax) — AV team hasn't confirmed setup time. Event is in 3 days.", action: "Confirm with AV" },
        { type: "success", title: "High-Value Pipeline", body: "Q2 event pipeline: BHD 287,000 across 8 events. Al-Sayed Wedding (BHD 95k) still in negotiation — follow-up due today.", action: "Follow Up" },
        { type: "info", title: "Catering Upsell", body: "Al-Noor Conference ordered standard buffet (BHD 22/head). Premium option (BHD 34/head) includes live cooking station — acceptance rate 61%.", action: "Propose Upgrade" },
      ];
    case "Procurement":
      return [
        { type: "warning", title: "3 Items at Reorder Level", body: "Minibar sodas (42 units left, reorder at 50), bath amenity sets (28 left, reorder at 30), coffee capsules (15 left, reorder at 25).", action: "Raise POs" },
        { type: "info", title: "Supplier Savings Opportunity", body: "Gulf Fresh Produce charges BHD 4.20/kg for tomatoes. Current market rate is BHD 3.10/kg. Renegotiating could save BHD 1,800/month.", action: "Renegotiate" },
        { type: "success", title: "PO Approval Pending", body: "PO-2026-0044 (HVAC filters, BHD 2,400 — SkyTech HVAC) awaiting your approval. Lead time 5 days — needed before next month's PM schedule.", action: "Approve PO" },
      ];
    case "Comms":
      return [
        { type: "warning", title: "4 Requests Unanswered >1hr", body: "Rooms 208 (extra towels, 1h 22m), 315 (pillow menu, 1h 05m), 501 (valet, 58m), 102 (wake-up call, 1h 11m). SLA is 45 mins.", action: "Escalate to Supervisor" },
        { type: "info", title: "Broadcast Timing", body: "Best engagement for in-app broadcasts: 7–8 PM (guests returning from dinner). Schedule tonight's spa promotion for 7:15 PM.", action: "Schedule Broadcast" },
        { type: "success", title: "Concierge Win", body: "12 restaurant reservations made this week through concierge. Estimated ancillary revenue generated: BHD 1,440. Track this as a KPI.", action: "Add to Report" },
      ];
    case "Sales & Revenue":
      return [
        { type: "info", title: "Channel Rebalancing", body: "Booking.com at 34% of mix while direct is only 18%. Each 1% shift to direct saves ~BHD 3,200/month in commissions. 5 quick wins available.", action: "View Channel Plan" },
        { type: "success", title: "Weekend Rate Opportunity", body: "Demand signals show Apr 11–12 weekend tracking 18% above last year's pace. Rates currently set same as weekdays — recommend +15% uplift.", action: "Raise Rates" },
        { type: "warning", title: "Corporate Contracts Expiring", body: "3 corporate rate agreements expire April 30: Gulf Air (BHD 125/night), BAPCO (BHD 118/night), Zain Group (BHD 132/night). Renewal discussions not started.", action: "Schedule Meetings" },
      ];
    case "Team":
      return [
        { type: "warning", title: "3 Absences Today", body: "3 housekeeping staff called in sick on a peak checkout day (88% occ). 2 on-call team members available — recommend activating both now.", action: "Call In Staff" },
        { type: "info", title: "Training Deadline Approaching", body: "Fire safety refresher training due for 8 team members by April 15. Only 3 have completed it. Online module takes 25 minutes.", action: "Send Reminders" },
        { type: "success", title: "Payroll Ready to Approve", body: "March payroll processed: 47 employees, BHD 124,800 total. 2 overtime exceptions flagged for review. Approval deadline: April 5.", action: "Review & Approve" },
      ];
    case "Maintenance":
      return [
        { type: "warning", title: "Elevator A PM Overdue", body: "Monthly preventive maintenance for Elevator A is 2 days overdue. Regulatory inspection due April 20 — risk of non-compliance.", action: "Schedule Now" },
        { type: "info", title: "Generator Needs Attention", body: "Generator health check flagged. Last service: 27 days ago. With 3 upcoming large events, recommend inspection before April 10.", action: "Create Work Order" },
        { type: "success", title: "Energy Saving Alert", body: "HVAC optimisation from last month's upgrade reduced electricity consumption by 5.8% — saving BHD 1,240 this month.", action: "View ESG Report" },
      ];
    case "Portfolio":
      return [
        { type: "success", title: "Chain RevPAR Leading Market", body: "Portfolio RevPAR at BHD 142 vs comp set BHD 121 (+17.4%). Maldives Resort driving the outperformance at BHD 820/night ADR.", action: "View Full Report" },
        { type: "warning", title: "Colombo Transfer Request", body: "Guest Priya Sharma (Manama → Colombo, Apr 12) — cross-property transfer not yet acknowledged by City Colombo team. 36hrs pending.", action: "Follow Up" },
        { type: "info", title: "Dubai Opening Milestone", body: "Boutique Dubai hits 6-month mark on April 8. Recommend a performance review deck for the board — occupancy trending to 81%.", action: "Prepare Deck" },
      ];
    case "Security":
      return [
        { type: "warning", title: "Overstay Visitor", body: "Lisa Wong (Booking.com property review) checked in at 14:00 and has not checked out. Host (Ahmed Al-Mansouri) left at 16:30. Follow up required.", action: "Contact Host" },
        { type: "info", title: "Patrol Gap Detected", body: "Back-of-house patrol at 03:00 was missed due to radio malfunction. Recommend compensatory check before morning shift handover.", action: "Schedule Check" },
        { type: "success", title: "All Keys Accounted For", body: "Master keys MK-001 and FM-03 returned by outgoing shift. 6/6 engineering keys returned on schedule. No exceptions.", action: "Log Confirmation" },
      ];
    case "Insights":
      return [
        { type: "success", title: "Ahead of Budget — All Departments", body: "March final: BHD 444k vs BHD 421k budget (+5.4%). Net profit margin 38%. Strong Q2 pipeline — base forecast BHD 1.38M Apr–Jun.", action: "View Board Report" },
        { type: "info", title: "NPS at All-Time High", body: "Guest NPS reached 86 in March — top 8% of GCC luxury hotels. Key driver: front desk personalisation and F&B quality scores.", action: "Share with Team" },
        { type: "warning", title: "ESG Carbon Target at Risk", body: "Carbon footprint 186 tCO₂e vs 170 target. HVAC upgrade in May expected to close the gap — but Q1 will miss target if unaddressed.", action: "Review ESG Plan" },
      ];
    default:
      return [
        { type: "info", title: "Analysis Complete", body: `AI has scanned ${department} operations and identified 3 efficiency opportunities worth an estimated BHD 2,400/month.`, action: "Review Findings" },
        { type: "success", title: "All Systems Normal", body: "No critical alerts at this time. Running background analysis on historical patterns to surface predictive recommendations.", action: "View Analytics" },
      ];
  }
}

// ── Canned AI chat responses per question type ───────────────────────────────
const quickReplies: Record<string, string> = {
  "What's our occupancy tonight?": "Tonight's occupancy is tracking at 88% — 132 of 150 rooms confirmed. 3 arrivals still expected. Standard Kings are fully booked; 4 Deluxe Doubles and 2 Junior Suites remain available.",
  "Show me today's revenue": "Today's revenue as of 14:30: BHD 18,420. Rooms: BHD 12,800 (69.5%), F&B: BHD 3,640 (19.8%), Spa: BHD 1,200 (6.5%), Other: BHD 780 (4.2%). Pacing +6.8% vs same day last month.",
  "Any VIPs I should know about?": "3 VIPs on property: Sheikh Khalid Al-Zayed (Room 1001 — Platinum Elite, 49th stay), Elena Marchetti (Room 501 — Platinum, business), Noura Al-Rashid (Room 308 — Platinum). Sheikh Khalid prefers Arabic music in the room.",
  "What needs my attention?": "Top 3 right now: (1) 4 guest requests unanswered >1hr, (2) Elevator A PM overdue by 2 days, (3) Al-Noor Conference AV setup unconfirmed for April 5. Want me to escalate all three?",
};

const defaultReply = (q: string, dept: string) =>
  `Analysing ${dept} data for: "${q}"… Based on current operations, I recommend reviewing the relevant KPIs in your dashboard. For deeper analysis, this would connect to your live property data feed. Want me to summarise the current ${dept} status instead?`;

// ── Component ─────────────────────────────────────────────────────────────────
export function AgenticAIPanel({ department, onClose }: AgenticAIPanelProps) {
  const [executedActions, setExecutedActions] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: `Hi! I'm monitoring **${department}** operations. Here are my top recommendations right now — or ask me anything below.`, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const insights = buildInsights(department);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleAction = (action: string) => setExecutedActions(prev => new Set(prev).add(action));

  const sendMessage = (text?: string) => {
    const msg = text ?? chatInput.trim();
    if (!msg) return;
    setChatInput("");
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: msg, time }]);
    setAiTyping(true);
    setTimeout(() => {
      const reply = quickReplies[msg] ?? defaultReply(msg, department);
      setMessages(prev => [...prev, { role: "ai", text: reply, time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }]);
      setAiTyping(false);
    }, 900 + Math.random() * 600);
  };

  const iconMap: Record<Insight["type"], React.JSX.Element> = {
    warning: <div className="bg-amber-100 p-2 rounded-full text-amber-600 shrink-0"><AlertTriangle className="w-4 h-4" /></div>,
    success: <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0"><CheckCircle2 className="w-4 h-4" /></div>,
    info: <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0"><TrendingUp className="w-4 h-4" /></div>,
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full flex flex-col shadow-2xl z-30 overflow-hidden" style={{ animation: "slideInRight 0.3s ease-out" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-white/20 rounded-lg p-1.5"><Sparkles className="w-4 h-4" /></div>
          <div>
            <p className="font-bold text-sm leading-none">Singularity AI</p>
            <p className="text-white/70 text-xs mt-0.5">{department}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-1 text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full"><Zap className="w-2.5 h-2.5"/>Live</span>
          <button onClick={handleRefresh} className={cn("text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors", refreshing && "animate-spin")}><RefreshCw className="w-3.5 h-3.5" /></button>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Insight cards */}
        {!refreshing ? (
          <div className="p-4 space-y-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Sparkles className="w-3 h-3"/>AI Recommendations</p>
            {insights.map((ins, i) => (
              <div key={i} className="bg-background border border-border rounded-xl p-3.5 shadow-sm space-y-2.5">
                <div className="flex items-start gap-2.5">
                  {iconMap[ins.type]}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground">{ins.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{ins.body}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAction(ins.action)}
                  disabled={executedActions.has(ins.action)}
                  className={cn(
                    "w-full py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5",
                    executedActions.has(ins.action)
                      ? "bg-emerald-100 text-emerald-700 cursor-default"
                      : "bg-violet-600 text-white hover:bg-violet-700"
                  )}
                >
                  {executedActions.has(ins.action)
                    ? <><CheckCircle2 className="w-3 h-3"/>Done</>
                    : <>{ins.action}<ArrowRight className="w-3 h-3"/></>}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-7 h-7 animate-spin text-violet-500" />
            <p className="text-sm">Analysing live data…</p>
          </div>
        )}

        {/* Chat messages */}
        <div className="p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1"><Bot className="w-3 h-3"/>Assistant</p>
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5", m.role === "ai" ? "bg-gradient-to-br from-violet-500 to-indigo-600" : "bg-secondary border border-border")}>
                {m.role === "ai" ? <Sparkles className="w-3 h-3 text-white" /> : <User className="w-3 h-3 text-muted-foreground" />}
              </div>
              <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed", m.role === "ai" ? "bg-secondary/60 text-foreground rounded-tl-none" : "bg-violet-600 text-white rounded-tr-none")}>
                {m.text}
                <div className={cn("text-[10px] mt-1 opacity-60", m.role === "user" ? "text-right" : "")}>{m.time}</div>
              </div>
            </div>
          ))}
          {aiTyping && (
            <div className="flex gap-2 items-center">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0"><Sparkles className="w-3 h-3 text-white"/></div>
              <div className="bg-secondary/60 rounded-2xl rounded-tl-none px-3 py-2">
                <div className="flex gap-1 items-center h-4">{[0,1,2].map(j=><div key={j} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{animationDelay:`${j*150}ms`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-3 pt-2 border-t border-border bg-card">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {["What's our occupancy tonight?", "Any VIPs I should know about?", "What needs my attention?"].map(q => (
            <button key={q} onClick={() => sendMessage(q)} className="text-[10px] bg-secondary hover:bg-secondary/80 border border-border text-muted-foreground rounded-full px-2 py-1 transition-colors flex items-center gap-1 leading-none">
              <ChevronRight className="w-2.5 h-2.5 shrink-0"/>{q}
            </button>
          ))}
        </div>
        {/* Chat input */}
        <div className="flex gap-2 pb-3">
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask anything…"
            className="flex-1 text-xs bg-secondary border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-muted-foreground text-foreground"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!chatInput.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl px-3 py-2 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
