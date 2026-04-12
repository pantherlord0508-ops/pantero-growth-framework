"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Wifi, Globe, Shield, Users, BookOpen, ShoppingBag, MessageSquare } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import Link from "next/link";

const features = [
  {
    icon: Wifi,
    title: "Works Offline",
    description: "Access all features without internet. Built for Africa's connectivity challenges.",
    color: "#10B981",
  },
  {
    icon: MessageSquare,
    title: "AI Companion",
    description: "Smart AI assistant in your language. Get help, guidance, and mentorship anytime.",
    color: "#F59E0B",
  },
  {
    icon: Users,
    title: "Community Workspace",
    description: "Connect with peers, collaborate on projects, and build your network.",
    color: "#3B82F6",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description: "Buy, sell, and trade tech resources. From devices to digital products.",
    color: "#8B5CF6",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description: "Free courses in coding, data science, design, and more. Learn at your pace.",
    color: "#EC4899",
  },
  {
    icon: Shield,
    title: "Web3 Credentials",
    description: "Blockchain-verified certificates that travel with you. Own your achievements.",
    color: "#06B6D4",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Platform <span className="text-gradient-gold">Features</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">
              Everything you need to learn, connect, trade, and build your tech career — 
              all in one platform that works offline.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `${feature.color}30`,
                    background: `${feature.color}12`,
                  }}
                >
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-muted-foreground">
              Ready to experience all these features?
            </p>
            <Link
              href="/join"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Join the Waitlist <Zap className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}