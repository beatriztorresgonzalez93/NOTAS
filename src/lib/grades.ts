import type { TaskGrade } from "@/types/subject";

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
  if (trimmed.toUpperCase() === "NE") return "NE";
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
  if (value === "NE") return "NE";
  return String(value);
}

export function isValidTaskGrade(value: unknown): value is TaskGrade {
  if (value === null || value === undefined || value === "") return true;
  if (value === "NE") return true;
  const n = Number(value);
  return !Number.isNaN(n) && n >= 0 && n <= 10;
}

/** NE cuenta en la media como 0; las celdas vacías no cuentan. */
export function averageTasksOnly(tasks: TaskGrade[]): {
  average: number | null;
  count: number;
  neCount: number;
} {
  const entries = tasks.filter((v) => v !== null);
  if (entries.length === 0) {
    return { average: null, count: 0, neCount: 0 };
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
  };
}
