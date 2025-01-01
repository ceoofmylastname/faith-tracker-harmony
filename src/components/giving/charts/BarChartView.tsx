import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
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
          interval={0}
          padding={{ left: 5, right: 5 }}
        />
        <YAxis 
          stroke="currentColor" 
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={45}
          padding={{ top: 10, bottom: 10 }}
        />
        <Tooltip content={<GivingTooltip />} />
        <Bar 
          dataKey="tithes" 
          fill="url(#tithesBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
        <Bar 
          dataKey="offerings" 
          fill="url(#offeringsBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}