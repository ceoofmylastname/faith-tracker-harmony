import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GivingTooltip } from './GivingTooltip';

interface ChartData {
  month: string;
  fullDate: string;
  tithes: number;
  offerings: number;
}

interface AreaChartViewProps {
  data: ChartData[];
  chartConfig: any;
}

export function AreaChartView({ data, chartConfig }: AreaChartViewProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="tithesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-tithes)" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="var(--color-tithes)" stopOpacity={0.2}/>
          </linearGradient>
          <linearGradient id="offeringsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-offerings)" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="var(--color-offerings)" stopOpacity={0.2}/>
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
          fontSize={10}
          tickLine={false}
          axisLine={false}
          interval={0}
          tick={{ fill: 'currentColor', fontWeight: 500 }}
          height={30}
        />
        <YAxis 
          stroke="currentColor" 
          fontSize={10}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={45}
          tick={{ fill: 'currentColor', fontWeight: 500 }}
        />
        <Tooltip 
          content={<GivingTooltip />}
          cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="tithes"
          stroke="var(--color-tithes)"
          strokeWidth={2}
          fill="url(#tithesGradient)"
          dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
          activeDot={{ 
            r: 5, 
            strokeWidth: 2,
            filter: 'url(#shadow)'
          }}
        />
        <Area
          type="monotone"
          dataKey="offerings"
          stroke="var(--color-offerings)"
          strokeWidth={2}
          fill="url(#offeringsGradient)"
          dot={{ r: 3, strokeWidth: 2, fill: 'white' }}
          activeDot={{ 
            r: 5, 
            strokeWidth: 2,
            filter: 'url(#shadow)'
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}