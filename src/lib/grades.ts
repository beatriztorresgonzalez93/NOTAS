import type { IGradeEntry } from "@/models/Subject";

export function averageGrade(
  assignments: IGradeEntry[],
  exams: IGradeEntry[]
): number | null {
  const all = [...assignments, ...exams];
  if (all.length === 0) return null;
  const sum = all.reduce((acc, g) => acc + g.score, 0);
  return Math.round((sum / all.length) * 100) / 100;
}
