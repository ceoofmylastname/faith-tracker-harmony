import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BibleSearchResultsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  response: string | null;
}

export function BibleSearchResults({ 
  isOpen, 
  onOpenChange, 
  response 
}: BibleSearchResultsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Results</DialogTitle>
          <DialogDescription>
            Here's what we found based on your search:
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {response ? (
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{response}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No results found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}