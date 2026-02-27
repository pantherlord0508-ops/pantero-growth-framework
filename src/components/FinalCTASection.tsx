import { ArrowRight } from "lucide-react";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const FinalCTASection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32">
    <div className="container">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Serious About{" "}
          <span className="text-gradient-gold">Growth?</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Stop consuming. Start building real ability.
        </p>
        <a
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
        >
          Join the Waitlist
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default FinalCTASection;
