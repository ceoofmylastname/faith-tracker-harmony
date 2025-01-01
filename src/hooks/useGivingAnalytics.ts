import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface MonthlyGiving {
  month: string;
  tithes: number;
  offerings: number;
}

interface GivingAnalytics {
  totalGivingYTD: number;
  tithesYTD: number;
  monthlyAverage: number;
  goalProgress: number;
  currentGoalAmount: number | null;
  monthlyData: MonthlyGiving[];
}

export function useGivingAnalytics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["giving-analytics", user?.id],
    queryFn: async (): Promise<GivingAnalytics> => {
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;

      // Fetch giving records for the year
      const { data: givingData, error: givingError } = await supabase
        .from("giving_records")
        .select("amount, category, date")
        .eq("user_id", user?.id)
        .gte("date", startOfYear)
        .order("date", { ascending: true });

      if (givingError) throw givingError;

      // Calculate YTD totals
      const totalGivingYTD = givingData.reduce((sum, record) => sum + Number(record.amount), 0);
      const tithesYTD = givingData
        .filter(record => record.category === "tithe")
        .reduce((sum, record) => sum + Number(record.amount), 0);

      // Calculate monthly average
      const monthlyAverage = totalGivingYTD / (new Date().getMonth() + 1);

      // Fetch latest goal for progress calculation
      const { data: goalData, error: goalError } = await supabase
        .from("giving_goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (goalError && goalError.code !== "PGRST116") throw goalError;

      // Process monthly data
      const monthlyDataMap = givingData.reduce((acc, record) => {
        const monthKey = record.date.substring(0, 7); // Get YYYY-MM format
        if (!acc[monthKey]) {
          acc[monthKey] = { tithes: 0, offerings: 0 };
        }
        if (record.category === "tithe") {
          acc[monthKey].tithes += Number(record.amount);
        } else if (record.category === "offering") {
          acc[monthKey].offerings += Number(record.amount);
        }
        return acc;
      }, {} as Record<string, { tithes: number; offerings: number }>);

      // Convert to array and ensure all months from start of year are included
      const monthlyData: MonthlyGiving[] = [];
      const currentMonth = new Date().getMonth();
      
      for (let month = 0; month <= currentMonth; month++) {
        const date = new Date(currentYear, month, 1);
        const monthKey = date.toISOString().substring(0, 7);
        monthlyData.push({
          month: monthKey,
          tithes: monthlyDataMap[monthKey]?.tithes || 0,
          offerings: monthlyDataMap[monthKey]?.offerings || 0,
        });
      }

      // Calculate goal progress
      const goalProgress = goalData 
        ? (totalGivingYTD / Number(goalData.target_amount)) * 100
        : 0;

      return {
        totalGivingYTD,
        tithesYTD,
        monthlyAverage,
        goalProgress: Math.min(goalProgress, 100),
        currentGoalAmount: goalData ? Number(goalData.target_amount) : null,
        monthlyData,
      };
    },
    enabled: !!user,
  });
}