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
            className="bg-[#141419] text-white hover:bg-[#2A2A3C] border border-[#2A2A3C]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="w-64 p-0 bg-[#141419] border-r border-[#2A2A3C] text-white"
        >
          <DashboardNavigation onNavigate={onNavigate} onSignOut={onSignOut} />
        </SheetContent>
      </Sheet>
    </div>
  );
}