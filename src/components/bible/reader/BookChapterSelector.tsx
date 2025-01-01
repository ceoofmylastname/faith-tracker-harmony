import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BIBLE_BOOKS } from "@/lib/bible-data";

interface BookChapterSelectorProps {
  selectedBook: string;
  selectedChapter: string;
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: string) => void;
}

export function BookChapterSelector({
  selectedBook,
  selectedChapter,
  onBookChange,
  onChapterChange,
}: BookChapterSelectorProps) {
  const selectedBookData = BIBLE_BOOKS.find(book => book.name === selectedBook);
  const chapters = selectedBookData ? Array.from({ length: selectedBookData.chapters }, (_, i) => i + 1) : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Select value={selectedBook} onValueChange={onBookChange}>
        <SelectTrigger className="w-full">
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
        onValueChange={onChapterChange}
        disabled={!selectedBook}
      >
        <SelectTrigger className="w-full">
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
  );
}