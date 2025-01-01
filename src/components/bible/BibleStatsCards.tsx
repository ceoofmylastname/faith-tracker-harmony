import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Trophy, BookMarked } from "lucide-react";

interface BibleStatsCardsProps {
  dailyProgress: number;
  currentBook: string;
  currentChapter: number;
  streak: number;
  bestStreak: number;
  overallProgress: number;
}

export default function BibleStatsCards({
  dailyProgress,
  currentBook,
  currentChapter,
  streak,
  bestStreak,
  overallProgress,
}: BibleStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <Card className="transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-lg p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Daily Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 p-4">
          <div className="text-lg font-bold mb-2">30 minutes</div>
          <Progress value={(dailyProgress / 30) * 100} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">{dailyProgress} minutes completed</p>
        </CardContent>
      </Card>

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

      <Card className="transform hover:scale-[1.02] transition-all duration-300">
        <CardHeader className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-t-lg p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookMarked className="h-4 w-4" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 p-4">
          <div className="text-lg font-bold mb-2">{overallProgress}%</div>
          <Progress value={overallProgress} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">{Math.round(overallProgress * 1189 / 100)} chapters completed</p>
        </CardContent>
      </Card>
    </div>
  );
}