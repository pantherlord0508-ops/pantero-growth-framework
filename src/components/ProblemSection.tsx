import { ShieldOff, Globe, BrainCircuit } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const problems = [
  {
    icon: ShieldOff,
    title: "No Digital Identity",
    description: "Millions across Africa have no way to prove who they are online. Without a verified digital identity, doors stay closed.",
  },
  {
    icon: Globe,
    title: "Opportunities Exist — Access Doesn't",
    description: "Jobs, skills training, and resources are out there, but there's no single place connecting people to what they need — especially in their own language.",
  },
  {
    icon: BrainCircuit,
    title: "AI That Doesn't Speak Your Language",
    description: "Most digital tools are built for English-first audiences. If you think in Yoruba, Swahili, or Hausa, you're left behind.",
  },
];

const ProblemSection = () => (
  <section id="problem" className="border-t border-border py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            The gap is real.{" "}
            <span className="text-gradient-gold">And it's holding people back.</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Across the continent, talent is everywhere — but the systems to unlock it barely exist.
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
