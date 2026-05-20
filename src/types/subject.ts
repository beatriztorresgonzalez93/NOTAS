export interface Subject {
  _id: string;
  slug: string;
  name: string;
  order: number;
  tasks: (number | null)[];
  exam: number | null;
  finalGrade: number | null;
  createdAt?: string;
  updatedAt?: string;
}
