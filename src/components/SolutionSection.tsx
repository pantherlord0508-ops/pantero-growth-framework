import { Layers, BarChart3, Zap, Target } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Structured Learning Paths",
    description: "Follow curated progressions designed for depth, not surface-level browsing.",
  },
  {
    icon: BarChart3,
    title: "Skill Progression Tracking",
    description: "Measure where you are and where you're heading with clear milestones.",
  },
  {
    icon: Zap,
    title: "Learn → Do → Showcase → Earn",
    description: "A complete loop from knowledge acquisition to real-world proof and opportunity.",
  },
  {
    icon: Target,
    title: "Built for Serious Growth",
    description: "No passive scrolling. Every action moves you closer to measurable outcomes.",
  },
];

const SolutionSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
          What Is Pantero?
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          A Framework for{" "}
          <span className="text-gradient-gold">Measurable Growth</span>
        </h2>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-gold-dim hover:shadow-gold"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary transition-colors group-hover:bg-primary/10">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
