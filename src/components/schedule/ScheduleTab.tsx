import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Event } from "./types";
import CalendarView from "./CalendarView";
import EventsList from "./EventsList";
import EventDialog from "./EventDialog";
import { useToast } from "@/components/ui/use-toast";

export default function ScheduleTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['schedule-events', format(selectedDate || new Date(), 'yyyy-MM')],
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
        toast({
          title: "Error fetching events",
          description: error.message,
          variant: "destructive"
        });
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

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('calendar-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events'
        },
        (payload) => {
          console.log('Calendar event change received:', payload);
          toast({
            title: "Calendar Updated",
            description: "New event received from Make.com"
          });
          // Trigger a refetch of the events
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

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