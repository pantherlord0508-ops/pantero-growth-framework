import { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroCanvas = lazy(() => import("./IntroCanvas"));

const GOLD = "#C6A85B";

type Phase =
  | "countdown"
  | "dice"
  | "emerge"
  | "brand"
  | "features"
  | "dissolve"
  | "exit";

const PHASE_DURATIONS: Record<Phase, number> = {
  countdown: 2000,
  dice: 1500,
  emerge: 1500,
  brand: 1200,
  features: 2500,
  dissolve: 1200,
  exit: 800,
};

const PHASE_ORDER: Phase[] = [
  "countdown",
  "dice",
  "emerge",
  "brand",
  "features",
  "dissolve",
  "exit",
];

interface Props {
  onComplete: () => void;
}

const PanteroIntroLoader = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdownNum, setCountdownNum] = useState(1);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [phaseStart, setPhaseStart] = useState(Date.now());
  const phaseIndexRef = useRef(0);

  // Detect WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebGLFailed(true);
    } catch {
      setWebGLFailed(true);
    }
  }, []);

  // Countdown ticker
  useEffect(() => {
    if (phase !== "countdown") return;
    let n = 1;
    const iv = setInterval(() => {
      n++;
      if (n > 5) {
        clearInterval(iv);
        return;
      }
      setCountdownNum(n);
    }, 350);
    return () => clearInterval(iv);
  }, [phase]);

  // Phase sequencer
  useEffect(() => {
    const advancePhase = () => {
      phaseIndexRef.current++;
      if (phaseIndexRef.current >= PHASE_ORDER.length) {
        onComplete();
        return;
      }
      const next = PHASE_ORDER[phaseIndexRef.current];
      setPhase(next);
      setPhaseStart(Date.now());
    };

    const duration = PHASE_DURATIONS[phase];
    const timer = setTimeout(advancePhase, duration);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const elapsed = (Date.now() - phaseStart) / 1000;

  // Fallback 2D if WebGL fails
  if (webGLFailed) {
    return <Fallback2D phase={phase} countdownNum={countdownNum} onSkip={onComplete} />;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: "#000" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Skip button */}
      <motion.button
        onClick={onComplete}
        className="absolute top-6 right-6 z-50 px-5 py-2 text-sm rounded-md border font-body tracking-wider"
        style={{
          color: GOLD,
          borderColor: GOLD,
          background: "transparent",
        }}
        whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${GOLD}40` }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Skip
      </motion.button>

      {/* Countdown overlay */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key="countdown"
            className="absolute inset-0 z-40 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={countdownNum}
                initial={{ opacity: 0, scale: 0.3, filter: "blur(12px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.8, filter: "blur(6px)" }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="font-display text-8xl md:text-9xl font-bold select-none"
                style={{
                  color: GOLD,
                  textShadow: `0 0 40px ${GOLD}, 0 0 80px ${GOLD}80, 0 0 120px ${GOLD}40`,
                }}
              >
                {countdownNum}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand name flash during brand phase */}
      <AnimatePresence>
        {phase === "brand" && (
          <motion.div
            className="absolute bottom-16 left-0 right-0 z-40 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span
              className="font-display text-lg tracking-[0.4em] uppercase"
              style={{ color: GOLD, textShadow: `0 0 20px ${GOLD}60` }}
            >
              Pantero
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: `${GOLD} transparent` }}
            />
          </div>
        }
      >
        {phase !== "countdown" && (
          <IntroCanvas phase={phase} />
        )}
      </Suspense>
    </motion.div>
  );
};

/* 2D Fallback for no-WebGL */
const Fallback2D = ({
  phase,
  countdownNum,
  onSkip,
}: {
  phase: Phase;
  countdownNum: number;
  onSkip: () => void;
}) => {
  const LETTERS = ["P", "A", "N", "T", "E", "R", "O"];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "#000" }}
      animate={phase === "exit" ? { opacity: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <button
        onClick={onSkip}
        className="absolute top-6 right-6 z-10 px-4 py-1.5 text-sm rounded-md border"
        style={{ color: GOLD, borderColor: GOLD, background: "transparent" }}
      >
        Skip
      </button>

      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.span
            key={countdownNum}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.25 }}
            className="font-display text-8xl font-bold"
            style={{ color: GOLD, textShadow: `0 0 40px ${GOLD}` }}
          >
            {countdownNum}
          </motion.span>
        )}
      </AnimatePresence>

      {(phase === "brand" || phase === "features") && (
        <div className="flex gap-3">
          {LETTERS.map((letter, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center rounded-lg font-display text-xl font-bold"
              style={{
                width: 52,
                height: 52,
                backgroundColor: GOLD,
                color: "#000",
                boxShadow: `0 0 24px ${GOLD}`,
              }}
              initial={{ opacity: 0, y: -60, scale: 0.4 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {letter}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PanteroIntroLoader;
