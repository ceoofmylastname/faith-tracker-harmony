import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, Users, UserPlus } from "lucide-react";
import MessagingSection from "./MessagingSection";
import PartnershipsSection from "./PartnershipsSection";
import { useToast } from "@/components/ui/use-toast";

export default function CommunityTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    share_prayer_data: false,
    share_bible_data: false,
    share_fasting_data: false,
    share_giving_data: false,
  });

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("community_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default profile if it doesn't exist
        const { error: insertError } = await supabase
          .from("community_profiles")
          .insert([{ id: user?.id }]);

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error("Error loading community settings:", error);
      toast({
        variant: "destructive",
        title: "Error loading settings",
        description: error.message,
      });
    }
  };

  const updateSetting = async (key: string, value: boolean) => {
    try {
      const { error } = await supabase
        .from("community_profiles")
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq("id", user?.id);

      if (error) throw error;

      setSettings((prev) => ({ ...prev, [key]: value }));
      toast({
        title: "Settings updated",
        description: "Your community sharing preferences have been updated.",
      });
    } catch (error: any) {
      console.error("Error updating setting:", error);
      toast({
        variant: "destructive",
        title: "Error updating setting",
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Community</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Data Sharing Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="share-prayer">Share Prayer Data</Label>
            <Switch
              id="share-prayer"
              checked={settings.share_prayer_data}
              onCheckedChange={(checked) => updateSetting("share_prayer_data", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="share-bible">Share Bible Reading Data</Label>
            <Switch
              id="share-bible"
              checked={settings.share_bible_data}
              onCheckedChange={(checked) => updateSetting("share_bible_data", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="share-fasting">Share Fasting Data</Label>
            <Switch
              id="share-fasting"
              checked={settings.share_fasting_data}
              onCheckedChange={(checked) => updateSetting("share_fasting_data", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="share-giving">Share Giving Data</Label>
            <Switch
              id="share-giving"
              checked={settings.share_giving_data}
              onCheckedChange={(checked) => updateSetting("share_giving_data", checked)}
            />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Partnerships
          </TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <MessagingSection />
        </TabsContent>
        <TabsContent value="partnerships">
          <PartnershipsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}