import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudyNotesProps {
  selectedBook: string;
  selectedChapter: string;
}

interface SavedNote {
  notes: string;
  timestamp: string;
}

export function StudyNotes({ selectedBook, selectedChapter }: StudyNotesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);

  const handleSaveNotes = async () => {
    if (!user || !selectedBook || !selectedChapter || !notes.trim()) return;

    try {
      const { error } = await supabase
        .from('saved_inputs')
        .insert({
          user_id: user.id,
          input_type: 'bible_notes',
          input_value: JSON.stringify({
            book: selectedBook,
            chapter: selectedChapter,
            notes: notes.trim(),
            timestamp: new Date().toISOString(),
          }),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notes saved successfully",
      });

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
    if (!user || !selectedBook || !selectedChapter) return;

    try {
      const { data, error } = await supabase
        .from('saved_inputs')
        .select('input_value')
        .eq('user_id', user.id)
        .eq('input_type', 'bible_notes')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const filteredNotes = data
          .map(item => {
            const parsed = JSON.parse(item.input_value);
            return parsed.book === selectedBook && parsed.chapter === selectedChapter
              ? { notes: parsed.notes, timestamp: parsed.timestamp }
              : null;
          })
          .filter((note): note is SavedNote => note !== null);

        setSavedNotes(filteredNotes);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => {
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
            <h4 className="text-sm font-semibold mb-2">Previous Notes</h4>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {savedNotes.map((note, index) => (
                <div
                  key={index}
                  className="mb-4 p-3 bg-muted/50 rounded-md last:mb-0"
                >
                  <p className="text-sm whitespace-pre-wrap">{note.notes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.timestamp).toLocaleDateString()} {new Date(note.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}