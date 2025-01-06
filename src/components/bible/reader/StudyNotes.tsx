import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { NotesInput } from "./notes/NotesInput";
import { PreviousNotes } from "./notes/PreviousNotes";

interface StudyNotesProps {
  selectedBook: string;
  selectedChapter: string;
}

interface SavedNote {
  study_notes: string;
  created_at: string;
  book: string;
  chapter: number;
}

export function StudyNotes({ selectedBook, selectedChapter }: StudyNotesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

  const handleSaveNotes = async () => {
    if (!user || !selectedBook || !selectedChapter || !notes.trim()) {
      console.log("Missing required data:", { user, selectedBook, selectedChapter, notes });
      return;
    }

    try {
      console.log("Saving notes:", { selectedBook, selectedChapter, notes });
      const { error } = await supabase
        .from('bible_reading_progress')
        .upsert({
          user_id: user.id,
          book: selectedBook,
          chapter: parseInt(selectedChapter),
          study_notes: notes.trim(),
          minutes_spent: 0,
          completed: false,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,book,chapter',
          ignoreDuplicates: false
        });

      if (error) {
        console.error("Error saving notes:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Notes saved successfully",
      });

      setNotes("");
      loadNotes();
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const loadNotes = async () => {
    if (!user) {
      console.log("No user found for loading notes");
      return;
    }

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      console.log("Loading notes for the past 30 days");
      const { data, error } = await supabase
        .from('bible_reading_progress')
        .select('study_notes, created_at, book, chapter')
        .eq('user_id', user.id)
        .not('study_notes', 'is', null)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading notes:", error);
        throw error;
      }

      if (data) {
        console.log("Retrieved notes:", data);
        setSavedNotes(data as SavedNote[]);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => {
    console.log("Effect triggered with:", { selectedBook, selectedChapter });
    loadNotes();
  }, [user, selectedBook, selectedChapter]);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold mb-3">Study Notes</h3>
        <NotesInput
          notes={notes}
          onNotesChange={setNotes}
          onSave={handleSaveNotes}
        />
        <PreviousNotes notes={savedNotes} />
      </CardContent>
    </Card>
  );
}