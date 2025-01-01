import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Plus } from "lucide-react";

interface EventFormData {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  repeat: string;
  invitees: string;
}

export default function EventForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<EventFormData>();

  const onSubmit = async (data: EventFormData) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert({
          title: data.title,
          description: `Location: ${data.location}\nInvitees: ${data.invitees}`,
          start_time: new Date(data.startTime).toISOString(),
          end_time: new Date(data.endTime).toISOString(),
          event_type: data.repeat === 'none' ? 'event' : `repeat_${data.repeat}`,
        });

      if (error) throw error;

      toast({
        title: "Event created",
        description: "Your event has been scheduled successfully",
      });
      
      setOpen(false);
      reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error creating event",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title", { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location", { required: true })} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input 
              id="startTime" 
              type="datetime-local" 
              {...register("startTime", { required: true })} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input 
              id="endTime" 
              type="datetime-local" 
              {...register("endTime", { required: true })} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repeat">Repeat</Label>
            <Select onValueChange={(value) => register("repeat").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invitees">Invitees (comma-separated emails)</Label>
            <Input id="invitees" {...register("invitees")} />
          </div>
          
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}