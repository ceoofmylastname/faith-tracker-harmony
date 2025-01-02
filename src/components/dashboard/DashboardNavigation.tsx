import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import NavigationLinks from "./NavigationLinks";
import NavigationActions from "./NavigationActions";

interface DashboardNavigationProps {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export default function DashboardNavigation({ onNavigate, onSignOut }: DashboardNavigationProps) {
  const { user } = useAuth();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const isAdmin = user?.email === 'jrmenterprisegroup@gmail.com';

  return (
    <div className="h-full flex flex-col bg-[#141419]">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
          FTTH Members
        </h2>
      </div>

      <NavigationLinks isAdmin={isAdmin} onNavigate={onNavigate} />
      
      <div className="mt-auto">
        <NavigationActions 
          onUpdateProfile={() => setShowImageUpload(true)}
          onSignOut={onSignOut}
        />
      </div>

      {user && (
        <ProfileImageUpload
          userId={user.id}
          open={showImageUpload}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
}