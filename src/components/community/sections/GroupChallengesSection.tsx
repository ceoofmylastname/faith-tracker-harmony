import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Clock, Plus, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export default function GroupChallengesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    category: "",
    description: "",
    endDate: ""
  });

  // Fetch all challenges
  const { data: challenges, refetch: refetchChallenges } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_challenges')
        .select(`
          *,
          creator:profiles(name),
          participants:challenge_participants(user_id),
          progress:challenge_progress(*)
        `);
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's participated challenges
  const { data: participatedChallenges } = useQuery({
    queryKey: ['participated-challenges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('challenge_id')
        .eq('user_id', user?.id);
      if (error) throw error;
      return data.map(p => p.challenge_id);
    }
  });

  const createChallenge = async () => {
    try {
      const { error } = await supabase.from("community_challenges").insert({
        creator_id: user?.id,
        name: newChallenge.name,
        category: newChallenge.category,
        description: newChallenge.description,
        end_date: new Date(newChallenge.endDate).toISOString()
      });

      if (error) throw error;

      toast({
        title: "Challenge created!",
        description: "Your challenge has been created successfully."
      });
      setIsCreating(false);
      refetchChallenges();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating challenge",
        description: error.message
      });
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      const { error } = await supabase.from("challenge_participants").insert({
        challenge_id: challengeId,
        user_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Joined challenge!",
        description: "You've successfully joined the challenge."
      });
      refetchChallenges();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error joining challenge",
        description: error.message
      });
    }
  };

  const markDailyProgress = async (challengeId: string) => {
    try {
      const { error } = await supabase.from("challenge_progress").insert({
        challenge_id: challengeId,
        user_id: user?.id,
        completed_date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      toast({
        title: "Progress recorded!",
        description: "Your daily progress has been recorded."
      });
      refetchChallenges();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error recording progress",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Community Challenges</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Challenge Name</Label>
                <Input
                  id="name"
                  value={newChallenge.name}
                  onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
                  placeholder="Enter challenge name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newChallenge.category}
                  onValueChange={(value) => setNewChallenge({ ...newChallenge, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prayer">Prayer</SelectItem>
                    <SelectItem value="bible">Bible Reading</SelectItem>
                    <SelectItem value="fasting">Fasting</SelectItem>
                    <SelectItem value="giving">Giving</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Enter challenge description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newChallenge.endDate}
                  onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                />
              </div>
              <Button onClick={createChallenge} className="w-full">
                Create Challenge
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {challenges?.map((challenge) => {
          const isParticipating = participatedChallenges?.includes(challenge.id);
          const participantCount = challenge.participants?.length || 0;
          const todayProgress = challenge.progress?.filter(
            (p) => p.completed_date === new Date().toISOString().split('T')[0]
          ).length || 0;
          
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
                <Button 
                  onClick={() => markDailyProgress(challenge.id)}
                  className="w-full gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Today Complete
                </Button>
              ) : (
                <Button 
                  onClick={() => joinChallenge(challenge.id)}
                  variant="outline" 
                  className="w-full"
                >
                  Join Challenge
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
