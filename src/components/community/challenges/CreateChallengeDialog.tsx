import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateChallengeDialogProps {
  onCreateChallenge: (challenge: any) => Promise<void>;
}

export function CreateChallengeDialog({ onCreateChallenge }: CreateChallengeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    category: "",
    description: "",
    endDate: ""
  });

  const handleCreate = async () => {
    await onCreateChallenge(newChallenge);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Challenge
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Challenge Name</Label>
            <Input
              id="name"
              value={newChallenge.name}
              onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
              placeholder="Enter challenge name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newChallenge.category}
              onValueChange={(value) => setNewChallenge({ ...newChallenge, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prayer">Prayer</SelectItem>
                <SelectItem value="bible">Bible Reading</SelectItem>
                <SelectItem value="fasting">Fasting</SelectItem>
                <SelectItem value="giving">Giving</SelectItem>
                <SelectItem value="workout">Workout</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              placeholder="Enter challenge description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={newChallenge.endDate}
              onChange={(e) => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create Challenge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}