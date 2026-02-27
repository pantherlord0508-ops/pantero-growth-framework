import { ArrowRight, Crown, Mail, Users, MessageSquare } from "lucide-react";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const perks = [
  { icon: Crown, text: "Priority access to the platform" },
  { icon: Mail, text: "Beta invitations before public launch" },
  { icon: Users, text: "Founding member recognition" },
  { icon: MessageSquare, text: "Direct input into platform evolution" },
];

const EarlyAccessSection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Built with{" "}
          <span className="text-gradient-gold">Early Members.</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join a focused group shaping how skill development should work.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-lg gap-4">
        {perks.map((p) => (
          <div key={p.text} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
              <p.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm text-foreground">{p.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
        >
          Secure Early Access
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default EarlyAccessSection;
