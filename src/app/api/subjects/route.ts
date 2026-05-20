import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Subject } from "@/models/Subject";

export async function GET() {
  try {
    await connectDB();
    const subjects = await Subject.find().sort({ updatedAt: -1 }).lean();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudieron cargar las asignaturas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la asignatura es obligatorio" },
        { status: 400 }
      );
    }

    await connectDB();
    const subject = await Subject.create({ name });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo crear la asignatura" },
      { status: 500 }
    );
  }
}
