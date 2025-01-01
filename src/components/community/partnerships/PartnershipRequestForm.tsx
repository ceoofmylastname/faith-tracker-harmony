import { useState } from "react";
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
import { UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PartnershipRequestFormProps {
  users: Array<{ id: string; email: string }>;
  onRequestSent: () => void;
  currentUserId: string;
}

export default function PartnershipRequestForm({ 
  users, 
  onRequestSent,
  currentUserId 
}: PartnershipRequestFormProps) {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>("");

  const requestPartnership = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.from("accountability_partnerships").insert([
        {
          user_id_1: currentUserId,
          user_id_2: selectedUser,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setSelectedUser("");
      onRequestSent();
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

  return (
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
  );
}