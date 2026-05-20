"use client";

import { useCallback, useRef, useState } from "react";
import type { SaveToastStatus } from "@/components/SaveToast";

export function useSaveNotifier() {
  const [status, setStatus] = useState<SaveToastStatus>("idle");
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const notifySaving = useCallback(() => {
    clearHideTimer();
    setStatus("saving");
  }, []);

  const notifySaved = useCallback(() => {
    clearHideTimer();
    setStatus("saved");
    hideTimer.current = setTimeout(() => {
      setStatus((s) => (s === "saved" ? "idle" : s));
    }, 2000);
  }, []);

  const notifyError = useCallback(() => {
    clearHideTimer();
    setStatus("error");
    hideTimer.current = setTimeout(() => {
      setStatus((s) => (s === "error" ? "idle" : s));
    }, 3500);
  }, []);

  return { status, notifySaving, notifySaved, notifyError };
}
