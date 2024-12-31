import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const PrayerGoals = () => {
  const [targetMinutes, setTargetMinutes] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

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
    } catch (error) {
      console.error('Error setting prayer goal:', error);
      toast({
        title: "Error setting goal",
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
        <Progress value={75} className="h-2">
          <div 
            className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" 
            style={{ width: '75%' }} 
          />
        </Progress>
      </CardContent>
    </Card>
  );
};