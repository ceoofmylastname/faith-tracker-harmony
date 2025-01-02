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
        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
      >
        <defs>
          <linearGradient id="tithesBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-tithes)" stopOpacity={1}/>
            <stop offset="100%" stopColor="var(--color-tithes)" stopOpacity={0.7}/>
          </linearGradient>
          <linearGradient id="offeringsBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-offerings)" stopOpacity={1}/>
            <stop offset="100%" stopColor="var(--color-offerings)" stopOpacity={0.7}/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false}
          stroke="rgba(255,255,255,0.2)"
        />
        <XAxis 
          dataKey="month" 
          stroke="currentColor" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval={0}
          padding={{ left: 0, right: 0 }}
          tick={{ fill: 'currentColor', fontWeight: 500 }}
        />
        <YAxis 
          stroke="currentColor" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={60}
          tick={{ fill: 'currentColor', fontWeight: 500 }}
        />
        <Tooltip 
          content={<GivingTooltip />}
          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
        />
        <Bar 
          dataKey="tithes" 
          fill="url(#tithesBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={30}
          filter="url(#shadow)"
        />
        <Bar 
          dataKey="offerings" 
          fill="url(#offeringsBarGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={30}
          filter="url(#shadow)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}