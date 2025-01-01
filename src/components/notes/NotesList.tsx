import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  onNoteSelect: (note: Note | null) => void;
}

export function NotesList({ notes, selectedNote, onNoteSelect }: NotesListProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle>Your Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedNote ? (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => onNoteSelect(null)}
              className="mb-4"
            >
              Back to Notes
            </Button>
            <h3 className="text-2xl font-bold">{selectedNote.title}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(selectedNote.created_at), "MMMM d, yyyy")}
            </p>
            <p className="whitespace-pre-wrap">{selectedNote.content}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={() => onNoteSelect(note)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(note.created_at), "MMMM d, yyyy")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}