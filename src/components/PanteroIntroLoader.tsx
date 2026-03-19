import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Coins,
  ShoppingBag,
  Users,
  Store,
  Palette,
  Quote,
} from "lucide-react";

interface Props {
  onComplete: () => void;
}

const LETTERS = ["P", "A", "N", "T", "E", "R", "O"];

const FEATURES: { icon: React.ElementType; label: string }[] = [
  { icon: Bot, label: "AI Assistant" },
  { icon: Coins, label: "Token Mining" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Users, label: "Social Feed" },
  { icon: Store, label: "Affiliate Store" },
  { icon: Palette, label: "Themes" },
  { icon: Quote, label: "Quotes" },
];

type Phase = "countdown" | "cubes" | "brand" | "features" | "exit";

const GOLD = "hsl(42 60% 54%)";
const GOLD_GLOW = "hsl(42 70% 62%)";

const PanteroIntroLoader = ({ onComplete }: Props) => {
  const [phase, setPhase] = useState<Phase>("countdown");
  const [countdownNum, setCountdownNum] = useState(1);

  // Safety timeout — auto-skip if animation lags
  useEffect(() => {
    const t = setTimeout(onComplete, 7000);
    return () => clearTimeout(t);
  }, [onComplete]);

  // Phase sequencer
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Countdown: 5 numbers × 300ms = 1500ms
    let t = 0;
    for (let i = 2; i <= 5; i++) {
      t += 300;
      timers.push(setTimeout(() => setCountdownNum(i), t));
    }
    t += 400;
    timers.push(setTimeout(() => setPhase("cubes"), t));

    // Cubes phase: 800ms
    t += 800;
    timers.push(setTimeout(() => setPhase("brand"), t));

    // Brand phase: 800ms
    t += 800;
    timers.push(setTimeout(() => setPhase("features"), t));

    // Features phase: 1500ms
    t += 1500;
    timers.push(setTimeout(() => setPhase("exit"), t));

    // Exit phase: 600ms then complete
    t += 600;
    timers.push(setTimeout(onComplete, t));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#000" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-10 px-4 py-1.5 text-sm rounded-md border transition-colors"
        style={{
          color: GOLD,
          borderColor: GOLD,
          background: "transparent",
        }}
      >
        Skip
      </button>

      {/* Countdown Phase */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.span
            key={countdownNum}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.4 }}
            transition={{ duration: 0.25 }}
            className="font-display text-7xl font-bold select-none"
            style={{
              color: GOLD,
              textShadow: `0 0 30px ${GOLD_GLOW}, 0 0 60px ${GOLD_GLOW}`,
            }}
          >
            {countdownNum}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Cubes Phase — 7 squares fly outward from center */}
      {phase === "cubes" && (
        <div className="relative w-full h-full flex items-center justify-center">
          {LETTERS.map((_, i) => {
            const angle = (i / 7) * Math.PI * 2;
            const dist = 120;
            return (
              <motion.div
                key={`cube-${i}`}
                className="absolute rounded-lg"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: GOLD,
                  boxShadow: `0 0 20px ${GOLD_GLOW}`,
                }}
                initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, filter: "blur(8px)" }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  scale: 1,
                  rotate: 180 + i * 30,
                  filter: "blur(0px)",
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            );
          })}
        </div>
      )}

      {/* Brand Phase — cubes form PANTERO */}
      {phase === "brand" && (
        <div className="flex gap-3">
          {LETTERS.map((letter, i) => (
            <motion.div
              key={`letter-${i}`}
              className="flex items-center justify-center rounded-lg font-display text-xl font-bold"
              style={{
                width: 52,
                height: 52,
                backgroundColor: GOLD,
                color: "#000",
                boxShadow: `0 0 24px ${GOLD_GLOW}`,
              }}
              initial={{ opacity: 0, y: -60, rotate: -90, scale: 0.4 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              {letter}
            </motion.div>
          ))}
        </div>
      )}

      {/* Features Phase — cubes flip to show features */}
      {phase === "features" && (
        <div className="flex gap-3">
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={`feat-${i}`}
                className="flex flex-col items-center justify-center rounded-lg gap-1"
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: GOLD,
                  color: "#000",
                  boxShadow: `0 0 24px ${GOLD_GLOW}`,
                }}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.12 }}
              >
                <Icon size={16} strokeWidth={2.5} />
                <span className="text-[6px] font-semibold leading-none text-center">
                  {feat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default PanteroIntroLoader;
