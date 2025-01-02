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
    { name: "Fasting", path: "/dashboard/fasting", icon: CalendarDays },
    { name: "Giving", path: "/dashboard/giving", icon: PiggyBank },
    { name: "Notes", path: "/dashboard/notes", icon: StickyNote },
    { name: "Community", path: "/dashboard/community", icon: Users },
    { name: "Schedule", path: "/dashboard/schedule", icon: Calendar },
  ];

  if (isAdmin) {
    links.push({ name: "Updates", path: "/dashboard/updates", icon: Bell });
  }

  return (
    <div className="space-y-1 px-3">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => onNavigate(link.path)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors duration-200",
              "text-gray-300 hover:text-white hover:bg-[#2A2A3C]",
              "group relative overflow-hidden",
              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
              "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500"
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