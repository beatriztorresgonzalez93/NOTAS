"use client";

import { useCallback, useState } from "react";
import type { Subject } from "@/types/subject";

type SaveNotifier = {
  notifySaving: () => void;
  notifySaved: () => void;
  notifyError: () => void;
};

export function useSubjectPersist(
  subject: Subject,
  onUpdate: (updated: Subject) => void,
  notifier: SaveNotifier
) {
  const [saving, setSaving] = useState(false);
  const [cellError, setCellError] = useState(false);

  const persist = useCallback(
    async (patch: Partial<Pick<Subject, "tasks" | "exam" | "finalGrade">>) => {
      setSaving(true);
      setCellError(false);
      notifier.notifySaving();
      try {
        const res = await fetch(`/api/subjects/${subject._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("Error al guardar");
        onUpdate((await res.json()) as Subject);
        notifier.notifySaved();
      } catch {
        setCellError(true);
        notifier.notifyError();
        throw new Error("save failed");
      } finally {
        setSaving(false);
      }
    },
    [subject._id, onUpdate, notifier]
  );

  return { persist, saving, cellError };
}
