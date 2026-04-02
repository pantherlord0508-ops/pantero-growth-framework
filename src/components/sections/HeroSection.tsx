/**
 * Hero section component for the landing page.
 *
 * Displays the main value proposition, animated particles,
 * live stats counter, and primary CTA buttons.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import LiveStats from "@/components/dashboard/live-stats";

const companyLogos = [
  { name: "Google", color: "#4285F4" },
  { name: "Meta", color: "#0668E1" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Stripe", color: "#635BFF" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-radial pt-16">
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            style={{ left: `${20 + i * 15}%`, top: `${30 + i * 8}%` }}
            animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
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
          <motion.p
            className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Pantero
          </motion.p>
          <motion.h1
            className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Own Your Identity.{" "}
            <span className="text-gradient-gold">Shape Your Path.</span>
          </motion.h1>
          <motion.p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Pantero gives every African a secure digital identity, an AI companion that speaks your language, and direct access to jobs and skills that matter.
          </motion.p>

          {/* Trust signals - Company logos */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Join thousands already on the waitlist
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale">
              {companyLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2"
                >
                  <div
                    className="h-4 w-4 rounded"
                    style={{ background: logo.color }}
                  />
                  <span className="text-sm font-semibold text-foreground">
                    {logo.name}
                  </span>
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

          <motion.div
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link
              href="/join"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:scale-[1.03] hover:opacity-90"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#signup"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 font-display text-sm font-medium text-foreground transition-all hover:bg-secondary hover:border-gold-dim"
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
          <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
