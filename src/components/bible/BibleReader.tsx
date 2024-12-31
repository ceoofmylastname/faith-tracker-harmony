import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen, Clock, Save } from "lucide-react";
import { BIBLE_BOOKS } from "@/lib/bible-data";
import { useBibleReading } from "@/hooks/useBibleReading";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface BibleReaderProps {
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  onProgressUpdate: (minutes: number) => void;
}

export default function BibleReader({ onBookChange, onChapterChange, onProgressUpdate }: BibleReaderProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    readingGoal,
    todayProgress,
    startReadingSession,
    endReadingSession,
  } = useBibleReading();

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [notes, setNotes] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

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

  const handleStartTimer = async () => {
    if (!selectedBook || !selectedChapter) {
      toast({
        title: "Selection Required",
        description: "Please select a book and chapter before starting the timer",
        variant: "destructive",
      });
      return;
    }

    try {
      const session = await startReadingSession(selectedBook, parseInt(selectedChapter));
      if (session) {
        setSessionId(session.id);
        setIsReading(true);
        const interval = setInterval(() => {
          setTimer(prev => {
            const newValue = prev + 1;
            onProgressUpdate(Math.floor(newValue / 60));
            return newValue;
          });
        }, 1000);
        setTimerInterval(interval);
      }
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start reading session",
        variant: "destructive",
      });
    }
  };

  const handleStopTimer = async () => {
    if (sessionId && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
      await endReadingSession(sessionId, timer);
      setIsReading(false);
      setTimer(0);
      setSessionId(null);
    }
  };

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
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="w-[180px]">
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
              <Select 
                value={selectedChapter} 
                onValueChange={setSelectedChapter}
                disabled={!selectedBook}
              >
                <SelectTrigger className="w-[180px]">
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
            <Button
              variant={isReading ? "destructive" : "outline"}
              className="gap-2"
              onClick={isReading ? handleStopTimer : handleStartTimer}
            >
              <Clock className="h-4 w-4" />
              {isReading ? `Stop (${formatTime(timer)})` : "Start Timer"}
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedBook} {selectedChapter}
            </h2>
            <p className="leading-relaxed">
              {selectedBook && selectedChapter
                ? "Bible content would be displayed here..."
                : "Select a book and chapter to begin reading"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Study Notes</h3>
          <Textarea
            placeholder="Write your thoughts and reflections here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px] mb-4"
          />
          <Button className="w-full gap-2" onClick={handleSaveNotes}>
            <Save className="h-4 w-4" />
            Save Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}