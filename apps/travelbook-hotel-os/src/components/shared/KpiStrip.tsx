/**
 * KpiStrip — compact single-row KPI summary.
 * Occupies ~10% of the page height, ensuring data content dominates.
 * Replaces full-size gradient StatCard grids across all departments.
 */
import { cn } from "../../lib/utils";

export interface KpiItem {
  /** Tailwind dot colour, e.g. "bg-violet-500" */
  color: string;
  value: string | number;
  label: string;
}

interface KpiStripProps {
  items: KpiItem[];
  className?: string;
}

export function KpiStrip({ items, className }: KpiStripProps) {
  return (
    <div className={cn("bg-card rounded-2xl border border-border px-5 py-4", className)}>
      <div className="flex flex-wrap items-center divide-x divide-border">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn("flex items-center gap-2.5", i === 0 ? "pr-8" : "px-8")}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", item.color)} />
            <span className="text-xl font-bold text-foreground leading-none">
              {item.value}
            </span>
            <span className="text-xs text-muted-foreground leading-none">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
