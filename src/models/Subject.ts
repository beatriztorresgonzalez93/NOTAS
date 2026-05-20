import mongoose, { Schema, models, model } from "mongoose";

export interface IGradeEntry {
  name: string;
  score: number;
}

export interface ISubject {
  _id: mongoose.Types.ObjectId;
  name: string;
  assignments: IGradeEntry[];
  exams: IGradeEntry[];
  finalGrade: number | null;
}

const gradeEntrySchema = new Schema<IGradeEntry>(
  {
    name: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 0, max: 10 },
  },
  { _id: true }
);

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    assignments: { type: [gradeEntrySchema], default: [] },
    exams: { type: [gradeEntrySchema], default: [] },
    finalGrade: { type: Number, default: null, min: 0, max: 10 },
  },
  { timestamps: true }
);

export const Subject =
  models.Subject ?? model<ISubject>("Subject", subjectSchema);
