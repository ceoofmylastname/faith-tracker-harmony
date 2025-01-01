import { useEffect, useState } from "react";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { StatCard } from "./analytics/StatCard";
import { WeeklyChart } from "./analytics/WeeklyChart";

export default function BibleAnalytics() {
  const { user } = useAuth();
  const [averageTime, setAverageTime] = useState(0);
  const [mostActiveDay, setMostActiveDay] = useState("");
  const [monthlyTrend, setMonthlyTrend] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ day: string; minutes: number }[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Get reading sessions from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: sessions } = await supabase
          .from('bible_reading_sessions')
          .select('duration_seconds, started_at')
          .eq('user_id', user.id)
          .gte('started_at', sevenDaysAgo.toISOString())
          .order('started_at', { ascending: true });

        if (sessions) {
          // Calculate average reading time
          const totalMinutes = sessions.reduce(
            (acc, session) => acc + (session.duration_seconds / 60),
            0
          );
          setAverageTime(Math.round(totalMinutes / (sessions.length || 1)));

          // Process daily reading data
          const dailyData: Record<string, number> = {};
          let maxMinutes = 0;
          let maxDay = "";

          sessions.forEach(session => {
            const day = format(new Date(session.started_at), 'EEEE');
            const minutes = session.duration_seconds / 60;
            dailyData[day] = (dailyData[day] || 0) + minutes;

            if (dailyData[day] > maxMinutes) {
              maxMinutes = dailyData[day];
              maxDay = day;
            }
          });

          setMostActiveDay(maxDay || "No data yet");

          // Format data for the chart
          const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const formattedData = weekDays.map(day => ({
            day: day.substring(0, 3),
            minutes: Math.round(dailyData[day] || 0)
          }));
          setWeeklyData(formattedData);

          // Calculate monthly trend
          const previousMonth = new Date();
          previousMonth.setMonth(previousMonth.getMonth() - 1);
          
          const { data: lastMonthSessions } = await supabase
            .from('bible_reading_sessions')
            .select('duration_seconds')
            .eq('user_id', user.id)
            .gte('started_at', previousMonth.toISOString())
            .lt('started_at', sevenDaysAgo.toISOString());

          if (lastMonthSessions) {
            const lastMonthAvg = lastMonthSessions.reduce(
              (acc, session) => acc + (session.duration_seconds / 60),
              0
            ) / (lastMonthSessions.length || 1);

            const currentAvg = totalMinutes / (sessions.length || 1);
            const trend = lastMonthAvg ? ((currentAvg - lastMonthAvg) / lastMonthAvg) * 100 : 0;
            setMonthlyTrend(Math.round(trend));
          }
        }
      } catch (error) {
        console.error("Error fetching Bible analytics:", error);
      }
    };

    fetchAnalytics();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('bible-analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bible_reading_sessions',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Average Time"
          value={`${averageTime} min`}
          subtitle="Per reading session"
          icon={Clock}
          gradientFrom="blue-50"
          gradientTo="blue-100"
        />
        <StatCard
          title="Most Active"
          value={mostActiveDay}
          subtitle="Best reading day"
          icon={Calendar}
          gradientFrom="green-50"
          gradientTo="green-100"
        />
        <StatCard
          title="Monthly Trend"
          value={`${monthlyTrend > 0 ? '+' : ''}${monthlyTrend}%`}
          subtitle="Reading time change"
          icon={TrendingUp}
          gradientFrom="purple-50"
          gradientTo="purple-100"
        />
      </div>
      <WeeklyChart data={weeklyData} />
    </div>
  );
}
