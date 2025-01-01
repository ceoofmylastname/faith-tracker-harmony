import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {profiles?.map((profile) => {
        const preferences = communityProfiles?.find(cp => cp.id === profile.id);
        const isCurrentUser = user?.id === profile.id;

        return (
          <Card key={profile.id} className="p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                {profile.profile_image_url ? (
                  <AvatarImage src={profile.profile_image_url} alt={profile.name || 'User'} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile.name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold">{profile.name || 'Anonymous'}</h3>
                {isCurrentUser && <span className="text-sm text-muted-foreground">(You)</span>}
              </div>
            </div>
            
            {preferences && (
              <div className="text-sm space-y-1">
                <h4 className="font-medium">Sharing Preferences:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {preferences.share_prayer_data && (
                    <li>✓ Prayer Data</li>
                  )}
                  {preferences.share_bible_data && (
                    <li>✓ Bible Reading Data</li>
                  )}
                  {preferences.share_fasting_data && (
                    <li>✓ Fasting Data</li>
                  )}
                  {preferences.share_giving_data && (
                    <li>✓ Giving Data</li>
                  )}
                </ul>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}