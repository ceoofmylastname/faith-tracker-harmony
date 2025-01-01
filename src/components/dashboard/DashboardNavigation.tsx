import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Heart, BookOpen, Timer, Wallet, LogOut, PenLine, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardNavigationProps {
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export default function DashboardNavigation({ onNavigate, onSignOut }: DashboardNavigationProps) {
  const { user } = useAuth();

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Avatar className="h-10 w-10 ring-2 ring-white/20">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Faith Tracker</h1>
      </div>
      <nav className="flex flex-col h-[calc(100%-160px)] justify-between">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard')}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/prayer')}
          >
            <Heart className="mr-2 h-5 w-5" />
            Prayer
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/bible')}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/fasting')}
          >
            <Timer className="mr-2 h-5 w-5" />
            Fasting
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/giving')}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Tithes & Giving
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/notes')}
          >
            <PenLine className="mr-2 h-5 w-5" />
            Notes
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => onNavigate('/dashboard/community')}
          >
            <Users className="mr-2 h-5 w-5" />
            Community
          </Button>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1 mt-auto"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </nav>
    </>
  );
}