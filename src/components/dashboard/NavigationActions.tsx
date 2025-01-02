import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";

interface NavigationActionsProps {
  onUpdateProfile: () => void;
  onSignOut: () => void;
}

export default function NavigationActions({ onUpdateProfile, onSignOut }: NavigationActionsProps) {
  return (
    <div className="p-4 border-t border-[#2A2A3C]">
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-[#2A2A3C]"
          onClick={onUpdateProfile}
        >
          <UserCircle className="h-5 w-5" />
          Profile
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-[#2A2A3C]"
          onClick={onSignOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}