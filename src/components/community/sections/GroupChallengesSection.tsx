import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ChallengeCard } from "../challenges/ChallengeCard";
import { CreateChallengeDialog } from "../challenges/CreateChallengeDialog";

export default function GroupChallengesSection() {
  const { user } = useAuth();
  const { toast } = useToast();

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

  const createChallenge = async (newChallenge: any) => {
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
        <CreateChallengeDialog onCreateChallenge={createChallenge} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {challenges?.map((challenge) => {
          const isParticipating = participatedChallenges?.includes(challenge.id);
          const participantCount = challenge.participants?.length || 0;
          const todayProgress = challenge.progress?.filter(
            (p: any) => p.completed_date === new Date().toISOString().split('T')[0]
          ).length || 0;
          
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isParticipating={isParticipating}
              participantCount={participantCount}
              todayProgress={todayProgress}
              onJoin={joinChallenge}
              onMarkProgress={markDailyProgress}
            />
          );
        })}
      </div>
    </div>
  );
}