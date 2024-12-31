import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Bible, BookOpen, Calendar, Home, PrayingHands, Settings, Wallet } from "lucide-react";

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
    { title: "Prayer", icon: PrayingHands, bg: "bg-purple-100" },
    { title: "Bible Reading", icon: BookOpen, bg: "bg-blue-100" },
    { title: "Fasting", icon: Calendar, bg: "bg-green-100" },
    { title: "Giving", icon: Wallet, bg: "bg-yellow-100" },
  ];

  const weeklySchedule = [
    { day: "MON", activity: "Morning Prayer", time: "6:00 AM", participants: 3 },
    { day: "WED", activity: "Bible Study", time: "7:00 PM", participants: 5 },
    { day: "FRI", activity: "Fasting", time: "All Day", participants: 2 },
    { day: "SUN", activity: "Church Service", time: "10:00 AM", participants: 12 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-purple-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Faith Tracker</h1>
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-white">
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <PrayingHands className="mr-2 h-5 w-5" />
            Prayer
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Bible className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Welcome, {user.email}</h2>
          <Button onClick={() => signOut()} variant="outline">
            Sign Out
          </Button>
        </div>

        {/* Popular Activities Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Spiritual Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularActivities.map((activity) => (
              <Card key={activity.title} className={`${activity.bg} border-none`}>
                <CardContent className="p-6 flex items-center space-x-4">
                  <activity.icon className="h-8 w-8 text-purple-900" />
                  <span className="font-medium text-lg">{activity.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Daily Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Prayer Time</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Bible Reading</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Fasting Goal</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((item) => (
                  <div key={item.day} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-purple-900">{item.day}</span>
                      <div>
                        <p className="font-medium">{item.activity}</p>
                        <p className="text-sm text-gray-500">{item.time}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
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