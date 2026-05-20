import mongoose, { Schema, models, model } from "mongoose";
import { TASK_COUNT } from "@/lib/subjects";

export interface ISubject {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  order: number;
  tasks: (number | null)[];
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
      type: [gradeField],
      default: () => Array(TASK_COUNT).fill(null),
      validate: {
        validator: (v: unknown[]) => v.length === TASK_COUNT,
        message: `Debe haber exactamente ${TASK_COUNT} tareas`,
      },
    },
    exam: gradeField,
    finalGrade: gradeField,
  },
  { timestamps: true }
);

export const Subject =
  models.Subject ?? model<ISubject>("Subject", subjectSchema);
