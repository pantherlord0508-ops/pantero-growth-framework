/**
 * Features grid component.
 *
 * Displays the core product features in a responsive grid
 * with hover animations and icons.
 */

"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Users, GraduationCap, ShoppingBag, Fingerprint, Blocks } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Companion",
    description:
      "Offline-capable AI mentorship in your language. Career guidance, code help, and personalized learning paths — even without internet.",
    color: "#c9a54e",
  },
  {
    icon: Users,
    title: "Social Network",
    description:
      "Connect with peers, collaborate on projects, showcase portfolios, and share your work with a global tech community.",
    color: "#635BFF",
  },
  {
    icon: GraduationCap,
    title: "Learning Hub",
    description:
      "Free structured courses in programming, data science, cybersecurity, UI/UX, cloud computing, and mobile development.",
    color: "#00A4EF",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "Buy and sell affordable tech equipment, resources, and digital assets. From laptops to courses, all in one place.",
    color: "#FF9900",
  },
  {
    icon: Fingerprint,
    title: "Digital Identity",
    description:
      "Your verified credentials, blockchain-backed certificates, and portfolio that travels with you — owned by you.",
    color: "#4ECB71",
  },
  {
    icon: Blocks,
    title: "Web3 Powered",
    description:
      "Blockchain credentials, NFT achievement badges, crypto payments, and future DAO governance. Your achievements, verified.",
    color: "#E91E8C",
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
            Your Complete{" "}
            <span className="text-gradient-gold">Tech Ecosystem</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Six pillars built to take African tech talent from zero to world-class.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: 0.08 + i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1.5"
                style={
                  {
                    "--feature-color": f.color,
                  } as React.CSSProperties
                }
              >
                {/* Glow on hover */}
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
                  style={{ background: f.color }}
                />
                {/* Bottom border glow */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderColor: `${f.color}30`,
                    background: `${f.color}12`,
                  }}
                >
                  <f.icon
                    className="h-5 w-5 transition-colors"
                    style={{ color: f.color }}
                  />
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
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
