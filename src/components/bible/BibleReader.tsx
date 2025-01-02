import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookChapterSelector } from "./reader/BookChapterSelector";
import { StudyNotes } from "./reader/StudyNotes";
import BibleTimer from "./BibleTimer";

interface BibleReaderProps {
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  onProgressUpdate: (minutes: number) => void;
}

export default function BibleReader({ onBookChange, onChapterChange, onProgressUpdate }: BibleReaderProps) {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");

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

  const handleProgressUpdate = (minutes: number) => {
    console.log("Updating progress with minutes:", minutes);
    onProgressUpdate(minutes);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 mb-4">
            <BookChapterSelector
              selectedBook={selectedBook}
              selectedChapter={selectedChapter}
              onBookChange={setSelectedBook}
              onChapterChange={setSelectedChapter}
            />
            <div className="w-full sm:w-auto">
              <BibleTimer
                selectedBook={selectedBook}
                selectedChapter={selectedChapter}
                onProgressUpdate={handleProgressUpdate}
              />
            </div>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-lg font-semibold mb-3">
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

      <StudyNotes
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
      />
    </div>
  );
}