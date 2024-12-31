import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    </div>
  );
}