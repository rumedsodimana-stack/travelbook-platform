# Singularity PMS — Design System

> Single source of truth for all UI decisions. Every component must follow these rules.

---

## 1. User Roles & UI Access

### GM (General Manager)
- **Pages visible:** All 8 departments — Front Desk, Housekeeping, Food & Beverage, Sales & Revenue, Human Resources, Engineering, Executive, Finance
- **Actions available:** All CRUD operations, approve/reject workflows, view all financial data, export reports
- **Hidden/Disabled:** Nothing

### DeptManager
- **Pages visible:** Their own department + Executive Overview (read-only)
- **Actions available:** Approve department-level actions, update statuses, view KPIs for their dept, view staff in their dept
- **Hidden/Disabled:** Payroll amounts, cross-department financials, global settings

### Supervisor
- **Pages visible:** Their own department only
- **Actions available:** Update task/room/order statuses, create work orders, view own-dept staff
- **Hidden/Disabled:** Financial tabs, KPI financials, HR (Payroll, Attendance for others), Rate Management

### Staff
- **Pages visible:** Their own department, task-focused views only (no Overview tabs)
- **Actions available:** Update their assigned tasks/rooms/orders only
- **Hidden/Disabled:** All financial data, all KPI cards with revenue, all management tabs, Export buttons

### Finance
- **Pages visible:** Executive > Financials, Sales & Revenue > Overview, Analytics-only views
- **Actions available:** View journal entries, run reports, export financial data
- **Hidden/Disabled:** Operations tabs (room status, arrivals/departures), HR, Engineering

### Admin
- **Pages visible:** System Settings (future), User Management (future)
- **Actions available:** CRUD on users, roles, property settings
- **Hidden/Disabled:** Operational data

---

## 2. Color System

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#8b5cf6` (violet-500) | Buttons, active nav, highlights, badges |
| Primary Dark | `#7c3aed` (violet-600) | Hover on primary elements |
| Background | `#f3f4f6` | Page background |
| Card | `#ffffff` | Card/panel backgrounds |
| Border | `#e5e7eb` | Card borders, dividers |
| Text Primary | `#1f2937` | Headings, body |
| Text Muted | `#6b7280` | Labels, captions, placeholders |
| Success | `#10b981` (emerald-500) | Clean status, success states |
| Warning | `#f59e0b` (amber-500) | Pending, caution states |
| Danger | `#ef4444` (red-500) | Error, cancelled, dirty |
| Info | `#3b82f6` (blue-500) | Informational badges |

### Dark Mode
| Token | Value |
|-------|-------|
| Background | `#0f172a` |
| Card | `#1e293b` |
| Border | `#334155` |
| Text Primary | `#f8fafc` |
| Text Muted | `#94a3b8` |

### KPI Card Gradients
| Card | Gradient |
|------|----------|
| Arrivals | `from-pink-500 to-rose-600` |
| In-House | `from-violet-500 to-purple-600` |
| Departures | `from-emerald-500 to-green-600` |
| Revenue | `from-amber-500 to-yellow-600` |
| Occupancy | `from-blue-500 to-cyan-600` |
| ADR/RevPAR | `from-indigo-500 to-violet-600` |

---

## 3. Typography

| Role | Class |
|------|-------|
| Page Title | `text-xl font-semibold text-foreground` |
| Section Header | `text-lg font-semibold text-foreground` |
| Card Label | `text-xs font-medium text-muted-foreground uppercase tracking-wider` |
| Body | `text-sm text-foreground` |
| Body Muted | `text-sm text-muted-foreground` |
| Micro | `text-xs text-muted-foreground` |
| KPI Value | `text-3xl font-bold text-white` (inside gradient card) |

Font stack: `system-ui, 'DM Sans', -apple-system, sans-serif`

---

## 4. Component Rules

### Cards
```
✅ DO:   rounded-2xl shadow-sm border border-border bg-card p-6
❌ DON'T: rounded-lg, drop-shadow, no border, bg-white (use bg-card)
```

### Buttons
| Variant | Classes |
|---------|---------|
| Primary | `bg-violet-600 hover:bg-violet-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors` |
| Secondary | `bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg px-4 py-2 text-sm font-medium` |
| Danger | `bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium` |
| Ghost | `hover:bg-secondary text-muted-foreground rounded-lg px-3 py-2 text-sm` |
| Icon | `p-2 rounded-lg hover:bg-secondary text-muted-foreground` |

```
❌ DON'T: rounded-full (only for badges/tags), outline variant, border-only buttons
```

### Status Badges
```
Base: px-3 py-1 rounded-full text-xs font-medium

Confirmed / Active / Clean / Paid:    bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400
Pending / In Progress / Warning:      bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400
Cancelled / Error / Dirty / Overdue:  bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400
Neutral / Default / Draft:            bg-secondary text-secondary-foreground
Info / Checked-In / Open:             bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400
```

### Tables
```
Wrapper:  rounded-2xl overflow-hidden bg-card border border-border
Header:   bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider
Row:      hover:bg-secondary/30 transition-colors
Sticky:   sticky top-0 for headers in scrollable tables
```

### Loading Skeletons
```
Always use animate-pulse
Skeleton line: bg-secondary rounded h-4 w-full animate-pulse
Skeleton card: bg-secondary rounded-2xl h-32 animate-pulse
Never show blank screen — skeleton must appear immediately
```

### Empty States
```
Container: flex flex-col items-center justify-center py-16 text-center
Icon:      text-5xl mb-4
Title:     text-lg font-semibold text-foreground mb-2
Message:   text-sm text-muted-foreground mb-6
Action:    Primary button
```

### Forms
```
Input:   bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500
Label:   text-sm font-medium text-foreground block mb-1
Error:   text-xs text-red-500 mt-1
Select:  same as Input + appearance-none
```

### Modals
```
Overlay: fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
Panel:   bg-card rounded-2xl border border-border shadow-xl max-w-lg w-full p-6
Header:  flex justify-between items-center mb-4
```

---

## 5. Page Layout Rules

### Every page must follow this structure:
```tsx
// 1. Sticky header bar
<div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">{actions}</div>
  </div>
  // 2. Submenu tabs (if applicable)
  <div className="flex gap-1 mt-4">{submenus}</div>
</div>

// 3. Page content
<div className="p-6 space-y-6">
  // 4. Filter bar (optional)
  <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
    {filters}
  </div>

  // 5. KPI grid
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {kpiCards}
  </div>

  // 6. Content area
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {mainContent}
  </div>
</div>
```

---

## 6. Animation Rules

- **Page transitions:** `AnimatePresence` + `motion.div` with `initial={{ opacity: 0, y: 8 }}` `animate={{ opacity: 1, y: 0 }}` `exit={{ opacity: 0, y: -8 }}`
- **Submenu transitions:** Keep existing `layoutId="activeSubmenuBg"` spring animation — NEVER change
- **Tables/lists:** NO animation (causes jank with large datasets)
- **Modals:** `motion.div` scale + opacity: `initial={{ scale: 0.95, opacity: 0 }}`
- **KPI cards:** Simple fade-in only, no stagger (performance)

---

## 7. API / Data Rules

```tsx
// ✅ Pattern for reads
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', params],
  queryFn: () => service.getResource(params),
  staleTime: 30_000,
});
const display = data ?? MOCK_FALLBACK;

// ✅ Pattern for writes
const mutation = useMutation({
  mutationFn: service.updateResource,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resource'] }),
});

// ✅ Error display
{error && (
  <div className="bg-card rounded-2xl border border-red-200 p-6 text-center">
    <p className="text-sm text-red-600 mb-3">Unable to load data</p>
    <button onClick={() => refetch()} className="...primary button...">Retry</button>
  </div>
)}
```

---

## 8. AI Panel Rules

- Always fetch current department's live data before calling Gemini
- Prompt must include: current date, property name, actual KPI values
- Max 3 recommendations shown at once
- Each recommendation must have:
  - Icon (emoji)
  - Title (1 line)
  - Description (2 lines max)
  - Execute button (calls relevant mutation or opens modal)
- Loading state: 3 skeleton cards
- Refresh button in panel header

---

## Quick Reference Checklist

Before submitting any component, verify:
- [ ] Cards use `rounded-2xl shadow-sm border border-border bg-card`
- [ ] All buttons match the button table above
- [ ] All status badges use `rounded-full px-3 py-1 text-xs font-medium`
- [ ] Tables have `rounded-2xl overflow-hidden border border-border`
- [ ] Loading skeleton uses `animate-pulse bg-secondary`
- [ ] Empty state has icon + message + action button
- [ ] Page has sticky header with title + subtitle
- [ ] API calls use `useQuery` / `useMutation`
- [ ] Mock data fallback is in place
- [ ] No raw error strings shown in UI
