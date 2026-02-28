import { BookOpen, Shuffle, TrendingDown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const problems = [
  {
    icon: BookOpen,
    title: "Too Much, Too Scattered",
    description: "You've got a hundred tabs open and no idea what to focus on. Sound familiar?",
  },
  {
    icon: Shuffle,
    title: "No Clear Path",
    description: "You learn random things but never feel like you're actually getting better. There's no system.",
  },
  {
    icon: TrendingDown,
    title: "Learning ≠ Earning",
    description: "Certificates pile up but nobody's hiring you for them. The gap between learning and doing is real.",
  },
];

const ProblemSection = () => (
  <section id="problem" className="border-t border-border py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Most platforms teach.{" "}
            <span className="text-gradient-gold">Few actually help you grow.</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Let's be honest — the way most people learn online isn't working. Here's why.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {problems.map((p, i) => (
          <AnimatedSection key={p.title} delay={0.1 + i * 0.1}>
            <div className="rounded-xl border border-border bg-card p-8 transition-all hover:border-gold-dim hover:shadow-gold hover:-translate-y-1 h-full">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
