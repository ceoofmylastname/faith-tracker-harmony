import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, HandsPraying, Target, Trophy } from "lucide-react";
import GroupSection from "./sections/GroupSection";
import PrayerRequestsSection from "./sections/PrayerRequestsSection";
import GroupChallengesSection from "./sections/GroupChallengesSection";
import LeaderboardSection from "./sections/LeaderboardSection";
import DataSharingPreferences from "./DataSharingPreferences";

export default function CommunityTab() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
          Community & Accountability
        </h1>
        <p className="text-xl text-muted-foreground">
          Grow Together. Stay Accountable. Achieve More.
        </p>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 animate-fade-in"
        >
          <Users className="mr-2" />
          Create Group
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="w-full justify-start bg-white/50 backdrop-blur-sm border mb-6">
          <TabsTrigger value="groups" className="data-[state=active]:bg-primary/10">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="prayers" className="data-[state=active]:bg-primary/10">
            <HandsPraying className="mr-2 h-4 w-4" />
            Prayer Requests
          </TabsTrigger>
          <TabsTrigger value="challenges" className="data-[state=active]:bg-primary/10">
            <Target className="mr-2 h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary/10">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <div className="grid gap-6">
          <TabsContent value="groups" className="m-0">
            <GroupSection />
          </TabsContent>

          <TabsContent value="prayers" className="m-0">
            <PrayerRequestsSection />
          </TabsContent>

          <TabsContent value="challenges" className="m-0">
            <GroupChallengesSection />
          </TabsContent>

          <TabsContent value="leaderboard" className="m-0">
            <LeaderboardSection />
          </TabsContent>
        </div>
      </Tabs>

      {/* Settings Card */}
      <Card className="mt-8">
        <DataSharingPreferences />
      </Card>
    </div>
  );
}