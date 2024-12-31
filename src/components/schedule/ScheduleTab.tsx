import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = {
  id: string;
  type: 'prayer' | 'bible' | 'note' | 'task';
  title: string;
  start: Date;
  end?: Date;
  content?: string;
  completed?: boolean;
};

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

  const getDayEvents = (date: Date) => {
    return events.filter(event => 
      format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'prayer':
        return 'bg-primary text-white';
      case 'bible':
        return 'bg-green-600 text-white';
      case 'note':
        return 'bg-blue-600 text-white';
      case 'task':
        return 'bg-gray-600 text-white';
    }
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasEvents: (date) => dayHasEvents(date),
            }}
            modifiersStyles={{
              hasEvents: { 
                fontWeight: 'bold',
                textDecoration: 'underline' 
              }
            }}
          />
        </div>

        <div className="space-y-4">
          {selectedDate && (
            <>
              <h2 className="text-xl font-semibold">
                Events for {format(selectedDate, 'MMMM d, yyyy')}
              </h2>
              <div className="space-y-2">
                {getDayEvents(selectedDate).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={cn(
                      "w-full text-left p-4 rounded-lg transition-transform hover:scale-[1.02]",
                      getEventColor(event.type)
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
                {getDayEvents(selectedDate).length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No events scheduled for this day
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(selectedEvent?.start || new Date(), 'MMMM d, yyyy h:mm a')}
            </div>
            {selectedEvent?.content && (
              <p className="text-gray-700 dark:text-gray-300">
                {selectedEvent.content}
              </p>
            )}
            {selectedEvent?.type === 'task' && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status:
                </span>
                <span className={selectedEvent.completed ? 'text-green-600' : 'text-yellow-600'}>
                  {selectedEvent.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}