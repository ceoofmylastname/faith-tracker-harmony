import { useState } from "react";
import { FastingForm } from "./FastingForm";
import { FastingDashboard } from "./FastingDashboard";
import { Card } from "@/components/ui/card";

export default function FastingTab() {
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <Card className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <FastingForm onSuccess={() => setShowForm(false)} />
        </Card>
        <FastingDashboard />
      </div>
    </div>
  );
}