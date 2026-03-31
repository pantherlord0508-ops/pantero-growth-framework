import AnimatedSection from "./AnimatedSection";
import { TrendingUp, Users, Eye, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { week: "Week 1", signups: 14 },
  { week: "Week 2", signups: 31 },
  { week: "Week 3", signups: 48 },
  { week: "Week 4", signups: 67 },
  { week: "Week 5", signups: 80 },
  { week: "Now", signups: 120 },
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
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">Real Traction</p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            People Are{" "}
            <span className="text-gradient-gold">Already Moving.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Across the continent, people are signing up because they believe in a platform that puts identity and opportunity in their hands.
          </p>
        </div>
      </AnimatedSection>

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
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(42 60% 54%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(42 60% 54%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(220 12% 7%)",
                  border: "1px solid hsl(220 10% 14%)",
                  borderRadius: 8,
                  color: "hsl(40 10% 92%)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="signups"
                stroke="hsl(42 60% 54%)"
                strokeWidth={2}
                fill="url(#goldGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.4}>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Early members</span> help shape what Pantero becomes.{" "}
          <span className="text-primary font-semibold">You could be one of them.</span>
        </p>
      </AnimatedSection>
    </div>
  </section>
);

export default SocialProofSection;
