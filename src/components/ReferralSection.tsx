import { Share2 } from "lucide-react";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const ReferralSection = () => (
  <section className="border-t border-border py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Share2 className="h-5 w-5 text-primary" />
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Grow With Us.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          If you believe in structured growth, invite others who are serious about building real skills.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Share this link
          </p>
          <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <span className="flex-1 truncate text-sm text-secondary-foreground">{WAITLIST_URL}</span>
            <button
              onClick={() => navigator.clipboard.writeText(WAITLIST_URL)}
              className="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ReferralSection;
