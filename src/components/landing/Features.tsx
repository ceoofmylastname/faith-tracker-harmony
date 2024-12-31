import { BookOpen, Calendar, PrayingHands, Timer } from "lucide-react";

const features = [
  {
    icon: PrayingHands,
    title: "Prayer Tracking",
    description: "Track your daily prayers and build consistent prayer habits",
  },
  {
    icon: BookOpen,
    title: "Bible Reading",
    description: "Set and achieve your Bible reading goals with progress tracking",
  },
  {
    icon: Timer,
    title: "Fasting Tracker",
    description: "Monitor your fasting journey and spiritual growth",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description: "Organize all your spiritual activities in one place",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-16">
          Features to Enhance Your Spiritual Journey
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};