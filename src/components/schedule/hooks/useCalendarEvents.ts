import { format } from "date-fns";
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

      const startOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), selectedDate?.getMonth() || new Date().getMonth(), 1);
      const endOfMonth = new Date(selectedDate?.getFullYear() || new Date().getFullYear(), (selectedDate?.getMonth() || new Date().getMonth()) + 1, 0);

      try {
        const { data, error } = await supabase
          .from('calendar_events')
          .select(`
            *,
            profiles:user_id (name, email)
          `)
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

        if (!data) return [];

        return data.map((event: any) => ({
          id: event.id,
          type: event.event_type || 'event',
          title: event.title,
          start: new Date(event.start_time),
          end: event.end_time ? new Date(event.end_time) : undefined,
          content: `${event.description || ''}\nCreated by: ${event.profiles?.name || event.profiles?.email || 'Unknown'}`,
          completed: event.completed || false,
        }));
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