import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function WelcomeSection() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-white bg-clip-text text-transparent">
        Welcome to Your Faith Journey{profile?.name ? `, ${profile.name}` : ''}
      </h1>
      <p className="text-muted-foreground mt-2">
        Track your spiritual growth and stay connected with your community
      </p>
    </div>
  );
}