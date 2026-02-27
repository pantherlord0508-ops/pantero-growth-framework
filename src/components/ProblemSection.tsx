import { BookOpen, Shuffle, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: BookOpen,
    title: "Content Overload",
    description: "Endless tutorials with no clear path forward. Consumption without direction.",
  },
  {
    icon: Shuffle,
    title: "No Structure",
    description: "Random learning with no progression system. No way to measure real growth.",
  },
  {
    icon: TrendingDown,
    title: "No Link to Outcomes",
    description: "Learning disconnected from execution. No bridge to earning or building proof.",
  },
];

const ProblemSection = () => (
  <section id="problem" className="border-t border-border py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Most platforms teach.{" "}
          <span className="text-gradient-gold">Few build ability.</span>
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          The current approach to online learning is broken. Content is everywhere, but structured growth is rare.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {problems.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-border bg-card p-8 transition-colors hover:border-gold-dim"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
              <p.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
