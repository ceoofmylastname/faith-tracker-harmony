import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, TrendingUp, Clock } from "lucide-react";

export default function BibleAnalytics() {
  const weeklyData = [
    { day: "Mon", minutes: 25 },
    { day: "Tue", minutes: 30 },
    { day: "Wed", minutes: 15 },
    { day: "Thu", minutes: 45 },
    { day: "Fri", minutes: 20 },
    { day: "Sat", minutes: 35 },
    { day: "Sun", minutes: 40 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Average Time
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">30 min</div>
            <p className="text-sm text-gray-500">Per reading session</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Most Active
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">Sunday</div>
            <p className="text-sm text-gray-500">Best reading day</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-sm text-gray-500">Reading time increase</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Reading Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="minutes" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}