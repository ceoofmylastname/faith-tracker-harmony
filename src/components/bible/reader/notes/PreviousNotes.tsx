import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface SavedNote {
  study_notes: string;
  created_at: string;
  book: string;
  chapter: number;
}

interface PreviousNotesProps {
  notes: SavedNote[];
}

export function PreviousNotes({ notes }: PreviousNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-2">Previous Notes (Last 30 Days)</h4>
      <ScrollArea className="h-[300px] rounded-md border p-2">
        {notes.map((note, index) => (
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
  );
}