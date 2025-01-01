import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import BibleTimer from "./BibleTimer";

interface BibleReaderProps {
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  onProgressUpdate: (minutes: number) => void;
}

export default function BibleReader({ onBookChange, onChapterChange, onProgressUpdate }: BibleReaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [notes, setNotes] = useState("");

  const selectedBookData = BIBLE_BOOKS.find(book => book.name === selectedBook);
  const chapters = selectedBookData ? Array.from({ length: selectedBookData.chapters }, (_, i) => i + 1) : [];

  useEffect(() => {
    if (selectedBook) {
      onBookChange(selectedBook);
    }
  }, [selectedBook, onBookChange]);

  useEffect(() => {
    if (selectedChapter) {
      onChapterChange(parseInt(selectedChapter));
    }
  }, [selectedChapter, onChapterChange]);

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

  // Load existing notes when book and chapter are selected
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 min-w-[120px]">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Book" />
                </SelectTrigger>
                <SelectContent>
                  {BIBLE_BOOKS.map((book) => (
                    <SelectItem key={book.name} value={book.name}>
                      {book.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <Select 
                value={selectedChapter} 
                onValueChange={setSelectedChapter}
                disabled={!selectedBook}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()}>
                      Chapter {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-none">
              <BibleTimer
                selectedBook={selectedBook}
                selectedChapter={selectedChapter}
                onProgressUpdate={onProgressUpdate}
              />
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-3">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="text-sm leading-relaxed">
              {selectedBook && selectedChapter
                ? "Bible content would be displayed here..."
                : "Select a book and chapter to begin reading"}
            </p>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
