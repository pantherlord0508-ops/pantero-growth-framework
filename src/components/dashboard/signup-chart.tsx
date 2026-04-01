"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DailyTrend {
  date: string;
  count: number;
}

interface SignupChartProps {
  dailyTrend: DailyTrend[];
}

function formatLabel(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{formatLabel(label)}</p>
      <p className="font-display text-sm font-bold text-primary">{payload[0].value} signups</p>
    </div>
  );
}

export default function SignupChart({ dailyTrend }: SignupChartProps) {
  if (!dailyTrend?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <h3 className="mb-4 font-display text-sm font-semibold text-foreground">
        Daily Signups (Last 30 Days)
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(42 60% 54%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(42 60% 54%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 10% 14%)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatLabel}
              tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }}
              axisLine={{ stroke: "hsl(220 10% 14%)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(42 60% 54%)"
              strokeWidth={2}
              fill="url(#goldGradient)"
              activeDot={{ r: 5, fill: "hsl(42 60% 54%)", stroke: "hsl(220 14% 4%)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
