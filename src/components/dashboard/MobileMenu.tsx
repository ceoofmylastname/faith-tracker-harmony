import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import DashboardNavigation from "./DashboardNavigation";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
}

export default function MobileMenu({ isOpen, onOpenChange, onNavigate, onSignOut }: MobileMenuProps) {
  return (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-gradient-to-r from-primary via-secondary to-primary-dark text-white hover:from-primary/90 hover:via-secondary/90 hover:to-primary-dark/90 backdrop-blur-sm shadow-lg rounded-xl w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-64 p-0 bg-gradient-to-b from-primary via-secondary to-primary-dark text-white border-none shadow-2xl"
        >
          <div className="relative h-full overflow-hidden rounded-r-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-black/5">
            <DashboardNavigation onNavigate={onNavigate} onSignOut={onSignOut} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}