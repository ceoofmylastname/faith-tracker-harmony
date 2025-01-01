import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function LeaderboardSection() {
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Top Contributors</h3>
      
      <div className="space-y-4">
        {leaderboard?.map((user, index) => (
          <Card key={user.id} className="p-4 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-8 text-center font-semibold">
                {index + 1}
              </div>
              <Avatar>
                <AvatarImage src={user.profile_image_url} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{user.name || 'Anonymous'}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Medal className="h-5 w-5 text-primary" />
                <span className="font-semibold">
                  {Math.floor(Math.random() * 1000)} pts
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}