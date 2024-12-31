import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email",
      });
      return;
    }

    navigate("/signup");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-4">
        {user ? (
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <div className="relative container mx-auto px-6 text-center">
        <p className="text-white text-xl mb-6">
          Discover: The Real You, The Real Purpose, The Real Truth.
        </p>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
          Faith Isn't Just A Belief—It's A Bold Lifestyle. Take The First Step Into The Kingdom Today.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Strengthen your faith and track your spiritual journey with our all-in-one Faith Tracker. Connect with a community of believers committed to growing closer to Yahowah.
        </p>

        <div className="max-w-xl mx-auto space-y-6">
          {user ? (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 rounded-full"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter Your Best Email"
                className="w-full px-6 py-4 rounded-full bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 rounded-full"
                onClick={handleSubmit}
              >
                Tell Me More
              </Button>
            </div>
          )}
          
          <p className="text-sm text-gray-400">
            We respect your privacy. Your email address will never be shared or sold
          </p>
        </div>
      </div>
    </div>
  );
};