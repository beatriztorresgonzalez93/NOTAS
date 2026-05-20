import mongoose, { Schema, models, model } from "mongoose";
import { TASK_COUNT } from "@/lib/subjects";
import { isValidTaskGrade } from "@/lib/grades";
import type { TaskGrade } from "@/types/subject";

export interface ISubject {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  order: number;
  tasks: TaskGrade[];
  exam: number | null;
  finalGrade: number | null;
}

const gradeField = {
  type: Number,
  default: null,
  min: 0,
  max: 10,
};

const subjectSchema = new Schema<ISubject>(
  {
    slug: { type: String, required: true, unique: true, immutable: true },
    name: { type: String, required: true },
    order: { type: Number, required: true },
    tasks: {
      type: [Schema.Types.Mixed],
      default: () => Array(TASK_COUNT).fill(null),
      validate: {
        validator(v: unknown[]) {
          if (v.length !== TASK_COUNT) return false;
          return v.every(isValidTaskGrade);
        },
        message: `Debe haber ${TASK_COUNT} tareas (0–10, NE o vacío)`,
      },
    },
    exam: gradeField,
    finalGrade: gradeField,
  },
  { timestamps: true }
);

export const Subject =
  models.Subject ?? model<ISubject>("Subject", subjectSchema);
