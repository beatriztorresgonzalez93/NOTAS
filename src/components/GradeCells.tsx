"use client";

import { useEffect, useState } from "react";
import {
  formatGrade,
  formatTaskGrade,
  parseGradeInput,
  parseTaskInput,
} from "@/lib/grades";
import { gradeCellClasses } from "@/lib/grade-styles";
import type { TaskGrade } from "@/types/subject";

export function TaskGradeCell({
  value,
  onSave,
  disabled,
  compact,
}: {
  value: TaskGrade;
  onSave: (value: TaskGrade) => Promise<void>;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [local, setLocal] = useState(formatTaskGrade(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLocal(formatTaskGrade(value));
  }, [value]);

  const commit = async () => {
    const parsed = parseTaskInput(local);
    if (parsed === "INVALID") {
      setLocal(formatTaskGrade(value));
      setError(true);
      return;
    }
    if (parsed === value) return;

    setSaving(true);
    setError(false);
    try {
      await onSave(parsed);
    } catch {
      setLocal(formatTaskGrade(value));
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const setNe = async () => {
    if (value === "NE") return;
    setSaving(true);
    setError(false);
    try {
      await onSave("NE");
      setLocal("NE");
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const styleValue: TaskGrade = (() => {
    const t = local.trim();
    if (t === "") return null;
    if (t.toUpperCase() === "NE") return "NE";
    const n = parseGradeInput(t);
    return n !== null ? n : value;
  })();

  return (
    <div className={compact ? "flex flex-col gap-0.5" : "flex flex-col items-stretch gap-1"}>
      <input
        type="text"
        inputMode="text"
        placeholder="—"
        title="Nota 0–10 o NE"
        value={local}
        disabled={disabled || saving}
        onChange={(e) => {
          setLocal(e.target.value);
          setError(false);
        }}
        onBlur={() => void commit()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={`grade-cell w-full ${compact ? "min-w-0 py-1.5 text-xs" : "min-w-[2.75rem] py-2 text-sm"} ${gradeCellClasses(error ? value : styleValue)} ${error ? "ring-2 ring-red-500/70" : ""}`}
      />
      {!compact && (
        <button
          type="button"
          disabled={disabled || saving || value === "NE"}
          onClick={() => void setNe()}
          className="rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-500/80 transition hover:bg-amber-500/10 hover:text-amber-400 disabled:cursor-default disabled:opacity-30"
        >
          NE
        </button>
      )}
      {compact && value !== "NE" && (
        <button
          type="button"
          disabled={disabled || saving}
          onClick={() => void setNe()}
          className="text-[8px] font-bold uppercase text-amber-500/70"
        >
          NE
        </button>
      )}
    </div>
  );
}

export function GradeCell({
  value,
  onSave,
  disabled,
  highlight,
  compact,
}: {
  value: number | null;
  onSave: (value: number | null) => Promise<void>;
  disabled?: boolean;
  highlight?: boolean;
  compact?: boolean;
}) {
  const [local, setLocal] = useState(formatGrade(value));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLocal(formatGrade(value));
  }, [value]);

  const commit = async () => {
    const parsed = parseGradeInput(local);
    if (local.trim() !== "" && parsed === null) {
      setLocal(formatGrade(value));
      setError(true);
      return;
    }
    if (parsed === value || (parsed === null && value === null)) return;

    setSaving(true);
    setError(false);
    try {
      await onSave(parsed);
    } catch {
      setLocal(formatGrade(value));
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  const styleValue =
    local.trim() === "" ? null : (parseGradeInput(local) ?? value);

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder="—"
      value={local}
      disabled={disabled || saving}
      onChange={(e) => {
        setLocal(e.target.value);
        setError(false);
      }}
      onBlur={() => void commit()}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={`grade-cell w-full ${compact ? "min-w-0 py-1.5 text-xs" : "min-w-[2.75rem] py-2 text-sm"} ${gradeCellClasses(error ? value : styleValue, { highlight })} ${error ? "ring-2 ring-red-500/70" : ""}`}
    />
  );
}
