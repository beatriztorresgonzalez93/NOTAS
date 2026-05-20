import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Subject } from "@/models/Subject";

type RouteContext = { params: Promise<{ id: string }> };

function invalidId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
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
    if (Array.isArray(body.assignments)) update.assignments = body.assignments;
    if (Array.isArray(body.exams)) update.exams = body.exams;
    if (body.finalGrade === null || typeof body.finalGrade === "number") {
      update.finalGrade = body.finalGrade;
    }

    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!subject) {
      return NextResponse.json({ error: "Asignatura no encontrada" }, { status: 404 });
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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (invalidId(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    await connectDB();
    const result = await Subject.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Asignatura no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo eliminar la asignatura" },
      { status: 500 }
    );
  }
}
