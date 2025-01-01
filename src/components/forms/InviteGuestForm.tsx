import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface GuestFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

export function InviteGuestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GuestFormData>();

  const onSubmit = async (data: GuestFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://hook.us2.make.com/464oikand23p9c674cczdp0j18vuylhj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to submit');

      toast({
        title: "Success!",
        description: "Guest invitation has been sent successfully.",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 space-y-8 transform perspective-1000">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent transform translate-z-4">
        INVITE A GUEST
      </h2>
      
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6 transform rotate-x-1 hover:rotate-x-0 transition-transform duration-300"
      >
        <div className="space-y-4 [transform-style:preserve-3d]">
          <div className="transform translate-z-4 hover:translate-z-8 transition-transform duration-300">
            <Input
              placeholder="First Name"
              {...register("firstName", { required: true })}
              className="w-full bg-transparent border-primary/20 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>

          <div className="transform translate-z-4 hover:translate-z-8 transition-transform duration-300">
            <Input
              placeholder="Last Name"
              {...register("lastName", { required: true })}
              className="w-full bg-transparent border-primary/20 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>

          <div className="transform translate-z-4 hover:translate-z-8 transition-transform duration-300">
            <Input
              placeholder="Phone"
              type="tel"
              {...register("phone", { required: true })}
              className="w-full bg-transparent border-primary/20 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>

          <div className="transform translate-z-4 hover:translate-z-8 transition-transform duration-300">
            <Input
              placeholder="Email"
              type="email"
              {...register("email", { required: true })}
              className="w-full bg-transparent border-primary/20 focus:border-primary/50 backdrop-blur-sm"
            />
          </div>

          <div className="transform translate-z-4 hover:translate-z-8 transition-transform duration-300">
            <Textarea
              placeholder="Notes"
              {...register("notes")}
              className="w-full bg-transparent border-primary/20 focus:border-primary/50 backdrop-blur-sm resize-none h-32"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full transform hover:translate-z-4 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white"
        >
          {isSubmitting ? "Sending..." : "Send Invitation"}
        </Button>
      </form>
    </div>
  );
}