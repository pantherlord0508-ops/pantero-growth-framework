"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReferralDashboardProps {
  referralCode: string;
  position: number;
  referralCount?: number;
}

export default function ReferralDashboard({
  referralCode,
  position,
  referralCount = 0,
}: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/join?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Pantero",
          text: "Join me on Pantero - Own Your Identity. Shape Your Path.",
          url: referralLink,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6 text-center">
        <h3 className="font-display text-lg font-bold text-foreground">Your Referral Dashboard</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your link to move up the waitlist
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-secondary p-4 text-center">
          <Trophy className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="font-display text-2xl font-bold text-foreground">#{position}</p>
          <p className="text-xs text-muted-foreground">Your Position</p>
        </div>
        <div className="rounded-lg border border-border bg-secondary p-4 text-center">
          <Users className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="font-display text-2xl font-bold text-foreground">{referralCount}</p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Your Referral Code
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
          <span className="font-display text-lg font-bold tracking-wider text-primary">
            {referralCode}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Your Referral Link
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
          <span className="flex-1 truncate text-sm text-secondary-foreground">
            {referralLink}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="shrink-0 text-primary hover:text-primary hover:bg-primary/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          onClick={handleCopy}
          className="flex-1 bg-primary text-primary-foreground font-display font-semibold shadow-gold hover:opacity-90"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 border-border text-foreground hover:bg-secondary hover:border-gold-dim"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}
