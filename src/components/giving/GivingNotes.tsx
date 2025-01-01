import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  scripture_reference: string | null;
  category: "Saturday Gathering" | "Wednesday Night Roundtable" | "Other";
  created_at: string;
}

export default function GivingNotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scriptureRef, setScriptureRef] = useState("");
  const [category, setCategory] = useState<Note["category"]>("Other");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("giving_notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      setNotes(data);
    };

    fetchNotes();

    // Subscribe to changes
    const channel = supabase
      .channel("giving_notes_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "giving_notes",
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchNotes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const noteData = {
      user_id: user.id,
      title,
      content,
      scripture_reference: scriptureRef || null,
      category,
    };

    const { error } = await supabase.from("giving_notes").insert([noteData]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving note",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Note saved successfully",
      description: "Your note has been saved and added to your collection.",
    });

    // Reset form
    setTitle("");
    setContent("");
    setScriptureRef("");
    setCategory("Other");
    setSelectedNote(null);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setScriptureRef(note.scripture_reference || "");
    setCategory(note.category);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Note Form */}
        <Card className="p-6 transform transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-2xl font-bold mb-4">New Note</h3>
            
            <div className="space-y-2">
              <Select
                value={category}
                onValueChange={(value: Note["category"]) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saturday Gathering">Saturday Gathering</SelectItem>
                  <SelectItem value="Wednesday Night Roundtable">Wednesday Night Roundtable</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Scripture Reference (optional)"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Note content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>

            <Button type="submit" className="w-full">
              Save Note
            </Button>
          </form>
        </Card>

        {/* Selected Note Display */}
        {selectedNote && (
          <Card className="p-6 transform transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedNote.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedNote.created_at), "PPP")}
                </p>
              </div>
              
              <div className="space-y-2">
                <span className="inline-block px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {selectedNote.category}
                </span>
                {selectedNote.scripture_reference && (
                  <p className="text-sm italic">
                    Scripture: {selectedNote.scripture_reference}
                  </p>
                )}
              </div>
              
              <p className="whitespace-pre-wrap">{selectedNote.content}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Previous Notes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="p-4 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm"
              onClick={() => handleNoteClick(note)}
            >
              <div className="space-y-2">
                <h4 className="font-semibold truncate">{note.title}</h4>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{format(new Date(note.created_at), "PP")}</span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                    {note.category}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}