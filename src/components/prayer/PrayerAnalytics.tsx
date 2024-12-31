import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const PrayerAnalytics = () => {
  const [progress, setProgress] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [goalMinutes, setGoalMinutes] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchPrayerData = async () => {
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)).toISOString();

      // Fetch current month's goal
      const { data: goalData, error: goalError } = await supabase
        .from('prayer_goals')
        .select('target_minutes')
        .eq('user_id', user.id)
        .eq('month', new Date().toISOString().slice(0, 7) + '-01')
        .maybeSingle();

      if (goalError) {
        console.error('Error fetching prayer goal:', goalError);
        return;
      }

      // Fetch prayer sessions for today
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('prayer_sessions')
        .select('duration_seconds')
        .eq('user_id', user.id)
        .gte('started_at', startOfDay)
        .lte('started_at', endOfDay);

      if (sessionsError) {
        console.error('Error fetching prayer sessions:', sessionsError);
        return;
      }

      const targetMinutes = goalData?.target_minutes || 0;
      const totalSeconds = sessionsData?.reduce((acc, session) => acc + (session.duration_seconds || 0), 0) || 0;
      const totalMins = Math.round(totalSeconds / 60);
      
      setGoalMinutes(targetMinutes);
      setTotalMinutes(totalMins);
      setProgress(targetMinutes > 0 ? Math.min((totalMins / targetMinutes) * 100, 100) : 0);
    };

    fetchPrayerData();

    // Subscribe to real-time updates for prayer sessions
    const channel = supabase
      .channel('prayer-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prayer_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchPrayerData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCardClick = () => {
    navigate('/dashboard/prayer');
  };

  const getProgressColor = () => {
    if (progress <= 30) return "bg-red-500";
    if (progress <= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgressMessage = () => {
    if (progress <= 30) return "Let's aim higher! You can do it!";
    if (progress <= 70) return "You're on track! Keep up the great work.";
    if (progress <= 90) return "Almost there—stay consistent!";
    return "Amazing progress! You've crushed your goal!";
  };

  return (
    <Card 
      className="transform hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30"
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <Heart className="h-4 w-4 inline-block mr-2 text-red-500" />
          Daily Prayer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getProgressMessage()}
          </p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-sm mt-1 text-gray-600 dark:text-gray-400">
            {Math.round(progress)}% ({totalMinutes} / {goalMinutes} minutes)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};