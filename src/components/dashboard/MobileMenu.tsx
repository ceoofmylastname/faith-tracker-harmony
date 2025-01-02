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
          <Button variant="ghost" size="icon" className="bg-red-900 text-white hover:bg-red-800">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white border-none">
          <DashboardNavigation onNavigate={onNavigate} onSignOut={onSignOut} />
        </SheetContent>
      </Sheet>
    </div>
  );
}