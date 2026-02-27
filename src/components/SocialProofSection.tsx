import AnimatedSection from "./AnimatedSection";
import { TrendingUp, Users, Eye, ArrowUpRight } from "lucide-react";

const chartBars = [
  { label: "Week 1", height: 22, value: 14 },
  { label: "Week 2", height: 38, value: 31 },
  { label: "Week 3", height: 52, value: 48 },
  { label: "Week 4", height: 70, value: 67 },
  { label: "Week 5", height: 85, value: 80 },
  { label: "Now", height: 100, value: 120 },
];

const stats = [
  { icon: Eye, label: "Page Views", value: "120+", change: "+43%" },
  { icon: Users, label: "Waitlist Signups", value: "80+", change: "+67%" },
  { icon: TrendingUp, label: "Conversion Rate", value: "66.7%", change: "+12%" },
];

const SocialProofSection = () => (
  <section className="border-t border-border py-24 md:py-32">
    <div className="container">
      <AnimatedSection>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Real Traction
          </p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            People Are{" "}
            <span className="text-gradient-gold">Already Moving.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every day, more ambitious people commit to structured growth. Don't get left behind.
          </p>
        </div>
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection delay={0.15}>
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-gold-dim hover:shadow-gold"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              <span className="mt-2 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <ArrowUpRight className="h-3 w-3" />
                {s.change}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Chart */}
      <AnimatedSection delay={0.3}>
        <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold text-foreground">Growth Trajectory</p>
              <p className="text-xs text-muted-foreground">Weekly signups since launch</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <TrendingUp className="h-3 w-3" />
              Trending Up
            </span>
          </div>
          <div className="flex items-end justify-between gap-3" style={{ height: 160 }}>
            {chartBars.map((bar) => (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-primary tabular-nums">{bar.value}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/60 to-primary transition-all"
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Urgency nudge */}
      <AnimatedSection delay={0.4}>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Only early members</span> get founding access & shape the platform.{" "}
          <span className="text-primary font-semibold">Spots are filling fast.</span>
        </p>
      </AnimatedSection>
    </div>
  </section>
);

export default SocialProofSection;
