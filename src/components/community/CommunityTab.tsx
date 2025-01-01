import { MessageSquare, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessagingSection from "./MessagingSection";
import PartnershipsSection from "./PartnershipsSection";
import DataSharingPreferences from "./DataSharingPreferences";

export default function CommunityTab() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      
      <DataSharingPreferences />

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