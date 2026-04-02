"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Share2, Users, Trophy, Twitter, MessageCircle, Mail, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ReferralDashboardProps {
  referralCode: string;
  position: number;
  referralCount?: number;
}

interface UserStats {
  referral_count: number;
  position: number;
}

export default function ReferralDashboard({
  referralCode,
  position,
  referralCount: initialReferralCount,
}: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(initialReferralCount);
  const [loading, setLoading] = useState(true);
  
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = `${baseUrl}/join?ref=${referralCode}`;
  
  const shareText = "I just joined the Pantero waitlist! Own your identity, shape your path. Join me there! 🚀";
  const shareTextWithLink = `${shareText}\n\nJoin here: ${referralLink}`;

  useEffect(() => {
    if (!referralCode) return;
    
    fetch(`/api/referral?code=${referralCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setReferralCount(data.user.referral_count || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [referralCode]);

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

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareTextWithLink)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleShareEmail = () => {
    const emailUrl = `mailto:?subject=Join me on Pantero&body=${encodeURIComponent(shareTextWithLink)}`;
    window.open(emailUrl);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Pantero",
          text: shareText,
          url: referralLink,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  const getNextMilestone = () => {
    const milestones = [5, 10, 25, 50, 100, 250, 500, 1000];
    const next = milestones.find(m => m > referralCount);
    return next || null;
  };

  const nextMilestone = getNextMilestone();
  const progress = nextMilestone ? (referralCount / nextMilestone) * 100 : 100;

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
          <p className="font-display text-2xl font-bold text-foreground">
            {loading ? "..." : referralCount}
          </p>
          <p className="text-xs text-muted-foreground">Referrals</p>
        </div>
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && (
        <div className="mb-6 rounded-lg bg-secondary/50 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              {nextMilestone - referralCount} more to next reward
            </span>
            <span className="font-display font-bold text-primary">
              {referralCount}/{nextMilestone}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-yellow-400"
            />
          </div>
        </div>
      )}

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

      {/* Social Share Buttons */}
      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Share & Earn Rewards
        </p>
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={handleShareTwitter}
            className="h-12 bg-[#1DA1F2] hover:bg-[#1a91da]"
            title="Share on Twitter"
          >
            <Twitter className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleShareWhatsApp}
            className="h-12 bg-[#25D366] hover:bg-[#20bd5a]"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleShareEmail}
            className="h-12 bg-gray-600 hover:bg-gray-700"
            title="Share via Email"
          >
            <Mail className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleNativeShare}
            variant="outline"
            className="h-12 border-border hover:bg-secondary"
            title="More options"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          onClick={handleCopy}
          className="flex-1 bg-primary text-primary-foreground font-display font-semibold shadow-gold hover:opacity-90"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
        <Button
          onClick={handleNativeShare}
          variant="outline"
          className="flex-1 border-border text-foreground hover:bg-secondary hover:border-gold-dim"
        >
          <Share2 className="mr-2 h-4 w-4" />
          More
        </Button>
      </div>
    </motion.div>
  );
}