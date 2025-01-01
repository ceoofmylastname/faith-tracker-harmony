import { format } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Event } from "../types";

export function useCalendarEvents(selectedDate: Date | undefined) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Subscribe to real-time updates from Supabase
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