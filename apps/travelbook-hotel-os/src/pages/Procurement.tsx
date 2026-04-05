import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  ShoppingCart, Package, Truck, CheckCircle2, AlertCircle,
  Search, Filter, Plus, Edit2, Trash2, Download, Eye,
  TrendingUp, TrendingDown, DollarSign, Star, Clock,
  BarChart2, FileText, RefreshCw, ChevronRight, Send,
  Award, AlertTriangle, Archive, Layers
} from "lucide-react";
import { KpiStrip, LegendBar, SectionSearch, SectionHeader, PageShell } from "../components/shared";

interface ProcurementProps {
  aiEnabled: boolean;
  activeSubmenu?: string;
}

type POStatus = "Draft" | "Pending Approval" | "Approved" | "Sent" | "Partial" | "Received" | "Cancelled";
type GRNStatus = "Pending" | "Partial" | "Complete" | "Rejected";
type SupplierStatus = "Active" | "Preferred" | "Probation" | "Suspended";

interface PurchaseOrder {
  id: string;
  supplier: string;
  supplierId: string;
  category: string;
  items: { name: string; qty: number; unit: string; unitPrice: number }[];
  totalValue: number;
  status: POStatus;
  requestedBy: string;
  approvedBy?: string;
  createdDate: string;
  expectedDelivery: string;
  deliveredDate?: string;
  notes: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  rating: number;
  onTimeDelivery: number;
  qualityScore: number;
  totalSpend: number;
  activeOrders: number;
  status: SupplierStatus;
  paymentTerms: string;
  currency: string;
  lastOrder: string;
}

interface GRN {
  id: string;
  poId: string;
  supplier: string;
  receivedBy: string;
  receivedDate: string;
  items: { name: string; ordered: number; received: number; unit: string; condition: "Good" | "Damaged" | "Short" }[];
  status: GRNStatus;
  invoice: string;
  notes: string;
  qcPassed: boolean;
}

interface StockItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  parLevel: number;
  reorderPoint: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastOrdered: string;
  autoReorder: boolean;
  location: string;
}

interface SupplierComparison {
  item: string;
  suppliers: { name: string; price: number; leadTime: number; minOrder: number }[];
}

// ── Sample Data ───────────────────────────────────────────────
const purchaseOrders: PurchaseOrder[] = [
  { id: "PO-2026-041", supplier: "Gulf Food Distributors", supplierId: "SUP001", category: "Food & Beverage", items: [{ name: "Basmati Rice (25kg)", qty: 20, unit: "bag", unitPrice: 28 }, { name: "Olive Oil (5L)", qty: 24, unit: "bottle", unitPrice: 18 }, { name: "Chicken Breast (kg)", qty: 150, unit: "kg", unitPrice: 4.5 }], totalValue: 1507, status: "Approved", requestedBy: "Chef Ahmed", approvedBy: "GM Hassan", createdDate: "2026-03-28", expectedDelivery: "2026-04-03", notes: "Urgent — banquet stock replenishment." },
  { id: "PO-2026-042", supplier: "Al-Manar Cleaning Supplies", supplierId: "SUP002", category: "Housekeeping", items: [{ name: "Laundry Detergent (20L)", qty: 10, unit: "drum", unitPrice: 45 }, { name: "Floor Cleaner (5L)", qty: 20, unit: "bottle", unitPrice: 12 }, { name: "Toilet Rolls (48pk)", qty: 50, unit: "pack", unitPrice: 8.5 }], totalValue: 1115, status: "Sent", requestedBy: "Housekeeper Nadia", approvedBy: "GM Hassan", createdDate: "2026-03-30", expectedDelivery: "2026-04-05", notes: "" },
  { id: "PO-2026-043", supplier: "TechSupply ME", supplierId: "SUP003", category: "Technology", items: [{ name: 'LED TV 55"', qty: 5, unit: "unit", unitPrice: 320 }, { name: "Wireless Router", qty: 10, unit: "unit", unitPrice: 85 }], totalValue: 2450, status: "Pending Approval", requestedBy: "IT Manager Karim", createdDate: "2026-04-01", expectedDelivery: "2026-04-15", notes: "Room upgrade project." },
  { id: "PO-2026-044", supplier: "Royal Linen Co.", supplierId: "SUP004", category: "Linen & Textiles", items: [{ name: "Bath Towel (500gsm)", qty: 200, unit: "piece", unitPrice: 4.2 }, { name: "Bed Sheet Set (King)", qty: 50, unit: "set", unitPrice: 18 }, { name: "Pillow Cases", qty: 100, unit: "pair", unitPrice: 6 }], totalValue: 2540, status: "Received", requestedBy: "Laundry Supervisor", approvedBy: "GM Hassan", createdDate: "2026-03-20", expectedDelivery: "2026-03-27", deliveredDate: "2026-03-26", notes: "Regular quarterly order." },
  { id: "PO-2026-045", supplier: "Bahrain Beverage Co.", supplierId: "SUP005", category: "Food & Beverage", items: [{ name: "Mineral Water (500ml 24pk)", qty: 100, unit: "case", unitPrice: 5 }, { name: "Soft Drinks Assorted (330ml)", qty: 80, unit: "case", unitPrice: 9 }, { name: "Fruit Juice (1L)", qty: 60, unit: "case", unitPrice: 12 }], totalValue: 2420, status: "Partial", requestedBy: "F&B Manager Sara", approvedBy: "GM Hassan", createdDate: "2026-03-25", expectedDelivery: "2026-04-02", notes: "Ongoing standing order." },
  { id: "PO-2026-046", supplier: "Gulf Amenities Ltd", supplierId: "SUP006", category: "Guest Amenities", items: [{ name: "Shampoo (30ml)", qty: 2000, unit: "bottle", unitPrice: 0.45 }, { name: "Body Lotion (30ml)", qty: 2000, unit: "bottle", unitPrice: 0.55 }, { name: "Dental Kit", qty: 1000, unit: "kit", unitPrice: 0.8 }], totalValue: 2800, status: "Draft", requestedBy: "Front Office", createdDate: "2026-04-01", expectedDelivery: "2026-04-10", notes: "" },
  { id: "PO-2026-047", supplier: "Al-Noor Engineering", supplierId: "SUP007", category: "Maintenance", items: [{ name: "HVAC Filter Set", qty: 20, unit: "unit", unitPrice: 35 }, { name: "LED Bulb (Pack 10)", qty: 30, unit: "pack", unitPrice: 22 }], totalValue: 1360, status: "Approved", requestedBy: "Chief Engineer", approvedBy: "GM Hassan", createdDate: "2026-03-29", expectedDelivery: "2026-04-06", notes: "Preventive maintenance stock." },
  { id: "PO-2026-048", supplier: "Gulf Food Distributors", supplierId: "SUP001", category: "Food & Beverage", items: [{ name: "Fresh Salmon (kg)", qty: 80, unit: "kg", unitPrice: 12 }, { name: "Lobster (kg)", qty: 20, unit: "kg", unitPrice: 38 }], totalValue: 1720, status: "Sent", requestedBy: "Chef Ahmed", approvedBy: "GM Hassan", createdDate: "2026-04-01", expectedDelivery: "2026-04-04", notes: "Gala dinner event stock." },
];

const suppliers: Supplier[] = [
  { id: "SUP001", name: "Gulf Food Distributors", category: "Food & Beverage", contact: "Mr. Tariq Mansoor", email: "tariq@gulffood.bh", phone: "+973 1733 9900", country: "Bahrain", rating: 4.7, onTimeDelivery: 94, qualityScore: 92, totalSpend: 68000, activeOrders: 2, status: "Preferred", paymentTerms: "Net 30", currency: "BHD", lastOrder: "2026-04-01" },
  { id: "SUP002", name: "Al-Manar Cleaning Supplies", category: "Housekeeping", contact: "Ms. Fatima Al-Zain", email: "fatima@almanar.bh", phone: "+973 1744 5678", country: "Bahrain", rating: 4.2, onTimeDelivery: 88, qualityScore: 90, totalSpend: 24000, activeOrders: 1, status: "Active", paymentTerms: "Net 15", currency: "BHD", lastOrder: "2026-03-30" },
  { id: "SUP003", name: "TechSupply ME", category: "Technology", contact: "David Kim", email: "david@techsupply.ae", phone: "+971 4 321 9900", country: "UAE", rating: 4.5, onTimeDelivery: 91, qualityScore: 95, totalSpend: 42000, activeOrders: 1, status: "Active", paymentTerms: "Net 45", currency: "USD", lastOrder: "2026-04-01" },
  { id: "SUP004", name: "Royal Linen Co.", category: "Linen & Textiles", contact: "Ms. Aisha Rajab", email: "aisha@royallinen.bh", phone: "+973 1755 3344", country: "Bahrain", rating: 4.8, onTimeDelivery: 97, qualityScore: 98, totalSpend: 55000, activeOrders: 0, status: "Preferred", paymentTerms: "Net 30", currency: "BHD", lastOrder: "2026-03-20" },
  { id: "SUP005", name: "Bahrain Beverage Co.", category: "Food & Beverage", contact: "Mr. Hassan Al-Ali", email: "orders@bbco.bh", phone: "+973 1788 1122", country: "Bahrain", rating: 4.0, onTimeDelivery: 82, qualityScore: 85, totalSpend: 31000, activeOrders: 1, status: "Active", paymentTerms: "Net 15", currency: "BHD", lastOrder: "2026-03-25" },
  { id: "SUP006", name: "Gulf Amenities Ltd", category: "Guest Amenities", contact: "Priya Singh", email: "priya@gulfamenities.ae", phone: "+971 4 456 7788", country: "UAE", rating: 4.6, onTimeDelivery: 93, qualityScore: 94, totalSpend: 48000, activeOrders: 1, status: "Preferred", paymentTerms: "Net 30", currency: "USD", lastOrder: "2026-04-01" },
  { id: "SUP007", name: "Al-Noor Engineering", category: "Maintenance", contact: "Mr. Khalid Noor", email: "k.noor@alnooreng.bh", phone: "+973 3112 4455", country: "Bahrain", rating: 3.8, onTimeDelivery: 75, qualityScore: 80, totalSpend: 18000, activeOrders: 1, status: "Probation", paymentTerms: "Net 30", currency: "BHD", lastOrder: "2026-03-29" },
  { id: "SUP008", name: "Comfort Furniture LLC", category: "Furniture & Fixtures", contact: "Mr. Omar Rashid", email: "omar@comfortfurn.bh", phone: "+973 1733 7711", country: "Bahrain", rating: 4.3, onTimeDelivery: 85, qualityScore: 88, totalSpend: 72000, activeOrders: 0, status: "Active", paymentTerms: "50% advance", currency: "BHD", lastOrder: "2026-02-15" },
];

const grnRecords: GRN[] = [
  { id: "GRN-041", poId: "PO-2026-041", supplier: "Gulf Food Distributors", receivedBy: "Storekeeper Ali", receivedDate: "2026-04-03", items: [{ name: "Basmati Rice (25kg)", ordered: 20, received: 20, unit: "bag", condition: "Good" }, { name: "Olive Oil (5L)", ordered: 24, received: 22, unit: "bottle", condition: "Short" }, { name: "Chicken Breast (kg)", ordered: 150, received: 148, unit: "kg", condition: "Good" }], status: "Partial", invoice: "INV-GFD-2026-0312", notes: "2 bottles of olive oil missing from delivery. Supplier to credit.", qcPassed: true },
  { id: "GRN-044", poId: "PO-2026-044", supplier: "Royal Linen Co.", receivedBy: "Laundry Supervisor", receivedDate: "2026-03-26", items: [{ name: "Bath Towel (500gsm)", ordered: 200, received: 200, unit: "piece", condition: "Good" }, { name: "Bed Sheet Set (King)", ordered: 50, received: 50, unit: "set", condition: "Good" }, { name: "Pillow Cases", ordered: 100, received: 100, unit: "pair", condition: "Good" }], status: "Complete", invoice: "INV-RLC-2026-0289", notes: "All items received in excellent condition.", qcPassed: true },
];

const stockItems: StockItem[] = [
  { id: "STK001", name: "Basmati Rice (25kg)", category: "Food & Beverage", currentStock: 18, parLevel: 30, reorderPoint: 10, unit: "bag", unitCost: 28, supplier: "Gulf Food Distributors", lastOrdered: "2026-03-28", autoReorder: true, location: "Main Store — Bay A" },
  { id: "STK002", name: "Laundry Detergent (20L)", category: "Housekeeping", currentStock: 8, parLevel: 15, reorderPoint: 5, unit: "drum", unitCost: 45, supplier: "Al-Manar Cleaning Supplies", lastOrdered: "2026-03-30", autoReorder: true, location: "Linen Room" },
  { id: "STK003", name: "Bath Towel (500gsm)", category: "Linen & Textiles", currentStock: 340, parLevel: 600, reorderPoint: 200, unit: "piece", unitCost: 4.2, supplier: "Royal Linen Co.", lastOrdered: "2026-03-20", autoReorder: true, location: "Linen Room" },
  { id: "STK004", name: "Shampoo (30ml)", category: "Guest Amenities", currentStock: 820, parLevel: 2000, reorderPoint: 500, unit: "bottle", unitCost: 0.45, supplier: "Gulf Amenities Ltd", lastOrdered: "2026-04-01", autoReorder: true, location: "Amenities Store" },
  { id: "STK005", name: "Mineral Water (500ml 24pk)", category: "Food & Beverage", currentStock: 45, parLevel: 120, reorderPoint: 30, unit: "case", unitCost: 5, supplier: "Bahrain Beverage Co.", lastOrdered: "2026-03-25", autoReorder: true, location: "Main Store — Bay B" },
  { id: "STK006", name: "HVAC Filter Set", category: "Maintenance", currentStock: 12, parLevel: 30, reorderPoint: 8, unit: "unit", unitCost: 35, supplier: "Al-Noor Engineering", lastOrdered: "2026-03-29", autoReorder: false, location: "Engineering Store" },
  { id: "STK007", name: "Toilet Rolls (48pk)", category: "Housekeeping", currentStock: 38, parLevel: 80, reorderPoint: 20, unit: "pack", unitCost: 8.5, supplier: "Al-Manar Cleaning Supplies", lastOrdered: "2026-03-30", autoReorder: true, location: "Housekeeping Store" },
  { id: "STK008", name: "LED Bulb (Pack 10)", category: "Maintenance", currentStock: 24, parLevel: 50, reorderPoint: 15, unit: "pack", unitCost: 22, supplier: "Al-Noor Engineering", lastOrdered: "2026-03-29", autoReorder: false, location: "Engineering Store" },
  { id: "STK009", name: "Coffee Beans (1kg)", category: "Food & Beverage", currentStock: 22, parLevel: 40, reorderPoint: 12, unit: "bag", unitCost: 15, supplier: "Gulf Food Distributors", lastOrdered: "2026-03-28", autoReorder: true, location: "F&B Store" },
  { id: "STK010", name: "Bed Sheet Set (King)", category: "Linen & Textiles", currentStock: 85, parLevel: 120, reorderPoint: 40, unit: "set", unitCost: 18, supplier: "Royal Linen Co.", lastOrdered: "2026-03-20", autoReorder: true, location: "Linen Room" },
  { id: "STK011", name: "Body Lotion (30ml)", category: "Guest Amenities", currentStock: 650, parLevel: 2000, reorderPoint: 500, unit: "bottle", unitCost: 0.55, supplier: "Gulf Amenities Ltd", lastOrdered: "2026-04-01", autoReorder: true, location: "Amenities Store" },
  { id: "STK012", name: "Chicken Breast (kg)", category: "Food & Beverage", currentStock: 62, parLevel: 80, reorderPoint: 25, unit: "kg", unitCost: 4.5, supplier: "Gulf Food Distributors", lastOrdered: "2026-03-28", autoReorder: true, location: "Cold Store" },
];

const supplierComparisons: SupplierComparison[] = [
  { item: "Bath Towel (500gsm)", suppliers: [{ name: "Royal Linen Co.", price: 4.2, leadTime: 5, minOrder: 100 }, { name: "Gulf Textiles", price: 3.9, leadTime: 8, minOrder: 200 }, { name: "Euro Linens Import", price: 5.1, leadTime: 14, minOrder: 50 }] },
  { item: "Shampoo (30ml)", suppliers: [{ name: "Gulf Amenities Ltd", price: 0.45, leadTime: 7, minOrder: 500 }, { name: "Biosense Arabia", price: 0.38, leadTime: 10, minOrder: 1000 }, { name: "Luxury Amenities Co", price: 0.72, leadTime: 5, minOrder: 200 }] },
  { item: "Laundry Detergent (20L)", suppliers: [{ name: "Al-Manar Cleaning", price: 45, leadTime: 3, minOrder: 5 }, { name: "CleanMaster Gulf", price: 42, leadTime: 5, minOrder: 10 }, { name: "Diversey ME", price: 58, leadTime: 7, minOrder: 3 }] },
];

const spendByCategory = [
  { month: "Nov", fb: 18000, housekeeping: 8000, linen: 6000, amenities: 9000, maintenance: 4000 },
  { month: "Dec", fb: 24000, housekeeping: 10000, linen: 12000, amenities: 11000, maintenance: 5000 },
  { month: "Jan", fb: 20000, housekeeping: 9000, linen: 5000, amenities: 10000, maintenance: 3000 },
  { month: "Feb", fb: 22000, housekeeping: 8500, linen: 4000, amenities: 9500, maintenance: 6000 },
  { month: "Mar", fb: 26000, housekeeping: 9000, linen: 7000, amenities: 10000, maintenance: 4500 },
  { month: "Apr", fb: 19000, housekeeping: 7000, linen: 8000, amenities: 10000, maintenance: 4000 },
];

const categorySpendPie = [
  { name: "Food & Beverage", value: 38, color: "#10b981" },
  { name: "Housekeeping", value: 18, color: "#6366f1" },
  { name: "Linen", value: 14, color: "#0ea5e9" },
  { name: "Amenities", value: 20, color: "#f59e0b" },
  { name: "Maintenance", value: 10, color: "#ec4899" },
];

// ── Helper Components ─────────────────────────────────────────
const POStatusBadge = ({ status }: { status: POStatus }) => {
  const map: Record<POStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    "Pending Approval": "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Sent: "bg-blue-100 text-blue-700",
    Partial: "bg-orange-100 text-orange-700",
    Received: "bg-purple-100 text-purple-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[status])}>{status}</span>;
};

const SupplierStatusBadge = ({ status }: { status: SupplierStatus }) => {
  const map: Record<SupplierStatus, string> = {
    Active: "bg-blue-100 text-blue-700",
    Preferred: "bg-emerald-100 text-emerald-700",
    Probation: "bg-amber-100 text-amber-700",
    Suspended: "bg-red-100 text-red-700",
  };
  return <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", map[status])}>{status}</span>;
};

// ── Main Component ────────────────────────────────────────────
export function Procurement({ aiEnabled, activeSubmenu = "Overview" }: ProcurementProps) {
  const [search, setSearch] = useState("");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredPOs = purchaseOrders.filter(po => {
    const matchSearch = po.id.toLowerCase().includes(search.toLowerCase()) ||
      po.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || po.status === filterStatus;
    const matchCat = filterCategory === "All" || po.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const totalPOValue = purchaseOrders.reduce((s, p) => s + p.totalValue, 0);
  const pendingApproval = purchaseOrders.filter(p => p.status === "Pending Approval").length;
  const overdueItems = stockItems.filter(s => s.currentStock <= s.reorderPoint).length;
  const activeSuppliers = suppliers.filter(s => s.status === "Active" || s.status === "Preferred").length;

  return (
    <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeSubmenu === "Overview" && (
          <motion.div key="procov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search procurement..." />}
            header={<SectionHeader icon={ShoppingCart} title="Procurement Overview" subtitle="Spending, suppliers, and stock metrics" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:`BHD ${(totalPOValue/1000).toFixed(1)}k`,label:"MTD Spend"},
              {color:"bg-amber-500",value:pendingApproval,label:"Pending Approvals"},
              {color:"bg-rose-500",value:overdueItems,label:"Low Stock Alerts"},
              {color:"bg-emerald-500",value:activeSuppliers,label:"Active Suppliers"},
              {color:"bg-blue-500",value:purchaseOrders.length,label:"Total POs"},
            ]} />}
          >

            {/* Spend chart + pie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Procurement Spend by Category (6 Months)" />
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={spendByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip formatter={(v: number) => [`BHD ${v.toLocaleString()}`, ""]} />
                    <Legend />
                    <Bar dataKey="fb" name="F&B" fill="#10b981" stackId="a" />
                    <Bar dataKey="housekeeping" name="Housekeeping" fill="#6366f1" stackId="a" />
                    <Bar dataKey="linen" name="Linen" fill="#0ea5e9" stackId="a" />
                    <Bar dataKey="amenities" name="Amenities" fill="#f59e0b" stackId="a" />
                    <Bar dataKey="maintenance" name="Maintenance" fill="#ec4899" radius={[4,4,0,0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Spend Mix" />
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categorySpendPie} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                      {categorySpendPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <LegendBar items={[
                  { label: "Food & Beverage", color: "bg-emerald-100 border-emerald-200" },
                  { label: "Housekeeping", color: "bg-indigo-100 border-indigo-200" },
                  { label: "Linen", color: "bg-sky-100 border-sky-200" },
                  { label: "Amenities", color: "bg-amber-100 border-amber-200" },
                  { label: "Maintenance", color: "bg-pink-100 border-pink-200" },
                ]} />
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <SectionHeader title="Low Stock Alerts" />
                <button className="text-xs text-primary flex items-center gap-1">View All <ChevronRight size={14} /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Item", "Category", "Current Stock", "Reorder Point", "Par Level", "Status", "Auto-Reorder"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stockItems.filter(s => s.currentStock <= s.reorderPoint * 1.5).map(item => (
                      <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={cn("font-semibold", item.currentStock <= item.reorderPoint ? "text-red-500" : "text-amber-500")}>{item.currentStock} {item.unit}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{item.reorderPoint} {item.unit}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.parLevel} {item.unit}</td>
                        <td className="px-4 py-3">
                          {item.currentStock <= item.reorderPoint ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Critical</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Low</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.autoReorder ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-xs"><CheckCircle2 size={12} /> Auto</span>
                          ) : (
                            <button className="text-xs text-primary hover:underline">Order Now</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent POs */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Recent Purchase Orders" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["PO #", "Supplier", "Category", "Value", "Expected", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {purchaseOrders.slice(0, 6).map(po => (
                      <tr key={po.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedPO(po)}>
                        <td className="px-4 py-3 font-medium text-primary">{po.id}</td>
                        <td className="px-4 py-3 text-foreground">{po.supplier}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.category}</td>
                        <td className="px-4 py-3 font-medium text-foreground">BHD {po.totalValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.expectedDelivery}</td>
                        <td className="px-4 py-3"><POStatusBadge status={po.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── PURCHASE ORDERS ── */}
        {activeSubmenu === "Purchase Orders" && (
          <motion.div key="polist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search purchase orders..." />}
            header={<SectionHeader icon={ShoppingCart} title="Purchase Orders" subtitle="Order tracking and management" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:purchaseOrders.length,label:"Total POs"},
              {color:"bg-amber-500",value:pendingApproval,label:"Pending Approval"},
              {color:"bg-emerald-500",value:purchaseOrders.filter(p=>p.status==="Approved").length,label:"Approved"},
              {color:"bg-blue-500",value:purchaseOrders.filter(p=>p.status==="Received").length,label:"Received"},
              {color:"bg-rose-500",value:purchaseOrders.filter(p=>p.status==="Cancelled").length,label:"Cancelled"},
            ]} />}
          >

            {/* Filters */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-4">
              <div className="flex flex-wrap items-center gap-3">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {["All", "Draft", "Pending Approval", "Approved", "Sent", "Partial", "Received", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {["All", "Food & Beverage", "Housekeeping", "Technology", "Linen & Textiles", "Guest Amenities", "Maintenance"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* PO table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["PO #", "Supplier", "Category", "Items", "Total Value", "Requested By", "Expected", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filteredPOs.map(po => (
                      <tr key={po.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-primary cursor-pointer hover:underline" onClick={() => setSelectedPO(po)}>{po.id}</td>
                        <td className="px-4 py-3 text-foreground">{po.supplier}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.category}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.items.length} items</td>
                        <td className="px-4 py-3 font-semibold text-foreground">BHD {po.totalValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.requestedBy}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.expectedDelivery}</td>
                        <td className="px-4 py-3"><POStatusBadge status={po.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {po.status === "Pending Approval" && (
                              <button className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-200 transition-colors">Approve</button>
                            )}
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Download size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PO Detail Panel */}
            {selectedPO && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedPO.id} — {selectedPO.supplier}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPO.category} · Requested by {selectedPO.requestedBy}</p>
                  </div>
                  <button onClick={() => setSelectedPO(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
                </div>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Item", "Qty", "Unit", "Unit Price", "Total"].map(h => <th key={h} className="pb-2 text-left text-xs text-muted-foreground font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {selectedPO.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 text-foreground">{item.name}</td>
                          <td className="py-2 text-foreground">{item.qty}</td>
                          <td className="py-2 text-muted-foreground">{item.unit}</td>
                          <td className="py-2 text-foreground">BHD {item.unitPrice}</td>
                          <td className="py-2 font-medium text-foreground">BHD {(item.qty * item.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-border">
                        <td colSpan={4} className="pt-3 font-semibold text-foreground">Total</td>
                        <td className="pt-3 font-bold text-foreground text-base">BHD {selectedPO.totalValue.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {selectedPO.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800 mb-4">
                    <strong>Notes:</strong> {selectedPO.notes}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  {selectedPO.status === "Pending Approval" && <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600">Approve</button>}
                  {selectedPO.status === "Approved" && <button className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-1"><Send size={14} /> Send to Supplier</button>}
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70">Print PO</button>
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70">Create GRN</button>
                </div>
              </div>
            )}
          </PageShell>
          </motion.div>
        )}

        {/* ── GRN / RECEIVING ── */}
        {activeSubmenu === "GRN & Receiving" && (
          <motion.div key="grn" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search GRNs..." />}
            header={<SectionHeader icon={ShoppingCart} title="Goods Received Notes (GRN)" subtitle="Delivery receiving and quality control" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:grnRecords.length,label:"Total GRNs"},
              {color:"bg-emerald-500",value:grnRecords.filter(g=>g.status==="Complete").length,label:"Complete"},
              {color:"bg-amber-500",value:grnRecords.filter(g=>g.status==="Pending").length,label:"Pending"},
              {color:"bg-orange-500",value:grnRecords.filter(g=>g.status==="Partial").length,label:"Partial"},
              {color:"bg-rose-500",value:grnRecords.filter(g=>g.status==="Rejected").length,label:"Rejected"},
            ]} />}
          >

            {grnRecords.map(grn => {
              const statusMap: Record<GRNStatus, string> = {
                Pending: "bg-amber-100 text-amber-700",
                Partial: "bg-orange-100 text-orange-700",
                Complete: "bg-emerald-100 text-emerald-700",
                Rejected: "bg-red-100 text-red-700",
              };
              return (
                <div key={grn.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{grn.id}</h3>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusMap[grn.status])}>{grn.status}</span>
                        {grn.qcPassed && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1"><CheckCircle2 size={11} /> QC Passed</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{grn.supplier} · Ref: {grn.poId} · Inv: {grn.invoice}</p>
                      <p className="text-sm text-muted-foreground">Received: {grn.receivedDate} by {grn.receivedBy}</p>
                    </div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1"><Download size={12} /> Download GRN</button>
                  </div>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          {["Item", "Ordered", "Received", "Unit", "Condition", "Variance"].map(h => <th key={h} className="pb-2 text-left text-xs text-muted-foreground font-medium">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30">
                        {grn.items.map((item, i) => {
                          const variance = item.received - item.ordered;
                          const condMap: Record<string, string> = {
                            Good: "bg-emerald-100 text-emerald-700",
                            Damaged: "bg-red-100 text-red-700",
                            Short: "bg-amber-100 text-amber-700",
                          };
                          return (
                            <tr key={i}>
                              <td className="py-2 text-foreground">{item.name}</td>
                              <td className="py-2 text-foreground">{item.ordered} {item.unit}</td>
                              <td className="py-2 font-medium text-foreground">{item.received} {item.unit}</td>
                              <td className="py-2 text-muted-foreground">{item.unit}</td>
                              <td className="py-2"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", condMap[item.condition])}>{item.condition}</span></td>
                              <td className="py-2 font-medium">
                                {variance === 0 ? (
                                  <span className="text-emerald-600">✓ Exact</span>
                                ) : (
                                  <span className={variance < 0 ? "text-red-500" : "text-emerald-600"}>{variance > 0 ? "+" : ""}{variance}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {grn.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-800">
                      <strong>Notes:</strong> {grn.notes}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pending GRNs */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
              <SectionHeader title="Pending Deliveries (Awaiting GRN)" />
              <div className="space-y-3">
                {purchaseOrders.filter(po => po.status === "Sent" || po.status === "Partial").map(po => (
                  <div key={po.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
                    <div>
                      <p className="font-medium text-foreground">{po.id} — {po.supplier}</p>
                      <p className="text-sm text-muted-foreground">Expected: {po.expectedDelivery} · BHD {po.totalValue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <POStatusBadge status={po.status} />
                      <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">Receive Goods</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── SUPPLIERS ── */}
        {activeSubmenu === "Suppliers" && (
          <motion.div key="suppliers" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search suppliers..." />}
            header={<SectionHeader icon={ShoppingCart} title="Supplier Directory" subtitle="Vendor management and performance" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:suppliers.length,label:"Total Suppliers"},
              {color:"bg-emerald-500",value:suppliers.filter(s=>s.status==="Preferred").length,label:"Preferred"},
              {color:"bg-amber-500",value:suppliers.filter(s=>s.status==="Probation").length,label:"On Probation"},
              {color:"bg-blue-500",value:`${Math.round(suppliers.reduce((s,sup)=>s+sup.onTimeDelivery,0)/suppliers.length)}%`,label:"On-Time Delivery"},
              {color:"bg-rose-500",value:suppliers.filter(s=>s.status==="Suspended").length,label:"Suspended"},
            ]} />}
          >

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Supplier", "Category", "Country", "Rating", "On-Time %", "Quality %", "Total Spend", "Status", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {suppliers.map(sup => (
                      <tr key={sup.id} className="hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setSelectedSupplier(sup)}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{sup.name}</p>
                          <p className="text-xs text-muted-foreground">{sup.contact}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{sup.category}</td>
                        <td className="px-4 py-3 text-muted-foreground">{sup.country}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="font-medium text-foreground">{sup.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", sup.onTimeDelivery >= 90 ? "text-emerald-600" : sup.onTimeDelivery >= 80 ? "text-amber-600" : "text-red-500")}>{sup.onTimeDelivery}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium", sup.qualityScore >= 90 ? "text-emerald-600" : "text-amber-600")}>{sup.qualityScore}%</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">BHD {sup.totalSpend.toLocaleString()}</td>
                        <td className="px-4 py-3"><SupplierStatusBadge status={sup.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
                            <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Supplier Detail */}
            {selectedSupplier && (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedSupplier.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSupplier.category} · {selectedSupplier.country}</p>
                  </div>
                  <button onClick={() => setSelectedSupplier(null)} className="text-muted-foreground text-sm">✕</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  {[["Contact", selectedSupplier.contact], ["Email", selectedSupplier.email], ["Phone", selectedSupplier.phone], ["Payment Terms", selectedSupplier.paymentTerms], ["Currency", selectedSupplier.currency], ["Last Order", selectedSupplier.lastOrder], ["Active Orders", selectedSupplier.activeOrders], ["Total Spend", `BHD ${selectedSupplier.totalSpend.toLocaleString()}`]].map(([k, v]) => (
                    <div key={k} className="p-3 bg-secondary/30 rounded-xl">
                      <p className="text-xs text-muted-foreground">{k}</p>
                      <p className="font-medium text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Create PO</button>
                  <button className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/70">View History</button>
                </div>
              </div>
            )}
          </PageShell>
          </motion.div>
        )}

        {/* ── SUPPLIER SCORECARD ── */}
        {activeSubmenu === "Supplier Scorecard" && (
          <motion.div key="scorecard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search scorecards..." />}
            header={<SectionHeader icon={ShoppingCart} title="Supplier Performance Scorecard" subtitle="Vendor performance ratings and metrics" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:suppliers.length,label:"Suppliers Rated"},
              {color:"bg-emerald-500",value:suppliers.filter(s=>s.rating>=4).length,label:"Top Rated (4+)"},
              {color:"bg-blue-500",value:`${Math.round(suppliers.reduce((s,sup)=>s+sup.qualityScore,0)/suppliers.length)}%`,label:"Avg Quality"},
              {color:"bg-amber-500",value:`${Math.round(suppliers.reduce((s,sup)=>s+sup.onTimeDelivery,0)/suppliers.length)}%`,label:"Avg On-Time"},
              {color:"bg-rose-500",value:suppliers.filter(s=>s.rating<3).length,label:"Underperforming"},
            ]} />}
          >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suppliers.map(sup => {
                const overall = Math.round((sup.rating * 20 + sup.onTimeDelivery + sup.qualityScore) / 3);
                return (
                  <div key={sup.id} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{sup.name}</h3>
                        <p className="text-sm text-muted-foreground">{sup.category}</p>
                      </div>
                      <SupplierStatusBadge status={sup.status} />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Overall Score", value: `${overall}%`, color: overall >= 90 ? "text-emerald-600" : overall >= 75 ? "text-amber-600" : "text-red-500" },
                        { label: "On-Time Delivery", value: `${sup.onTimeDelivery}%`, color: sup.onTimeDelivery >= 90 ? "text-emerald-600" : "text-amber-600" },
                        { label: "Quality Score", value: `${sup.qualityScore}%`, color: sup.qualityScore >= 90 ? "text-emerald-600" : "text-amber-600" },
                      ].map(m => (
                        <div key={m.label} className="text-center p-3 bg-secondary/30 rounded-xl">
                          <p className={cn("text-2xl font-bold", m.color)}>{m.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    {[
                      { label: "Delivery Performance", value: sup.onTimeDelivery, color: "bg-emerald-500" },
                      { label: "Quality Compliance", value: sup.qualityScore, color: "bg-blue-500" },
                      { label: "Overall Rating", value: Math.round(sup.rating * 20), color: "bg-amber-500" },
                    ].map(bar => (
                      <div key={bar.label} className="mb-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{bar.label}</span>
                          <span className="font-medium text-foreground">{bar.value}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all", bar.color)} style={{ width: `${bar.value}%` }} />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-sm">
                      <span className="text-muted-foreground">Total Spend: <span className="font-medium text-foreground">BHD {sup.totalSpend.toLocaleString()}</span></span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} className={i < Math.round(sup.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />)}
                        <span className="text-foreground font-medium ml-1">{sup.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </PageShell>
          </motion.div>
        )}

        {/* ── SUPPLIER COMPARISON ── */}
        {activeSubmenu === "Supplier Comparison" && (
          <motion.div key="comparison" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search comparisons..." />}
            header={<SectionHeader icon={ShoppingCart} title="Supplier Comparison" subtitle="Side-by-side vendor analysis" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:supplierComparisons.length,label:"Items Compared"},
              {color:"bg-emerald-500",value:suppliers.filter(s=>s.status==="Preferred").length,label:"Preferred Suppliers"},
              {color:"bg-blue-500",value:suppliers.length,label:"Total Suppliers"},
              {color:"bg-amber-500",value:`${Math.round(suppliers.reduce((s,sup)=>s+sup.rating,0)/suppliers.length*20)}%`,label:"Avg Rating"},
              {color:"bg-rose-500",value:activeSuppliers,label:"Active Suppliers"},
            ]} />}
          >
            {supplierComparisons.map(comp => (
              <div key={comp.item} className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Package size={16} className="text-primary" /> {comp.item}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Supplier", "Unit Price (BHD)", "Lead Time (days)", "Min. Order", "Recommendation"].map(h => <th key={h} className="pb-2 text-left text-xs text-muted-foreground font-medium">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {comp.suppliers.map((s, i) => {
                        const isBest = i === comp.suppliers.reduce((bi, s2, i2) => s2.price < comp.suppliers[bi].price ? i2 : bi, 0);
                        return (
                          <tr key={s.name} className={cn("transition-colors", isBest ? "bg-emerald-50" : "")}>
                            <td className="py-2.5 font-medium text-foreground flex items-center gap-2">
                              {isBest && <Award size={14} className="text-emerald-600" />}{s.name}
                            </td>
                            <td className={cn("py-2.5 font-semibold", isBest ? "text-emerald-600" : "text-foreground")}>BHD {s.price}</td>
                            <td className="py-2.5 text-foreground">{s.leadTime} days</td>
                            <td className="py-2.5 text-foreground">{s.minOrder} units</td>
                            <td className="py-2.5">{isBest ? <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Best Value</span> : <span className="text-muted-foreground text-xs">Alternative</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </PageShell>
          </motion.div>
        )}

        {/* ── STOCK LEVELS / INVENTORY ── */}
        {activeSubmenu === "Stock Levels" && (
          <motion.div key="stock" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search stock items..." />}
            header={<SectionHeader icon={ShoppingCart} title="Stock Levels & Inventory" subtitle="Inventory tracking and reorder management" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:stockItems.length,label:"Total SKUs"},
              {color:"bg-rose-500",value:stockItems.filter(s=>s.currentStock<=s.reorderPoint).length,label:"Critical"},
              {color:"bg-emerald-500",value:stockItems.filter(s=>s.autoReorder).length,label:"Auto-Reorder"},
              {color:"bg-blue-500",value:`BHD ${stockItems.reduce((s,i)=>s+i.currentStock*i.unitCost,0).toLocaleString(undefined,{maximumFractionDigits:0})}`,label:"Stock Value"},
              {color:"bg-amber-500",value:stockItems.filter(s=>s.currentStock<=s.parLevel&&s.currentStock>s.reorderPoint).length,label:"Below Par"},
            ]} />}
          >

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center gap-3">
                <select className="px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none">
                  <option>All Categories</option>
                  {["Food & Beverage", "Housekeeping", "Linen & Textiles", "Guest Amenities", "Maintenance"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["Item", "Category", "Current Stock", "Par Level", "Reorder Point", "Unit Cost", "Supplier", "Location", "Auto", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stockItems.map(item => {
                      const pct = Math.round((item.currentStock / item.parLevel) * 100);
                      const statusLabel = item.currentStock <= item.reorderPoint ? "Critical" : pct < 50 ? "Low" : "OK";
                      const statusColor = item.currentStock <= item.reorderPoint ? "bg-red-100 text-red-700" : pct < 50 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
                      return (
                        <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{item.category}</td>
                          <td className="px-4 py-3">
                            <div>
                              <span className={cn("font-semibold", item.currentStock <= item.reorderPoint ? "text-red-500" : "text-foreground")}>{item.currentStock} {item.unit}</span>
                              <div className="h-1.5 bg-secondary rounded-full mt-1 w-20">
                                <div className={cn("h-full rounded-full", item.currentStock <= item.reorderPoint ? "bg-red-500" : pct < 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(pct, 100)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.parLevel}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.reorderPoint}</td>
                          <td className="px-4 py-3 text-foreground">BHD {item.unitCost}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{item.supplier}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs">{item.location}</td>
                          <td className="px-4 py-3">{item.autoReorder ? <CheckCircle2 size={16} className="text-emerald-500" /> : <span className="text-muted-foreground text-xs">Manual</span>}</td>
                          <td className="px-4 py-3"><span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusColor)}>{statusLabel}</span></td>
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

        {/* ── REPORTS ── */}
        {activeSubmenu === "Reports" && (
          <motion.div key="procrep" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }} className="h-full">
          <PageShell
            search={<SectionSearch value={search} onChange={setSearch} placeholder="Search reports..." />}
            header={<SectionHeader icon={ShoppingCart} title="Procurement Reports" subtitle="Spending analysis and supplier performance" />}
            kpi={<KpiStrip items={[
              {color:"bg-indigo-500",value:"BHD 284,000",label:"YTD Spend"},
              {color:"bg-emerald-500",value:"BHD 18,500",label:"Cost Savings"},
              {color:"bg-blue-500",value:"7.2 days",label:"Avg Lead Time"},
              {color:"bg-amber-500",value:"82",label:"Supplier NPS"},
              {color:"bg-rose-500",value:purchaseOrders.length,label:"Total POs"},
            ]} />}
          >

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "YTD Procurement Spend", value: "BHD 284,000", change: "+12%", up: true },
                { label: "Cost Savings (vs Budget)", value: "BHD 18,500", change: "+6.1%", up: true },
                { label: "Avg Lead Time", value: "7.2 days", change: "-0.8d", up: true },
                { label: "Supplier NPS", value: "82", change: "+4", up: true },
              ].map(k => (
                <div key={k.label} className="bg-card rounded-2xl shadow-sm border border-border p-4">
                  <p className="text-sm text-muted-foreground">{k.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{k.value}</p>
                  <p className={cn("text-xs mt-1 font-medium", k.up ? "text-emerald-600" : "text-red-500")}>{k.up ? "↑" : "↓"} {k.change} vs last period</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Monthly Spend Trend" />
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={spendByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <Tooltip formatter={(v: number) => [`BHD ${v.toLocaleString()}`, ""]} />
                    <Area type="monotone" dataKey="fb" name="F&B" stroke="#10b981" fill="#d1fae5" strokeWidth={2} stackId="a" />
                    <Area type="monotone" dataKey="housekeeping" name="HK" stroke="#6366f1" fill="#e0e7ff" strokeWidth={2} stackId="a" />
                    <Area type="monotone" dataKey="amenities" name="Amenities" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} stackId="a" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Supplier performance table */}
              <div className="bg-card rounded-2xl shadow-sm border border-border p-5">
                <SectionHeader title="Top Suppliers by Spend" />
                <div className="space-y-3">
                  {[...suppliers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 6).map((sup, i) => (
                    <div key={sup.id} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}.</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-foreground">{sup.name}</span>
                          <span className="text-foreground font-semibold">BHD {sup.totalSpend.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(sup.totalSpend / 72000) * 100}%` }} />
                        </div>
                      </div>
                      <SupplierStatusBadge status={sup.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PO Summary Table */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="p-5 border-b border-border">
                <SectionHeader title="Purchase Order Summary" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>{["PO #", "Supplier", "Value", "Created", "Expected", "Delivered", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {purchaseOrders.map(po => (
                      <tr key={po.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-primary">{po.id}</td>
                        <td className="px-4 py-3 text-foreground">{po.supplier}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">BHD {po.totalValue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.createdDate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.expectedDelivery}</td>
                        <td className="px-4 py-3 text-muted-foreground">{po.deliveredDate || "–"}</td>
                        <td className="px-4 py-3"><POStatusBadge status={po.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </PageShell>
          </motion.div>
        )}

      </AnimatePresence>
  );
}
