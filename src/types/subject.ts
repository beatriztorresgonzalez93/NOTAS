/**
 * - vacío: sin registro (no cuenta en media)
 * - NE: no entregado (cuenta como 0)
 * - SC: sin calificar, entregado (no cuenta en media)
 */
export type TaskGrade = number | null | "NE" | "SC";

export interface Subject {
  _id: string;
  slug: string;
  name: string;
  order: number;
  tasks: TaskGrade[];
  exam: number | null;
  finalGrade: number | null;
  createdAt?: string;
  updatedAt?: string;
}
