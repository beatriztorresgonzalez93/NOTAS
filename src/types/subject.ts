/**
 * - vacío: sin registro
 * - NE: no entregado
 * - SC: entregado, sin calificar aún
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
