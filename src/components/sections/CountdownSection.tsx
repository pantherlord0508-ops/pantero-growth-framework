/**
 * CountdownSection — animated countdown to Pantero's launch date.
 */
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Zap, Users, Clock } from "lucide-react";

const LAUNCH_DATE = new Date("2026-11-30T00:00:00Z");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LiveData {
  total_signups: number;
  signups_today: number;
  signups_this_week: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(LAUNCH_DATE.getTime() - now.getTime(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-[#c9a54e]/25 bg-[#0d1117] shadow-[inset_0_1px_0_hsl(42_60%_54%_/_0.15),0_0_30px_-8px_hsl(42_60%_54%_/_0.3)] sm:h-28 sm:w-28">
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#c9a54e]/10" />
          <motion.span
            key={display}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-display text-4xl font-extrabold tabular-nums text-white sm:text-5xl"
            style={{ textShadow: "0 0 20px hsl(42 60% 54% / 0.5)" }}
          >
            {display}
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#c9a54e]/60">
        {label}
      </span>
    </motion.div>
  );
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());
  const [launched, setLaunched] = useState(false);
  const [liveData, setLiveData] = useState<LiveData | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setLaunched(true);
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setLiveData({
          total_signups: data.total_signups || 0,
          signups_today: data.signups_today || 0,
          signups_this_week: data.signups_this_week || 0,
        });
      } catch (err) {
        console.error("Failed to fetch live data:", err);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-border py-24 md:py-32">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, hsl(42 60% 54%), transparent 70%)" }}
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
            <Rocket className="h-3.5 w-3.5" />
            Launch Countdown
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            {launched ? (
              <span className="text-gradient-gold">We&apos;ve Launched! 🚀</span>
            ) : (
              <>
                Pantero Goes Live{" "}
                <span className="text-gradient-gold">Very Soon</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {launched
              ? "The future of African tech careers is here. Welcome aboard."
              : "Secure your spot now — early members get priority access, 2× referral rewards, and founding member perks."}
          </p>

          {!launched && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <FlipUnit value={timeLeft.days} label="Days" />
              <span className="mb-6 hidden font-display text-4xl font-bold text-[#c9a54e]/40 sm:block">:</span>
              <FlipUnit value={timeLeft.hours} label="Hours" />
              <span className="mb-6 hidden font-display text-4xl font-bold text-[#c9a54e]/40 sm:block">:</span>
              <FlipUnit value={timeLeft.minutes} label="Minutes" />
              <span className="mb-6 hidden font-display text-4xl font-bold text-[#c9a54e]/40 sm:block">:</span>
              <FlipUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          )}

          {/* Live Stats Row */}
          {liveData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{liveData.total_signups}</span> on waitlist
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-foreground">{liveData.signups_today}</span> today
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-orange-400" />
                <span className="font-semibold text-foreground">{liveData.signups_this_week}</span> this week
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-5 py-2.5 text-sm text-amber-400"
          >
            <Zap className="h-4 w-4" />
            Early members get <strong className="font-bold text-amber-300">founding member</strong> status + 2× referral bonus
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
