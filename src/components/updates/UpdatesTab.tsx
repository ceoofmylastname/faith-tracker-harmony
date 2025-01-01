import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import AccessManagement from "./AccessManagement";
import UpdatesCalendar from "./UpdatesCalendar";
import { Navigate } from "react-router-dom";

export default function UpdatesTab() {
  const { user } = useAuth();

  // Check if user has the specific email
  if (!user || user.email !== 'jrmenterprisegroup@gmail.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Updates</h1>
        <AccessManagement />
      </div>

      <UpdatesCalendar />
    </div>
  );
}