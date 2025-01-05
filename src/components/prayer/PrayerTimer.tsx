import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Clock } from "lucide-react";
import { usePrayerTimer } from "@/hooks/usePrayerTimer";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const PrayerTimer = () => {
  const { isRunning, time, startTimer, stopTimer } = usePrayerTimer();
  const [totalTime, setTotalTime] = useState(0);
  const { user } = useAuth();

  const handleStopTimer = async () => {
    const minutes = Math.ceil(time / 60);
    await stopTimer();
    setTotalTime(prev => prev + time);

    if (user) {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // First, try to get existing cumulative record
      const { data: existingData } = await supabase
        .from('bible_reading_cumulative')
        .select('current_month_minutes')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingData) {
        // Update existing record
        await supabase
          .from('bible_reading_cumulative')
          .update({
            current_month_minutes: existingData.current_month_minutes + minutes,
            last_reset_date: firstDayOfMonth.toISOString()
          })
          .eq('user_id', user.id);
      } else {
        // Create new record
        await supabase
          .from('bible_reading_cumulative')
          .insert({
            user_id: user.id,
            current_month_minutes: minutes,
            total_minutes: minutes,
            last_reset_date: firstDayOfMonth.toISOString()
          });
      }
    }
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