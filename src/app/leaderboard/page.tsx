"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Users } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

interface TopReferrer {
  full_name: string;
  email: string;
  referral_count: number;
  referral_code: string;
}

function anonymizeName(name: string): string {
  const parts = name.split(" ");
  if (parts.length === 1) return `${parts[0][0]}***`;
  return `${parts[0]} ${parts[parts.length - 1][0]}***`;
}

function getMedalColor(rank: number): string {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-muted-foreground";
}

function getMedalBg(rank: number): string {
  if (rank === 1) return "bg-yellow-400/15 border-yellow-400/30";
  if (rank === 2) return "bg-gray-300/15 border-gray-300/30";
  if (rank === 3) return "bg-amber-600/15 border-amber-600/30";
  return "bg-secondary border-border";
}

export default function LeaderboardPage() {
  const [referrers, setReferrers] = useState<TopReferrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
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
                Top referrers on the Pantero waitlist. Share your link to climb the ranks.
              </p>
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
              </motion.div>
            ) : (
              <div className="space-y-3">
                {referrers.map((r, i) => {
                  const rank = i + 1;
                  return (
                    <motion.div
                      key={r.referral_code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        rank <= 3
                          ? `${getMedalBg(rank)} shadow-gold`
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${getMedalBg(rank)} ${getMedalColor(rank)}`}
                      >
                        {rank <= 3 ? (
                          <Medal className={`h-5 w-5 ${getMedalColor(rank)}`} />
                        ) : (
                          `#${rank}`
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold text-foreground truncate">
                          {anonymizeName(r.full_name)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code: {r.referral_code}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-foreground">
                          {r.referral_count}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          referrals
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
