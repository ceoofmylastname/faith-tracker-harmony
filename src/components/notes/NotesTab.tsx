import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Copy, PenLine, Plus, RefreshCcw, SpellCheck } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function NotesTab() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [spellCheck, setSpellCheck] = useState(true);
  const [minWordLength, setMinWordLength] = useState([4]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !content || !category) return;

    const { error } = await supabase.from("notes").insert([
      {
        user_id: user.id,
        title,
        content,
        tags: [category],
      },
    ]);

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

    setTitle("");
    setContent("");
    setCategory("");
    fetchNotes();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The note content has been copied to your clipboard.",
    });
  };

  const handleClear = () => {
    setContent("");
    setTitle("");
    setCategory("");
    setSelectedNote(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <PenLine className="h-8 w-8" />
          Notes
        </h1>
      </div>

      <Card className="transform transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Create Note</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <SpellCheck className="h-4 w-4" />
              <span className="text-sm">Spell Check</span>
              <Switch
                checked={spellCheck}
                onCheckedChange={setSpellCheck}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Min Length: {minWordLength}</span>
              <Slider
                value={minWordLength}
                onValueChange={setMinWordLength}
                max={10}
                min={1}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 focus:ring-2 focus:ring-primary/50"
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-2 focus:ring-2 focus:ring-primary/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saturday Gathering">Saturday Gathering</SelectItem>
                  <SelectItem value="Wednesday Night Roundtable">
                    Wednesday Night Roundtable
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] border-2 focus:ring-2 focus:ring-primary/50"
                spellCheck={spellCheck}
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Save Note
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle>Your Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedNote ? (
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setSelectedNote(null)}
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
                  onClick={() => setSelectedNote(note)}
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
    </div>
  );
}