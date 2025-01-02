import { format, parseISO } from "date-fns";

interface TooltipData {
  fullDate: string;
  tithes: number;
  offerings: number;
}

export function GivingTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as TooltipData;
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-xs sm:text-sm mb-1">
          {format(parseISO(data.fullDate + "-01"), "MMMM yyyy")}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
          Tithes: ${Number(payload[0].value).toFixed(2)}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
          Offerings: ${Number(payload[1].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
}