import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export function BibleStudy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://hook.us2.make.com/nwtcflihewbzevsqu4paadhqktizcse3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      const data = await response.json();
      setResponse(data.message || "Search completed successfully");
      triggerConfetti();
      toast({
        title: "Success",
        description: "Search completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
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
        <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
          {response ? (
            <div className="p-4 rounded-lg bg-secondary/10">{response}</div>
          ) : (
            "Enter a search term to begin studying"
          )}
        </div>
      </CardContent>
    </Card>
  );
}