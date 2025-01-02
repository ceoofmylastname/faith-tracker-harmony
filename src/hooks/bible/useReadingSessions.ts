import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const useReadingSessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const startReadingSession = async (book: string, chapter: number) => {
    if (!user) return null;

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
      return null;
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
        description: `Reading session completed: ${Math.ceil(durationSeconds / 60)} minutes`,
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

  return { startReadingSession, endReadingSession };
};