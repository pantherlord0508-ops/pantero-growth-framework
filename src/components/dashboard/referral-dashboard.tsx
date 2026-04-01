"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Twitter, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralDashboardProps {
  referral_code: string;
  position: number;
  full_name: string;
}

export default function ReferralDashboard({ referral_code, position, full_name }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${referral_code}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(
    `Join the Pantero waitlist and get early access to Africa's AI-powered identity platform! Use my link: ${referralLink}`
  );

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${shareText}`,
    whatsapp: `https://wa.me/?text=${shareText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6"
    >
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Welcome, {full_name.split(" ")[0]}</p>
        <motion.p
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mt-2 font-display text-5xl font-bold text-primary tabular-nums"
        >
          #{position}
        </motion.p>
        <p className="mt-1 text-xs text-muted-foreground">Your position on the waitlist</p>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Your referral link
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
          <span className="flex-1 truncate text-sm text-secondary-foreground">{referralLink}</span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Share & move up faster
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
