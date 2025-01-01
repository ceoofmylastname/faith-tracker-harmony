import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { GivingTooltip } from './GivingTooltip';

interface ChartData {
  month: string;
  fullDate: string;
  tithes: number;
  offerings: number;
}

interface BarChartViewProps {
  data: ChartData[];
  chartConfig: any;
}

export function BarChartView({ data, chartConfig }: BarChartViewProps) {
  return (
    <BarChart
      data={data}
      margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
      height={300}
    >
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
      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
      <XAxis 
        dataKey="month" 
        stroke="currentColor" 
        fontSize={10}
        tickLine={false}
        axisLine={false}
        interval="preserveStartEnd"
        tick={{ fontSize: 10 }}
        padding={{ left: 10, right: 10 }}
      />
      <YAxis 
        stroke="currentColor" 
        fontSize={10}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value}`}
        domain={[0, 'auto']}
        tick={{ fontSize: 10 }}
        width={45}
      />
      <ChartTooltip content={GivingTooltip} />
      <Bar 
        dataKey="tithes" 
        fill="url(#tithesBarGradient)"
        radius={[4, 4, 0, 0]}
        maxBarSize={25}
      />
      <Bar 
        dataKey="offerings" 
        fill="url(#offeringsBarGradient)"
        radius={[4, 4, 0, 0]}
        maxBarSize={25}
      />
    </BarChart>
  );
}