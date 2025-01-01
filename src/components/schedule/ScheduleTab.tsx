import { useState } from "react";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import CalendarView from "./CalendarView";
import EventsList from "./EventsList";
import EventDialog from "./EventDialog";
import { Event } from "./types";
import { useCalendarEvents } from "./hooks/useCalendarEvents";

export default function ScheduleTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, isLoading } = useCalendarEvents(selectedDate);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const dayHasEvents = (date: Date) => {
    return events.some(event => 
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Schedule</h1>
      
      <div className="grid md:grid-cols-[auto,1fr] gap-8">
        <CalendarView
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          dayHasEvents={dayHasEvents}
        />

        <EventsList
          selectedDate={selectedDate}
          events={events}
          onEventClick={setSelectedEvent}
        />
      </div>

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}