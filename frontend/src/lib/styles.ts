// Priority is an ordered severity scale, so these map to fixed status colors
// (rose/amber/emerald) rather than an arbitrary categorical palette - used
// consistently everywhere a priority is shown (dots, badges, charts).
export const priorityDot: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export const priorityBadge: Record<string, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/15",
  medium:
    "bg-amber-50 text-amber-700 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/15",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/15",
};
