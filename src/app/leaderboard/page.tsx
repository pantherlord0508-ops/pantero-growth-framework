"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";

interface TopReferrer {
  full_name: string;
  email: string;
  referral_count: number;
  referral_code: string;
}

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
                See who is leading in referrals.
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
                {referrers.map((r, i) => (
                  <motion.div
                    key={`${r.full_name}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                  >
                    <p className="font-display text-sm font-semibold text-foreground truncate">
                      {r.full_name}
                    </p>
                    <p className="font-display text-lg font-bold text-foreground">
                      {r.referral_count}
                    </p>
                  </motion.div>
                ))}
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
