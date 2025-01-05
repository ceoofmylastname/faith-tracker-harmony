import { PrayerCard } from "./cards/PrayerCard";
import { BibleCard } from "./cards/BibleCard";
import { FastingCard } from "./cards/FastingCard";
import { GivingCard } from "./cards/GivingCard";
import { WelcomeSection } from "./sections/WelcomeSection";
import { InviteSection } from "./sections/InviteSection";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <WelcomeSection />

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

      <InviteSection />
    </div>
  );
}