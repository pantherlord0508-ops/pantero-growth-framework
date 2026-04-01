"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";

interface RecentSignup {
  name: string;
  time: string;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function SignupTicker({ recentSignups }: { recentSignups?: RecentSignup[] }) {
  const [signups, setSignups] = useState<RecentSignup[]>(recentSignups || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (recentSignups) {
      setSignups(recentSignups);
      return;
    }

    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recent_signups) {
          setSignups(data.recent_signups);
        }
      })
      .catch(() => {});
  }, [recentSignups]);

  useEffect(() => {
    if (signups.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % signups.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [signups.length]);

  if (signups.length === 0) return null;

  const current = signups[currentIndex];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
        <Clock className="h-4 w-4 text-primary" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-sm font-medium text-foreground">{current.name}</span>
          <span className="text-xs text-muted-foreground">joined {timeAgo(current.time)}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
