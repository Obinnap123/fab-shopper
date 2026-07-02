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

const formatCurrency = (value: number) => {
  if (value === 0) return "\u20A60";
  if (Math.abs(value) < 1000) return `\u20A6${value.toLocaleString()}`;
  return `\u20A6${(value / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
};

export function SalesChart({ data = [
  { month: "Jan", online: 0, offline: 0 },
  { month: "Feb", online: 0, offline: 0 },
  { month: "Mar", online: 0, offline: 0 },
  { month: "Apr", online: 0, offline: 0 },
  { month: "May", online: 0, offline: 0 },
  { month: "Jun", online: 0, offline: 0 }
] }: { data?: ChartData[] }) {
  const highestValue = Math.max(...data.flatMap((item) => [item.online, item.offline]), 0);
  const chartMax = highestValue <= 0 ? 1000 : Math.ceil(highestValue / 1000) * 1000;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(26,60,46,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="#1a3c2e" tickLine={false} axisLine={false} />
        <YAxis
          domain={[0, chartMax]}
          stroke="#1a3c2e"
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCurrency}
        />
        <Tooltip
          formatter={(value: number) => `\u20A6${value.toLocaleString()}`}
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
