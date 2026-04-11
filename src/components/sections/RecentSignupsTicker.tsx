/**
 * Recent signups ticker component.
 *
 * Displays a horizontal scrolling list of recent signups
 * with animated entry transitions and relative time.
 */

"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface RecentSignup {
  name: string;
  time: string;
}

interface RecentSignupsTickerProps {
  signups: RecentSignup[];
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function LiveTickerItem({ name, time }: { name: string; time: string }) {
  const [relativeTime, setRelativeTime] = useState(getRelativeTime(time));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(time));
    }, 60000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <motion.span
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="shrink-0 text-sm text-muted-foreground"
    >
      <span className="font-medium text-foreground">{name}</span>
      <span className="text-primary/60"> · {relativeTime}</span>
    </motion.span>
  );
}

export function RecentSignupsTicker({ signups }: RecentSignupsTickerProps) {
  if (signups.length === 0) return null;

  return (
    <section className="border-t border-border py-8">
      <div className="container">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="shrink-0 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            Live
          </span>
          <div className="flex gap-6 overflow-hidden">
            {signups.slice(0, 6).map((s, i) => (
              <LiveTickerItem key={`${s.name}-${i}`} name={s.name} time={s.time} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
