import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { differenceInDays, format } from "date-fns";

export function FastingCard() {
  const [activeFast, setActiveFast] = useState<{
    type: string;
    startDate: Date;
    durationDays: number;
  } | null>(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchFastingData = async () => {
      const { data } = await supabase
        .from('fasting_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + data.duration_days);
        
        const remaining = differenceInDays(endDate, new Date());
        
        setActiveFast({
          type: data.fast_type,
          startDate: startDate,
          durationDays: data.duration_days,
        });
        setDaysRemaining(remaining >= 0 ? remaining : 0);
      }
    };

    fetchFastingData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('fasting-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fasting_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchFastingData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!activeFast) {
    return (
      <Card className="relative overflow-hidden transform-gpu transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:border-blue-600/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Timer className="h-5 w-5 text-blue-600" />
            Fasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            No active fast. Start one to track your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min(
    ((activeFast.durationDays - daysRemaining) / activeFast.durationDays) * 100,
    100
  );

  return (
    <Card className="relative overflow-hidden transform-gpu transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:border-blue-600/20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Timer className="h-5 w-5 text-blue-600" />
          {activeFast.type} Fast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(activeFast.startDate, 'MMM d, yyyy')}
          </span>
          <span>{daysRemaining} days remaining</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200/50 dark:bg-gray-700/50" />
        <p className="text-sm text-center text-muted-foreground">
          {progress === 100 ? "Fast completed! 🎉" : "Stay strong! 💪"}
        </p>
      </CardContent>
    </Card>
  );
}