import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock } from "lucide-react";
import { usePrayerTimer } from "@/hooks/usePrayerTimer";

export const PrayerTimer = () => {
  const { isRunning, time, startTimer, stopTimer } = usePrayerTimer();

  return (
    <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Prayer Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={isRunning ? stopTimer : startTimer}
              variant="outline"
              className="hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
              {isRunning ? "Stop" : "Start"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};