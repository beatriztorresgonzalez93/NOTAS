export function parseGradeInput(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = parseFloat(trimmed.replace(",", "."));
  if (Number.isNaN(n) || n < 0 || n > 10) return null;
  return Math.round(n * 100) / 100;
}

export function formatGrade(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

/** Media solo de celdas con nota (ignora vacías). No incluye examen ni nota final. */
export function averageTasksOnly(tasks: (number | null)[]): {
  average: number | null;
  count: number;
} {
  const filled = tasks.filter((v): v is number => v !== null);
  if (filled.length === 0) return { average: null, count: 0 };
  const sum = filled.reduce((acc, v) => acc + v, 0);
  return {
    average: Math.round((sum / filled.length) * 100) / 100,
    count: filled.length,
  };
}
