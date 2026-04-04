"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Medal, Crown, TrendingUp, Sparkles } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import Link from "next/link";

interface TopReferrer {
  full_name: string;
  email: string;
  referral_count: number;
  referral_code: string;
}

const getRankIcon = (position: number) => {
  if (position === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (position === 2) return <Medal className="h-5 w-5 text-gray-300" />;
  if (position === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return null;
};

const getRankStyles = (position: number) => {
  if (position === 1) return "border-yellow-400/50 bg-yellow-400/10";
  if (position === 2) return "border-gray-300/50 bg-gray-100/10";
  if (position === 3) return "border-amber-600/50 bg-amber-600/10";
  return "border-border bg-card";
};

export default function LeaderboardPage() {
  const [referrers, setReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/top-referrers")
      .then((res) => res.json())
      .then((data) => {
        if (data.top_referrers) {
          setReferrers(data.top_referrers);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">Leaderboard</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Top referrers earning exclusive rewards
              </p>
              
              {/* Rewards banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-yellow-400/20 border border-primary/30 px-4 py-2"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Top referrers get <span className="text-primary font-bold">early access + exclusive badges</span>
                </span>
              </motion.div>
            </motion.div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-xl border border-border bg-card"
                  />
                ))}
              </div>
            ) : referrers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-border bg-card p-12 text-center"
              >
                <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No referrers yet. Be the first to share your link!
                </p>
                <Link
                  href="/join"
                  className="mt-4 inline-block text-primary hover:underline"
                >
                  Join now →
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {referrers.map((r, i) => (
                  <motion.div
                    key={`${r.full_name}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className={`flex items-center justify-between rounded-xl border p-4 ${getRankStyles(i + 1)}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        {getRankIcon(i + 1) || (
                          <span className="font-display text-sm font-bold text-muted-foreground">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground truncate max-w-[180px]">
                          {r.full_name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-green-400" />
                          <span>Active referrer</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-foreground">
                        {r.referral_count}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        referral{r.referral_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground">
                Want to be on the leaderboard?
              </p>
              <Link
                href="/join"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Join the waitlist <span>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}