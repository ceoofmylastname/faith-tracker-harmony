import { useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import MobileMenu from "@/components/dashboard/MobileMenu";
import DashboardHome from "@/components/dashboard/DashboardHome";
import PrayerTab from "@/components/prayer/PrayerTab";
import BibleTab from "@/components/bible/BibleTab";
import FastingTab from "@/components/fasting/FastingTab";
import GivingTab from "@/components/giving/GivingTab";
import NotesTab from "@/components/notes/NotesTab";
import CommunityTab from "@/components/community/CommunityTab";
import ScheduleTab from "@/components/schedule/ScheduleTab";
import UpdatesTab from "@/components/updates/UpdatesTab";

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

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        onNavigate={handleNavigation}
        onSignOut={handleSignOut}
      />

      <div className="hidden md:block md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-gradient-to-b md:from-red-900 md:via-red-800 md:to-red-900 md:text-white md:p-6 md:shadow-2xl md:transition-all md:duration-300 md:ease-in-out md:z-50">
        <DashboardNavigation onNavigate={handleNavigation} onSignOut={handleSignOut} />
      </div>

      <div className="md:ml-64 min-h-screen p-4">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="prayer" element={<PrayerTab />} />
          <Route path="bible" element={<BibleTab />} />
          <Route path="fasting" element={<FastingTab />} />
          <Route path="giving" element={<GivingTab />} />
          <Route path="notes" element={<NotesTab />} />
          <Route path="community" element={<CommunityTab />} />
          <Route path="schedule" element={<ScheduleTab />} />
          <Route path="updates" element={<UpdatesTab />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}