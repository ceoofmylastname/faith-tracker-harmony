import { PrayerCard } from "./cards/PrayerCard";
import { BibleCard } from "./cards/BibleCard";
import { FastingCard } from "./cards/FastingCard";
import { GivingCard } from "./cards/GivingCard";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHome() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user profile to get the name
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user?.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const triggerConfetti = () => {
    // Left side confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.2, y: 0.8 }
    });
    
    // Right side confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.8, y: 0.8 }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://hook.us2.make.com/464oikand23p9c674cczdp0j18vuylhj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        triggerConfetti();
        toast({
          title: "Success!",
          description: "Guest invitation has been sent successfully.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          notes: ""
        });
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send invitation. Please try again.",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent mb-6 md:mt-0 mt-12 text-center md:text-left">
        Welcome to Your Faith Journey{profile?.name ? `, ${profile.name}` : ''}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 [perspective:1000px]">
        <div className="transform-gpu transition-all duration-300 hover:translate-z-4 hover:-translate-y-2 hover:shadow-xl">
          <PrayerCard />
        </div>
        <div className="transform-gpu transition-all duration-300 hover:translate-z-4 hover:-translate-y-2 hover:shadow-xl">
          <BibleCard />
        </div>
        <div className="transform-gpu transition-all duration-300 hover:translate-z-4 hover:-translate-y-2 hover:shadow-xl">
          <FastingCard />
        </div>
        <div className="transform-gpu transition-all duration-300 hover:translate-z-4 hover:-translate-y-2 hover:shadow-xl">
          <GivingCard />
        </div>
      </div>

      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">INVITE A GUEST</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="bg-transparent border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="bg-transparent border-gray-300"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="bg-transparent border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="bg-transparent border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="bg-transparent border-gray-300"
              rows={4}
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white"
          >
            Send Invitation
          </Button>
        </form>
      </div>
    </div>
  );
}