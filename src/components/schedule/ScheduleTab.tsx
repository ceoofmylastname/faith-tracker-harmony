import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Event } from "./types";
import CalendarView from "./CalendarView";
import EventsList from "./EventsList";
import EventDialog from "./EventDialog";

export default function ScheduleTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['schedule-events', format(selectedDate || new Date(), 'yyyy-MM')],
    queryFn: async () => {
      const startOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), selectedDate?.getMonth() || new Date().getMonth(), 1);
      const endOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), (selectedDate?.getMonth() || new Date().getMonth()) + 1, 0);

      const [prayerSessions, bibleSessions, notes, tasks] = await Promise.all([
        supabase
          .from('prayer_sessions')
          .select('*')
          .gte('started_at', startOfMonth.toISOString())
          .lte('started_at', endOfMonth.toISOString()),
        supabase
          .from('bible_reading_sessions')
          .select('*')
          .gte('started_at', startOfMonth.toISOString())
          .lte('started_at', endOfMonth.toISOString()),
        supabase
          .from('notes')
          .select('*')
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString()),
        supabase
          .from('tasks')
          .select('*')
          .gte('due_date', startOfMonth.toISOString())
          .lte('due_date', endOfMonth.toISOString()),
      ]);

      const allEvents: Event[] = [
        ...(prayerSessions.data || []).map((session: any) => ({
          id: session.id,
          type: 'prayer' as const,
          title: 'Prayer Session',
          start: new Date(session.started_at),
          end: new Date(session.ended_at),
          content: `Duration: ${Math.floor(session.duration_seconds / 60)} minutes`,
        })),
        ...(bibleSessions.data || []).map((session: any) => ({
          id: session.id,
          type: 'bible' as const,
          title: `${session.book} ${session.chapter}`,
          start: new Date(session.started_at),
          end: new Date(session.ended_at),
          content: `Duration: ${Math.floor(session.duration_seconds / 60)} minutes`,
        })),
        ...(notes.data || []).map((note: any) => ({
          id: note.id,
          type: 'note' as const,
          title: note.title,
          start: new Date(note.created_at),
          content: note.content,
        })),
        ...(tasks.data || []).map((task: any) => ({
          id: task.id,
          type: 'task' as const,
          title: task.title,
          start: new Date(task.due_date),
          completed: task.completed,
          content: task.category ? `Category: ${task.category}` : undefined,
        })),
      ];

      return allEvents;
    },
  });

  const dayHasEvents = (date: Date) => {
    return events.some(event => 
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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