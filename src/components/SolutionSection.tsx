import { Layers, BarChart3, Zap, Target } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const features = [
  {
    icon: Layers,
    title: "Paths That Make Sense",
    description: "No more jumping between random tutorials. We give you a clear road from beginner to capable.",
  },
  {
    icon: BarChart3,
    title: "See Your Progress",
    description: "Know exactly where you stand and what's next. Real milestones, not vague promises.",
  },
  {
    icon: Zap,
    title: "Learn → Build → Show → Grow",
    description: "It's a full loop — pick up a skill, apply it to real projects, then let your work speak for itself.",
  },
  {
    icon: Target,
    title: "Made for People Who Mean It",
    description: "This isn't a content library. Every step is designed to push you closer to something real.",
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
            A Platform for{" "}
            <span className="text-gradient-gold">Meaningful Growth</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Think of it as your growth nexus — where skills, projects, and opportunities meet in one place.
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
