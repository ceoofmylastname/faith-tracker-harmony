import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Trophy, Clock, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function GroupChallengesSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    category: "",
    description: "",
    endDate: ""
  });

  const createChallenge = async () => {
    try {
      const { error } = await supabase.from("community_challenges").insert({
        creator_id: user?.id,
        name: newChallenge.name,
        category: newChallenge.category,
        description: newChallenge.description,
        end_date: new Date(newChallenge.endDate).toISOString()
      });

      if (error) throw error;

      toast({
        title: "Challenge created!",
        description: "Your challenge has been created successfully."
      });
      setIsCreating(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating challenge",
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Community Challenges</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
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
              <Button onClick={createChallenge} className="w-full">
                Create Challenge
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Challenge cards will be mapped here */}
      </div>
    </div>
  );
}