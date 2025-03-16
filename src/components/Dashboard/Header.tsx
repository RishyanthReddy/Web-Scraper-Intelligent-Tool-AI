import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Settings, User, Bell, HelpCircle } from "lucide-react";

interface HeaderProps {
  title?: string;
  userName?: string;
  avatarUrl?: string;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  onHelpClick?: () => void;
}

const Header = ({
  title = "AI Web Scraper",
  userName = "Gayathri",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=Gayathri&hair=long&hairColor=black&accessories=none&eyes=wink&mouth=smile",
  onSettingsClick = () => {},
  onProfileClick = () => {},
  onNotificationsClick = () => {},
  onHelpClick = () => {},
}: HeaderProps) => {
  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground mr-3">
          <span className="font-bold text-lg">WS</span>
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHelpClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <HelpCircle size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNotificationsClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Bell size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings size={20} />
        </Button>

        <Button
          variant="ghost"
          className="flex items-center p-0 h-auto hover:bg-transparent"
          onClick={onProfileClick}
        >
          <div className="mr-3 text-sm hidden md:block">
            <p className="font-medium">{userName}</p>
          </div>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={avatarUrl} alt={`${userName}'s avatar`} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};

export default Header;
