import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Ministry } from "@/components/landing/Ministry";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Ministry />
      <Footer />
    </div>
  );
};

export default Index;