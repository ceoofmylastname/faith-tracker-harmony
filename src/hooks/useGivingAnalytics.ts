import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface GivingAnalytics {
  totalGivingYTD: number;
  tithesYTD: number;
  monthlyAverage: number;
  goalProgress: number;
  currentGoalAmount: number | null;
}

export function useGivingAnalytics() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["giving-analytics", user?.id],
    queryFn: async (): Promise<GivingAnalytics> => {
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;

      // Fetch total giving for the year
      const { data: givingData, error: givingError } = await supabase
        .from("giving_records")
        .select("amount, category")
        .eq("user_id", user?.id)
        .gte("date", startOfYear);

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
        .single();

      if (goalError && goalError.code !== "PGRST116") throw goalError;

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
      };
    },
    enabled: !!user,
  });
}