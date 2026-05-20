"use client";

import { useCallback, useEffect, useState } from "react";
import { TASK_COUNT } from "@/lib/subjects";
import { averageTasksOnly, formatGrade, parseGradeInput } from "@/lib/grades";
import type { Subject } from "@/types/subject";

function GradeCell({
  value,
  onSave,
  disabled,
  highlight,
}: {
  value: number | null;
  onSave: (value: number | null) => Promise<void>;
  disabled?: boolean;
  highlight?: boolean;
}) {
  const [local, setLocal] = useState(formatGrade(value));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLocal(formatGrade(value));
  }, [value]);

  const commit = async () => {
    const parsed = parseGradeInput(local);
    if (local.trim() !== "" && parsed === null) {
      setLocal(formatGrade(value));
      return;
    }
    if (parsed === value || (parsed === null && value === null)) return;

    setSaving(true);
    try {
      await onSave(parsed);
    } catch {
      setLocal(formatGrade(value));
    } finally {
      setSaving(false);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder="—"
      value={local}
      disabled={disabled || saving}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => void commit()}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      className={`grade-cell w-full min-w-[2.75rem] rounded-md border px-2 py-2 text-center text-sm font-medium tabular-nums transition focus:outline-none focus:ring-2 focus:ring-[#e50914]/60 disabled:opacity-50 ${
        highlight
          ? "border-[#e50914]/50 bg-[#e50914]/10 text-white"
          : "border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-600 hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    />
  );
}

function SubjectRow({
  subject,
  onUpdate,
}: {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
}) {
  const [saving, setSaving] = useState(false);

  const persist = useCallback(
    async (patch: Partial<Pick<Subject, "tasks" | "exam" | "finalGrade">>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/subjects/${subject._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("Error al guardar");
        onUpdate((await res.json()) as Subject);
      } finally {
        setSaving(false);
      }
    },
    [subject._id, onUpdate]
  );

  const { average: tasksAverage, count: tasksCount } = averageTasksOnly(
    subject.tasks
  );

  return (
    <tr
      className={`group border-b border-white/[0.06] transition hover:bg-white/[0.03] ${
        saving ? "opacity-70" : ""
      }`}
    >
      <td className="sticky left-0 z-10 min-w-[11rem] max-w-[14rem] border-r border-white/[0.06] bg-[#0d0d0d] px-4 py-3 align-middle group-hover:bg-[#121212]">
        <span className="text-sm font-medium leading-snug text-zinc-100">
          {subject.name}
        </span>
      </td>
      {subject.tasks.map((task, i) => (
        <td key={i} className="px-1.5 py-2 align-middle">
          <GradeCell
            value={task}
            disabled={saving}
            onSave={async (score) => {
              const tasks = [...subject.tasks];
              tasks[i] = score;
              await persist({ tasks });
            }}
          />
        </td>
      ))}
      <td className="px-1.5 py-2 align-middle">
        <GradeCell
          value={subject.exam}
          disabled={saving}
          onSave={async (exam) => persist({ exam })}
        />
      </td>
      <td className="px-2 py-2 align-middle">
        <GradeCell
          value={subject.finalGrade}
          disabled={saving}
          highlight
          onSave={async (finalGrade) => persist({ finalGrade })}
        />
      </td>
      <td className="hidden px-3 py-2 align-middle text-center lg:table-cell">
        {tasksAverage !== null ? (
          <span className="text-sm font-medium text-zinc-300">
            {tasksAverage}
            <span className="mt-0.5 block text-[10px] font-normal text-zinc-600">
              {tasksCount} tarea{tasksCount !== 1 ? "s" : ""}
            </span>
          </span>
        ) : (
          <span className="text-xs text-zinc-600">—</span>
        )}
      </td>
    </tr>
  );
}

export default function NotasApp() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subjects");
      if (!res.ok) throw new Error();
      setSubjects(await res.json());
    } catch {
      setError(
        "No se pudo conectar con la base de datos. Revisa MONGODB_URI."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const taskHeaders = Array.from({ length: TASK_COUNT }, (_, i) => `T${i + 1}`);

  return (
    <div className="notas-app min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.12)_0%,_transparent_55%)]" />

      <div className="relative mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#e50914]">
            FP · Registro académico
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mis <span className="text-[#e50914]">notas</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Escala 0–10. Las asignaturas son fijas; escribe en cada celda y
            pulsa Enter o sal del campo para guardar.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#e50914] border-t-transparent" />
            Cargando asignaturas…
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#141414]/90 shadow-2xl shadow-black/50 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-[#1a1a1a]">
                    <th className="sticky left-0 z-20 min-w-[11rem] border-r border-white/10 bg-[#1a1a1a] px-4 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Asignatura
                    </th>
                    {taskHeaders.map((label) => (
                      <th
                        key={label}
                        className="px-1.5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500"
                      >
                        {label}
                      </th>
                    ))}
                    <th className="px-1.5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Examen
                    </th>
                    <th className="px-2 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#e50914]">
                      Final
                    </th>
                    <th className="hidden px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600 lg:table-cell">
                      Media*
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <SubjectRow
                      key={subject._id}
                      subject={subject}
                      onUpdate={(updated) =>
                        setSubjects((prev) =>
                          prev.map((s) =>
                            s._id === updated._id ? updated : s
                          )
                        )
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-white/[0.06] px-4 py-3 text-xs text-zinc-600">
              * Media solo de las tareas con nota (T1–T9 rellenas). Las vacías no
              cuentan; si una asignatura usa 6 tareas, deja el resto en blanco.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
