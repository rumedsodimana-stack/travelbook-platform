/**
 * LegendBar — compact single-row colour legend.
 * Occupies ~3% of page height. Each item is a small colour swatch + label.
 * Used for floor plans, timeline views, and any status-coded grid.
 * Wrapped in a card container for visual consistency with KpiStrip.
 */
import { cn } from "../../lib/utils";

export interface LegendItem {
  /**
   * Two Tailwind classes: bg + border, e.g. "bg-emerald-100 border-emerald-200"
   * The component renders a w-4 h-4 rounded swatch using these classes.
   */
  color: string;
  label: string;
}

interface LegendBarProps {
  items: LegendItem[];
  className?: string;
}

export function LegendBar({ items, className }: LegendBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-x-5 gap-y-2 items-center text-xs bg-card rounded-2xl border border-border px-5 py-3",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={cn("w-3.5 h-3.5 rounded border-2 shrink-0", item.color)} />
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
