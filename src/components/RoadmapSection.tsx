import AnimatedSection from "./AnimatedSection";
import { Layers, Rocket, Globe, Sparkles, Calendar, Users, Star, Flag } from "lucide-react";

const milestones = [
  {
    icon: Calendar,
    date: "Now",
    title: "Early Access Waitlist",
    description: "Sign up and be among the first to experience Pantero. Your input shapes what we build.",
    active: true,
  },
  {
    icon: Users,
    date: "Q2 2026",
    title: "Community Formation",
    description: "The first members join, connect, and begin contributing ideas. Regional voices start shaping the platform.",
    active: false,
  },
  {
    icon: Star,
    date: "Q3 2026",
    title: "Foundation — Core Identity & AI",
    description: "Decentralized identity system goes live. AI companion launches in English, Yoruba, Swahili, and Hausa.",
    active: false,
  },
  {
    icon: Flag,
    date: "Q4 2026",
    title: "Job Marketplace & Skills Platform",
    description: "The job marketplace opens alongside structured skill paths and verifiable credential assessments.",
    active: false,
  },
  {
    icon: Layers,
    date: "2027",
    title: "Scale — 10+ Languages & Voice AI",
    description: "Expanding to Igbo, Zulu, Amharic, and more. Voice interface launches for call-in AI assistance.",
    active: false,
  },
  {
    icon: Globe,
    date: "2027-2028",
    title: "Ecosystem — Education & Cross-Border",
    description: "University partnerships, mobile native apps, regional data centers, and API marketplace for third parties.",
    active: false,
  },
  {
    icon: Sparkles,
    date: "2028+",
    title: "Continental Vision",
    description: "Unified digital identity across African nations. Healthcare, agriculture, and land registry integrations.",
    active: false,
  },
  {
    icon: Rocket,
    date: "2030",
    title: "100 Million Africans Empowered",
    description: "Full community governance. 50+ languages. Data sovereignty. Africa's digital future, owned by Africans.",
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
