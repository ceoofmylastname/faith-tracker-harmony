import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Copy, Plus, RefreshCcw } from "lucide-react";

interface NoteFormProps {
  onNoteSaved: () => void;
  user: any;
}

export function NoteForm({ onNoteSaved, user }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();

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
    onNoteSaved();
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
  };

  return (
    <Card className="transform transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle>Create Note</CardTitle>
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
  );
}