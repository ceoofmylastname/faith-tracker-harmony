import { Button } from "@/components/ui/button";

export const Ministry = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-secondary via-primary to-primary-dark text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Walking in Alignment with the Kingdom of God
        </h2>
        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-xl mb-6 italic">
            "But seek first the kingdom of God and his righteousness, and all these
            things will be added to you."
          </p>
          <p className="text-lg text-white/90">- Matthew 6:33</p>
        </div>
        <Button
          size="lg"
          className="bg-accent hover:bg-accent-dark text-primary font-semibold"
        >
          Join Our Community
        </Button>
      </div>
    </section>
  );
};