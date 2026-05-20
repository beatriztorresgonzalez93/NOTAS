"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TASK_COUNT } from "@/lib/subjects";
import { SaveToast } from "@/components/SaveToast";
import { SubjectCard } from "@/components/SubjectCard";
import { SubjectTableRow } from "@/components/SubjectTableRow";
import { useSaveNotifier } from "@/hooks/useSaveNotifier";
import type { Subject } from "@/types/subject";

export default function NotasApp() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { status, notifySaving, notifySaved, notifyError } = useSaveNotifier();
  const notifier = useMemo(
    () => ({ notifySaving, notifySaved, notifyError }),
    [notifySaving, notifySaved, notifyError]
  );

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

  const updateSubject = useCallback((updated: Subject) => {
    setSubjects((prev) =>
      prev.map((s) => (s._id === updated._id ? updated : s))
    );
  }, []);

  const taskHeaders = Array.from({ length: TASK_COUNT }, (_, i) => `T${i + 1}`);

  const legend = (
    <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded border border-emerald-500/45 bg-emerald-950/50" />
        ≥ 5
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded border border-red-500/45 bg-red-950/50" />
        &lt; 5
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded border border-amber-500/45 bg-amber-950/50" />
        NE
      </span>
      <span className="text-zinc-600">Vacío = sin registro</span>
    </div>
  );

  return (
    <div className="notas-app min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(229,9,20,0.12)_0%,_transparent_55%)]" />
      <SaveToast status={status} />

      <div className="relative mx-auto max-w-[100rem] px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#e50914]">
            FP · Registro académico
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mis <span className="text-[#e50914]">notas</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Escala 0–10. <span className="text-emerald-400">Verde</span> aprueba,
            <span className="text-red-400"> rojo</span> suspenso,{" "}
            <span className="text-amber-400">NE</span> no entregado (0 en la
            media). Se guarda al salir del campo.
          </p>
          {legend}
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
          <>
            {/* Vista móvil: tarjetas */}
            <div className="flex flex-col gap-4 md:hidden">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onUpdate={updateSubject}
                  notifier={notifier}
                />
              ))}
            </div>

            {/* Vista escritorio: tabla */}
            <div className="hidden overflow-hidden rounded-xl border border-white/10 bg-[#141414]/90 shadow-2xl shadow-black/50 backdrop-blur-sm md:block">
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
                      <th className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
                        Media*
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <SubjectTableRow
                        key={subject._id}
                        subject={subject}
                        onUpdate={updateSubject}
                        notifier={notifier}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-white/[0.06] px-4 py-3 text-xs text-zinc-600">
                * Media de tareas con registro (nota o NE). Vacío = no cuenta.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
