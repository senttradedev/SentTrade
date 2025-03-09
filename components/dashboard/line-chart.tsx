"use client";

import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";

const data = [
  { date: "10-25", value: 48000 },
  { date: "11-1", value: 49000 },
  { date: "11-5", value: 47000 },
  { date: "11-10", value: 50000 },
  { date: "11-15", value: 48500 },
  { date: "11-20", value: 49500 },
];

export function LineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data}>
        <YAxis
          domain={[45000, 52000]}
          ticks={[46000, 48000, 50000, 52000]}
          axisLine={false}
          tickLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#000"
          strokeWidth={1.5}
          dot={{ fill: "#fff", stroke: "#000", strokeWidth: 1.5, r: 4 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
