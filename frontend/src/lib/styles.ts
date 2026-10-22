// Priority is an ordered severity scale, so these map to fixed status colors
// (rose/amber/emerald) rather than an arbitrary categorical palette - used
// consistently everywhere a priority is shown (dots, badges, charts).
export const priorityDot: Record<string, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export const priorityBadge: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20",
  medium: "bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
};
