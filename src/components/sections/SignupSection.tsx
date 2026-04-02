/**
 * Signup section component.
 *
 * Contains the signup form with heading and description text.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";
import SignupForm from "@/components/signup-form";

export function SignupSection() {
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        if (data.total_signups !== undefined) {
          const spots = Math.max(0, 1000 - data.total_signups);
          setSpotsLeft(spots);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="signup" className="border-t border-border py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Get Early Access
            </p>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Join the <span className="text-gradient-gold">Pantero Waitlist</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Secure your spot. Refer friends to move up the queue.
            </p>

            {/* Urgency indicator */}
            {spotsLeft !== null && spotsLeft <= 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400"
              >
                <Zap className="h-4 w-4" />
                <span>Only <span className="font-bold text-red-300">{spotsLeft}</span> spots remaining in early access</span>
              </motion.div>
            )}

            {/* Time bonus info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground"
            >
              <Clock className="h-3 w-3" />
              <span>Join now to get <span className="font-semibold text-primary">2x referral rewards</span> - Limited time offer!</span>
            </motion.div>
          </div>
          <div className="mx-auto mt-10 max-w-md">
            <SignupForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}