import { Button } from "@/components/ui/button";

export const Ministry = () => {
  return (
    <section className="relative py-24 bg-maroon-gray">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12 space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Seek First The Kingdom Of God And His Righteousness
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            "But seek first his kingdom and his righteousness, and all these things will be given to you as well."
          </p>
          <p className="text-lg md:text-xl text-white/90">- Matthew 6:33</p>
        </div>
        <a 
          href="https://www.ftthlv.com/contact-us" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            className="bg-accent hover:bg-accent-dark text-primary font-semibold"
          >
            Join Our Community
          </Button>
        </a>
      </div>
    </section>
  );
};