import type { TaskGrade } from "@/types/subject";

const BASE =
  "rounded-md border px-2 py-2 text-center text-sm font-semibold tabular-nums transition focus:outline-none focus:ring-2 disabled:opacity-50";

const FOCUS = "focus:ring-[#e50914]/60";

export function gradeCellClasses(
  value: TaskGrade | number | null,
  options?: { highlight?: boolean }
): string {
  if (value === null) {
    return `${BASE} ${FOCUS} border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-600 hover:border-white/20 hover:bg-white/[0.08]`;
  }

  if (value === "NE") {
    return `${BASE} ${FOCUS} border-amber-500/50 bg-amber-950/50 text-amber-300`;
  }

  if (value === "SC") {
    return `${BASE} ${FOCUS} border-sky-500/45 bg-sky-950/40 text-sky-300`;
  }

  if (typeof value === "number") {
    const pass = value >= 5;
    if (options?.highlight) {
      return pass
        ? `${BASE} ${FOCUS} border-emerald-500/60 bg-emerald-950/40 text-emerald-200 ring-1 ring-[#e50914]/30`
        : `${BASE} ${FOCUS} border-red-500/60 bg-red-950/40 text-red-200 ring-1 ring-[#e50914]/30`;
    }
    return pass
      ? `${BASE} ${FOCUS} border-emerald-500/45 bg-emerald-950/35 text-emerald-300`
      : `${BASE} ${FOCUS} border-red-500/45 bg-red-950/35 text-red-300`;
  }

  return `${BASE} ${FOCUS} border-white/10 bg-white/5 text-zinc-100`;
}

export function mediaBadgeClasses(average: number | null): string {
  if (average === null) return "bg-zinc-800/80 text-zinc-500";
  if (average >= 5) return "bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/30";
  return "bg-red-950/60 text-red-300 ring-1 ring-red-500/30";
}
