"use client";

export type SaveToastStatus = "idle" | "saving" | "saved" | "error";

export function SaveToast({ status }: { status: SaveToastStatus }) {
  if (status === "idle") return null;

  const config = {
    saving: {
      bg: "border-white/15 bg-zinc-900/95 text-zinc-300",
      icon: (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#e50914] border-t-transparent" />
      ),
      text: "Guardando…",
    },
    saved: {
      bg: "border-emerald-500/30 bg-emerald-950/90 text-emerald-200",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: "Guardado",
    },
    error: {
      bg: "border-red-500/40 bg-red-950/90 text-red-200",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      text: "Error al guardar",
    },
  }[status];

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-xl backdrop-blur-md ${config.bg}`}
      role="status"
      aria-live="polite"
    >
      {config.icon}
      {config.text}
    </div>
  );
}
