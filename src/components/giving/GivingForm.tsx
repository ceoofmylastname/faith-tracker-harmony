import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GivingForm() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" placeholder="0.00" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tithe">Tithe</SelectItem>
            <SelectItem value="offering">Offering</SelectItem>
            <SelectItem value="special">Special Offering</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Save Record</Button>
    </div>
  );
}