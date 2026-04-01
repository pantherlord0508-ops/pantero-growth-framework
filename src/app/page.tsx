"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Fingerprint, BrainCircuit, Briefcase, ChevronDown } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import LiveStats from "@/components/dashboard/live-stats";
import SignupForm from "@/components/signup-form";

const features = [
  {
    icon: Fingerprint,
    title: "Digital Identity",
    description:
      "A decentralized identity that belongs to you. Verify credentials, prove skills, and own your data — no corporation required.",
  },
  {
    icon: BrainCircuit,
    title: "AI Companion",
    description:
      "An offline-capable AI that speaks Yoruba, Swahili, Hausa, and more. It guides you through skills, jobs, and opportunities in your language.",
  },
  {
    icon: Briefcase,
    title: "Jobs & Skills",
    description:
      "A marketplace matching your verified skills to real opportunities. Earn blockchain-backed certificates that employers trust.",
  },
];

interface RecentSignup {
  name: string;
  time: string;
}

export default function HomePage() {
  const [recentSignups, setRecentSignups] = useState<RecentSignup[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.recent_signups) {
          setRecentSignups(data.recent_signups);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
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

      {/* Recent Signups Ticker */}
      {recentSignups.length > 0 && (
        <section className="border-t border-border py-8">
          <div className="container">
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-primary">
                Recent
              </span>
              <div className="flex gap-6 overflow-hidden">
                {recentSignups.slice(0, 6).map((s, i) => (
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
      )}

      {/* Signup Form */}
      <section id="signup" className="border-t border-border py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Get Early Access
              </p>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Join the <span className="text-gradient-gold">Pantero Waitlist</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Secure your spot. Refer friends to move up the queue.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-md">
              <SignupForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              What Is Pantero?
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              A Nexus for <span className="text-gradient-gold">Africa&apos;s Digital Future</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="group h-full rounded-xl border border-border bg-card p-8 transition-all hover:border-gold-dim hover:shadow-gold hover:-translate-y-1">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24 md:py-32 relative overflow-hidden">
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
        />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ready to Own <span className="text-gradient-gold">Your Future?</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Your identity. Your language. Your opportunity. It starts here.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
              >
                Join the Waitlist
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://chat.whatsapp.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 font-display text-sm font-medium text-foreground transition-all hover:bg-secondary hover:border-gold-dim"
              >
                WhatsApp Community
              </a>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              No spam. Unsubscribe anytime.{" "}
              <span className="text-primary">Be early, not late.</span>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
