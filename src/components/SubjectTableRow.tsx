"use client";

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

export function SubjectTableRow({
  subject,
  onUpdate,
  notifier,
}: {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
  notifier: Notifier;
}) {
  const { persist, saving } = useSubjectPersist(subject, onUpdate, notifier);
  const { average: tasksAverage, count: tasksCount, neCount, scCount } =
    averageTasksOnly(subject.tasks);

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
          <TaskGradeCell
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
      <td className="px-3 py-2 align-middle text-center">
        {tasksAverage !== null ? (
          <span
            className={`inline-flex flex-col items-center rounded-lg px-2 py-1 text-sm font-bold tabular-nums ${mediaBadgeClasses(tasksAverage)}`}
          >
            {tasksAverage}
            <span className="mt-0.5 text-[10px] font-normal opacity-80">
              {tasksCount} t.
              {neCount > 0 ? ` · ${neCount} NE` : ""}
              {scCount > 0 ? ` · ${scCount} SC` : ""}
            </span>
          </span>
        ) : (
          <span className="text-xs text-zinc-600">—</span>
        )}
      </td>
    </tr>
  );
}
