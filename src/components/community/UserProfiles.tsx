import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Check } from "lucide-react";

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  profile_image_url: string | null;
}

interface CommunityProfile {
  id: string;
  share_prayer_data: boolean;
  share_bible_data: boolean;
  share_fasting_data: boolean;
  share_giving_data: boolean;
}

export default function UserProfiles() {
  const { user } = useAuth();

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;
      return data as Profile[];
    },
  });

  const { data: communityProfiles, isLoading: preferencesLoading } = useQuery({
    queryKey: ["community_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_profiles")
        .select("*");
      if (error) throw error;
      return data as CommunityProfile[];
    },
  });

  if (profilesLoading || preferencesLoading) {
    return <div className="flex justify-center p-8">Loading profiles...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles?.map((profile) => {
        const preferences = communityProfiles?.find(cp => cp.id === profile.id);
        const isCurrentUser = user?.id === profile.id;

        return (
          <Card key={profile.id} className="p-6 space-y-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                {profile.profile_image_url ? (
                  <AvatarImage src={profile.profile_image_url} alt={profile.name || 'User'} />
                ) : (
                  <AvatarFallback className="bg-primary/5 text-primary font-medium">
                    {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile.name || 'Anonymous'}</h3>
                {isCurrentUser && (
                  <span className="text-sm text-muted-foreground bg-primary/5 px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
            </div>
            
            {preferences && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground">Sharing:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {preferences.share_prayer_data && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Prayer Data</span>
                    </div>
                  )}
                  {preferences.share_bible_data && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Bible Reading</span>
                    </div>
                  )}
                  {preferences.share_fasting_data && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Fasting Data</span>
                    </div>
                  )}
                  {preferences.share_giving_data && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Giving Data</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}