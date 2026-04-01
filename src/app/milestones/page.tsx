"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Circle } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsapp-button";
import { Progress } from "@/components/ui/progress";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  target_count: number;
  reached_at: string | null;
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/milestones").then((r) => r.json()),
      fetch("/api/stats").then((r) => r.json()),
    ])
      .then(([milestoneData, statsData]) => {
        if (milestoneData.milestones) setMilestones(milestoneData.milestones);
        if (statsData.total_signups !== undefined) setTotalSignups(statsData.total_signups);
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
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                <span className="text-gradient-gold">Milestones</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Track our collective progress. Each milestone unlocks new features and opportunities.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5">
                <span className="text-sm text-muted-foreground">Current signups:</span>
                <motion.span
                  key={totalSignups}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="font-display text-lg font-bold text-primary tabular-nums"
                >
                  {totalSignups.toLocaleString()}
                </motion.span>
              </div>
            </motion.div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl border border-border bg-card"
                  />
                ))}
              </div>
            ) : milestones.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <Target className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">No milestones set yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((m, i) => {
                  const progress = Math.min((totalSignups / m.target_count) * 100, 100);
                  const isComplete = m.reached_at !== null || totalSignups >= m.target_count;

                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className={`rounded-xl border p-6 transition-all ${
                        isComplete
                          ? "border-primary/30 bg-primary/5 shadow-gold"
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {isComplete ? (
                              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                            )}
                            <h3 className="font-display text-base font-semibold text-foreground">
                              {m.name}
                            </h3>
                          </div>
                          {m.description && (
                            <p className="mt-2 text-sm text-muted-foreground pl-8">
                              {m.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display text-lg font-bold text-foreground">
                            {m.target_count.toLocaleString()}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            target
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {Math.min(totalSignups, m.target_count).toLocaleString()} /{" "}
                            {m.target_count.toLocaleString()}
                          </span>
                          <span className={isComplete ? "text-primary font-semibold" : ""}>
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
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
