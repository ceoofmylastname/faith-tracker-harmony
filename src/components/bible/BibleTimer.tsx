import { useState } from "react";
import { TimerDisplay } from "./timer/TimerDisplay";
import { TimerLogic } from "./timer/TimerLogic";

interface BibleTimerProps {
  selectedBook: string;
  selectedChapter: string;
  onProgressUpdate: (minutes: number) => void;
}

export default function BibleTimer({ selectedBook, selectedChapter, onProgressUpdate }: BibleTimerProps) {
  const [isReading, setIsReading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [lastSessionMinutes, setLastSessionMinutes] = useState<number | null>(null);

  const { handleStartTimer, handleStopTimer } = TimerLogic({
    selectedBook,
    selectedChapter,
    onProgressUpdate,
    onTimerChange: setTimer,
    onIsReadingChange: setIsReading,
    onLastSessionMinutesChange: setLastSessionMinutes,
  });

  return (
    <div className="space-y-4">
      <TimerDisplay
        isReading={isReading}
        timer={timer}
        onStart={handleStartTimer}
        onStop={handleStopTimer}
      />
      {lastSessionMinutes !== null && (
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Last session: {lastSessionMinutes}/30 minutes
        </div>
      )}
    </div>
  );
}