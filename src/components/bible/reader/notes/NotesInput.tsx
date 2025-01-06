import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface NotesInputProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onSave: () => void;
}

export function NotesInput({ notes, onNotesChange, onSave }: NotesInputProps) {
  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Write your thoughts and reflections here..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="min-h-[150px] mb-3 text-sm"
      />
      <Button className="w-full gap-2 text-sm" onClick={onSave}>
        <Save className="h-4 w-4" />
        Save Notes
      </Button>
    </div>
  );
}