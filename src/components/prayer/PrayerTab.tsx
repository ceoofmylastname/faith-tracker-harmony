import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { PrayerTimer } from "./PrayerTimer";
import { PrayerGoals } from "./PrayerGoals";
import { useToast } from "@/components/ui/use-toast";

export default function PrayerTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [reflection, setReflection] = useState("");

  const verseOfTheDay = {
    text: "Pray without ceasing.",
    reference: "1 Thessalonians 5:17",
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
        <CardContent>
          <Textarea
            placeholder="Write your prayer reflections here..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="min-h-[150px] bg-white/80 dark:bg-gray-800/80"
          />
          <div className="flex justify-end mt-4">
            <Button className="bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400">
              Save Reflection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}