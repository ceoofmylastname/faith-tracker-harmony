import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useBibleReading } from "@/hooks/useBibleReading";

interface BibleReadingUpdate {
  current_month_minutes: number;
  last_reset_date: string;
}

export function BibleCard() {
  const [currentBook, setCurrentBook] = useState("");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [goalMinutes] = useState(30);
  const { user } = useAuth();
  const { todayProgress: dailyProgress, streak } = useBibleReading();
  const [monthlyProgress, setMonthlyProgress] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchBibleData = async () => {
      try {
        // Fetch latest reading session for current book/chapter
        const { data: sessions, error: sessionsError } = await supabase
          .from('bible_reading_sessions')
          .select('book, chapter')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (sessionsError) throw sessionsError;

        if (sessions && sessions.length > 0) {
          setCurrentBook(sessions[0].book);
          setCurrentChapter(sessions[0].chapter);
        }

        // Fetch monthly progress
        const { data: cumulativeData, error: cumulativeError } = await supabase
          .from('bible_reading_cumulative')
          .select('current_month_minutes, last_reset_date')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cumulativeError) throw cumulativeError;

        if (cumulativeData) {
          const lastResetDate = new Date(cumulativeData.last_reset_date);
          const currentDate = new Date();
          
          // If it's a new month, reset the progress
          if (lastResetDate.getMonth() !== currentDate.getMonth() || 
              lastResetDate.getFullYear() !== currentDate.getFullYear()) {
            const { error: updateError } = await supabase
              .from('bible_reading_cumulative')
              .update({
                current_month_minutes: 0,
                last_reset_date: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
              })
              .eq('user_id', user.id);

            if (updateError) throw updateError;
            setMonthlyProgress(0);
          } else {
            console.log('Setting monthly progress:', cumulativeData.current_month_minutes);
            setMonthlyProgress(cumulativeData.current_month_minutes);
          }
        }
      } catch (error) {
        console.error('Error fetching Bible data:', error);
      }
    };

    fetchBibleData();

    // Subscribe to real-time updates for bible_reading_cumulative
    const channel = supabase
      .channel('bible-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_cumulative',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Received bible reading update:', payload);
          const newData = payload.new as BibleReadingUpdate;
          if (newData && typeof newData.current_month_minutes === 'number') {
            console.log('Updating monthly progress to:', newData.current_month_minutes);
            setMonthlyProgress(newData.current_month_minutes);
          }
        }
      )
      .subscribe();

    // Subscribe to bible_reading_sessions for current book/chapter updates
    const sessionsChannel = supabase
      .channel('reading-sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          console.log('Received reading session update:', payload);
          if (payload.new) {
            setCurrentBook(payload.new.book);
            setCurrentChapter(payload.new.chapter);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [user]);

  const monthlyProgressPercentage = Math.min((monthlyProgress / goalMinutes) * 100, 100);

  return (
    <Card className="relative overflow-hidden transform-gpu transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)] hover:border-green-600/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          Bible Reading
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>{monthlyProgress} / {goalMinutes} minutes</span>
          <span className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            {streak} day streak
          </span>
        </div>
        <Progress value={monthlyProgressPercentage} className="h-2 bg-gray-200/50 dark:bg-gray-700/50" />
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