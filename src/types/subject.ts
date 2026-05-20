/** Nota numérica, vacío (no cuenta en media) o NE = no entregado (cuenta como 0). */
export type TaskGrade = number | null | "NE";

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
