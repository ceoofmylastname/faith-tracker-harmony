import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function BibleCard() {
  const [currentBook, setCurrentBook] = useState("");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [goalMinutes, setGoalMinutes] = useState(30);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchBibleData = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's reading sessions
      const { data: sessions } = await supabase
        .from('bible_reading_sessions')
        .select('duration_seconds, book, chapter')
        .eq('user_id', user.id)
        .gte('started_at', today)
        .order('created_at', { ascending: false });

      if (sessions && sessions.length > 0) {
        const totalMinutes = sessions.reduce(
          (acc, session) => acc + (session.duration_seconds / 60),
          0
        );
        setDailyProgress(totalMinutes);
        setCurrentBook(sessions[0].book);
        setCurrentChapter(sessions[0].chapter);
      }

      // Fetch reading goal
      const { data: goalData } = await supabase
        .from('bible_reading_goals')
        .select('daily_minutes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (goalData) {
        setGoalMinutes(goalData.daily_minutes);
      }
    };

    fetchBibleData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bible-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchBibleData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const progressPercentage = Math.min((dailyProgress / goalMinutes) * 100, 100);

  return (
    <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          Bible Reading
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>{Math.round(dailyProgress)} / {goalMinutes} minutes</span>
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            {streak} day streak
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="text-sm text-center">
          {currentBook && currentChapter ? (
            <span>Currently reading: {currentBook} {currentChapter}</span>
          ) : (
            <span>Start your reading journey today!</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}