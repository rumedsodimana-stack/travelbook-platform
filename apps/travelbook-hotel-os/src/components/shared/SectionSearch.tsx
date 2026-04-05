/**
 * SectionSearch — standardised compact search / filter input.
 * Occupies ~5% of page height. Consistent across every department page.
 */
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

interface SectionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SectionSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: SectionSearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
      />
    </div>
  );
}
