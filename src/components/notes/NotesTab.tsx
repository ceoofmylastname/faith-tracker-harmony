import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { PenLine } from "lucide-react";
import { NoteForm } from "./NoteForm";
import { NotesList } from "./NotesList";

type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function NotesTab() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching notes",
        description: error.message,
      });
      return;
    }

    setNotes(data || []);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PenLine className="h-8 w-8" />
          Notes
        </h1>
      </div>

      <NoteForm onNoteSaved={fetchNotes} user={user} />
      
      <NotesList
        notes={notes}
        selectedNote={selectedNote}
        onNoteSelect={setSelectedNote}
      />
    </div>
  );
}