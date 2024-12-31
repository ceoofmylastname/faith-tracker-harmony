import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const data = [
  { month: 'Jan', tithes: 800, offerings: 200 },
  { month: 'Feb', tithes: 900, offerings: 300 },
  { month: 'Mar', tithes: 850, offerings: 250 },
  { month: 'Apr', tithes: 1000, offerings: 400 },
  { month: 'May', tithes: 950, offerings: 350 },
  { month: 'Jun', tithes: 1100, offerings: 450 },
];

const chartConfig = {
  tithes: {
    label: "Tithes",
    theme: {
      light: "#800000", // Maroon
      dark: "#555555", // Gray
    },
  },
  offerings: {
    label: "Offerings",
    theme: {
      light: "#A52A2A", // Lighter maroon
      dark: "#888888", // Lighter gray
    },
  },
};

export default function GivingCharts() {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={chartType === 'area' ? 'default' : 'outline'}
          onClick={() => setChartType('area')}
          size="sm"
        >
          Area
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          onClick={() => setChartType('bar')}
          size="sm"
        >
          Bar
        </Button>
      </div>

      <div className="h-[300px]">
        <ChartContainer config={chartConfig}>
          {chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Area
                type="monotone"
                dataKey="tithes"
                stroke="var(--color-tithes)"
                fill="var(--color-tithes)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="offerings"
                stroke="var(--color-offerings)"
                fill="var(--color-offerings)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="tithes" fill="var(--color-tithes)" />
              <Bar dataKey="offerings" fill="var(--color-offerings)" />
            </BarChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}