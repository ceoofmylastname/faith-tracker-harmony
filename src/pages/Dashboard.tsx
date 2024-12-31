import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Home, Settings, Wallet, Heart, ScrollText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white p-6 shadow-xl transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Faith Tracker</h1>
        </div>
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300">
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300">
            <Heart className="mr-2 h-5 w-5" />
            Prayer
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300">
            <ScrollText className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user.email}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Keep growing closer to Yahowah</p>
          </div>
          <Button onClick={() => signOut()} variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            Sign Out
          </Button>
        </div>

        {/* Popular Activities Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Spiritual Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TooltipProvider>
              {popularActivities.map((activity) => (
                <Tooltip key={activity.title}>
                  <TooltipTrigger>
                    <Card className={`${activity.bg} border-none hover:scale-105 transition-transform duration-300`}>
                      <CardContent className="p-6 flex items-center space-x-4">
                        <activity.icon className="h-8 w-8 text-purple-900" />
                        <span className="font-medium text-lg">{activity.title}</span>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{activity.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle>Daily Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Prayer Time</span>
                    <span className="text-purple-600 dark:text-purple-400">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-purple-100 dark:bg-purple-900">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400" style={{ width: "85%" }} />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Bible Reading</span>
                    <span className="text-blue-600 dark:text-blue-400">60%</span>
                  </div>
                  <Progress value={60} className="h-2 bg-blue-100 dark:bg-blue-900">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: "60%" }} />
                  </Progress>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Fasting Goal</span>
                    <span className="text-green-600 dark:text-green-400">40%</span>
                  </div>
                  <Progress value={40} className="h-2 bg-green-100 dark:bg-green-900">
                    <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: "40%" }} />
                  </Progress>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-purple-900 dark:text-purple-400">{item.day}</span>
                      <div>
                        <p className={`font-medium ${getActivityColor(item.type)}`}>{item.activity}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.time}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}