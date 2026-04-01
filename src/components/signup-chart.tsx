"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface DailyTrend {
  date: string;
  count: number;
}

export default function SignupChart() {
  const [data, setData] = useState<DailyTrend[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const json = await res.json();
        if (json.daily_trend) {
          setData(json.daily_trend);
        }
      } catch {
        // silent fail
      }
    };
    fetchStats();
  }, []);

  const formattedData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    signups: d.count,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">Daily Signups</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <TrendingUp className="h-3 w-3" />
          Live
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="signupGoldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(42 60% 54%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(42 60% 54%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(220 10% 50%)", fontSize: 10 }}
            interval="preserveStartEnd"
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
            fill="url(#signupGoldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
