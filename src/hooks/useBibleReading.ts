import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { addDays, isSameDay, parseISO } from "date-fns";

export const useBibleReading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [readingGoal, setReadingGoal] = useState<number>(30);
  const [todayProgress, setTodayProgress] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch reading goal
        const { data: goalData } = await supabase
          .from("bible_reading_goals")
          .select("daily_minutes")
          .eq("user_id", user.id)
          .single();

        if (goalData) {
          setReadingGoal(goalData.daily_minutes);
        }

        // Fetch today's progress
        const today = new Date();
        const { data: sessionsData } = await supabase
          .from("bible_reading_sessions")
          .select("duration_seconds, started_at")
          .eq("user_id", user.id)
          .gte("started_at", today.toISOString().split("T")[0]);

        if (sessionsData) {
          const totalMinutes = sessionsData.reduce(
            (acc, session) => acc + session.duration_seconds / 60,
            0
          );
          setTodayProgress(totalMinutes);
        }

        // Calculate streak
        const { data: streakData } = await supabase
          .from("bible_reading_sessions")
          .select("started_at")
          .eq("user_id", user.id)
          .order("started_at", { ascending: false });

        if (streakData && streakData.length > 0) {
          let currentStreak = 0;
          let maxStreak = 0;
          let currentDate = new Date();

          for (let i = 0; i < streakData.length; i++) {
            const sessionDate = parseISO(streakData[i].started_at);
            
            if (isSameDay(currentDate, sessionDate) || 
                isSameDay(addDays(currentDate, -1), sessionDate)) {
              currentStreak++;
              currentDate = sessionDate;
              maxStreak = Math.max(maxStreak, currentStreak);
            } else {
              break;
            }
          }

          setStreak(currentStreak);
          setBestStreak(maxStreak);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bible reading data:", error);
        toast({
          title: "Error",
          description: "Failed to load Bible reading data",
          variant: "destructive",
        });
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bible-reading-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bible_reading_sessions",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          // Refresh data when changes occur
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const startReadingSession = async (book: string, chapter: number) => {
    if (!user) return;

    try {
      const startedAt = new Date().toISOString();
      const { data, error } = await supabase
        .from("bible_reading_sessions")
        .insert({
          user_id: user.id,
          book,
          chapter,
          started_at: startedAt,
          duration_seconds: 0,
          ended_at: startedAt,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error starting reading session:", error);
      toast({
        title: "Error",
        description: "Failed to start reading session",
        variant: "destructive",
      });
    }
  };

  const endReadingSession = async (sessionId: string, durationSeconds: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("bible_reading_sessions")
        .update({
          duration_seconds: durationSeconds,
          ended_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reading session completed!",
      });
    } catch (error) {
      console.error("Error ending reading session:", error);
      toast({
        title: "Error",
        description: "Failed to end reading session",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    readingGoal,
    todayProgress,
    streak,
    bestStreak,
    startReadingSession,
    endReadingSession,
  };
};