import { Button } from "@/components/ui/button";
import { Camera, LogOut } from "lucide-react";

interface NavigationActionsProps {
  onUpdateProfile: () => void;
  onSignOut: () => void;
}

export default function NavigationActions({ onUpdateProfile, onSignOut }: NavigationActionsProps) {
  return (
    <div className="space-y-2 pt-4 border-t border-white/20">
      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-white/10 text-white/80 hover:text-white justify-start font-normal"
        onClick={onUpdateProfile}
      >
        <Camera className="h-5 w-5" />
        <span>Update Profile Picture</span>
      </Button>
      
      <Button
        variant="ghost"
        className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-white/10 text-white/80 hover:text-white justify-start font-normal"
        onClick={onSignOut}
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
}