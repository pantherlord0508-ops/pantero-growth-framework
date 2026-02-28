import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "./AnimatedSection";
import AvatarStack from "./AvatarStack";

const WAITLIST_URL = "https://waitlister.me/p/pantero-app";

const FinalCTASection = () => (
  <section className="border-t border-border bg-surface-elevated py-24 md:py-32 relative overflow-hidden">
    {/* Background glow */}
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, hsl(42 60% 54%), transparent 70%)' }} />
    
    <div className="container relative z-10">
      <AnimatedSection>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Serious About{" "}
            <span className="text-gradient-gold">Growth?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            You've scrolled this far — that says something. Let's make it count.
          </p>
          <motion.a
            href={WAITLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Join the Waitlist
            <ArrowRight className="h-4 w-4" />
          </motion.a>
          <div className="mt-6 flex justify-center">
            <AvatarStack />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. <span className="text-primary">Be early, not late.</span>
          </p>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default FinalCTASection;
