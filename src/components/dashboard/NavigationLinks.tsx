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
    <div className="space-y-2 flex-1 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => onNavigate(link.path)}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3",
              "rounded-xl transition-all duration-300",
              "text-white/90 hover:text-white",
              "relative overflow-hidden group",
              "bg-gradient-to-r from-primary/80 via-secondary/80 to-primary-dark/80",
              "hover:bg-gradient-to-r hover:from-primary hover:via-secondary hover:to-primary-dark",
              "before:absolute before:inset-0",
              "before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent",
              "before:translate-x-[-100%] hover:before:translate-x-[100%]",
              "before:transition-transform before:duration-500",
              "shadow-lg hover:shadow-xl",
              "border border-white/10",
              "backdrop-blur-sm"
            )}
          >
            <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-medium tracking-wide text-shadow-sm">
              {link.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}