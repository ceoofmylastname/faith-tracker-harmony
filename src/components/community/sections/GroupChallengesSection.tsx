import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Clock } from "lucide-react";

export default function GroupChallengesSection() {
  const challenges = [
    {
      id: 1,
      name: "1,000 Minutes of Prayer",
      progress: 65,
      deadline: "2024-03-31",
      type: "Prayer",
    },
    {
      id: 2,
      name: "Read Through Psalms",
      progress: 30,
      deadline: "2024-04-15",
      type: "Bible Reading",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Active Challenges</h3>
        <Button>
          <Target className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-6 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">{challenge.name}</h4>
                <p className="text-sm text-muted-foreground">{challenge.type}</p>
              </div>
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <Progress value={challenge.progress} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{challenge.progress}% Complete</span>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Ends {new Date(challenge.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}