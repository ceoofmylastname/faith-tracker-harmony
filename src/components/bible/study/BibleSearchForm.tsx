import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BibleSearchFormProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function BibleSearchForm({ 
  searchTerm, 
  onSearchTermChange, 
  onSearch, 
  isLoading 
}: BibleSearchFormProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bible Study Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border border-transparent bg-gradient-to-r from-primary via-secondary to-white rounded-lg">
          <div className="bg-background p-4 rounded-md">
            <div className="flex gap-2">
              <Input
                placeholder="Enter word, Strong's number, or scripture..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onSearch();
                  }
                }}
              />
              <Button 
                onClick={onSearch} 
                className="relative overflow-hidden"
                disabled={isLoading}
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? "Searching..." : "Search"}
                <span className="absolute h-[2px] w-full top-0 left-[-100%] bg-gradient-to-r from-transparent to-white/50 animate-[span1_2s_linear_infinite]"></span>
                <span className="absolute w-[2px] h-full top-[-100%] right-0 bg-gradient-to-b from-transparent to-white/50 animate-[span2_2s_linear_infinite]"></span>
                <span className="absolute h-[2px] w-full bottom-0 right-[-100%] bg-gradient-to-l from-transparent to-white/50 animate-[span3_2s_linear_infinite]"></span>
                <span className="absolute w-[2px] h-full bottom-[-100%] left-0 bg-gradient-to-t from-transparent to-white/50 animate-[span4_2s_linear_infinite]"></span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}