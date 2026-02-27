import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Users } from "lucide-react";

const LiveCounter = () => {
  const [views, setViews] = useState(120);
  const [waitlisters, setWaitlisters] = useState(80);
  const [viewFlash, setViewFlash] = useState(false);
  const [waitFlash, setWaitFlash] = useState(false);

  // Simulate organic view ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setViews((v) => v + 1);
      setViewFlash(true);
      setTimeout(() => setViewFlash(false), 600);
    }, Math.random() * 8000 + 6000);
    return () => clearInterval(interval);
  }, []);

  // Simulate waitlist ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setWaitlisters((w) => w + 1);
      setWaitFlash(true);
      setTimeout(() => setWaitFlash(false), 600);
    }, Math.random() * 18000 + 14000);
    return () => clearInterval(interval);
  }, []);

  const handleWaitlistClick = () => {
    setViews((v) => v + 1);
    setWaitlisters((w) => w + 1);
    setViewFlash(true);
    setWaitFlash(true);
    setTimeout(() => { setViewFlash(false); setWaitFlash(false); }, 600);
  };

  // Expose for parent
  (LiveCounter as any)._onWaitlistClick = handleWaitlistClick;

  return (
    <div className="flex items-center gap-6">
      <CounterPill icon={Eye} label="Views" count={views} flash={viewFlash} />
      <CounterPill icon={Users} label="Joined" count={waitlisters} flash={waitFlash} />
    </div>
  );
};

const CounterPill = ({
  icon: Icon,
  label,
  count,
  flash,
}: {
  icon: any;
  label: string;
  count: number;
  flash: boolean;
}) => (
  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
    <Icon className="h-3.5 w-3.5 text-primary" />
    <span className="text-xs text-muted-foreground">{label}</span>
    <motion.span
      key={count}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="font-display text-sm font-bold text-foreground tabular-nums"
    >
      {count}
    </motion.span>
    <AnimatePresence>
      {flash && (
        <motion.span
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -14 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold text-primary"
        >
          +1
        </motion.span>
      )}
    </AnimatePresence>
  </div>
);

export default LiveCounter;
