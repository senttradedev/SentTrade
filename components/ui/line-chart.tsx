"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LineChartProps {
  data: Array<Record<string, any>>;
  dataKeys: string[];
  xAxisKey: string;
  colors?: string[];
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  showLegend?: boolean;
}

export function LineChart({
  data,
  dataKeys,
  xAxisKey,
  colors = ["var(--primary)"],
  yAxisFormatter = (value) => `${value}`,
  tooltipFormatter = (value) => `${value}`,
  showLegend = true,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          className="opacity-30"
        />
        <XAxis
          dataKey={xAxisKey}
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={yAxisFormatter}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">{label}</div>
                  {payload.map((item: any) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">
                          {item.name}:
                        </span>
                      </div>
                      <span className="font-medium">
                        {item.value
                          ? tooltipFormatter(Number(item.value))
                          : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
        {showLegend && (
          <Legend
            verticalAlign="top"
            height={36}
            content={({ payload }) => {
              if (!payload) return null;
              return (
                <div className="flex items-center justify-center gap-4">
                  {payload.map((entry, index) => (
                    <div
                      key={entry.value}
                      className="flex items-center gap-1 text-sm"
                    >
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
        )}
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
