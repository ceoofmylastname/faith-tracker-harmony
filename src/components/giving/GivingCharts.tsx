import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useGivingAnalytics } from "@/hooks/useGivingAnalytics";

const chartConfig = {
  tithes: {
    label: "Tithes",
    theme: {
      light: "#800000",
      dark: "#555555",
    },
  },
  offerings: {
    label: "Offerings",
    theme: {
      light: "#A52A2A",
      dark: "#888888",
    },
  },
};

export default function GivingCharts() {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const { data: analytics } = useGivingAnalytics();

  const transformedData = analytics?.monthlyData?.map((item) => ({
    month: new Date(item.month).toLocaleString('default', { month: 'short' }),
    tithes: Number(item.tithes) || 0,
    offerings: Number(item.offerings) || 0,
  })) || [];

  const commonChartProps = {
    data: transformedData,
    margin: { top: 20, right: 10, left: 10, bottom: 20 },
    height: 300,
  };

  const renderChart = () => {
    if (chartType === 'area') {
      return (
        <AreaChart {...commonChartProps}>
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
            interval="preserveStartEnd"
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            stroke="currentColor" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            domain={[0, 'auto']}
            tick={{ fontSize: 10 }}
            width={50}
          />
          <ChartTooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="tithes"
            stroke="var(--color-tithes)"
            fill="url(#tithesGradient)"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5, strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="offerings"
            stroke="var(--color-offerings)"
            fill="url(#offeringsGradient)"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 1 }}
            activeDot={{ r: 5, strokeWidth: 1 }}
          />
        </AreaChart>
      );
    }

    return (
      <BarChart {...commonChartProps}>
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
          interval="preserveStartEnd"
          tick={{ fontSize: 10 }}
        />
        <YAxis 
          stroke="currentColor" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          domain={[0, 'auto']}
          tick={{ fontSize: 10 }}
          width={50}
        />
        <ChartTooltip 
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '8px',
            fontSize: '12px',
          }}
        />
        <Bar 
          dataKey="tithes" 
          fill="url(#tithesBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={30}
        />
        <Bar 
          dataKey="offerings" 
          fill="url(#offeringsBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={30}
        />
      </BarChart>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center sm:justify-start">
        <Button
          variant={chartType === 'area' ? 'default' : 'outline'}
          onClick={() => setChartType('area')}
          size="sm"
          className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3"
        >
          Area
        </Button>
        <Button
          variant={chartType === 'bar' ? 'default' : 'outline'}
          onClick={() => setChartType('bar')}
          size="sm"
          className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-3"
        >
          Bar
        </Button>
      </div>

      <div className="relative h-[300px] w-full transform transition-all duration-500 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(128,0,0,0.2)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] backdrop-blur-sm border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}