import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import {
  Palette,
  Building,
  User,
  Plug,
  ShieldCheck,
  Save,
  RotateCcw,
  Globe,
  Clock,
  Bell,
  Database,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { SectionHeader, PageShell } from "../components/shared";
import { Settings as SettingsIcon } from "lucide-react";

interface ConfigurationProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

type Tab = "Appearance" | "Property Branding" | "User Preferences" | "Integrations" | "System Settings";

const TABS: { id: Tab; icon: React.ElementType }[] = [
  { id: "Appearance", icon: Palette },
  { id: "Property Branding", icon: Building },
  { id: "User Preferences", icon: User },
  { id: "Integrations", icon: Plug },
  { id: "System Settings", icon: ShieldCheck },
];

export function Configuration({ aiEnabled, activeSubmenu = "Appearance" }: ConfigurationProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Appearance");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PageShell
      header={
        <SectionHeader
          title="Configuration"
          subtitle="Personalise your workspace and system settings"
          icon={SettingsIcon}
          actions={
            <div className="flex items-center gap-3">
              <AnimatePresence>
                {saved && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Saved!
                  </motion.div>
                )}
              </AnimatePresence>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          }
        />
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/60 p-1 rounded-xl w-fit mb-6">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Appearance" && <AppearanceTab />}
          {activeTab === "Property Branding" && <PropertyBrandingTab />}
          {activeTab === "User Preferences" && <UserPreferencesTab />}
          {activeTab === "Integrations" && <IntegrationsTab />}
          {activeTab === "System Settings" && <SystemSettingsTab />}
        </motion.div>
      </AnimatePresence>
    </PageShell>
  );
}

// ─── Appearance ─────────────────────────────────────────────────────────────

const ACCENT_PRESETS = [
  { name: "Violet", primary: "#7c3aed", accent: "#06b6d4" },
  { name: "Blue", primary: "#2563eb", accent: "#7c3aed" },
  { name: "Emerald", primary: "#059669", accent: "#0284c7" },
  { name: "Rose", primary: "#e11d48", accent: "#f59e0b" },
  { name: "Amber", primary: "#d97706", accent: "#059669" },
  { name: "Indigo", primary: "#4338ca", accent: "#06b6d4" },
];

function ColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">{value.toUpperCase()}</p>
      </div>
      <label className="cursor-pointer relative">
        <div
          className="w-10 h-10 rounded-xl border-2 border-border shadow-sm hover:scale-105 transition-transform"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>
    </div>
  );
}

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-semibold mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm border transition-all",
              value === opt.value
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AppearanceTab() {
  const theme = useThemeStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">

      {/* Dark Mode Toggle */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary rounded-xl p-2.5">
              {theme.darkMode ? <Moon className="w-5 h-5 text-violet-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <p className="text-sm font-semibold">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark interface</p>
            </div>
          </div>
          <button
            onClick={() => theme.set({ darkMode: !theme.darkMode })}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
              theme.darkMode ? "bg-violet-600" : "bg-input"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                theme.darkMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Accent Presets */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Colour Presets" className="mb-4" />
        <div className="grid grid-cols-6 gap-3">
          {ACCENT_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => theme.set({ primaryColor: preset.primary, accentColor: preset.accent })}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                theme.primaryColor === preset.primary
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-foreground/30"
              )}
            >
              <div
                className="w-8 h-8 rounded-full shadow-sm"
                style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})` }}
              />
              <span className="text-xs font-medium text-muted-foreground">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Custom Colors" className="mb-4" />
        <ColorSwatch label="Primary Color" value={theme.primaryColor} onChange={v => theme.set({ primaryColor: v })} />
        <ColorSwatch label="Accent Color" value={theme.accentColor} onChange={v => theme.set({ accentColor: v })} />
        <ColorSwatch label="Background Color" value={theme.bgColor} onChange={v => theme.set({ bgColor: v })} />
        <ColorSwatch label="Surface Color" value={theme.surfaceColor} onChange={v => theme.set({ surfaceColor: v })} />
        <ColorSwatch label="Text Color" value={theme.textColor} onChange={v => theme.set({ textColor: v })} />
        <button
          onClick={theme.reset}
          className="mt-4 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to defaults
        </button>
      </div>

      {/* Typography & Layout */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Typography & Layout" className="mb-4" />

        <RadioGroup
          label="Font Family"
          options={[
            { value: "Inter", label: "Inter" },
            { value: "Poppins", label: "Poppins" },
            { value: "DM Sans", label: "DM Sans" },
            { value: "Manrope", label: "Manrope" },
          ]}
          value={theme.fontFamily}
          onChange={v => theme.set({ fontFamily: v })}
        />

        <RadioGroup
          label="Font Size"
          options={[
            { value: "sm", label: "Small" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Large" },
            { value: "xl", label: "XL" },
          ]}
          value={theme.fontSize}
          onChange={v => theme.set({ fontSize: v })}
        />

        <RadioGroup
          label="Sidebar Width"
          options={[
            { value: "compact", label: "Compact" },
            { value: "normal", label: "Normal" },
            { value: "wide", label: "Wide" },
          ]}
          value={theme.sidebarWidth}
          onChange={v => theme.set({ sidebarWidth: v })}
        />

        <RadioGroup
          label="Border Radius"
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "SM" },
            { value: "md", label: "MD" },
            { value: "lg", label: "LG" },
            { value: "xl", label: "XL" },
            { value: "full", label: "Full" },
          ]}
          value={theme.borderRadius}
          onChange={v => theme.set({ borderRadius: v })}
        />

        <RadioGroup
          label="Shadow Intensity"
          options={[
            { value: "none", label: "None" },
            { value: "sm", label: "Subtle" },
            { value: "md", label: "Medium" },
            { value: "lg", label: "Strong" },
          ]}
          value={theme.shadowIntensity}
          onChange={v => theme.set({ shadowIntensity: v })}
        />
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Live Preview" className="mb-4" />
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="h-10 flex items-center px-4 gap-3" style={{ backgroundColor: theme.primaryColor }}>
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <span className="text-white text-xs font-semibold ml-2">{theme.propertyName || "Hotel Singularity"}</span>
          </div>
          <div className="p-6" style={{ backgroundColor: theme.bgColor }}>
            <p className="text-sm font-semibold mb-3" style={{ color: theme.textColor }}>Dashboard Overview</p>
            <div className="grid grid-cols-3 gap-3">
              {["Occupancy", "Revenue", "Guests"].map((label, i) => (
                <div
                  key={label}
                  className="rounded-xl p-3 border"
                  style={{ backgroundColor: theme.surfaceColor, borderColor: "#e2e8f0" }}
                >
                  <p className="text-xs" style={{ color: theme.textColor, opacity: 0.6 }}>{label}</p>
                  <p className="text-lg font-bold mt-1" style={{ color: theme.primaryColor }}>
                    {["87%", "$24.5K", "142"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Property Branding ───────────────────────────────────────────────────────

function PropertyBrandingTab() {
  const theme = useThemeStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Property Identity" className="mb-6" />
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Hotel Name</label>
            <input
              type="text"
              value={theme.propertyName}
              onChange={e => theme.set({ propertyName: e.target.value })}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tagline</label>
            <input
              type="text"
              value={theme.tagline}
              onChange={e => theme.set({ tagline: e.target.value })}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Logo</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" className="h-16 mx-auto mb-3 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-secondary rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Building className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <label className="cursor-pointer inline-block px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors">
                Upload Logo
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              <p className="text-xs text-muted-foreground mt-2">PNG, SVG or WEBP recommended</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Localisation" className="mb-6" />
        <div className="space-y-4">
          {[
            {
              label: "Language",
              icon: Globe,
              type: "select",
              options: ["English (US)", "English (UK)", "French", "Spanish", "German", "Arabic"],
            },
            {
              label: "Currency",
              icon: null,
              type: "select",
              options: ["USD ($)", "EUR (€)", "GBP (£)", "AED (د.إ)", "JPY (¥)"],
              value: theme.currency,
              onChange: (v: string) => theme.set({ currency: v.split(" ")[0] }),
            },
            {
              label: "Timezone",
              icon: Clock,
              type: "select",
              options: ["America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Asia/Dubai", "Asia/Tokyo"],
              value: theme.timezone,
              onChange: (v: string) => theme.set({ timezone: v }),
            },
          ].map(field => (
            <div key={field.label}>
              <label className="text-sm font-medium mb-1.5 block">{field.label}</label>
              <select
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                value={field.value}
                onChange={e => field.onChange?.(e.target.value)}
              >
                {field.options.map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── User Preferences ────────────────────────────────────────────────────────

function UserPreferencesTab() {
  const theme = useThemeStore();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    maintenance: true,
    revenue: false,
    housekeeping: true,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Date & Time" className="mb-6" />
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Date Format</label>
            <select
              value={theme.dateFormat}
              onChange={e => theme.set({ dateFormat: e.target.value })}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD MMM YYYY">DD MMM YYYY</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Time Format</label>
            <div className="flex gap-2">
              {(["12h", "24h"] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => theme.set({ timeFormat: fmt })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all",
                    theme.timeFormat === fmt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  )}
                >
                  {fmt === "12h" ? "12-Hour (AM/PM)" : "24-Hour"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Dashboard Layout</label>
            <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option>Grid (Default)</option>
              <option>List View</option>
              <option>Compact</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Landing Page</label>
            <select className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30">
              <option>Dashboard</option>
              <option>Front Desk</option>
              <option>Executive</option>
              <option>Sales & Revenue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Notifications" className="mb-6" />
        <div className="space-y-1">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive summaries and alerts via email" },
            { key: "push", label: "Push Notifications", desc: "Browser push alerts for real-time events" },
            { key: "sms", label: "SMS Alerts", desc: "Critical alerts via SMS" },
            { key: "maintenance", label: "Maintenance Requests", desc: "Notify when new requests are submitted" },
            { key: "revenue", label: "Revenue Reports", desc: "Daily revenue digest at 8:00 AM" },
            { key: "housekeeping", label: "Housekeeping Updates", desc: "Room status change notifications" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  notifications[key as keyof typeof notifications] ? "bg-primary" : "bg-input"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                    notifications[key as keyof typeof notifications] ? "translate-x-4" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Integrations ────────────────────────────────────────────────────────────

const INTEGRATIONS = [
  {
    category: "Distribution",
    items: [
      { name: "Channel Manager", desc: "Sync rates & availability with OTAs", status: "connected", logo: "CM" },
      { name: "OTA Connect (Booking.com)", desc: "Direct booking.com API integration", status: "connected", logo: "BK" },
      { name: "Expedia Partner Central", desc: "Expedia property management", status: "disconnected", logo: "EX" },
    ],
  },
  {
    category: "Payments",
    items: [
      { name: "Stripe Payments", desc: "Card processing & guest payments", status: "connected", logo: "ST" },
      { name: "PayPal Business", desc: "PayPal checkout integration", status: "disconnected", logo: "PP" },
    ],
  },
  {
    category: "Communications",
    items: [
      { name: "Email Service (SendGrid)", desc: "Transactional email delivery", status: "connected", logo: "SG" },
      { name: "WhatsApp Business API", desc: "Guest messaging via WhatsApp", status: "disconnected", logo: "WA" },
      { name: "Twilio SMS", desc: "SMS alerts and OTP delivery", status: "disconnected", logo: "TW" },
    ],
  },
  {
    category: "Point of Sale",
    items: [
      { name: "Square POS", desc: "Restaurant & retail POS sync", status: "connected", logo: "SQ" },
    ],
  },
];

function IntegrationsTab() {
  const [statuses, setStatuses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    INTEGRATIONS.forEach(cat => cat.items.forEach(item => { map[item.name] = item.status; }));
    return map;
  });

  const toggle = (name: string) => {
    setStatuses(s => ({ ...s, [name]: s[name] === "connected" ? "disconnected" : "connected" }));
  };

  return (
    <div className="space-y-6 pb-12">
      {INTEGRATIONS.map(cat => (
        <div key={cat.category} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <SectionHeader title={cat.category} className="mb-4" />
          <div className="space-y-3">
            {cat.items.map(item => {
              const connected = statuses[item.name] === "connected";
              return (
                <div key={item.name} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {item.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", connected ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-secondary text-muted-foreground")}>
                      {connected ? "Connected" : "Disconnected"}
                    </span>
                    <button
                      onClick={() => toggle(item.name)}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors", connected ? "border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" : "border-primary text-primary hover:bg-primary/10")}
                    >
                      {connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── System Settings ─────────────────────────────────────────────────────────

function SystemSettingsTab() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    autoLogout: "30",
    sessionTimeout: "8",
    auditRetention: "90",
    backupFrequency: "daily",
  });

  const update = (key: string, value: string) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Security & Sessions" className="mb-6" />
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Auto-Logout (minutes of inactivity)</label>
            <select
              value={settings.autoLogout}
              onChange={e => update("autoLogout", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Max Session Duration (hours)</label>
            <select
              value={settings.sessionTimeout}
              onChange={e => update("sessionTimeout", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">API Key</label>
            <div className="flex items-center gap-2">
              <input
                type={showApiKey ? "text" : "password"}
                value="sk-sing-prod-••••••••••••••••••••••••"
                readOnly
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm font-mono outline-none"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2.5 border border-border rounded-xl hover:bg-secondary transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <SectionHeader title="Data & Compliance" className="mb-6" />
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Audit Log Retention</label>
            <select
              value={settings.auditRetention}
              onChange={e => update("auditRetention", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">1 year</option>
              <option value="forever">Forever</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={e => update("backupFrequency", e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium mb-3">Data Export</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Export Guest Data (CSV)", icon: Database },
                { label: "Export Financial Reports (XLSX)", icon: Download },
                { label: "Export Audit Logs (JSON)", icon: Download },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 border border-border rounded-xl text-sm text-left hover:bg-secondary/40 transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-6">
        <SectionHeader title="Danger Zone" className="mb-2" />
        <p className="text-sm text-red-600/80 dark:text-red-400/70 mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors">
            Clear All Cache
          </button>
          <button className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-800 transition-colors">
            Reset to Factory Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
