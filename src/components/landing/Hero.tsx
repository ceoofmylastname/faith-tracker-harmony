import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-secondary overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2Mmgydi0yem0tMjAgMGgydjJoLTJ2LTJ6bTIwLTIwdi0yaDJ2MmgtMnptLTIwIDB2LTJoMnYyaC0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10"></div>
      <div className="relative container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
          Discover the Real You, the Real Purpose, the Real Truth
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fadeIn">
          Deepen your walk in faith. Seek the Kingdom first.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
          <Button
            size="lg"
            className="bg-accent hover:bg-accent-dark text-primary font-semibold"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};