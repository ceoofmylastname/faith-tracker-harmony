import { Button } from "@/components/ui/button";

interface ChartTypeSelectorProps {
  chartType: 'area' | 'bar';
  setChartType: (type: 'area' | 'bar') => void;
}

export function ChartTypeSelector({ chartType, setChartType }: ChartTypeSelectorProps) {
  return (
    <div className="flex gap-2 justify-center sm:justify-start">
      <Button
        variant={chartType === 'area' ? 'default' : 'outline'}
        onClick={() => setChartType('area')}
        size="sm"
        className="transition-all duration-300 hover:scale-105 text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
      >
        Area
      </Button>
      <Button
        variant={chartType === 'bar' ? 'default' : 'outline'}
        onClick={() => setChartType('bar')}
        size="sm"
        className="transition-all duration-300 hover:scale-105 text-[10px] sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
      >
        Bar
      </Button>
    </div>
  );
}