/**
 * Recent signups ticker component.
 *
 * Displays a horizontal scrolling list of recent signups
 * with animated entry transitions.
 */

"use client";

import { motion } from "framer-motion";

interface RecentSignup {
  name: string;
  time: string;
}

interface RecentSignupsTickerProps {
  signups: RecentSignup[];
}

export function RecentSignupsTicker({ signups }: RecentSignupsTickerProps) {
  if (signups.length === 0) return null;

  return (
    <section className="border-t border-border py-8">
      <div className="container">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-primary">
            Recent
          </span>
          <div className="flex gap-6 overflow-hidden">
            {signups.slice(0, 6).map((s, i) => (
              <motion.span
                key={`${s.name}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="shrink-0 text-sm text-muted-foreground"
              >
                <span className="font-medium text-foreground">{s.name}</span> joined
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
