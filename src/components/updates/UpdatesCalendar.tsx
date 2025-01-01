import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import CalendarView from "@/components/schedule/CalendarView";
import EventsList from "@/components/schedule/EventsList";
import EventDialog from "@/components/schedule/EventDialog";
import { Event } from "@/components/schedule/types";

export default function UpdatesCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch all calendar events
  const { data: events = [] } = useQuery({
    queryKey: ['all-calendar-events', selectedDate && format(selectedDate, 'yyyy-MM')],
    queryFn: async () => {
      const startOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), selectedDate?.getMonth() || new Date().getMonth(), 1);
      const endOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), (selectedDate?.getMonth() || new Date().getMonth()) + 1, 0);

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', startOfMonth.toISOString())
        .lte('start_time', endOfMonth.toISOString());

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      return data.map((event: any) => ({
        id: event.id,
        type: event.event_type || 'event',
        title: event.title,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        content: event.description,
      }));
    },
  });

  return (
    <div className="grid md:grid-cols-[auto,1fr] gap-8">
      <CalendarView
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        dayHasEvents={(date) => events.some(event => 
          format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        )}
      />

      <EventsList
        selectedDate={selectedDate}
        events={events}
        onEventClick={setSelectedEvent}
      />

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}