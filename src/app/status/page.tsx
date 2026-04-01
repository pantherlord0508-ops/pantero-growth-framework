"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Users, Clock } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import SignupChart from "@/components/signup-chart";

interface RecentSignup {
  name: string;
  joined_at: string;
}

interface StatsData {
  total_signups: number;
  signups_today: number;
  signups_this_week: number;
  recent_signups: RecentSignup[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function StatusPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          total_signups: data.total_signups ?? 0,
          signups_today: data.signups_today ?? 0,
          signups_this_week: data.signups_this_week ?? 0,
          recent_signups: data.recent_signups ?? [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <Activity className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">Live Status</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Real-time Pantero waitlist activity and growth metrics.
              </p>
            </motion.div>

            {loading ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-card" />
                  ))}
                </div>
                <div className="h-64 animate-pulse rounded-xl border border-border bg-card" />
              </div>
            ) : stats ? (
              <>
                {/* Live Counters */}
                <div className="mb-8 grid gap-4 md:grid-cols-3">
                  {[
                    { icon: Users, label: "Total Signups", value: stats.total_signups },
                    { icon: TrendingUp, label: "Today", value: stats.signups_today },
                    { icon: Clock, label: "This Week", value: stats.signups_this_week },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-xl border border-border bg-card p-6 text-center"
                    >
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                      <motion.p
                        key={stat.value}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="font-display text-3xl font-bold text-foreground tabular-nums"
                      >
                        {stat.value.toLocaleString()}
                      </motion.p>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <SignupChart />
                </motion.div>

                {/* Recent Signups */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 rounded-xl border border-border bg-card p-6"
                >
                  <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                    Recent Signups
                  </h2>
                  {stats.recent_signups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No signups yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recent_signups.map((signup, i) => (
                        <motion.div
                          key={`${signup.name}-${i}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0"
                        >
                          <span className="text-sm font-medium text-foreground">{signup.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {timeAgo(signup.joined_at)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            ) : (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">Unable to load stats.</p>
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
