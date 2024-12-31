import { PrayerCard } from "./cards/PrayerCard";
import { BibleCard } from "./cards/BibleCard";
import { FastingCard } from "./cards/FastingCard";
import { GivingCard } from "./cards/GivingCard";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent mb-6">
        Welcome to Your Faith Journey
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PrayerCard />
        <BibleCard />
        <FastingCard />
        <GivingCard />
      </div>
    </div>
  );
}