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
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="preferences">Sharing Preferences</TabsTrigger>
          <TabsTrigger value="messaging">Messages</TabsTrigger>
          <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
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