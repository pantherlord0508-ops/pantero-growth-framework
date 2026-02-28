import { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Pantero?",
    a: "Pantero is a structured skill-development platform that helps you move from learning to execution to real outcomes — not just collecting certificates.",
  },
  {
    q: "When does beta launch?",
    a: "Beta launches in August 2026. Early waitlist members get first access and help shape the platform.",
  },
  {
    q: "Is it free?",
    a: "Early access will be free for founding members. Premium features will be introduced later with fair pricing.",
  },
  {
    q: "How do referrals work?",
    a: "After joining the waitlist, you get a unique referral link. Each friend who signs up through your link moves you higher in the queue.",
  },
  {
    q: "What skills are covered?",
    a: "We're starting with tech, design, and business skills — with community-driven paths expanding over time.",
  },
  {
    q: "How is this different?",
    a: "Unlike courses that end at theory, Pantero gives you structured paths with real projects, proof of work, and access to opportunities.",
  },
];

const FAQBot = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border bg-secondary px-4 py-3">
              <span className="font-display text-sm font-semibold text-foreground">FAQ Assistant</span>
              <button onClick={() => { setOpen(false); setSelected(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 space-y-2">
              {selected === null ? (
                <>
                  <p className="text-xs text-muted-foreground mb-3">Tap a question to get your answer:</p>
                  {faqs.map((faq, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <ChevronRight className="h-3 w-3 shrink-0 text-primary" />
                      {faq.q}
                    </button>
                  ))}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                    {faqs[selected].q}
                  </div>
                  <div className="rounded-lg bg-secondary px-3 py-2.5 text-sm text-secondary-foreground leading-relaxed">
                    {faqs[selected].a}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    ← Back to questions
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default FAQBot;
