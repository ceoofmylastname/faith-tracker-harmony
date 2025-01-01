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
        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
      >
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
        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
        <XAxis 
          dataKey="month" 
          stroke="currentColor" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          padding={{ left: 10, right: 10 }}
        />
        <YAxis 
          stroke="currentColor" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          width={60}
          padding={{ top: 20, bottom: 20 }}
        />
        <Tooltip content={<GivingTooltip />} />
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
    </ResponsiveContainer>
  );
}