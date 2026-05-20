import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ensureFixedSubjects } from "@/lib/seed-subjects";

export async function GET() {
  try {
    await connectDB();
    const subjects = await ensureFixedSubjects();
    return NextResponse.json(subjects);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudieron cargar las asignaturas" },
      { status: 500 }
    );
  }
}
