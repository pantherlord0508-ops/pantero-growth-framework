import { ArrowRight, ChevronDown } from "lucide-react";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const HeroSection = () => (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-radial pt-16">
    {/* Subtle gold glow */}
    <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, hsl(42 60% 54%), transparent 70%)' }} />
    
    <div className="container relative z-10 text-center">
      <div className="mx-auto max-w-3xl animate-fade-up">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Skill Development Framework
        </p>
        <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
          Turn Skill Into{" "}
          <span className="text-gradient-gold">Real Ability.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          A structured system that helps you move from learning to execution to real outcomes.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
          >
            Join the Waitlist
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 font-display text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            See How It Works
          </a>
        </div>
      </div>

      <a href="#problem" className="mt-20 inline-flex animate-fade-in opacity-0 [animation-delay:0.8s]">
        <ChevronDown className="h-5 w-5 text-muted-foreground animate-bounce" />
      </a>
    </div>
  </section>
);

export default HeroSection;
