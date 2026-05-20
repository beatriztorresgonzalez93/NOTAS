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

function countsForAverage(tasks: TaskGrade[]): (number | "NE")[] {
  return tasks.filter(
    (v): v is number | "NE" => typeof v === "number" || v === "NE"
  );
}

/** Solo notas y NE entran en la media; vacío y SC no cuentan. */
export function averageTasksOnly(tasks: TaskGrade[]): {
  average: number | null;
  count: number;
  neCount: number;
  scCount: number;
} {
  const entries = countsForAverage(tasks);
  const scCount = tasks.filter((v) => v === "SC").length;

  if (entries.length === 0) {
    return { average: null, count: 0, neCount: 0, scCount };
  }

  const neCount = entries.filter((v) => v === "NE").length;
  const sum = entries.reduce<number>(
    (acc, v) => acc + (v === "NE" ? 0 : v),
    0
  );

  return {
    average: Math.round((sum / entries.length) * 100) / 100,
    count: entries.length,
    neCount,
    scCount,
  };
}
