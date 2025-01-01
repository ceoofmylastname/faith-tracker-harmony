import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AccessManagement from "./AccessManagement";
import UpdatesCalendar from "./UpdatesCalendar";

export default function UpdatesTab() {
  const { user } = useAuth();

  // Check if current user has update access
  const { data: hasAccess, isLoading: checkingAccess } = useQuery({
    queryKey: ['update-access', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('update_access')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking access:', error);
        return false;
      }
      return !!data;
    },
  });

  if (checkingAccess) {
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
        <AccessManagement />
      </div>

      <UpdatesCalendar />
    </div>
  );
}