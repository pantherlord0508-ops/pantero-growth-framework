import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Pick a Path",
    description: "Choose what you want to learn. We'll give you a clear, structured roadmap — no guessing required.",
  },
  {
    number: "02",
    title: "Get Your Hands Dirty",
    description: "Theory is just the start. You'll work on real projects that test what you know and push you further.",
  },
  {
    number: "03",
    title: "Show What You've Built",
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
            Three steps. No fluff. Just a clear way to go from curious to capable.
          </p>
        </div>
      </AnimatedSection>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <AnimatedSection key={s.number} delay={0.15 + i * 0.15}>
            <div className="relative text-center md:text-left group">
              <span className="font-display text-5xl font-bold text-primary/20 transition-colors group-hover:text-primary/40">{s.number}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8">
                  <div className="glow-line" />
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
