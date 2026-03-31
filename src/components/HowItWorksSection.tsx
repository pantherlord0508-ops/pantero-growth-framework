import AnimatedSection from "./AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Create Your Digital Identity",
    description: "Set up your decentralized identity — a secure, portable profile that you control. No central authority owns your data.",
  },
  {
    number: "02",
    title: "Verify Your Credentials",
    description: "Add your education, work history, and skills. Pantero's verification system turns them into trusted, shareable credentials.",
  },
  {
    number: "03",
    title: "Meet Your AI Companion",
    description: "Your personal AI assistant activates — speaking your native language. It learns your goals and guides your next steps, even offline.",
  },
  {
    number: "04",
    title: "Explore Skill Paths",
    description: "Browse structured learning paths tailored to in-demand fields. Your AI companion recommends what's most relevant to your goals.",
  },
  {
    number: "05",
    title: "Learn and Build",
    description: "Work through courses and hands-on projects. Every completed module earns you verifiable credentials stored on your identity.",
  },
  {
    number: "06",
    title: "Get Assessed",
    description: "Take skill assessments designed by practitioners. Your results become blockchain-backed proof that employers and mentors can trust.",
  },
  {
    number: "07",
    title: "Discover Opportunities",
    description: "The job marketplace matches your verified skills to real openings. Employers see your credentials — not just a résumé.",
  },
  {
    number: "08",
    title: "Join the Community",
    description: "Connect with peers, mentors, and collaborators across the continent. Participate in governance and help shape what Pantero becomes.",
  },
  {
    number: "09",
    title: "Grow Without Limits",
    description: "As you learn, build, and earn — your digital identity grows with you. New skills, new credentials, new doors. The cycle never stops.",
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
            Nine steps. From identity to opportunity — a clear path forward.
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
