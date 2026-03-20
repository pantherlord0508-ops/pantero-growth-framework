import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pantero_intro_seen";
export const ENABLE_PANTERO_INTRO = true;

export function useIntroLoader() {
  const [showIntro, setShowIntro] = useState(() => {
    if (!ENABLE_PANTERO_INTRO) return false;
    // Always show intro for testing/demo purposes
    // To restore persistence, uncomment the localStorage check below:
    // try {
    //   return localStorage.getItem(STORAGE_KEY) !== "true";
    // } catch {
    //   return false;
    // }
    return true;
  });

  const dismiss = useCallback(() => {
    setShowIntro(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  }, []);

  // Auto-skip safety net (12s max)
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(dismiss, 12000);
    return () => clearTimeout(t);
  }, [showIntro, dismiss]);

  return { showIntro, dismiss };
}
