import type { TaskGrade } from "@/types/subject";

const TASK_CODES = ["NE", "SC"] as const;

export function parseGradeInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = parseFloat(trimmed.replace(",", "."));
  if (Number.isNaN(n) || n < 0 || n > 10) return null;
  return Math.round(n * 100) / 100;
}

export function parseTaskInput(value: string): TaskGrade | "INVALID" {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const upper = trimmed.toUpperCase();
  if (TASK_CODES.includes(upper as (typeof TASK_CODES)[number])) {
    return upper as "NE" | "SC";
  }
  const n = parseGradeInput(trimmed);
  if (n === null) return "INVALID";
  return n;
}

export function formatGrade(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function formatTaskGrade(value: TaskGrade | undefined): string {
  if (value === null || value === undefined) return "";
  if (value === "NE" || value === "SC") return value;
  return String(value);
}

export function isValidTaskGrade(value: unknown): value is TaskGrade {
  if (value === null || value === undefined || value === "") return true;
  if (value === "NE" || value === "SC") return true;
  const n = Number(value);
  return !Number.isNaN(n) && n >= 0 && n <= 10;
}
