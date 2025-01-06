import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function BibleStudy() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    // TODO: Implement Bible search functionality
    console.log("Searching for:", searchTerm);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bible Study Search</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter word, Strong's number, or scripture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch} className="relative overflow-hidden">
            <Search className="h-4 w-4 mr-2" />
            Search
            <span className="absolute h-[2px] w-full top-0 left-[-100%] bg-gradient-to-r from-transparent to-white/50 animate-[span1_2s_linear_infinite]"></span>
            <span className="absolute w-[2px] h-full top-[-100%] right-0 bg-gradient-to-b from-transparent to-white/50 animate-[span2_2s_linear_infinite]"></span>
            <span className="absolute h-[2px] w-full bottom-0 right-[-100%] bg-gradient-to-l from-transparent to-white/50 animate-[span3_2s_linear_infinite]"></span>
            <span className="absolute w-[2px] h-full bottom-[-100%] left-0 bg-gradient-to-t from-transparent to-white/50 animate-[span4_2s_linear_infinite]"></span>
          </Button>
        </div>
        <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
          Enter a search term to begin studying
        </div>
      </CardContent>
    </Card>
  );
}