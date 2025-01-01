import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, UserMinus, Shield, ShieldCheck } from "lucide-react";

export default function PartnershipsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    if (user) {
      loadUsers();
      loadPartnerships();
      subscribeToPartnerships();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .neq("id", user?.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: error.message,
      });
    }
  };

  const loadPartnerships = async () => {
    try {
      const { data, error } = await supabase
        .from("accountability_partnerships")
        .select(`
          *,
          user1:profiles!accountability_partnerships_user_id_1_fkey(email),
          user2:profiles!accountability_partnerships_user_id_2_fkey(email)
        `)
        .or(`user_id_1.eq.${user?.id},user_id_2.eq.${user?.id}`);

      if (error) throw error;
      setPartnerships(data || []);
    } catch (error: any) {
      console.error("Error loading partnerships:", error);
      toast({
        variant: "destructive",
        title: "Error loading partnerships",
        description: error.message,
      });
    }
  };

  const subscribeToPartnerships = () => {
    const subscription = supabase
      .channel('partnerships_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accountability_partnerships',
        },
        () => {
          loadPartnerships();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const requestPartnership = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.from("accountability_partnerships").insert([
        {
          user_id_1: user?.id,
          user_id_2: selectedUser,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSelectedUser("");
      toast({
        title: "Partnership requested",
        description: "Your partnership request has been sent.",
      });
    } catch (error: any) {
      console.error("Error requesting partnership:", error);
      toast({
        variant: "destructive",
        title: "Error requesting partnership",
        description: error.message,
      });
    }
  };

  const updatePartnershipStatus = async (partnershipId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("accountability_partnerships")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", partnershipId);

      if (error) throw error;

      toast({
        title: "Partnership updated",
        description: `Partnership ${status === "accepted" ? "accepted" : "declined"}.`,
      });
    } catch (error: any) {
      console.error("Error updating partnership:", error);
      toast({
        variant: "destructive",
        title: "Error updating partnership",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Request New Partnership</h3>
          <div className="flex gap-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={requestPartnership}>
              <UserPlus className="h-4 w-4 mr-2" />
              Request
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {partnerships.map((partnership) => {
          const isRequester = partnership.user_id_1 === user?.id;
          const partnerEmail = isRequester
            ? partnership.user2?.email
            : partnership.user1?.email;

          return (
            <Card key={partnership.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{partnerEmail}</div>
                  <div className="text-sm text-gray-500">
                    Status: {partnership.status}
                  </div>
                </div>
                {!isRequester && partnership.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      onClick={() =>
                        updatePartnershipStatus(partnership.id, "accepted")
                      }
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        updatePartnershipStatus(partnership.id, "declined")
                      }
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}