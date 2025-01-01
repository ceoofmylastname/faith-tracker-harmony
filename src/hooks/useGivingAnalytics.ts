import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { startOfYear, format, eachMonthOfInterval, startOfMonth, endOfMonth } from "date-fns";

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
      const now = new Date();
      const yearStart = startOfYear(now);
      
      // Get all months from start of year to current month
      const months = eachMonthOfInterval({
        start: yearStart,
        end: now
      });

      // Fetch giving records for the year
      const { data: givingData, error: givingError } = await supabase
        .from("giving_records")
        .select("amount, category, date")
        .eq("user_id", user?.id)
        .gte("date", format(yearStart, "yyyy-MM-dd"))
        .order("date", { ascending: true });

      if (givingError) throw givingError;

      // Calculate YTD totals
      const totalGivingYTD = givingData.reduce((sum, record) => sum + Number(record.amount), 0);
      const tithesYTD = givingData
        .filter(record => record.category === "tithe")
        .reduce((sum, record) => sum + Number(record.amount), 0);

      // Calculate monthly average (only counting months that have passed)
      const monthsPassed = months.length;
      const monthlyAverage = totalGivingYTD / monthsPassed;

      // Fetch latest goal for progress calculation
      const { data: goalData, error: goalError } = await supabase
        .from("giving_goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (goalError && goalError.code !== "PGRST116") throw goalError;

      // Process monthly data with proper date handling
      const monthlyDataMap = new Map<string, { tithes: number; offerings: number }>();
      
      // Initialize all months with zero values
      months.forEach(month => {
        monthlyDataMap.set(format(month, "yyyy-MM"), { tithes: 0, offerings: 0 });
      });

      // Fill in actual giving data
      givingData.forEach(record => {
        const monthKey = record.date.substring(0, 7); // YYYY-MM format
        const currentData = monthlyDataMap.get(monthKey) || { tithes: 0, offerings: 0 };
        
        if (record.category === "tithe") {
          currentData.tithes += Number(record.amount);
        } else if (record.category === "offering") {
          currentData.offerings += Number(record.amount);
        }
        
        monthlyDataMap.set(monthKey, currentData);
      });

      // Convert to array and format for display
      const monthlyData: MonthlyGiving[] = Array.from(monthlyDataMap.entries()).map(([month, data]) => ({
        month,
        tithes: data.tithes,
        offerings: data.offerings
      }));

      // Sort by date
      monthlyData.sort((a, b) => a.month.localeCompare(b.month));

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