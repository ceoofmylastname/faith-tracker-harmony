import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Timer, 
  CalendarDays, 
  PiggyBank, 
  StickyNote, 
  Users, 
  Calendar,
  Camera,
  LogOut,
  Bell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface DashboardNavigationProps {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export default function DashboardNavigation({ onNavigate, onSignOut }: DashboardNavigationProps) {
  const { user } = useAuth();
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Check if user has update access
  const { data: hasUpdateAccess } = useQuery({
    queryKey: ['update-access', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .from('update_access')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking update access:', error);
        return false;
      }
      return !!data;
    },
  });

  const links = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Prayer", path: "/dashboard/prayer", icon: Timer },
    { name: "Bible", path: "/dashboard/bible", icon: BookOpen },
    { name: "Fasting", path: "/dashboard/fasting", icon: CalendarDays },
    { name: "Giving", path: "/dashboard/giving", icon: PiggyBank },
    { name: "Notes", path: "/dashboard/notes", icon: StickyNote },
    { name: "Community", path: "/dashboard/community", icon: Users },
    { name: "Schedule", path: "/dashboard/schedule", icon: Calendar },
  ];

  // Add Updates link only if user has access
  if (hasUpdateAccess) {
    links.push({ name: "Updates", path: "/dashboard/updates", icon: Bell });
  }

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => onNavigate(link.path)}
              className={cn(
                "flex items-center space-x-2 w-full px-4 py-2",
                "hover:bg-white/10 rounded-lg transition-colors duration-200",
                "text-white/80 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="space-y-2 pt-4 border-t border-white/20">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-white/10 text-white/80 hover:text-white justify-start font-normal"
          onClick={() => setShowImageUpload(true)}
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