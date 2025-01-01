import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { PrayerTimer } from "./PrayerTimer";
import { PrayerGoals } from "./PrayerGoals";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export default function PrayerTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reflection, setReflection] = useState("");
  const [reflections, setReflections] = useState<Array<{ id: string; content: string; created_at: string }>>([]);

  const verseOfTheDay = {
    text: "Pray without ceasing.",
    reference: "1 Thessalonians 5:17",
  };

  useEffect(() => {
    if (user) {
      loadReflections();
    }
  }, [user]);

  const loadReflections = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('prayer_reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading reflections:', error);
      return;
    }
    
    setReflections(data || []);
  };

  const saveReflection = async () => {
    if (!user || !reflection.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reflection before saving",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('prayer_reflections')
        .insert([
          {
            user_id: user.id,
            content: reflection.trim(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reflection has been saved",
      });
      
      setReflection("");
      loadReflections();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving reflection",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
          Prayer Time with Yahowah
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track, Reflect, and Strengthen Your Connection
        </p>
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-none">
          <CardContent className="p-4">
            <p className="italic text-lg">{verseOfTheDay.text}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{verseOfTheDay.reference}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PrayerTimer />
        <PrayerGoals />
      </div>

      {/* Reflection Section */}
      <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Prayer Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Write your prayer reflections here..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[150px] bg-white/80 dark:bg-gray-800/80"
          />
          <div className="flex justify-end">
            <Button 
              onClick={saveReflection}
              className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400"
            >
              Save Reflection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Reflections Section */}
      {reflections.length > 0 && (
        <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Past Reflections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reflections.map((ref) => (
                <Card key={ref.id} className="bg-white/80 dark:bg-gray-700/80">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {format(new Date(ref.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                    <p className="whitespace-pre-wrap">{ref.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}