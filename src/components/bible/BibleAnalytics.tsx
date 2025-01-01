import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

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
        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Average Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{averageTime} min</div>
            <p className="text-sm text-gray-500">Per reading session</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Most Active
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{mostActiveDay}</div>
            <p className="text-sm text-gray-500">Best reading day</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{monthlyTrend > 0 ? '+' : ''}{monthlyTrend}%</div>
            <p className="text-sm text-gray-500">Reading time change</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Reading Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}