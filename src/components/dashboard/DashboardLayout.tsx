import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, Grid, Home, List, MessageCircle, Moon, PieChart, Plus, Search, Settings } from "lucide-react";
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
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-left">
          <span className="app-icon"></span>
          <p className="app-name">Faith Tracker</p>
          <div className="search-wrapper">
            <Input 
              type="text" 
              placeholder="Search" 
              className="search-input"
            />
            <Search className="text-gray-500" />
          </div>
        </div>
        <div className="app-header-right">
          <Button 
            variant="ghost" 
            size="icon"
            className="mode-switch"
            onClick={toggleDarkMode}
          >
            <Moon className={cn("moon", isDark && "fill-current")} />
          </Button>
          <Button size="icon" className="add-btn">
            <Plus className="btn-icon" />
          </Button>
          <Button variant="ghost" size="icon" className="notification-btn">
            <Bell />
          </Button>
          <Button variant="ghost" className="profile-btn">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="ml-2">{user?.user_metadata?.full_name || user?.email}</span>
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="messages-btn"
          onClick={() => setShowMessages(true)}
        >
          <MessageCircle />
        </Button>
      </div>

      <div className="app-content">
        {/* Sidebar */}
        <div className="app-sidebar">
          <a href="/dashboard" className="app-sidebar-link active">
            <Home />
          </a>
          <a href="/dashboard/analytics" className="app-sidebar-link">
            <PieChart />
          </a>
          <a href="/dashboard/schedule" className="app-sidebar-link">
            <Calendar />
          </a>
          <a href="/dashboard/settings" className="app-sidebar-link">
            <Settings />
          </a>
        </div>

        {/* Main Content */}
        <div className={cn(
          "projects-section",
          isGridView ? "jsGridView" : "jsListView"
        )}>
          <div className="projects-section-header">
            <p>Projects</p>
            <p className="time">December, 12</p>
          </div>

          <div className="projects-section-line">
            <div className="projects-status">
              <div className="item-status">
                <span className="status-number">45</span>
                <span className="status-type">In Progress</span>
              </div>
              <div className="item-status">
                <span className="status-number">24</span>
                <span className="status-type">Upcoming</span>
              </div>
              <div className="item-status">
                <span className="status-number">62</span>
                <span className="status-type">Total Projects</span>
              </div>
            </div>
            <div className="view-actions">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn("view-btn list-view", !isGridView && "active")}
                onClick={() => setIsGridView(false)}
              >
                <List />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className={cn("view-btn grid-view", isGridView && "active")}
                onClick={() => setIsGridView(true)}
              >
                <Grid />
              </Button>
            </div>
          </div>

          {children}
        </div>

        {/* Messages Section */}
        <div className={cn("messages-section", showMessages && "show")}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="messages-close"
            onClick={() => setShowMessages(false)}
          >
            <X />
          </Button>
          <div className="projects-section-header">
            <p>Client Messages</p>
          </div>
          {/* Message content will go here */}
        </div>
      </div>
    </div>
  );
}