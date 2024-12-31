import { useState } from "react";
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

export default function BibleReader() {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [notes, setNotes] = useState("");

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
                  <SelectItem value="genesis">Genesis</SelectItem>
                  <SelectItem value="exodus">Exodus</SelectItem>
                  <SelectItem value="matthew">Matthew</SelectItem>
                  {/* Add more books */}
                </SelectContent>
              </Select>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Chapter 1</SelectItem>
                  <SelectItem value="2">Chapter 2</SelectItem>
                  <SelectItem value="3">Chapter 3</SelectItem>
                  {/* Add more chapters */}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              Start Timer
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Matthew 5</h2>
            <p className="leading-relaxed">
              Now when Jesus saw the crowds, he went up on a mountainside and sat down. 
              His disciples came to him, and he began to teach them. He said: "Blessed 
              are the poor in spirit, for theirs is the kingdom of heaven..."
            </p>
            {/* Add more verses */}
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
          <Button className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}