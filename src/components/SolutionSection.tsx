import { Fingerprint, BrainCircuit, Briefcase, GraduationCap } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: Fingerprint,
    title: "Your Identity, Your Control",
    description: "A decentralized digital identity that belongs to you — not a corporation. Verify your credentials, prove your skills, and own your data.",
  },
  {
    icon: BrainCircuit,
    title: "An AI That Gets You",
    description: "An offline-capable AI companion that speaks Yoruba, Swahili, Hausa, and more. It guides you through skills, jobs, and opportunities — in your language.",
  },
  {
    icon: Briefcase,
    title: "Jobs That Find You",
    description: "A marketplace that matches your verified skills and credentials to real opportunities. No more guessing — your work speaks for itself.",
  },
  {
    icon: GraduationCap,
    title: "Skills That Count",
    description: "Structured learning paths with verifiable credentials. Complete assessments, earn blockchain-backed certificates, and let employers trust what you know.",
  },
];

const SolutionSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            What Is Pantero?
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            A Nexus for{" "}
            <span className="text-gradient-gold">Africa's Digital Future</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pantero connects identity, intelligence, and opportunity into one place — built by Africans, for Africa.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {features.map((f, i) => (
          <AnimatedSection key={f.title} delay={0.1 + i * 0.08}>
            <div className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-gold-dim hover:shadow-gold hover:-translate-y-1 h-full">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
