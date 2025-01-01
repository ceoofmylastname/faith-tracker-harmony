import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function PrayerRequestsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: prayerRequests } = useQuery({
    queryKey: ["prayer-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prayer_reflections")
        .select(`
          *,
          profiles:profiles(name, email, profile_image_url)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        description: "Both title and description are required.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("prayer_reflections")
        .insert([{ user_id: user?.id, content: `${title}\n\n${description}` }]);

      if (error) throw error;

      toast({
        title: "Prayer Request Submitted",
        description: "Your prayer request has been shared with the community.",
      });
      setTitle("");
      setDescription("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error submitting prayer request",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/60 backdrop-blur-sm animate-fade-in">
        <h3 className="text-xl font-semibold mb-4">Share Prayer Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Prayer Request Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your prayer request..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" className="w-full">
            <Heart className="mr-2 h-4 w-4" />
            Share Prayer Request
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {prayerRequests?.map((request) => (
          <Card key={request.id} className="p-4 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={request.profiles?.profile_image_url} />
                <AvatarFallback>
                  {request.profiles?.name?.[0]?.toUpperCase() || request.profiles?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold">{request.profiles?.name || 'Anonymous'}</h4>
                <p className="text-sm text-muted-foreground mt-1">{request.content}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Prayed
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}