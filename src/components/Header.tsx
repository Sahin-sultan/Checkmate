import { LiveClock } from "@/components/ui/LiveClock";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  user?: { name: string; email: string; avatar?: string } | null;
  onLogin?: (user: { name: string; email: string }) => void;
  onLogout?: () => void;
}

const Header = ({ activeTab, onTabChange, user, onLogout }: HeaderProps) => {
  const [showUserIcon, setShowUserIcon] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUserIcon(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="animate-slide-down flex items-center justify-between px-6 py-6 md:px-12">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="logo-float relative flex h-14 w-14 items-center justify-center rounded-xl bg-gold-gradient shadow-lg">
          <img
            src="https://res.cloudinary.com/ddzreu2to/image/upload/v1769528073/vecteezy_classic-chess-horse-vectors-art_67945655-removebg-preview_nc3y9f.png"
            alt="Checkmate Logo"
            className="h-10 w-10 object-contain drop-shadow-md"
          />
          <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
        </div>

        {/* Brand */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
            Checkmate
          </h1>
          <p className="font-body text-sm text-foreground-secondary">
            Master your day, every day
          </p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Live Clock - Hidden on small screens if needed, but keeping consistent */}
        <div className="hidden md:block">
          <LiveClock />
        </div>

        {/* User Profile / Login */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-zinc-950 border-white/10 text-white" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <Link to="/profile">
                <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-red-500 focus:bg-zinc-900 focus:text-red-500 cursor-pointer"
                onClick={onLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="ghost" className="text-foreground hover:bg-white/5 gap-2 transition-all duration-300">
              {showUserIcon ? (
                <img src="https://res.cloudinary.com/ddzreu2to/image/upload/v1769710692/user_xtrwmv.gif" alt="User" className="h-8 w-8 -ml-1" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
