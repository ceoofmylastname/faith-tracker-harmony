import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  dayHasEvents: (date: Date) => boolean;
}

export default function CalendarView({ selectedDate, onSelect, dayHasEvents }: CalendarViewProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="rounded-md border"
        modifiers={{
          hasEvents: (date) => dayHasEvents(date),
        }}
        modifiersStyles={{
          hasEvents: { 
            fontWeight: 'bold',
            textDecoration: 'underline',
            color: 'var(--primary)',
          }
        }}
      />
    </div>
  );
}