import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Coins, ShoppingBag, Users, Store, Palette, Quote,
} from "lucide-react";

const IntroCanvas = lazy(() => import("./IntroCanvas"));

const GOLD = "#C6A85B";

type Phase = "countdown" | "dice" | "emerge" | "brand" | "features" | "dissolve" | "exit";

const PHASE_DURATIONS: Record<Phase, number> = {
  countdown: 3000,
  dice: 3000,
  emerge: 44000,
  brand: 4000,
  features: 3000,
  dissolve: 2000,
  exit: 1000,
};

const PHASE_ORDER: Phase[] = [
  "countdown", "dice", "emerge", "brand", "features", "dissolve", "exit",
];

const FEATURE_DATA = [
  {
    icon: Bot,
    name: "AI Study Assistant",
    description: "Your intelligent study companion powered by advanced AI. Get personalized explanations, instant answers to complex questions, and adaptive learning paths tailored to your pace and style.",
  },
  {
    icon: Coins,
    name: "Token Mining",
    description: "Earn rewards as you learn. Our gamified mining system converts your study progress into tokens — the more you engage, practice, and achieve, the more you earn within the ecosystem.",
  },
  {
    icon: ShoppingBag,
    name: "Marketplace",
    description: "A vibrant digital marketplace where knowledge meets commerce. Trade study materials, premium resources, and exclusive content created by top learners and educators in the community.",
  },
  {
    icon: Users,
    name: "Social Profiles",
    description: "Connect with like-minded learners worldwide. Build your academic profile, showcase achievements, join study groups, and collaborate on projects with peers who share your ambitions.",
  },
  {
    icon: Store,
    name: "Affiliate Store",
    description: "Discover curated tools, books, and resources recommended by top performers. Earn commissions by sharing products you love with your network through our integrated affiliate program.",
  },
  {
    icon: Palette,
    name: "Custom Themes",
    description: "Make Pantero truly yours. Choose from a gallery of stunning themes or craft your own — from dark mode elegance to vibrant color palettes that match your personal aesthetic.",
  },
  {
    icon: Quote,
    name: "Quote Generator",
    description: "Start every session inspired. Our curated collection delivers motivational and thought-provoking quotes from great minds, keeping you focused and driven throughout your learning journey.",
  },
];

interface Props {
  onComplete: () => void;
}

const PanteroIntroLoader = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdownNum, setCountdownNum] = useState(1);
  const [webGLFailed, setWebGLFailed] = useState(false);
  const [revealedCube, setRevealedCube] = useState<number | null>(null);
  const phaseIndexRef = useRef(0);

  // Detect WebGL
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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
      if (n > 5) { clearInterval(iv); return; }
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
    };
    const duration = PHASE_DURATIONS[phase];
    const timer = setTimeout(advancePhase, duration);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const activeFeature = revealedCube !== null ? FEATURE_DATA[revealedCube] : null;

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
        style={{ color: GOLD, borderColor: GOLD, background: "transparent" }}
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
          <motion.div key="countdown" className="absolute inset-0 z-40 flex items-center justify-center">
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

      {/* Left-side feature detail panel */}
      <AnimatePresence mode="wait">
        {activeFeature && phase === "emerge" && (
          <motion.div
            key={revealedCube}
            className="absolute left-0 top-0 bottom-0 z-40 flex items-center"
            style={{ width: "42%" }}
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="px-8 md:px-12 lg:px-16 py-8 w-full">
              {/* Gold accent line */}
              <motion.div
                className="w-12 h-0.5 mb-6"
                style={{ background: GOLD }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              />

              {/* Icon */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <activeFeature.icon size={36} color={GOLD} strokeWidth={1.5} />
              </motion.div>

              {/* Feature name */}
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 tracking-wide"
                style={{ color: GOLD, textShadow: `0 0 20px ${GOLD}30` }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                {activeFeature.name}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-sm md:text-base leading-relaxed"
                style={{ color: "rgba(255,255,255,0.7)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                {activeFeature.description}
              </motion.p>

              {/* Cube counter */}
              <motion.div
                className="mt-8 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {FEATURE_DATA.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      background: i <= (revealedCube ?? -1) ? GOLD : "rgba(255,255,255,0.15)",
                      boxShadow: i === revealedCube ? `0 0 8px ${GOLD}` : "none",
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand name during brand phase */}
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
          <IntroCanvas phase={phase} onRevealedCube={setRevealedCube} />
        )}
      </Suspense>
    </motion.div>
  );
};

/* 2D Fallback */
const Fallback2D = ({
  phase, countdownNum, onSkip,
}: { phase: Phase; countdownNum: number; onSkip: () => void }) => {
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
              style={{ width: 52, height: 52, backgroundColor: GOLD, color: "#000", boxShadow: `0 0 24px ${GOLD}` }}
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
