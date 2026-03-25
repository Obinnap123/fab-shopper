"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type ChartData = {
  month: string;
  online: number;
  offline: number;
};

const currency = (value: number) => `${"\u20A6"}${value / 1000}k`;

export function SalesChart({ data = [
  { month: "Jan", online: 0, offline: 0 },
  { month: "Feb", online: 0, offline: 0 },
  { month: "Mar", online: 0, offline: 0 },
  { month: "Apr", online: 0, offline: 0 },
  { month: "May", online: 0, offline: 0 },
  { month: "Jun", online: 0, offline: 0 }
] }: { data?: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(26,60,46,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="#1a3c2e" tickLine={false} axisLine={false} />
        <YAxis
          stroke="#1a3c2e"
          tickLine={false}
          axisLine={false}
          tickFormatter={currency}
        />
        <Tooltip
          formatter={(value: number) => `${"\u20A6"}${value.toLocaleString()}`}
          contentStyle={{
            borderRadius: "16px",
            border: "1px solid rgba(26,60,46,0.2)",
            boxShadow: "0 12px 30px rgba(26,60,46,0.12)"
          }}
        />
        <Line type="monotone" dataKey="online" stroke="#1a3c2e" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="offline" stroke="#c9a84c" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
