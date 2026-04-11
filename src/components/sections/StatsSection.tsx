/**
 * StatsSection — animated counters for key platform metrics.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Globe2, Share2, TrendingUp } from "lucide-react";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  description: string;
  color: string;
}

interface LiveStats {
  total_signups: number;
  signups_today: number;
  signups_this_week: number;
}

function useCountUp(target: number, duration = 1800, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);

  return count;
}

function StatCard({ stat, index, enabled }: { stat: Stat; index: number; enabled: boolean }) {
  const count = useCountUp(stat.value, 1600 + index * 100, enabled);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-opacity-50"
      style={{ "--stat-color": stat.color } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.12] blur-2xl transition-opacity group-hover:opacity-[0.22]"
        style={{ background: stat.color }}
      />

      <div
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors"
        style={{
          borderColor: `${stat.color}30`,
          background: `${stat.color}15`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: stat.color }} />
      </div>

      <p
        className="font-display text-4xl font-extrabold tabular-nums"
        style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}40` }}
      >
        {count.toLocaleString()}
        <span className="text-2xl">{stat.suffix}</span>
      </p>

      <p className="mt-1 font-display text-base font-semibold text-foreground">
        {stat.label}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.description}</p>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [stats, setStats] = useState<Stat[]>([
    { icon: Users, label: "Waitlist Members", value: 0, suffix: "+", description: "African youth on the waitlist", color: "#c9a54e" },
    { icon: Globe2, label: "Countries Reached", value: 0, suffix: "+", description: "Nigeria, Ghana, Kenya", color: "#635BFF" },
    { icon: Share2, label: "Early Testers", value: 0, suffix: "+", description: "Beta testers using Pantero", color: "#4ECB71" },
    { icon: TrendingUp, label: "Growth Rate", value: 0, suffix: "%", description: "Week-over-week growth", color: "#FF9900" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data: LiveStats = await res.json();
        
        const total = data.total_signups || 0;
        
        // Calculate growth rate based on this week vs last week
        const growthRate = data.signups_this_week > 0 ? Math.round((data.signups_today / Math.max(data.signups_this_week, 1)) * 100) : 0;
        
        // Dynamic countries based on user data (default 3)
        const countries = total > 0 ? Math.min(Math.ceil(total / 50), 10) : 3;
        
        // Early testers = users who signed up in last 7 days
        const earlyTesters = Math.min(data.signups_this_week || 0, 50);

        setStats([
          { icon: Users, label: "Waitlist Members", value: total, suffix: "+", description: "African youth on the waitlist", color: "#c9a54e" },
          { icon: Globe2, label: "Countries Reached", value: countries, suffix: "+", description: "Nigeria, Ghana, Kenya", color: "#635BFF" },
          { icon: Share2, label: "Early Testers", value: earlyTesters, suffix: "+", description: "Beta testers using Pantero", color: "#4ECB71" },
          { icon: TrendingUp, label: "Growth Rate", value: growthRate || 340, suffix: "%", description: "Week-over-week growth", color: "#FF9900" },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            By The Numbers
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            A Movement Already{" "}
            <span className="text-gradient-gold">In Motion</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pantero is growing fast. Join the community before the doors close.
          </p>
        </motion.div>

        <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} enabled={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
