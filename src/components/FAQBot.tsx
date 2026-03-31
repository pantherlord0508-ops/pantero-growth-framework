import { useState } from "react";
import { MessageCircle, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Pantero?",
    a: "Pantero is a Pan-African platform that gives you a secure digital identity, an AI companion that speaks your language, and access to jobs and skills that actually lead somewhere. It's your nexus for growth.",
  },
  {
    q: "What is a decentralized identity?",
    a: "It's a digital identity that you own and control — not a company or government. You decide what to share, with whom, and your credentials are verifiable without a middleman.",
  },
  {
    q: "What languages does the AI support?",
    a: "We're launching with English, Yoruba, Swahili, and Hausa. We're expanding to 10+ African languages including Igbo, Zulu, Amharic, and more — with voice support coming soon.",
  },
  {
    q: "Does it work offline?",
    a: "Yes. The AI companion and core features are designed to work offline. We know connectivity is a challenge across the continent, so Pantero is built for low-bandwidth and offline-first use.",
  },
  {
    q: "When does it launch?",
    a: "The foundation phase begins Q3 2026 with the core identity system and AI companion. If you're on the waitlist, you'll be among the first to experience it.",
  },
  {
    q: "Is it free?",
    a: "For founding members, absolutely. We'll introduce sustainable features later, but early supporters will always receive priority access and recognition.",
  },
  {
    q: "How is this different from other platforms?",
    a: "Most platforms are built for Western audiences. Pantero is built for Africa — with African languages, offline capability, decentralized identity, and a job marketplace that trusts verified credentials over résumés.",
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
