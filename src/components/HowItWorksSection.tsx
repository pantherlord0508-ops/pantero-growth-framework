const steps = [
  {
    number: "01",
    title: "Learn with Structure",
    description: "Follow guided paths built for depth. No guessing what comes next.",
  },
  {
    number: "02",
    title: "Apply Through Action",
    description: "Practice with real projects and challenges that test what you've learned.",
  },
  {
    number: "03",
    title: "Build Proof & Unlock Opportunities",
    description: "Showcase your work, earn credentials, and connect to real opportunities.",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="border-t border-border py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          How It Works
        </h2>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.number} className="relative text-center md:text-left">
            <span className="font-display text-5xl font-bold text-primary/20">{s.number}</span>
            <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 -right-4 w-8">
                <div className="glow-line" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
