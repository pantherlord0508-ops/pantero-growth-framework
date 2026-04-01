/**
 * Call-to-action section component.
 *
 * Final CTA with gradient background, primary and secondary action buttons.
 */

"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t border-border py-24 md:py-32 relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Ready to Own <span className="text-gradient-gold">Your Future?</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Your identity. Your language. Your opportunity. It starts here.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
            >
              Join the Waitlist
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL || "https://chat.whatsapp.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-3.5 font-display text-sm font-medium text-foreground transition-all hover:bg-secondary hover:border-gold-dim"
            >
              WhatsApp Community
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            No spam. Unsubscribe anytime.{" "}
            <span className="text-primary">Be early, not late.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
