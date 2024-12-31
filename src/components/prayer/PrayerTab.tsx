import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Play, Pause, BookOpen, Heart, List, Plus, Home, Calendar, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PrayerTab() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [prayerTime, setPrayerTime] = useState(0);
  const [reflection, setReflection] = useState("");

  // Sample data - would be fetched from Supabase in a real implementation
  const dailyProgress = 75;
  const weeklyProgress = 85;
  const monthlyProgress = 60;
  const nextPrayer = "Morning Prayer";
  const nextPrayerTime = "6:00 AM";

  const verseOfTheDay = {
    text: "Pray without ceasing.",
    reference: "1 Thessalonians 5:17",
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white p-6 shadow-2xl transition-all duration-300 ease-in-out z-50">
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Faith Tracker</h1>
        </div>
        <nav className="space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => navigate('/dashboard')}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => navigate('/dashboard/prayer')}
          >
            <Heart className="mr-2 h-5 w-5" />
            Prayer
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        <div className="space-y-6 max-w-7xl mx-auto">
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
            {/* Progress Section */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Prayer Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Daily Progress</span>
                    <span className="text-red-600">{dailyProgress}%</span>
                  </div>
                  <Progress value={dailyProgress} className="h-2">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" 
                         style={{ width: `${dailyProgress}%` }} />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Weekly Progress</span>
                    <span className="text-red-600">{weeklyProgress}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-2">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" 
                         style={{ width: `${weeklyProgress}%` }} />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Monthly Progress</span>
                    <span className="text-red-600">{monthlyProgress}%</span>
                  </div>
                  <Progress value={monthlyProgress} className="h-2">
                    <div className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full" 
                         style={{ width: `${monthlyProgress}%` }} />
                  </Progress>
                </div>
              </CardContent>
            </Card>

            {/* Timer Section */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Prayer Timer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-4">
                    {Math.floor(prayerTime / 60)}:{(prayerTime % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={toggleTimer}
                      variant="outline"
                      className="hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {isTimerRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                      {isTimerRunning ? "Pause" : "Start"}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <Clock size={20} />
                    <span>Next Prayer: {nextPrayer} at {nextPrayerTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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

          {/* Prayer List Section */}
          <Card className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Prayer List</CardTitle>
              <Button variant="outline" size="icon" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <List className="h-4 w-4" />
                  <span>View Saved Prayers</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                    <span>Family's Health</span>
                    <Button variant="ghost" size="sm">Mark as Answered</Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                    <span>Guidance for Work</span>
                    <Button variant="ghost" size="sm">Mark as Answered</Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
