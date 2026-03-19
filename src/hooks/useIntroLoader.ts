import { useState, useCallback } from "react";

const STORAGE_KEY = "pantero_intro_seen";

export function useIntroLoader() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    setShowIntro(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  }, []);

  return { showIntro, dismiss };
}
