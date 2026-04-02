import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

const CTASection = dynamic(() => import("@/components/sections/CTASection").then((mod) => mod.CTASection), {
  ssr: false,
  loading: () => <div className="py-24 md:py-32" />,
});

const faqs = [
  {
    question: "What is Pantero?",
    answer:
      "Pantero is a platform designed to give every African a secure digital identity, an AI companion that speaks your language, and direct access to jobs and skills that matter. We're building the digital infrastructure for Africa's future.",
  },
  {
    question: "How does the waitlist work?",
    answer:
      "Sign up to secure your spot on the Pantero waitlist. You'll receive a unique referral link. Share it with friends and family — each referral moves you up the queue, giving you earlier access when we launch.",
  },
  {
    question: "What are referral milestones?",
    answer:
      "Milestones are rewards for spreading the word. As you hit referral targets (3, 5, 10, 25, or 50 referrals), you unlock exclusive perks like priority access, beta features, and founding member status.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. We take data privacy seriously. Your information is encrypted and stored securely using industry-standard practices. We never sell your data to third parties. Read our Privacy Policy for full details.",
  },
  {
    question: "When will Pantero launch?",
    answer:
      "We're currently in the early access phase. Our roadmap includes community formation in Q2 2026, core identity and AI features in Q3 2026, and the job marketplace in Q4 2026. Join the waitlist to be notified first.",
  },
  {
    question: "How do I move up the waitlist?",
    answer:
      "Share your unique referral link with others. When someone signs up using your link, you earn a referral. The more referrals you have, the higher your position. Top referrers get featured on our leaderboard.",
  },
  {
    question: "What languages will the AI companion support?",
    answer:
      "Our AI companion will initially support English, Yoruba, Swahili, and Hausa. We plan to expand to 50+ African languages including Igbo, Zulu, Amharic, and many more as we scale.",
  },
  {
    question: "Can I join the WhatsApp community?",
    answer:
      "Yes! After signing up, you'll be invited to join our WhatsApp community where you can connect with other early members, get updates, and help shape the platform's development.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display text-sm font-semibold text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <HelpCircle className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">FAQ</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Frequently asked questions about Pantero and the waitlist.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card px-6"
            >
              {faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </motion.div>
          </div>
        </div>
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
