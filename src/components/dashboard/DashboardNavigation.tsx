import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import NavigationLinks from "./NavigationLinks";
import NavigationActions from "./NavigationActions";
import { useNavigate } from "react-router-dom";

interface DashboardNavigationProps {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export default function DashboardNavigation({ onNavigate, onSignOut }: DashboardNavigationProps) {
  const { user } = useAuth();
  const [showImageUpload, setShowImageUpload] = useState(false);
  const navigate = useNavigate();

  // Check if user has the specific email address
  const isAdmin = user?.email === 'jrmenterprisegroup@gmail.com';

  const handleSignOut = () => {
    onSignOut();
    navigate("/");
  };

  return (
    <div className="h-full flex flex-col">
      <NavigationLinks isAdmin={isAdmin} onNavigate={onNavigate} />
      <NavigationActions 
        onUpdateProfile={() => setShowImageUpload(true)}
        onSignOut={handleSignOut}
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