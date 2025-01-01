import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface StudyNotesProps {
  selectedBook: string;
  selectedChapter: string;
}

export function StudyNotes({ selectedBook, selectedChapter }: StudyNotesProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [notes, setNotes] = useState("");

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
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadNotes = async () => {
      if (!user || !selectedBook || !selectedChapter) return;

      try {
        const { data, error } = await supabase
          .from('saved_inputs')
          .select('input_value')
          .eq('user_id', user.id)
          .eq('input_type', 'bible_notes')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const savedNote = JSON.parse(data[0].input_value);
          if (savedNote.book === selectedBook && savedNote.chapter === selectedChapter) {
            setNotes(savedNote.notes);
          } else {
            setNotes('');
          }
        }
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    };

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
        <Button className="w-full gap-2 text-sm" onClick={handleSaveNotes}>
          <Save className="h-4 w-4" />
          Save Notes
        </Button>
      </CardContent>
    </Card>
  );
}