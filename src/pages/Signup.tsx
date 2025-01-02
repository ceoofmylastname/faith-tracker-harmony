import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

export default function Signup() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  useEffect(() => {
    if (user && !showImageUpload) {
      navigate("/dashboard");
    }
  }, [user, navigate, showImageUpload]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password, formData.name);
      setShowImageUpload(true);
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error creating account",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="relative w-48 h-48 mb-8 animate-flip">
        <img 
          src="https://storage.googleapis.com/msgsndr/TivPy8SDoCwta90bdzyN/media/672aa6ff53c79865cd710429.png"
          alt="FTTHLV Logo"
          className="w-full h-full object-contain transform-gpu transition-transform duration-1000 backface-visibility-hidden"
        />
      </div>
      <div className="relative w-full max-w-md">
        {/* Neon border effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-75 animate-gradient-xy group-hover:opacity-100 transition duration-1000"></div>
        
        {/* Main form container */}
        <div className="relative w-full max-w-md bg-black p-8 rounded-lg shadow-[0_0_50px_-12px] shadow-primary">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-black text-white border-gray-700 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-black text-white border-gray-700 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="bg-black text-white border-gray-700 focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>

      {user && (
        <ProfileImageUpload
          userId={user.id}
          open={showImageUpload}
          onClose={() => {
            setShowImageUpload(false);
            navigate("/dashboard");
          }}
        />
      )}
    </div>
  );
}