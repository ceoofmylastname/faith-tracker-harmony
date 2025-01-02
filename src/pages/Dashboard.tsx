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
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        onNavigate={handleNavigation}
        onSignOut={handleSignOut}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow bg-[#141419] border-r border-[#2A2A3C] shadow-xl">
            <DashboardNavigation onNavigate={handleNavigation} onSignOut={handleSignOut} />
          </div>
        </div>

        {/* Main Content */}
        <div className="md:pl-64 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-[#141419] border-b border-[#2A2A3C] shadow-lg">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-semibold text-white">
                    FTTH Members Dashboard
                  </h1>
                  <div className="flex items-center gap-4">
                    {/* Add any header actions here */}
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8 bg-[#0A0A0F] min-h-screen">
              <div className="bg-[#141419] rounded-lg shadow-xl border border-[#2A2A3C] p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}