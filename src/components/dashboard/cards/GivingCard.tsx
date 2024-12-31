import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface CategoryProgress {
  category: string;
  amount: number;
  goal: number;
}

export function GivingCard() {
  const [totalGiving, setTotalGiving] = useState(0);
  const [goalAmount, setGoalAmount] = useState(0);
  const [categories, setCategories] = useState<CategoryProgress[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchGivingData = async () => {
      const currentYear = new Date().getFullYear();
      const startOfYear = `${currentYear}-01-01`;

      // Fetch total giving for the year
      const { data: givingData } = await supabase
        .from("giving_records")
        .select("amount, category")
        .eq("user_id", user.id)
        .gte("date", startOfYear);

      // Fetch latest goal
      const { data: goalData } = await supabase
        .from("giving_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (givingData) {
        const total = givingData.reduce((sum, record) => sum + Number(record.amount), 0);
        setTotalGiving(total);

        // Calculate category totals
        const categoryTotals = givingData.reduce((acc, record) => {
          const category = record.category;
          acc[category] = (acc[category] || 0) + Number(record.amount);
          return acc;
        }, {} as Record<string, number>);

        if (goalData) {
          setGoalAmount(Number(goalData.target_amount));
          setCategories([
            {
              category: "Tithe",
              amount: categoryTotals["tithe"] || 0,
              goal: Number(goalData.target_amount) * 0.1, // 10% of total goal
            },
            {
              category: "Offering",
              amount: categoryTotals["offering"] || 0,
              goal: Number(goalData.target_amount) * 0.9, // 90% of total goal
            },
          ]);
        }
      }
    };

    fetchGivingData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('giving-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'giving_records',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchGivingData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const totalProgress = Math.min((totalGiving / goalAmount) * 100, 100);

  return (
    <Card className="transform hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Wallet className="h-5 w-5 text-orange-600" />
          Tithes & Giving
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span>${totalGiving.toFixed(2)} / ${goalAmount.toFixed(2)}</span>
          <span>{Math.round(totalProgress)}% of goal</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{cat.category}</span>
                <span>${cat.amount.toFixed(2)} / ${cat.goal.toFixed(2)}</span>
              </div>
              <Progress 
                value={(cat.amount / cat.goal) * 100} 
                className="h-1"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}