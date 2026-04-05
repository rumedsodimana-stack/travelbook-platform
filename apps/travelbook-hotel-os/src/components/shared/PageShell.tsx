/**
 * PageShell — layout wrapper enforcing the Singularity proportion spec:
 *
 *   Search bar   5%   ← SectionSearch (optional)
 *   Page header  4%   ← SectionHeader (optional)
 *   KPI strip   10%   ← KpiStrip      (optional, always 5 items when present)
 *   Legend       3%   ← LegendBar     (optional, only when colour coding is present)
 *   Content     78%   ← primary data  (always)
 *
 * Every department sub-view should use PageShell as its outermost wrapper.
 * Slots that aren't needed are simply omitted — the content area expands to fill.
 */
import React from "react";

interface PageShellProps {
  /** ~5% — SectionSearch component */
  search?: React.ReactNode;
  /** ~4% — SectionHeader component */
  header?: React.ReactNode;
  /** ~10% — KpiStrip component (only when KPIs are meaningful) */
  kpi?: React.ReactNode;
  /** ~3% — LegendBar component (only when colour coding is present) */
  legend?: React.ReactNode;
  /** ~78% — primary data content; tables, grids, charts, etc. */
  children?: React.ReactNode;
}

export function PageShell({ search, header, kpi, legend, children }: PageShellProps) {
  return (
    <div className="flex flex-col gap-3 p-6">
      {search && <div className="shrink-0">{search}</div>}
      {header && <div className="shrink-0">{header}</div>}
      {kpi && <div className="shrink-0">{kpi}</div>}
      {legend && <div className="shrink-0">{legend}</div>}
      {children && <div>{children}</div>}
    </div>
  );
}
