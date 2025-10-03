// components/organisms/equity-curve-chart.tsx

"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userApi } from "@/lib/supabase/api";
import type { Trade } from "@/lib/types/trade";

interface EquityCurveChartProps {
  trades: Trade[];
}

interface ChartDataPoint {
  date: string;
  equity: number;
  fullDate: string | null;
  symbol: string | null;
}

export const EquityCurveChart = ({ trades }: EquityCurveChartProps) => {
  const [initialCapital, setInitialCapital] = useState(10000000);

  useEffect(() => {
    userApi.getSettings().then((settings) => {
      if (settings) {
        setInitialCapital(settings.initial_capital);
      }
    });
  }, []);

  const closedTrades = trades
    .filter((t) => t.status === "closed" && t.exit)
    .sort(
      (a, b) =>
        new Date(a.exit!.exitTime).getTime() -
        new Date(b.exit!.exitTime).getTime()
    );

  if (closedTrades.length === 0) {
    return null;
  }

  const chartData: ChartDataPoint[] = [
    {
      date: "시작",
      equity: initialCapital,
      fullDate: null,
      symbol: null,
    },
  ];

  let currentEquity = initialCapital;

  closedTrades.forEach((trade, index) => {
    currentEquity += trade.exit!.actualPnL;
    chartData.push({
      date: `#${index + 1}`,
      equity: currentEquity,
      fullDate: new Date(trade.exit!.exitTime).toLocaleDateString("ko-KR"),
      symbol: trade.entry.symbol,
    });
  });

  const minEquity = Math.min(...chartData.map((d) => d.equity));
  const maxEquity = Math.max(...chartData.map((d) => d.equity));
  const yAxisMin = Math.floor(minEquity * 0.95);
  const yAxisMax = Math.ceil(maxEquity * 1.05);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" />
          <YAxis
            domain={[yAxisMin, yAxisMax]}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            className="text-xs"
          />
          <Tooltip
            formatter={(value: number) => [
              `₩${value.toLocaleString()}`,
              "자산",
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const data = payload[0].payload as ChartDataPoint;
                if (data.fullDate && data.symbol) {
                  return `${label} - ${data.symbol} (${data.fullDate})`;
                }
              }
              return label;
            }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
