import { Link } from "react-router-dom";
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
  Bell,
  Search,
  LucideIcon
} from "lucide-react";

interface NavigationLink {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavigationLinksProps {
  isAdmin: boolean;
  onNavigate: (path: string) => void;
}

export default function NavigationLinks({ isAdmin, onNavigate }: NavigationLinksProps) {
  const links: NavigationLink[] = [
    { name: "Home", path: "/dashboard", icon: Home },
    { name: "Prayer", path: "/dashboard/prayer", icon: Timer },
    { name: "Bible", path: "/dashboard/bible", icon: BookOpen },
    { name: "Bible Study", path: "/dashboard/bible?tab=study", icon: Search },
    { name: "Fasting", path: "/dashboard/fasting", icon: CalendarDays },
    { name: "Giving", path: "/dashboard/giving", icon: PiggyBank },
    { name: "Notes", path: "/dashboard/notes", icon: StickyNote },
    { name: "Community", path: "/dashboard/community", icon: Users },
    { name: "Schedule", path: "/dashboard/schedule", icon: Calendar },
  ];

  // Add Updates link only if user is admin
  if (isAdmin) {
    links.push({ name: "Updates", path: "/dashboard/updates", icon: Bell });
  }

  return (
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
  );
}