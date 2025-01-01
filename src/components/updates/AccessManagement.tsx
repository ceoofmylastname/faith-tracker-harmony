import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function AccessManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Fetch all users for the dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      return data;
    },
  });

  const handleGrantAccess = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('update_access')
      .insert({
        user_id: selectedUser,
        granted_by: user?.id,
      });

    if (error) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: "Failed to grant access",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Access granted successfully",
    });
    setSelectedUser("");
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name || user.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button onClick={handleGrantAccess}>
        <UserPlus className="h-4 w-4 mr-2" />
        Grant Access
      </Button>
    </div>
  );
}