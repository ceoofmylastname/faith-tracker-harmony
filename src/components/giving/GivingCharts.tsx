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
          className="transition-all duration-300 hover:scale-105"
        >
          Area
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          onClick={() => setChartType('bar')}
          size="sm"
          className="transition-all duration-300 hover:scale-105"
        >
          Bar
        </Button>
      </div>

      <div className="relative h-[400px] w-full transform transition-all duration-500 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(128,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <ChartContainer config={chartConfig}>
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tithesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tithes)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-tithes)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="offeringsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-offerings)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-offerings)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="tithes"
                stroke="var(--color-tithes)"
                fill="url(#tithesGradient)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="offerings"
                stroke="var(--color-offerings)"
                fill="url(#offeringsGradient)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="tithesBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-tithes)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="var(--color-tithes)" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="offeringsBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-offerings)" stopOpacity={1}/>
                  <stop offset="100%" stopColor="var(--color-offerings)" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar 
                dataKey="tithes" 
                fill="url(#tithesBarGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar 
                dataKey="offerings" 
                fill="url(#offeringsBarGradient)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
}