import AnimatedSection from "./AnimatedSection";
import { Flag, Rocket, Calendar, Star, Users, Wrench } from "lucide-react";

const milestones = [
  {
    icon: Calendar,
    date: "Now",
    title: "Early Access Waitlist",
    description: "Sign up and help us build something worth using.",
    active: true,
  },
  {
    icon: Users,
    date: "March 2026",
    title: "Community Building",
    description: "Our first members start connecting, sharing ideas, and setting the tone.",
    active: false,
  },
  {
    icon: Star,
    date: "June 2026",
    title: "Alpha Testing",
    description: "A small group gets hands-on access and helps us fix what matters.",
    active: false,
  },
  {
    icon: Flag,
    date: "August 2026",
    title: "Beta Launch",
    description: "The doors open wider. Structured paths and progress tracking go live.",
    active: false,
  },
  {
    icon: Wrench,
    date: "October 2026",
    title: "Creator Tools",
    description: "You'll be able to create and share your own skill paths with everyone.",
    active: false,
  },
  {
    icon: Rocket,
    date: "November 2026",
    title: "Full Launch",
    description: "Everything comes together — showcasing, opportunities, and the full experience.",
    active: false,
  },
];

const RoadmapSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">Roadmap</p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Where We're{" "}
            <span className="text-gradient-gold">Headed.</span>
          </h2>
        </div>
      </AnimatedSection>

      <div className="mx-auto mt-16 max-w-2xl">
        {milestones.map((m, i) => (
          <AnimatedSection key={m.title} delay={0.1 + i * 0.1}>
            <div className="relative flex gap-6 pb-12 last:pb-0">
              {i < milestones.length - 1 && (
                <div className="absolute left-[19px] top-11 bottom-0 w-px bg-border" />
              )}
              <div
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                  m.active
                    ? "border-primary bg-primary/20"
                    : "border-border bg-card"
                }`}
              >
                <m.icon className={`h-4 w-4 ${m.active ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="pt-1">
                <span className={`text-xs font-semibold uppercase tracking-widest ${m.active ? "text-primary" : "text-muted-foreground"}`}>
                  {m.date}
                </span>
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
