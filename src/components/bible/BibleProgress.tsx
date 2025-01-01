import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollText, CheckCircle2 } from "lucide-react";
import { useBibleProgress } from "@/hooks/useBibleProgress";
import { Skeleton } from "@/components/ui/skeleton";

export default function BibleProgress() {
  const { booksProgress, isLoading } = useBibleProgress();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Reading Progress</h2>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Filter out books with 0% progress and sort by progress descending
  const booksWithProgress = booksProgress
    .filter((book) => book.progress > 0)
    .sort((a, b) => b.progress - a.progress);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Reading Progress</h2>
      <div className="grid gap-6">
        {booksWithProgress.length > 0 ? (
          booksWithProgress.map((book) => (
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
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <ScrollText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start reading to track your progress!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}