import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, Grid, Home, List, MessageCircle, Moon, PieChart, Plus, Search, Settings, Calendar, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGridView, setIsGridView] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold bg-gradient-text text-transparent bg-clip-text">
                Faith Tracker
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 w-[300px] bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-primary-light"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Moon className={cn("h-5 w-5", isDark && "fill-current")} />
              </Button>
              <Button 
                size="icon"
                className="rounded-full bg-primary hover:bg-primary-light"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost"
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user?.user_metadata?.full_name || user?.email}</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-20 fixed left-0 h-screen bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-r border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center py-8 space-y-8">
              <Button 
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  "hover:bg-primary/10 hover:text-primary",
                  "dark:hover:bg-primary/20"
                )}
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  "hover:bg-primary/10 hover:text-primary",
                  "dark:hover:bg-primary/20"
                )}
                onClick={() => navigate('/dashboard/analytics')}
              >
                <PieChart className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  "hover:bg-primary/10 hover:text-primary",
                  "dark:hover:bg-primary/20"
                )}
                onClick={() => navigate('/dashboard/schedule')}
              >
                <Calendar className="h-6 w-6" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-12 h-12",
                  "hover:bg-primary/10 hover:text-primary",
                  "dark:hover:bg-primary/20"
                )}
                onClick={() => navigate('/dashboard/settings')}
              >
                <Settings className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400">Track your spiritual journey</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn("rounded-full", !isGridView && "bg-primary/10 text-primary")}
                    onClick={() => setIsGridView(false)}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn("rounded-full", isGridView && "bg-primary/10 text-primary")}
                    onClick={() => setIsGridView(true)}
                  >
                    <Grid className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className={cn(
                "transition-all duration-300",
                isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
              )}>
                {children}
              </div>
            </div>
          </div>

          {/* Messages Panel */}
          <div className={cn(
            "fixed right-0 top-0 h-screen w-80 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-l border-gray-200 dark:border-gray-800",
            "transform transition-transform duration-300",
            showMessages ? "translate-x-0" : "translate-x-full"
          )}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowMessages(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {/* Message content will go here */}
            </div>
          </div>

          {/* Messages Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "fixed right-6 top-1/2 -translate-y-1/2 rounded-full",
              "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg",
              "border border-gray-200 dark:border-gray-800",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              showMessages && "hidden"
            )}
            onClick={() => setShowMessages(true)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}