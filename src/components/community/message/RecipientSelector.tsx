import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, User } from "lucide-react";

interface RecipientSelectorProps {
  recipient: string;
  setRecipient: (value: string) => void;
  users: Array<{ id: string; name: string; email: string }>;
}

export function RecipientSelector({ recipient, setRecipient, users }: RecipientSelectorProps) {
  return (
    <Select value={recipient} onValueChange={setRecipient}>
      <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm">
        <SelectValue placeholder="Select audience" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="community">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Everyone</span>
          </div>
        </SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span>{user.name || user.email}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}