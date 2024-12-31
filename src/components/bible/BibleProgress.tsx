import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollText, CheckCircle2 } from "lucide-react";

export default function BibleProgress() {
  const books = [
    { name: "Genesis", progress: 100, chapters: 50, completed: 50 },
    { name: "Exodus", progress: 75, chapters: 40, completed: 30 },
    { name: "Matthew", progress: 45, chapters: 28, completed: 13 },
    // Add more books
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Reading Progress</h2>
      <div className="grid gap-6">
        {books.map((book) => (
          <Card key={book.name} className="transform hover:scale-[1.01] transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5" />
                  {book.name}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {book.completed} of {book.chapters} chapters
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={book.progress} className="h-2 mb-2" />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{book.progress}% Complete</span>
                {book.progress === 100 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}