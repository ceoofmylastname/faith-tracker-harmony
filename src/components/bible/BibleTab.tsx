import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { BibleHeader } from "./header/BibleHeader";
import { BibleTabs } from "./tabs/BibleTabs";
import BibleStatsCards from "./BibleStatsCards";
import { useBibleReading } from "@/hooks/useBibleReading";

export default function BibleTab() {
  const [activeTab, setActiveTab] = useState("read");
  const [currentBook, setCurrentBook] = useState("Genesis");
  const [currentChapter, setCurrentChapter] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    todayProgress: dailyProgress,
    streak,
    bestStreak,
  } = useBibleReading();

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
      <BibleHeader onSaveProgress={handleSaveProgress} />

      <BibleStatsCards
        dailyProgress={dailyProgress}
        currentBook={currentBook}
        currentChapter={currentChapter}
        streak={streak}
        bestStreak={bestStreak}
        overallProgress={0}
      />

      <BibleTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentBook={currentBook}
        currentChapter={currentChapter}
        onBookChange={setCurrentBook}
        onChapterChange={setCurrentChapter}
        onProgressUpdate={(minutes) => {
          // This is handled by the useBibleReading hook now
          console.log("Progress update:", minutes);
        }}
      />
    </div>
  );
}