import { Metadata } from "next";
import { motion } from "framer-motion";
import { Globe, Shield, Users, Zap, Target, Heart } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

export const metadata: Metadata = {
  title: "About Us - Building Africa's Digital Future",
  description: "Learn about Pantero's mission to provide every African with a secure digital identity, AI companion, and access to jobs and skills. Join the movement.",
  keywords: ["Pantero about", "digital identity Africa", "African tech company", "AI companion Africa", "Pantero mission"],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Pantero",
  description: "Pantero is building digital infrastructure to empower 100 million Africans by 2030.",
  url: "https://pantero.vercel.app/about",
  mainEntity: {
    "@type": "Organization",
    name: "Pantero",
    url: "https://pantero.vercel.app",
    description: "Digital identity and AI platform for Africa",
    areaServed: {
      "@type": "Place",
      name: "Africa",
    },
  },
};

const values = [
  {
    icon: Shield,
    title: "Data Sovereignty",
    description: "Your identity belongs to you. Not to a corporation, not to a government. You control your data.",
  },
  {
    icon: Globe,
    title: "Inclusive by Design",
    description: "Built for Africa's 1.4 billion people. Supporting 50+ languages and designed for low-bandwidth environments.",
  },
  {
    icon: Users,
    title: "Community Powered",
    description: "Shaped by the people who use it. Your feedback directly influences what we build and how we build it.",
  },
  {
    icon: Zap,
    title: "AI for Everyone",
    description: "An offline-capable AI companion that speaks your language and understands your context.",
  },
  {
    icon: Target,
    title: "Real Opportunities",
    description: "Connecting verified skills to real jobs. Blockchain-backed credentials that employers trust.",
  },
  {
    icon: Heart,
    title: "Built with Care",
    description: "Every feature is designed with African users in mind. No Western-centric assumptions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-16 text-center"
            >
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
                About Pantero
              </p>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                Building Africa&apos;s{" "}
                <span className="text-gradient-gold">Digital Future</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Pantero is more than a platform. It&apos;s a movement to give every African
                control over their digital identity and access to opportunity.
              </p>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-16 rounded-xl border border-border bg-card p-8 md:p-10"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Pantero exists to bridge the digital divide across Africa. We believe every
                person deserves a secure digital identity, an AI assistant that speaks their
                language, and direct access to jobs and skills that matter. We&apos;re building
                the infrastructure that will empower 100 million Africans by 2030.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-8 text-center">
                What We Stand For
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {values.map((value, i) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card p-8 md:p-10 text-center"
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Join the Movement
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Pantero is built by a passionate team committed to Africa&apos;s digital
                transformation. We&apos;re growing fast and looking for people who share our
                vision.
              </p>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:opacity-90"
              >
                Join the Waitlist
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
