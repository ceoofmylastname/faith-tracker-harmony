import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Wallet } from "lucide-react";
import { PrayerAnalytics } from "@/components/prayer/PrayerAnalytics";

export default function DashboardHome() {
  const otherActivities = [
    { 
      title: "Bible Reading", 
      icon: BookOpen, 
      bg: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30",
      progress: 60,
      description: "Follow your Bible study progress" 
    },
    { 
      title: "Fasting", 
      icon: Calendar, 
      bg: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30",
      progress: 90,
      description: "Monitor your fasting schedule" 
    },
    { 
      title: "Giving", 
      icon: Wallet, 
      bg: "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30",
      progress: 45,
      description: "Track your tithes and offerings" 
    },
  ];

  const weeklySchedule = [
    { day: "MON", activity: "Morning Prayer", time: "6:00 AM", participants: 3 },
    { day: "WED", activity: "Bible Study", time: "7:00 PM", participants: 5 },
    { day: "FRI", activity: "Fasting", time: "All Day", participants: 2 },
    { day: "SUN", activity: "Church Service", time: "10:00 AM", participants: 12 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent mb-6">
        Welcome to Your Faith Journey
      </h1>

      {/* Popular Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PrayerAnalytics />
        {otherActivities.map((activity) => (
          <Card key={activity.title} className="transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
            <CardHeader className={`${activity.bg} rounded-t-lg p-4`}>
              <div className="flex items-center gap-2">
                <activity.icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                <CardTitle className="text-lg">{activity.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{activity.description}</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${activity.progress}%` }} 
                />
              </div>
              <p className="text-right text-sm mt-1 text-gray-600 dark:text-gray-400">{activity.progress}%</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Schedule */}
      <Card className="mt-6 transform hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklySchedule.map((item) => (
              <div 
                key={item.day}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-red-600 dark:text-red-400 w-16">
                    {item.day}
                  </span>
                  <div>
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.time}</p>
                  </div>
                </div>
                <Button variant="outline" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                  Join
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}