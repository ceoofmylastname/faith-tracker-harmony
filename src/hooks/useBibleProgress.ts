import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { useToast } from "@/components/ui/use-toast";

export interface BookProgress {
  name: string;
  progress: number;
  chapters: number;
  completed: number;
}

export const useBibleProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [booksProgress, setBooksProgress] = useState<BookProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const { data: completedChapters, error } = await supabase
          .from("bible_reading_progress")
          .select("book, chapter")
          .eq("user_id", user.id)
          .eq("completed", true);

        if (error) throw error;

        // Create a map to count completed chapters per book
        const completedByBook = completedChapters?.reduce((acc, { book }) => {
          acc[book] = (acc[book] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Calculate progress for each book
        const progress = BIBLE_BOOKS.map((book) => {
          const completedCount = completedByBook?.[book.name] || 0;
          return {
            name: book.name,
            chapters: book.chapters,
            completed: completedCount,
            progress: Math.round((completedCount / book.chapters) * 100),
          };
        });

        setBooksProgress(progress);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Bible progress:", error);
        toast({
          title: "Error",
          description: "Failed to load Bible reading progress",
          variant: "destructive",
        });
      }
    };

    fetchProgress();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("bible-progress-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bible_reading_progress",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return { booksProgress, isLoading };
};