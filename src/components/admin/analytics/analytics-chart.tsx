"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const data = [
  { month: "Jan", value: 420000 },
  { month: "Feb", value: 520000 },
  { month: "Mar", value: 610000 },
  { month: "Apr", value: 480000 },
  { month: "May", value: 720000 },
  { month: "Jun", value: 680000 }
];

export function AnalyticsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="forestFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a3c2e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#1a3c2e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="#1a3c2e" tickLine={false} axisLine={false} />
          <YAxis
            stroke="#1a3c2e"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `?${value / 1000}k`}
          />
          <Tooltip
            formatter={(value: number) => `?${value.toLocaleString()}`}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(26,60,46,0.2)",
              boxShadow: "0 12px 30px rgba(26,60,46,0.12)"
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#1a3c2e" fill="url(#forestFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
