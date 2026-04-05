/**
 * RoomCard — standardised room tile for floor plans / room grids.
 * Used across FrontDesk, Housekeeping, and Engineering pages
 * to ensure consistent sizing, colours, and layout.
 */
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import type { LucideIcon } from "lucide-react";

export interface RoomCardProps {
  /** Room number displayed prominently */
  roomNumber: string;
  /** Room type (e.g. "Standard King", "Suite") */
  roomType?: string;
  /** Current status label */
  status: string;
  /** Tailwind classes for bg, border, and text colour based on status */
  statusColor: string;
  /** Guest name if occupied */
  guestName?: string;
  /** Extra detail lines (housekeeper, time, etc.) */
  details?: { icon?: LucideIcon; text: string }[];
  /** Small badges (CI, CO, VIP, etc.) */
  badges?: { label: string; className?: string }[];
  /** Whether this card is currently selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export function RoomCard({
  roomNumber,
  roomType,
  status,
  statusColor,
  guestName,
  details,
  badges,
  selected,
  onClick,
}: RoomCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "rounded-xl border-2 p-3 text-left hover:shadow-md transition-all",
        statusColor,
        selected && "ring-2 ring-primary ring-offset-1"
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="text-lg font-bold leading-tight">{roomNumber}</div>
      {roomType && (
        <p className="text-[11px] opacity-70 mt-0.5 truncate">{roomType}</p>
      )}
      {guestName && (
        <p className="text-[11px] font-medium mt-0.5 truncate">{guestName}</p>
      )}
      <p className="text-[10px] font-semibold opacity-80 mt-0.5">{status}</p>
      {details && details.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {details.map((d, i) => (
            <p key={i} className="flex items-center gap-1 text-[10px] opacity-70 truncate">
              {d.icon && <d.icon className="h-3 w-3 shrink-0" />}
              <span className="truncate">{d.text}</span>
            </p>
          ))}
        </div>
      )}
      {badges && badges.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {badges.map((b) => (
            <span
              key={b.label}
              className={cn(
                "rounded bg-black/10 px-1.5 py-0.5 text-[9px] font-semibold",
                b.className
              )}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}
    </motion.button>
  );
}
