import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Ministry } from "@/components/landing/Ministry";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-gray-900 dark:to-gray-800">
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-modern-gradient opacity-10" />
        
        {/* Content */}
        <div className="relative z-10">
          <Hero />
          <Features />
          <Ministry />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Index;