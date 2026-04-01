/**
 * Features grid component.
 *
 * Displays the three core product features in a responsive grid
 * with hover animations and icons.
 */

"use client";

import { motion } from "framer-motion";
import { Fingerprint, BrainCircuit, Briefcase } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "Digital Identity",
    description:
      "A decentralized identity that belongs to you. Verify credentials, prove skills, and own your data \u2014 no corporation required.",
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

export function FeaturesGrid() {
  return (
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
  );
}
