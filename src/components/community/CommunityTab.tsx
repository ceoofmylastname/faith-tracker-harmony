import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataSharingPreferences from "./DataSharingPreferences";
import UserProfiles from "./UserProfiles";
import MessagingSection from "./MessagingSection";
import PartnershipsSection from "./PartnershipsSection";

export default function CommunityTab() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Community</h2>
      
      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="w-full justify-start bg-white/50 backdrop-blur-sm border">
          <TabsTrigger value="profiles" className="data-[state=active]:bg-primary/10">Profiles</TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary/10">Sharing Preferences</TabsTrigger>
          <TabsTrigger value="messaging" className="data-[state=active]:bg-primary/10">Messages</TabsTrigger>
          <TabsTrigger value="partnerships" className="data-[state=active]:bg-primary/10">Partnerships</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profiles" className="mt-6">
          <UserProfiles />
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <DataSharingPreferences />
        </TabsContent>
        
        <TabsContent value="messaging" className="mt-6">
          <MessagingSection />
        </TabsContent>
        
        <TabsContent value="partnerships" className="mt-6">
          <PartnershipsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}