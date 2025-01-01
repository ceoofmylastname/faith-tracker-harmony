import { Button } from "@/components/ui/button";
import { Camera, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NavigationActionsProps {
  onUpdateProfile: () => void;
  onSignOut: () => void;
}

export default function NavigationActions({ onUpdateProfile, onSignOut }: NavigationActionsProps) {
  const { toast } = useToast();
  const { signOut: authSignOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await authSignOut();
      onSignOut();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

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
        onClick={handleSignOut}
      >
        <LogOut className="h-5 w-5" />
        <span>Sign Out</span>
      </Button>
    </div>
  );
}