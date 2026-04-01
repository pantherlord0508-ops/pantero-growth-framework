"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import SignupForm from "@/components/signup-form";
import { motion } from "framer-motion";
import { Shield, Zap, Users } from "lucide-react";

const benefits = [
  { icon: Shield, title: "Own Your Identity", description: "Decentralized digital identity that belongs to you, not a corporation." },
  { icon: Zap, title: "AI That Speaks Your Language", description: "Offline-capable AI companion in Yoruba, Swahili, Hausa, and more." },
  { icon: Users, title: "Move Up by Referring", description: "Share your link and jump ahead of others on the waitlist." },
];

export default function JoinPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-radial pt-24 pb-16">
        <div
          className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsl(42 60% 54%), transparent 70%)" }}
        />

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
                Join the Movement
              </p>
              <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
                Get <span className="text-gradient-gold">Early Access</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                Secure your spot on the Pantero waitlist. Refer friends to move up the queue and unlock exclusive perks.
              </p>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col justify-center gap-6"
              >
                <h2 className="font-display text-xl font-bold text-foreground">Why Join?</h2>
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground">
                        {b.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <SignupForm />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
