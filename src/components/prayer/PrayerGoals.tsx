import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";

export const PrayerGoals = () => {
  const [targetMinutes, setTargetMinutes] = useState("");
  const [currentGoal, setCurrentGoal] = useState<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCurrentGoal();
    }
  }, [user]);

  const loadCurrentGoal = async () => {
    if (!user) return;

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const { data, error } = await supabase
      .from('prayer_goals')
      .select('target_minutes')
      .eq('user_id', user.id)
      .eq('month', firstDayOfMonth.toISOString())
      .maybeSingle();

    if (error) {
      console.error('Error loading prayer goal:', error);
      return;
    }

    setCurrentGoal(data?.target_minutes || null);
  };

  const handleSetGoal = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to set a goal",
        variant: "destructive",
      });
      return;
    }

    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const { data: existingGoal, error: fetchError } = await supabase
        .from('prayer_goals')
        .select()
        .eq('user_id', user.id)
        .eq('month', firstDayOfMonth.toISOString())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingGoal) {
        // Update existing goal
        const { error: updateError } = await supabase
          .from('prayer_goals')
          .update({ target_minutes: parseInt(targetMinutes) })
          .eq('id', existingGoal.id);

        if (updateError) throw updateError;
      } else {
        // Insert new goal
        const { error: insertError } = await supabase
          .from('prayer_goals')
          .insert({
            target_minutes: parseInt(targetMinutes),
            month: firstDayOfMonth.toISOString(),
            user_id: user.id
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Prayer goal set",
        description: `Your goal for this month is ${targetMinutes} minutes`,
      });
      
      setCurrentGoal(parseInt(targetMinutes));
      setTargetMinutes("");
    } catch (error: any) {
      console.error('Error setting prayer goal:', error);
      toast({
        title: "Error setting goal",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async () => {
    if (!user) return;

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    try {
      const { error } = await supabase
        .from('prayer_goals')
        .delete()
        .eq('user_id', user.id)
        .eq('month', firstDayOfMonth.toISOString());

      if (error) throw error;

      toast({
        title: "Goal deleted",
        description: "Your prayer goal has been removed",
      });
      
      setCurrentGoal(null);
    } catch (error: any) {
      toast({
        title: "Error deleting goal",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Monthly Prayer Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Target minutes"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(e.target.value)}
          />
          <Button onClick={handleSetGoal}>Set Goal</Button>
        </div>
        
        {currentGoal !== null && (
          <div className="mt-4 p-4 bg-white/80 dark:bg-gray-700/80 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Current Goal: {currentGoal} minutes</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={handleDeleteGoal}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={75} className="mt-2 h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};