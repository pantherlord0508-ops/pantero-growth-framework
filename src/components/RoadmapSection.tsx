"use client";

import AnimatedSection from "./AnimatedSection";
import { CheckCircle2, Users, FlaskConical, Beaker, Rocket, Sparkles } from "lucide-react";

const milestones = [
  {
    icon: CheckCircle2,
    date: "Dec 2025",
    title: "Waitlist Creation",
    description: "The Pantero waitlist went live, inviting early believers to join the movement and secure their spot.",
    active: true,
    completed: true,
  },
  {
    icon: CheckCircle2,
    date: "Apr 1, 2026",
    title: "Community Formation",
    description: "Our WhatsApp community launched, connecting early members to share ideas and shape the platform together.",
    active: true,
    completed: true,
  },
  {
    icon: FlaskConical,
    date: "Jun 2026",
    title: "Alpha Testing",
    description: "Closed alpha release for top waitlist members. Core identity and AI features tested with real users.",
    active: false,
    completed: false,
  },
  {
    icon: Beaker,
    date: "Aug 2026",
    title: "Beta Testing",
    description: "Open beta with expanded feature set. Jobs marketplace, skills platform, and multi-language AI companion.",
    active: false,
    completed: false,
  },
  {
    icon: Rocket,
    date: "Oct 2026",
    title: "Final Launch",
    description: "Pantero goes live for everyone. Full platform with digital identity, AI companion, and job marketplace.",
    active: false,
    completed: false,
  },
  {
    icon: Sparkles,
    date: "Nov 2026",
    title: "Ecosystem Expansion",
    description: "University partnerships, 10+ African languages, regional data centers, and API marketplace for third parties.",
    active: false,
    completed: false,
  },
];

const RoadmapSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">Roadmap</p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Where We&apos;re{" "}
            <span className="text-gradient-gold">Headed.</span>
          </h2>
        </div>
      </AnimatedSection>

      <div className="mx-auto mt-16 max-w-2xl">
        {milestones.map((m, i) => (
          <AnimatedSection key={m.title} delay={0.1 + i * 0.1}>
            <div className="relative flex gap-6 pb-12 last:pb-0">
              {i < milestones.length - 1 && (
                <div className={`absolute left-[19px] top-11 bottom-0 w-px ${m.completed ? "bg-primary/40" : "bg-border"}`} />
              )}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                  m.completed
                    ? "border-primary bg-primary/20"
                    : m.active
                    ? "border-primary bg-primary/20"
                    : "border-border bg-card"
                }`}
              >
                <m.icon className={`h-4 w-4 ${m.completed ? "text-primary" : m.active ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-widest ${m.completed ? "text-primary" : "text-muted-foreground"}`}>
                    {m.date}
                  </span>
                  {m.completed && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Done
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default RoadmapSection;
