import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isValidTaskGrade } from "@/lib/grades";
import { TASK_COUNT } from "@/lib/subjects";
import { Subject } from "@/models/Subject";
import type { TaskGrade } from "@/types/subject";

type RouteContext = { params: Promise<{ id: string }> };

function invalidId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
}

function normalizeTasks(raw: unknown): TaskGrade[] | null {
  if (!Array.isArray(raw) || raw.length !== TASK_COUNT) return null;
  const tasks: TaskGrade[] = [];
  for (const item of raw as unknown[]) {
    if (item === null || item === undefined || item === "") {
      tasks.push(null);
      continue;
    }
    if (item === "NE") {
      tasks.push("NE");
      continue;
    }
    const n = Number(item);
    if (Number.isNaN(n) || n < 0 || n > 10) return null;
    tasks.push(Math.round(n * 100) / 100);
  }
  return tasks;
}

function normalizeGrade(raw: unknown): number | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  if (Number.isNaN(n) || n < 0 || n > 10) return null;
  return Math.round(n * 100) / 100;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (invalidId(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    const body = await request.json();
    await connectDB();

    const update: Record<string, unknown> = {};

    if (body.tasks !== undefined) {
      const tasks = normalizeTasks(body.tasks);
      if (!tasks) {
        return NextResponse.json(
          { error: `Se requieren exactamente ${TASK_COUNT} tareas` },
          { status: 400 }
        );
      }
      update.tasks = tasks;
    }

    const exam = normalizeGrade(body.exam);
    if (body.exam !== undefined) update.exam = exam;

    const finalGrade = normalizeGrade(body.finalGrade);
    if (body.finalGrade !== undefined) update.finalGrade = finalGrade;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Sin cambios" }, { status: 400 });
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!subject) {
      return NextResponse.json(
        { error: "Asignatura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo actualizar la asignatura" },
      { status: 500 }
    );
  }
}
