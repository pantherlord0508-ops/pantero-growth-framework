/**
 * Signup section component.
 *
 * Contains the signup form with heading and description text.
 */

"use client";

import { motion } from "framer-motion";
import SignupForm from "@/components/signup-form";

export function SignupSection() {
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
          </div>
          <div className="mx-auto mt-10 max-w-md">
            <SignupForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
