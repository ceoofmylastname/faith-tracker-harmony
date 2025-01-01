import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Home, Heart, BookOpen, Timer, Wallet, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import PrayerTab from "@/components/prayer/PrayerTab";
import BibleTab from "@/components/bible/BibleTab";
import FastingTab from "@/components/fasting/FastingTab";
import DashboardHome from "@/components/dashboard/DashboardHome";
import GivingTab from "@/components/giving/GivingTab";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
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
            onClick={() => {
              navigate('/dashboard');
              setIsMobileMenuOpen(false);
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => {
              navigate('/dashboard/prayer');
              setIsMobileMenuOpen(false);
            }}
          >
            <Heart className="mr-2 h-5 w-5" />
            Prayer
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => {
              navigate('/dashboard/bible');
              setIsMobileMenuOpen(false);
            }}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Bible
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => {
              navigate('/dashboard/fasting');
              setIsMobileMenuOpen(false);
            }}
          >
            <Timer className="mr-2 h-5 w-5" />
            Fasting
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:bg-white/10 transition-all duration-300 transform hover:translate-x-1"
            onClick={() => {
              navigate('/dashboard/giving');
              setIsMobileMenuOpen(false);
            }}
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
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-red-900/90 text-white hover:bg-red-800">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-gradient-to-b md:from-red-900 md:via-red-800 md:to-red-900 md:text-white md:p-6 md:shadow-2xl md:transition-all md:duration-300 md:ease-in-out md:z-50">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen p-4">
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