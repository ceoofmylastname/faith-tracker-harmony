import { Button } from "@/components/ui/button";
import { BookMarked } from "lucide-react";

interface BibleHeaderProps {
  onSaveProgress: () => void;
}

export function BibleHeader({ onSaveProgress }: BibleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 bg-clip-text text-transparent">
        Bible Reading Journey
      </h1>
      <Button variant="outline" className="gap-2 text-sm" onClick={onSaveProgress}>
        <BookMarked className="h-4 w-4" />
        Save Progress
      </Button>
    </div>
  );
}