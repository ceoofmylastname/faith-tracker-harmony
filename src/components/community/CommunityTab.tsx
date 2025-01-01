import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle } from "lucide-react";
import UserProfiles from "./UserProfiles";
import MessagingSection from "./MessagingSection";
import GroupChallengesSection from "./sections/GroupChallengesSection";

export default function CommunityTab() {
  const [activeSection, setActiveSection] = useState<'profiles' | 'messages' | 'challenges'>('profiles');

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
          Community Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Connect, Share, and Grow Together
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 pb-6">
        <Button 
          variant={activeSection === 'profiles' ? 'default' : 'outline'}
          onClick={() => setActiveSection('profiles')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Members
        </Button>
        <Button 
          variant={activeSection === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveSection('messages')}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          Messages
        </Button>
        <Button 
          variant={activeSection === 'challenges' ? 'default' : 'outline'}
          onClick={() => setActiveSection('challenges')}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Challenges
        </Button>
      </div>

      {/* Main Content */}
      <Card className="p-6 bg-white/60 backdrop-blur-sm">
        {activeSection === 'profiles' && <UserProfiles />}
        {activeSection === 'messages' && <MessagingSection />}
        {activeSection === 'challenges' && <GroupChallengesSection />}
      </Card>
    </div>
  );
}