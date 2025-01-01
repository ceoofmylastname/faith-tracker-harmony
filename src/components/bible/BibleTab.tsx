import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import BibleReader from "./BibleReader";
import BibleProgress from "./BibleProgress";
import BibleAnalytics from "./BibleAnalytics";
import BibleStatsCards from "./BibleStatsCards";

export default function BibleTab() {
  const [activeTab, setActiveTab] = useState("read");
  const [currentBook, setCurrentBook] = useState("Genesis");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('bible-reading-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Update daily progress
          const today = new Date().toISOString().split('T')[0];
          const { data: todaySessions } = await supabase
            .from('bible_reading_sessions')
            .select('duration_seconds')
            .eq('user_id', user.id)
            .gte('started_at', today);

          if (todaySessions) {
            const totalMinutes = todaySessions.reduce(
              (acc, session) => acc + (session.duration_seconds / 60),
              0
            );
            setDailyProgress(totalMinutes);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Calculate streak and overall progress
  useEffect(() => {
    if (!user) return;

    const calculateProgress = async () => {
      try {
        // Get completed chapters
        const { data: completedData } = await supabase
          .from('bible_reading_progress')
          .select('book, chapter')
          .eq('user_id', user.id)
          .eq('completed', true);

        if (completedData) {
          const totalChapters = 1189; // Total chapters in the Bible
          const progress = (completedData.length / totalChapters) * 100;
          setOverallProgress(Math.round(progress));
        }

        // Calculate streak
        const { data: sessions } = await supabase
          .from('bible_reading_sessions')
          .select('started_at')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (sessions && sessions.length > 0) {
          let currentStreak = 0;
          let maxStreak = 0;
          let currentDate = new Date();

          for (let i = 0; i < sessions.length; i++) {
            const sessionDate = new Date(sessions[i].started_at);
            const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
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
      } catch (error) {
        console.error('Error calculating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
      }
    };

    calculateProgress();
  }, [user, toast]);

  const handleSaveProgress = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bible_reading_progress')
        .upsert({
          user_id: user.id,
          book: currentBook,
          chapter: currentChapter,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Progress saved successfully",
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
          Bible Reading Journey
        </h1>
        <Button variant="outline" className="gap-2 text-sm" onClick={handleSaveProgress}>
          <BookMarked className="h-4 w-4" />
          Save Progress
        </Button>
      </div>

      <BibleStatsCards
        dailyProgress={dailyProgress}
        currentBook={currentBook}
        currentChapter={currentChapter}
        streak={streak}
        bestStreak={bestStreak}
        overallProgress={overallProgress}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="read" className="mt-4">
          <BibleReader 
            onBookChange={setCurrentBook}
            onChapterChange={setCurrentChapter}
            onProgressUpdate={setDailyProgress}
          />
        </TabsContent>
        <TabsContent value="progress" className="mt-4">
          <BibleProgress />
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <BibleAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
