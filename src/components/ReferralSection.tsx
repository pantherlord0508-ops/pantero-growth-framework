import { Share2, UserPlus, Copy, Users } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const steps = [
  {
    icon: UserPlus,
    step: "1",
    title: "Join the Waitlist",
    description: "Head to our waitlist page and drop your email. Takes 10 seconds.",
  },
  {
    icon: Copy,
    step: "2",
    title: "Copy Your Referral Link",
    description: "Once you're in, grab your personal referral link from your Waitlister dashboard.",
  },
  {
    icon: Users,
    step: "3",
    title: "Share With Friends",
    description: "Send it to friends who care about growth. Every signup bumps you up the queue.",
  },
];

const ReferralSection = () => (
  <section className="border-t border-border py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Grow With Us.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Know someone who'd love this? Bring them along — you'll both get in faster.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.15}>
        <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-card p-6 text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-bold text-primary">
                {s.step}
              </div>
              <s.icon className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
              <h3 className="font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.3}>
        <div className="mx-auto mt-10 max-w-xl rounded-xl border border-border bg-card p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground text-center">
            Quick share — main waitlist link
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <span className="flex-1 truncate text-sm text-secondary-foreground">{WAITLIST_URL}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(WAITLIST_URL);
              }}
              className="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Copy
            </button>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default ReferralSection;
