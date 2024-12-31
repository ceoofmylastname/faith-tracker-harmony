import { PrayerAnalytics } from "@/components/prayer/PrayerAnalytics";

export default function DashboardHome() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent mb-6">
        Welcome to Your Faith Journey
      </h1>

      {/* Prayer Analytics */}
      <div className="grid grid-cols-1 gap-6">
        <PrayerAnalytics />
      </div>
    </div>
  );
}