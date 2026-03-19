"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AnalyticsLineChartProps = {
  data: { month: string; value: number }[];
  color?: string;
  currency?: boolean;
};

const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;

export function AnalyticsLineChart({
  data,
  color = "#1a3c2e",
  currency = true
}: AnalyticsLineChartProps) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              currency ? `₦${Math.round(value / 1000)}k` : value.toLocaleString()
            }
          />
          <Tooltip
            formatter={(value: number) =>
              currency ? formatCurrency(Number(value)) : Number(value).toLocaleString()
            }
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid rgba(26,60,46,0.2)",
              boxShadow: "0 12px 30px rgba(26,60,46,0.12)"
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
