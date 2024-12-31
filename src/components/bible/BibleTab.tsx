import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, BookMarked, Trophy } from "lucide-react";
import BibleReader from "./BibleReader";
import BibleProgress from "./BibleProgress";
import BibleAnalytics from "./BibleAnalytics";

export default function BibleTab() {
  const [activeTab, setActiveTab] = useState("read");

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
          Bible Reading Journey
        </h1>
        <Button variant="outline" className="gap-2">
          <BookMarked className="h-4 w-4" />
          Save Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold mb-2">30 minutes</div>
            <Progress value={65} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">19 minutes completed</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Current Book
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold mb-2">Matthew</div>
            <p className="text-sm text-gray-500">Chapter 5 of 28</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold mb-2">7 Days</div>
            <p className="text-sm text-gray-500">Personal Best: 14 days</p>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold mb-2">23%</div>
            <Progress value={23} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">15 books completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="read" className="mt-6">
          <BibleReader />
        </TabsContent>
        <TabsContent value="progress" className="mt-6">
          <BibleProgress />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <BibleAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}