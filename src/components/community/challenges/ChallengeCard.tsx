import { format } from "date-fns";
import { Trophy, Clock, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChallengeChat } from "./ChallengeChat";

interface ChallengeCardProps {
  challenge: any;
  isParticipating: boolean;
  participantCount: number;
  todayProgress: number;
  onJoin: (challengeId: string) => void;
  onMarkProgress: (challengeId: string) => void;
}

export function ChallengeCard({
  challenge,
  isParticipating,
  participantCount,
  todayProgress,
  onJoin,
  onMarkProgress,
}: ChallengeCardProps) {
  return (
    <Card key={challenge.id} className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">{challenge.name}</h4>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>
        <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
          {challenge.category}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4" />
          <span>Created by {challenge.creator?.name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ends {format(new Date(challenge.end_date), 'PP')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>{participantCount} participants</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Today's Progress</span>
          <span>{todayProgress}/{participantCount} completed</span>
        </div>
        <Progress value={(todayProgress / participantCount) * 100} />
      </div>

      {isParticipating ? (
        <div className="space-y-4">
          <Button 
            onClick={() => onMarkProgress(challenge.id)}
            className="w-full gap-2"
          >
            Mark Today Complete
          </Button>
          <ChallengeChat 
            challengeId={challenge.id}
            challengeName={challenge.name}
          />
        </div>
      ) : (
        <Button 
          onClick={() => onJoin(challenge.id)}
          variant="outline" 
          className="w-full"
        >
          Join Challenge
        </Button>
      )}
    </Card>
  );
}