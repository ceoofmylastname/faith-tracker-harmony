import { useReadingProgress } from "./bible/useReadingProgress";
import { useReadingStreak } from "./bible/useReadingStreak";
import { useReadingSessions } from "./bible/useReadingSessions";

export const useBibleReading = () => {
  const { todayProgress, updateTodayProgress } = useReadingProgress();
  const { streak, bestStreak } = useReadingStreak();
  const { startReadingSession, endReadingSession } = useReadingSessions();

  return {
    todayProgress,
    streak,
    bestStreak,
    updateTodayProgress,
    startReadingSession,
    endReadingSession,
  };
};