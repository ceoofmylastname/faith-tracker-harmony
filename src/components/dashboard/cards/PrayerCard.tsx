import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function PrayerCard() {
  const [dailyProgress, setDailyProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [goalMinutes, setGoalMinutes] = useState(30);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchPrayerData = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch today's prayer sessions
      const { data: sessions } = await supabase
        .from('prayer_sessions')
        .select('duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', today);

      if (sessions) {
        const totalMinutes = sessions.reduce(
          (acc, session) => acc + (session.duration_seconds / 60),
          0
        );
        setDailyProgress(totalMinutes);
      }

      // Fetch prayer goal
      const { data: goalData } = await supabase
        .from('prayer_goals')
        .select('target_minutes')
        .eq('user_id', user.id)
        .eq('month', new Date().toISOString().slice(0, 7) + '-01')
        .maybeSingle();

      if (goalData) {
        setGoalMinutes(goalData.target_minutes);
      }
    };

    fetchPrayerData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('prayer-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prayer_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchPrayerData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const progressPercentage = Math.min((dailyProgress / goalMinutes) * 100, 100);
  
  const getProgressColor = () => {
    if (progressPercentage >= 100) return "bg-green-500";
    if (progressPercentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMessage = () => {
    if (progressPercentage >= 100) return "Great job! Goal achieved! 🎉";
    if (progressPercentage >= 50) return "You're doing great! Keep going! 💪";
    return "Let's start praying! 🙏";
  };

  return (
    <div className="group relative p-[2px] rounded-xl transition-all duration-300 animate-float hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl opacity-75 group-hover:opacity-100 animate-borderGlow" />
      <Card className="relative w-full h-full bg-gradient-to-br from-background/90 to-background rounded-xl backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Daily Prayer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span>{Math.round(dailyProgress)} / {goalMinutes} minutes</span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-orange-500" />
              {streak} day streak
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            // Remove indicatorClassName and use the style prop instead
            style={{
              ['--progress-background' as string]: getProgressColor()
            }}
          />
          <p className="text-sm text-muted-foreground text-center">
            {getMessage()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}