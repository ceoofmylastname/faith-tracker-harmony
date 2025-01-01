import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export function usePartnerships(userId: string | undefined) {
  const { toast } = useToast();
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .neq("id", userId);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: error.message,
      });
    }
  };

  const loadPartnerships = async () => {
    try {
      const { data, error } = await supabase
        .from("accountability_partnerships")
        .select(`
          *,
          user1:profiles!accountability_partnerships_user_id_1_fkey(email),
          user2:profiles!accountability_partnerships_user_id_2_fkey(email)
        `)
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

      if (error) throw error;
      setPartnerships(data || []);
    } catch (error: any) {
      console.error("Error loading partnerships:", error);
      toast({
        variant: "destructive",
        title: "Error loading partnerships",
        description: error.message,
      });
    }
  };

  const subscribeToPartnerships = () => {
    const subscription = supabase
      .channel('partnerships_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accountability_partnerships',
        },
        () => {
          loadPartnerships();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  useEffect(() => {
    if (userId) {
      loadUsers();
      loadPartnerships();
      subscribeToPartnerships();
    }
  }, [userId]);

  return {
    users,
    partnerships,
    loadPartnerships,
  };
}