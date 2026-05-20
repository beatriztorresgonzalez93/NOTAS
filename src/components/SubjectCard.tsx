"use client";

import { TASK_COUNT } from "@/lib/subjects";
import { averageTasksOnly } from "@/lib/grades";
import { mediaBadgeClasses } from "@/lib/grade-styles";
import { useSubjectPersist } from "@/hooks/useSubjectPersist";
import { GradeCell, TaskGradeCell } from "@/components/GradeCells";
import type { Subject } from "@/types/subject";

type Notifier = {
  notifySaving: () => void;
  notifySaved: () => void;
  notifyError: () => void;
};

export function SubjectCard({
  subject,
  onUpdate,
  notifier,
}: {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
  notifier: Notifier;
}) {
  const { persist, saving } = useSubjectPersist(subject, onUpdate, notifier);
  const { average, count, neCount } = averageTasksOnly(subject.tasks);
  const taskLabels = Array.from({ length: TASK_COUNT }, (_, i) => `T${i + 1}`);

  return (
    <article
      className={`rounded-xl border border-white/10 bg-[#141414] p-4 shadow-lg transition ${
        saving ? "opacity-80" : ""
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold leading-snug text-white">
          {subject.name}
        </h2>
        {average !== null && (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${mediaBadgeClasses(average)}`}
          >
            {average}
            <span className="ml-1 font-normal opacity-70">
              ({count}
              {neCount > 0 ? ` · ${neCount} NE` : ""})
            </span>
          </span>
        )}
      </div>

      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Tareas
      </p>
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-3">
        {subject.tasks.map((task, i) => (
          <div key={i}>
            <label className="mb-1 block text-center text-[10px] text-zinc-500">
              {taskLabels[i]}
            </label>
            <TaskGradeCell
              value={task}
              compact
              disabled={saving}
              onSave={async (score) => {
                const tasks = [...subject.tasks];
                tasks[i] = score;
                await persist({ tasks });
              }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Examen
          </label>
          <GradeCell
            value={subject.exam}
            compact
            disabled={saving}
            onSave={async (exam) => persist({ exam })}
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#e50914]">
            Final
          </label>
          <GradeCell
            value={subject.finalGrade}
            compact
            highlight
            disabled={saving}
            onSave={async (finalGrade) => persist({ finalGrade })}
          />
        </div>
      </div>
    </article>
  );
}
