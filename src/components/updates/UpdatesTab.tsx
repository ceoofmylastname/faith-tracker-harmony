import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import CalendarView from "@/components/schedule/CalendarView";
import EventsList from "@/components/schedule/EventsList";
import EventDialog from "@/components/schedule/EventDialog";
import { format } from "date-fns";
import { Event } from "@/components/schedule/types";

export default function UpdatesTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Check if current user has update access
  const { data: hasAccess, isLoading: checkingAccess } = useQuery({
    queryKey: ['update-access', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('update_access')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error checking access:', error);
        return false;
      }
      return !!data;
    },
  });

  // Fetch all users for the dropdown
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data;
    },
    enabled: !!hasAccess,
  });

  // Fetch all calendar events
  const { data: events = [], isLoading: loadingEvents } = useQuery({
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
    enabled: !!hasAccess,
  });

  const handleGrantAccess = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('update_access')
      .insert({
        user_id: selectedUser,
        granted_by: user?.id,
      });

    if (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: "Failed to grant access",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Access granted successfully",
    });
    setSelectedUser("");
  };

  if (checkingAccess || loadingUsers) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Updates</h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleGrantAccess}>
            <UserPlus className="h-4 w-4 mr-2" />
            Grant Access
          </Button>
        </div>
      </div>

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
      </div>

      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}