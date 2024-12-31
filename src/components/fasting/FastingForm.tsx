import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface FastingFormProps {
  onSuccess: () => void;
}

interface FormData {
  startDate: Date;
  durationDays: number;
  fastType: string;
  notes: string;
}

const FAST_TYPES = [
  { value: "FULL_FAST", label: "Full Fast" },
  { value: "PARTIAL_FAST", label: "Partial Fast" },
  { value: "DANIEL_FAST", label: "Daniel Fast" },
];

export function FastingForm({ onSuccess }: FastingFormProps) {
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormData>({
    defaultValues: {
      durationDays: 1,
      fastType: "FULL_FAST",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a fasting session",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("fasting_sessions").insert({
        user_id: user.id,
        start_date: format(data.startDate, "yyyy-MM-dd"),
        duration_days: data.durationDays,
        fast_type: data.fastType,
        notes: data.notes,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your fasting session has been created",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create fasting session",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 transform transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fastType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of Fast</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type of fast" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FAST_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your fasting intentions or notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Fasting Journey
        </Button>
      </form>
    </Form>
  );
}