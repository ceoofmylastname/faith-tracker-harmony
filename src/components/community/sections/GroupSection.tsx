import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function GroupSection() {
  const { user } = useAuth();
  const [showInvite, setShowInvite] = useState(false);

  const { data: members } = useQuery({
    queryKey: ["group-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user?.id);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Group Stats */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Your Group</h3>
            <p className="text-muted-foreground">Active Members: {members?.length || 0}</p>
          </div>
          <Button onClick={() => setShowInvite(!showInvite)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
        <Progress value={65} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground">Group Progress: 65%</p>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.map((member) => (
          <Card key={member.id} className="p-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.profile_image_url} />
                <AvatarFallback className="bg-primary/10">
                  {member.name?.[0]?.toUpperCase() || member.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{member.name || 'Anonymous'}</h4>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <Progress value={45} className="mt-4 h-1" />
            <div className="mt-2 text-sm text-muted-foreground">
              Progress: 45%
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}