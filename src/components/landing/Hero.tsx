import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#1A1A1A] overflow-hidden">
      <div className="relative container mx-auto px-6 text-center">
        <p className="text-white text-xl mb-6">
          This Is The Sub Headline Above The Main Headline
        </p>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-text bg-clip-text text-transparent">
          Faith Isn't Just A Belief—It's A Bold Lifestyle. Take The First Step Into The Kingdom Today.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Deepen your walk in faith. Track your spiritual journey with our comprehensive Faith Tracker. Join a community of believers dedicated to growing closer to God.
        </p>

        <div className="max-w-xl mx-auto space-y-6">
          <input
            type="email"
            placeholder="Enter Your Best Email"
            className="w-full px-6 py-4 rounded-full bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-6 rounded-full"
            onClick={() => navigate("/signup")}
          >
            Tell Me More
          </Button>
          
          <p className="text-sm text-gray-400">
            We respect your privacy. Your email address will never be shared or sold
          </p>
        </div>
      </div>
    </div>
  );
};