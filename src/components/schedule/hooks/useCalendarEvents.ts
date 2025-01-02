import { format, addWeeks, addMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Event } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export function useCalendarEvents(selectedDate: Date | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['schedule-events', format(selectedDate || new Date(), 'yyyy-MM')],
    queryFn: async () => {
      if (!user) {
        console.error('User not authenticated');
        return [];
      }

      const startOfMonthDate = startOfMonth(selectedDate || new Date());
      const endOfMonthDate = endOfMonth(selectedDate || new Date());

      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select(`
            *,
            profiles:user_id (name, email)
          `)
          .or(`and(start_time.gte.${startOfMonthDate.toISOString()},start_time.lte.${endOfMonthDate.toISOString()}),event_type.neq.none`);

        if (error) {
          console.error('Error fetching events:', error);
          toast({
            title: "Error fetching events",
            description: error.message,
            variant: "destructive"
          });
          return [];
        }

        if (!data) return [];

        const processedEvents: Event[] = [];

        data.forEach((event: any) => {
          // Add the original event
          const baseEvent: Event = {
            id: event.id,
            type: event.event_type || 'event',
            title: event.title,
            start: new Date(event.start_time),
            end: event.end_time ? new Date(event.end_time) : undefined,
            content: `${event.description || ''}\nCreated by: ${event.profiles?.name || event.profiles?.email || 'Unknown'}`,
            completed: event.completed || false,
          };
          processedEvents.push(baseEvent);

          // Handle recurring events
          if (event.event_type?.startsWith('repeat_')) {
            const repeatType = event.event_type.split('_')[1];
            const originalStart = new Date(event.start_time);
            const originalEnd = event.end_time ? new Date(event.end_time) : undefined;
            
            // Generate recurring instances within the month
            let currentDate = originalStart;
            while (isWithinInterval(currentDate, { start: startOfMonthDate, end: endOfMonthDate })) {
              if (format(currentDate, 'yyyy-MM-dd') !== format(originalStart, 'yyyy-MM-dd')) {
                const recurringEvent: Event = {
                  ...baseEvent,
                  id: `${event.id}_${format(currentDate, 'yyyy-MM-dd')}`,
                  start: currentDate,
                  end: originalEnd ? new Date(currentDate.getTime() + (originalEnd.getTime() - originalStart.getTime())) : undefined,
                };
                processedEvents.push(recurringEvent);
              }
              
              // Move to next occurrence
              currentDate = repeatType === 'weekly' 
                ? addWeeks(currentDate, 1)
                : addMonths(currentDate, 1);
            }
          }
        });

        return processedEvents;
      } catch (error: any) {
        console.error('Error in events query:', error);
        toast({
          title: "Error fetching events",
          description: "There was an error fetching the events. Please try again.",
          variant: "destructive"
        });
        return [];
      }
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
        () => {
          queryClient.invalidateQueries({ queryKey: ['schedule-events'] });
          toast({
            title: "Calendar Updated",
            description: "Calendar events have been updated"
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return { events, isLoading };
}