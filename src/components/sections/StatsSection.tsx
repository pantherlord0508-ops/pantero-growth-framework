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

let cachedSignups: number | null = null;

const staticStats: Stat[] = [
  {
    icon: Users,
    label: "Waitlist Members",
    value: 187,
    suffix: "+",
    description: "African youth already on the waitlist",
    color: "#c9a54e",
  },
  {
    icon: Globe2,
    label: "Countries Reached",
    value: 3,
    suffix: "+",
    description: "Nigeria, Ghana, Kenya",
    color: "#635BFF",
  },
  {
    icon: Share2,
    label: "Early Testers",
    value: 12,
    suffix: "+",
    description: "Beta testers already using Pantero",
    color: "#4ECB71",
  },
  {
    icon: TrendingUp,
    label: "Platform Valuation",
    value: 50,
    suffix: "M+",
    description: "$50M+ growth potential by launch",
    color: "#FF9900",
  },
];

const premiumStats: Stat[] = [
  {
    icon: Users,
    label: "TAM",
    value: 2,
    suffix: "B+",
    description: "Total Addressable Market in Africa",
    color: "#10B981",
  },
  {
    icon: Globe2,
    label: "SAM",
    value: 400,
    suffix: "M+",
    description: "Serviceable Available Market",
    color: "#3B82F6",
  },
  {
    icon: Share2,
    label: "Youth Online",
    value: 650,
    suffix: "M+",
    description: "African youth with internet access",
    color: "#8B5CF6",
  },
  {
    icon: TrendingUp,
    label: "Tech Skills Gap",
    value: 25,
    suffix: "M+",
    description: "Unfilled tech jobs in Africa by 2030",
    color: "#F59E0B",
  },
];

function useCountUp(target: number, duration = 1800, enabled = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutExpo
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
      {/* Background glow */}
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
  const [stats, setStats] = useState<Stat[]>(staticStats);

  // Attempt to replace "Waitlist Members" with real live count
  useEffect(() => {
    if (cachedSignups !== null) {
      updateSignups(cachedSignups);
      return;
    }
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.total_signups) {
          cachedSignups = d.total_signups;
          updateSignups(d.total_signups);
        }
      })
      .catch(() => {});
  }, []);

  function updateSignups(n: number) {
    setStats((prev) =>
      prev.map((s) => (s.label === "Waitlist Members" ? { ...s, value: n } : s))
    );
  }

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

        {/* Premium Stats - $50M+ Waitlist Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="text-center mb-8">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              $50M+ Waitlist Potential
            </p>
            <h3 className="font-display text-2xl font-bold text-foreground">
              Why Investors Are{" "}
              <span className="text-gradient-gold">Watching Closely</span>
            </h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {premiumStats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} enabled={inView} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
