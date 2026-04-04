/**
 * Hero section component for the landing page.
 *
 * Displays the main value proposition, animated particles,
 * live stats counter, and primary CTA buttons.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import LiveStats from "@/components/dashboard/live-stats";

const companyLogos = [
  { name: "Google", color: "#4285F4" },
  { name: "Meta", color: "#0668E1" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Stripe", color: "#635BFF" },
];

// 14 particles at varied positions
const particles = [
  { left: "10%", top: "18%", size: 3, dur: 3.5 },
  { left: "22%", top: "34%", size: 2, dur: 4.2 },
  { left: "35%", top: "20%", size: 1.5, dur: 3.0 },
  { left: "50%", top: "12%", size: 2.5, dur: 5.0 },
  { left: "62%", top: "28%", size: 2, dur: 3.8 },
  { left: "75%", top: "15%", size: 3, dur: 4.5 },
  { left: "85%", top: "40%", size: 1.5, dur: 3.2 },
  { left: "15%", top: "60%", size: 2, dur: 4.0 },
  { left: "30%", top: "72%", size: 3, dur: 5.2 },
  { left: "55%", top: "65%", size: 1.5, dur: 3.6 },
  { left: "70%", top: "70%", size: 2.5, dur: 4.8 },
  { left: "88%", top: "65%", size: 2, dur: 3.4 },
  { left: "45%", top: "80%", size: 1.5, dur: 4.1 },
  { left: "5%", top: "45%", size: 2, dur: 3.9 },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-radial pt-16">
      {/* Primary radial glow */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full opacity-[0.08]"
        style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
      />

      {/* Animated grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(42 60% 54% / 0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(42 60% 54% / 0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/40"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [-12, 12, -12], opacity: [0.2, 0.7, 0.2] }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.18,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary"
          >
            <Sparkles className="h-3 w-3" />
            Pantero — The Future Is African
          </motion.div>

          <motion.h1
            className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            Your Path to Tech.{" "}
            <span className="text-gradient-gold">Start Here.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            The all-in-one ecosystem for African youth to explore, pursue, and succeed in tech careers.
            AI mentorship, courses, community, and marketplace — powered by Web3.
          </motion.p>

          {/* Trust signals */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Trusted community — from all corners of Africa
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 opacity-50 grayscale">
              {companyLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-secondary/40 px-3 py-2 backdrop-blur-sm"
                >
                  <div className="h-3.5 w-3.5 rounded" style={{ background: logo.color }} />
                  <span className="text-xs font-semibold text-foreground">{logo.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live stats */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <LiveStats />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link
              href="/join"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:scale-[1.04] hover:shadow-[0_0_28px_-4px_hsl(42_60%_54%_/_0.5)] active:scale-[0.98]"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#signup"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 font-display text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-gold-dim hover:bg-secondary"
            >
              Sign Up Below
            </a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#signup"
          className="mt-16 inline-flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <ChevronDown className="h-5 w-5 animate-bounce text-muted-foreground" />
        </motion.a>
      </div>
    </section>
  );
}
