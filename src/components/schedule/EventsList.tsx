import { format } from "date-fns";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Event } from "./types";

interface EventsListProps {
  selectedDate: Date | undefined;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export default function EventsList({ selectedDate, events, onEventClick }: EventsListProps) {
  if (!selectedDate) return null;

  const dayEvents = events.filter(event => 
    format(event.start, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Events for {format(selectedDate, 'MMMM d, yyyy')}
      </h2>
      <div className="space-y-2">
        {dayEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className={cn(
              "w-full text-left p-4 rounded-lg transition-all duration-200",
              "hover:scale-[1.02] hover:shadow-md",
              "bg-gradient-to-r from-primary/90 to-primary",
              "text-white"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{event.title}</span>
              {event.type === 'task' && event.completed && (
                <CheckCircle2 className="h-5 w-5" />
              )}
            </div>
            {event.content && (
              <p className="text-sm opacity-90 mt-1">{event.content}</p>
            )}
          </button>
        ))}
        {dayEvents.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No events scheduled for this day
          </p>
        )}
      </div>
    </div>
  );
}