import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Pick a Path",
    description: "Choose what you want to learn. We'll give you a clear, structured roadmap — no guessing required.",
  },
  {
    number: "02",
    title: "Learn the Fundamentals",
    description: "Start with the core concepts. Bite-sized lessons designed to build understanding from the ground up.",
  },
  {
    number: "03",
    title: "Get Your Hands Dirty",
    description: "Theory is just the start. You'll work on real exercises that test what you know and push you further.",
  },
  {
    number: "04",
    title: "Track Your Progress",
    description: "See exactly where you stand with real-time metrics, streaks, and milestone tracking across every path.",
  },
  {
    number: "05",
    title: "Connect With Peers",
    description: "Join a community of driven learners. Collaborate, compete, and grow together through shared goals.",
  },
  {
    number: "06",
    title: "Get Mentored",
    description: "Access guidance from experienced practitioners who've walked the path you're on right now.",
  },
  {
    number: "07",
    title: "Build Real Projects",
    description: "Apply your skills to meaningful, portfolio-worthy projects that demonstrate real-world competence.",
  },
  {
    number: "08",
    title: "Earn Credentials",
    description: "Complete challenges and assessments to earn verifiable credentials that prove your abilities.",
  },
  {
    number: "09",
    title: "Unlock Opportunities",
    description: "Your work becomes your proof. Showcase it, earn recognition, and unlock real opportunities.",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="border-t border-border py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Nine steps. No fluff. A clear path from curious to capable.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <AnimatedSection key={s.number} delay={0.1 + i * 0.08}>
            <div className="relative text-center md:text-left group">
              <span className="font-display text-5xl font-bold text-primary/20 transition-colors group-hover:text-primary/40">
                {s.number}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
