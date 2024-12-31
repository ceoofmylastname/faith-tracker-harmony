import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface FastingSession {
  id: string;
  start_date: string;
  duration_days: number;
  fast_type: string;
  notes: string;
}

export function FastingDashboard() {
  const [activeFast, setActiveFast] = useState<FastingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActiveFast = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("fasting_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        setActiveFast(data);
        if (data) {
          const startDate = new Date(data.start_date);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + data.duration_days);
          const remaining = differenceInDays(endDate, new Date());
          setDaysRemaining(remaining >= 0 ? remaining : 0);
        }
      } catch (error) {
        console.error("Error fetching fasting session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveFast();

    // Set up real-time subscription
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fasting_sessions",
        },
        () => {
          fetchActiveFast();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!activeFast) {
    return null;
  }

  const fastTypeLabel = {
    FULL_FAST: "Full Fast",
    PARTIAL_FAST: "Partial Fast",
    DANIEL_FAST: "Daniel Fast",
  }[activeFast.fast_type];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Start Date</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {format(new Date(activeFast.start_date), "PPP")}
          </p>
        </CardContent>
      </Card>

      <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Type of Fast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fastTypeLabel}</p>
        </CardContent>
      </Card>

      <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-purple-500/50 to-blue-500/50 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Days Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {daysRemaining === 0 ? (
              "Fast Completed! Well done! 🎉"
            ) : (
              `${daysRemaining} days`
            )}
          </p>
        </CardContent>
      </Card>

      {activeFast.notes && (
        <Card className="md:col-span-3 transform hover:scale-[1.02] transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{activeFast.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}