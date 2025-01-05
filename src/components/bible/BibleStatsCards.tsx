import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy } from "lucide-react";

interface BibleStatsCardsProps {
  dailyProgress: number;
  currentBook: string;
  currentChapter: number;
  streak: number;
  bestStreak: number;
  overallProgress: number;
}

export default function BibleStatsCards({
  currentBook,
  currentChapter,
  streak,
  bestStreak,
}: BibleStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <Card className="transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-t-lg p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />
            Current Book
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 p-4">
          <div className="text-lg font-bold mb-2">{currentBook}</div>
          <p className="text-xs text-gray-500">Chapter {currentChapter}</p>
        </CardContent>
      </Card>

      <Card className="transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-lg p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 p-4">
          <div className="text-lg font-bold mb-2">{streak} Days</div>
          <p className="text-xs text-gray-500">Personal Best: {bestStreak} days</p>
        </CardContent>
      </Card>
    </div>
  );
}