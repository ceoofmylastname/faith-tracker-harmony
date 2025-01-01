import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BibleReader from "../BibleReader";
import BibleProgress from "../BibleProgress";
import BibleAnalytics from "../BibleAnalytics";

interface BibleTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  currentBook: string;
  currentChapter: number;
  onBookChange: (book: string) => void;
  onChapterChange: (chapter: number) => void;
  onProgressUpdate: (minutes: number) => void;
}

export function BibleTabs({
  activeTab,
  onTabChange,
  currentBook,
  currentChapter,
  onBookChange,
  onChapterChange,
  onProgressUpdate,
}: BibleTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="read">Read</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="read" className="mt-4">
        <BibleReader 
          onBookChange={onBookChange}
          onChapterChange={onChapterChange}
          onProgressUpdate={onProgressUpdate}
        />
      </TabsContent>
      <TabsContent value="progress" className="mt-4">
        <BibleProgress />
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <BibleAnalytics />
      </TabsContent>
    </Tabs>
  );
}