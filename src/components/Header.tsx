import { LiveClock } from "@/components/ui/LiveClock";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
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

      {/* Live Clock */}
      <div className="hidden md:block">
        <LiveClock />
      </div>

      {/* Date Display (Hidden on md if Navigation pushes it, or kept? Let's hide it for now to avoid clutter, or maybe show on XL?) 
          The user asked to add the section (Nav), presumably effectively replacing the simple date or being the main focus.
      */}
      {/* <div className="hidden rounded-full bg-background-secondary px-5 py-2.5 md:block">
        <span className="font-mono text-sm text-foreground-secondary">
          {format(today, "EEEE, MMMM d, yyyy")}
        </span>
      </div> */}
    </header>
  );
};

export default Header;
