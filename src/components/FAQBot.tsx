import { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Pantero?",
    a: "Pantero is a platform — a nexus, really — where you learn skills, build real projects, and actually get somewhere with it. No more certificate hoarding.",
  },
  {
    q: "When does beta launch?",
    a: "We're aiming for August 2026. If you're on the waitlist early, you'll be among the first people in — and you'll help us shape it.",
  },
  {
    q: "Is it free?",
    a: "For founding members? Completely free. We'll introduce paid features later, but early supporters will always get special treatment.",
  },
  {
    q: "How do referrals work?",
    a: "Once you join, you'll get a unique link from Waitlister. Share it with friends — every person who signs up through your link moves you up in line.",
  },
  {
    q: "What skills are covered?",
    a: "We're kicking off with tech, design, and business — but this grows with the community. If enough people want it, we'll build paths for it.",
  },
  {
    q: "How is this different?",
    a: "Most platforms stop at theory. We take you all the way — structured paths, real projects, proof of what you've done, and doors that actually open.",
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
