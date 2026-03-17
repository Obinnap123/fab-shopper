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

const data = [
  { month: "Jan", online: 420000, offline: 180000 },
  { month: "Feb", online: 520000, offline: 240000 },
  { month: "Mar", online: 610000, offline: 310000 },
  { month: "Apr", online: 480000, offline: 260000 },
  { month: "May", online: 720000, offline: 330000 },
  { month: "Jun", online: 680000, offline: 290000 }
];

const currency = (value: number) => `${"\u20A6"}${value / 1000}k`;

export function SalesChart() {
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
