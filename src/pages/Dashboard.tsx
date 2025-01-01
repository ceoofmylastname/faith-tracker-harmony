import { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, Heart, BookOpen, Timer, Wallet, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import PrayerTab from "@/components/prayer/PrayerTab";
import BibleTab from "@/components/bible/BibleTab";
import FastingTab from "@/components/fasting/FastingTab";
import DashboardHome from "@/components/dashboard/DashboardHome";
import GivingTab from "@/components/giving/GivingTab";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white p-6 shadow-2xl transition-all duration-300 ease-in-out z-50">
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="h-10 w-10 ring-2 ring-white/20">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Faith Tracker</h1>
        </div>
        <nav className="flex flex-col h-[calc(100%-160px)] justify-between">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
              onClick={() => navigate('/dashboard')}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
              onClick={() => navigate('/dashboard/prayer')}
            >
              <Heart className="mr-2 h-5 w-5" />
              Prayer
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
              onClick={() => navigate('/dashboard/bible')}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Bible
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
              onClick={() => navigate('/dashboard/fasting')}
            >
              <Timer className="mr-2 h-5 w-5" />
              Fasting
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
              onClick={() => navigate('/dashboard/giving')}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Tithes & Giving
            </Button>
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1 mt-auto"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </nav>
      </div>

      <div className="ml-64 min-h-screen">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="prayer" element={<PrayerTab />} />
          <Route path="bible" element={<BibleTab />} />
          <Route path="fasting" element={<FastingTab />} />
          <Route path="giving" element={<GivingTab />} />
        </Routes>
      </div>
    </div>
  );
}