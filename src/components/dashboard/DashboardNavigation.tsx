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

  // Check if user has the specific email address
  const isAdmin = user?.email === 'jrmenterprisegroup@gmail.com';

  return (
    <div className="h-full flex flex-col">
      <NavigationLinks isAdmin={isAdmin} onNavigate={onNavigate} />
      <NavigationActions 
        onUpdateProfile={() => setShowImageUpload(true)}
        onSignOut={onSignOut}
      />

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