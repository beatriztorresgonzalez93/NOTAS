export interface GradeEntry {
  _id?: string;
  name: string;
  score: number;
}

export interface Subject {
  _id: string;
  name: string;
  assignments: GradeEntry[];
  exams: GradeEntry[];
  finalGrade: number | null;
  createdAt?: string;
  updatedAt?: string;
}
