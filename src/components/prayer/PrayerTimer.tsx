import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock } from "lucide-react";
import { usePrayerTimer } from "@/hooks/usePrayerTimer";
import { useState } from "react";

export const PrayerTimer = () => {
  const { isRunning, time, startTimer, stopTimer } = usePrayerTimer();
  const [totalTime, setTotalTime] = useState(0);

  const handleStopTimer = async () => {
    await stopTimer();
    setTotalTime(prev => prev + time);
  };

  return (
    <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Prayer Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Total Today: {Math.floor(totalTime / 60)} minutes
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={isRunning ? handleStopTimer : startTimer}
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