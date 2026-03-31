import { ArrowRight, Crown, Mail, Users, MessageSquare } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const perks = [
  { icon: Crown, text: "First access to the identity system and AI companion" },
  { icon: Mail, text: "Direct updates as new features and languages ship" },
  { icon: Users, text: "Your name recognized as a founding member" },
  { icon: MessageSquare, text: "A real voice in what we build and where we go" },
];

const EarlyAccessSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Built with{" "}
            <span className="text-gradient-gold">Early Members.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pantero isn't being built in isolation. Early members have a real voice in shaping Africa's digital future.
          </p>
        </div>
      </AnimatedSection>

      <div className="mx-auto mt-12 grid max-w-lg gap-4">
        {perks.map((p, i) => (
          <AnimatedSection key={p.text} delay={0.1 + i * 0.08}>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-gold-dim hover:-translate-y-0.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                <p.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-foreground">{p.text}</span>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.5}>
        <div className="mt-10 text-center">
          <a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:scale-[1.03] hover:opacity-90"
          >
            Secure Early Access
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default EarlyAccessSection;
