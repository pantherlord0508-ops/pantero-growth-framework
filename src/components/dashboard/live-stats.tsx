"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, CalendarDays, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  total_signups: number;
  signups_today: number;
  signups_this_week: number;
  success?: boolean;
  error?: string;
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplay(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplay(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-3xl font-bold text-foreground tabular-nums md:text-4xl"
    >
      {display.toLocaleString()}
    </motion.span>
  );
}

const statCards = [
  { key: "total", icon: Users, label: "Total Signups", field: "total_signups" as const },
  { key: "today", icon: Calendar, label: "Today", field: "signups_today" as const },
  { key: "week", icon: CalendarDays, label: "This Week", field: "signups_this_week" as const },
];

export default function LiveStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    fetch("/api/stats", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        
        // Handle API-level errors
        if (data.success === false) {
          setError(data.error || "Failed to load stats");
          setLoading(false);
          return;
        }
        
        setStats({
          total_signups: data.total_signups ?? 0,
          signups_today: data.signups_today ?? 0,
          signups_this_week: data.signups_this_week ?? 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          setError("Request timed out");
        } else {
          setError(err.message || "Failed to load stats");
        }
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-xl border border-border bg-card p-6 text-center">
            <Skeleton className="mx-auto mb-3 h-10 w-10 rounded-full" />
            <Skeleton className="mx-auto h-8 w-20" />
            <Skeleton className="mx-auto mt-2 h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 text-red-400">{error || "Failed to load stats"}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 text-center"
        >
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <card.icon className="h-5 w-5 text-primary" />
          </div>
          <AnimatedCounter value={stats[card.field]} />
          <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
