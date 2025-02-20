import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BibleSearchForm } from "./BibleSearchForm";
import { BibleSearchResults } from "./BibleSearchResults";
import { useConfetti } from "./useConfetti";

export function BibleStudy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { triggerConfetti } = useConfetti();

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
      console.log("Sending search request for:", searchTerm);
      const response = await fetch("https://hook.us2.make.com/nwtcflihewbzevsqu4paadhqktizcse3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        console.log("Received JSON response:", data);
        // For JSON responses, extract the actual message content
        setResponse(data.response || data.message || JSON.stringify(data));
      } else {
        // Handle text response
        const textData = await response.text();
        console.log("Received text response:", textData);
        setResponse(textData);
      }
      
      setShowResults(true);
      triggerConfetti();
      
      toast({
        title: "Success",
        description: "Search completed successfully",
      });
    } catch (error) {
      console.error("Search error:", error);
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
    <>
      <BibleSearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <BibleSearchResults
        isOpen={showResults}
        onOpenChange={setShowResults}
        response={response}
      />
    </>
  );
}