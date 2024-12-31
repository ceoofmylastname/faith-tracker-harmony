import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Home, Heart, Settings, Wallet, ScrollText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PrayerTab from "@/components/prayer/PrayerTab";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const popularActivities = [
    { title: "Prayer", icon: Heart, bg: "bg-gradient-to-br from-purple-100 to-purple-200", tooltip: "Track your daily prayers" },
    { title: "Bible Reading", icon: BookOpen, bg: "bg-gradient-to-br from-blue-100 to-blue-200", tooltip: "Monitor your Bible study progress" },
    { title: "Fasting", icon: Calendar, bg: "bg-gradient-to-br from-green-100 to-green-200", tooltip: "Log your fasting journey" },
    { title: "Giving", icon: Wallet, bg: "bg-gradient-to-br from-yellow-100 to-yellow-200", tooltip: "Manage your tithes and offerings" },
  ];

  const weeklySchedule = [
    { day: "MON", activity: "Morning Prayer", time: "6:00 AM", participants: 3, type: "prayer" },
    { day: "WED", activity: "Bible Study", time: "7:00 PM", participants: 5, type: "bible" },
    { day: "FRI", activity: "Fasting", time: "All Day", participants: 2, type: "fasting" },
    { day: "SUN", activity: "Church Service", time: "10:00 AM", participants: 12, type: "service" },
  ];

  const getActivityColor = (type) => {
    const colors = {
      prayer: "text-purple-600",
      bible: "text-blue-600",
      fasting: "text-green-600",
      service: "text-yellow-600",
    };
    return colors[type] || "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar with maroon gradient */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white p-6 shadow-2xl transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
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
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
            <ScrollText className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <PrayerTab />
      </div>
    </div>
  );
}