/**
 * SectionHeader — standardised page / section title.
 * Occupies ~4% of page height. Used at the top of every department view.
 * Supports an optional Lucide icon rendered before the title for visual consistency.
 */
import React from "react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Lucide icon component rendered before the title */
  icon?: LucideIcon;
  /** Optional right-side actions/badges */
  actions?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 min-h-[2rem]", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground leading-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground leading-tight mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
