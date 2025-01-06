import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

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

      // Clear the input after successful save
      setNotes("");
      
      // Refresh the saved notes list
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
        <Textarea
          placeholder="Write your thoughts and reflections here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[150px] mb-3 text-sm"
        />
        <Button className="w-full gap-2 text-sm mb-4" onClick={handleSaveNotes}>
          <Save className="h-4 w-4" />
          Save Notes
        </Button>

        {savedNotes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Previous Notes (Last 30 Days)</h4>
            <ScrollArea className="h-[300px] rounded-md border p-2">
              {savedNotes.map((note, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 bg-muted/50 rounded-md last:mb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium">
                      {note.book} {note.chapter}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(note.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.study_notes}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}