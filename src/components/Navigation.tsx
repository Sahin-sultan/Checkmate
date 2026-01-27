import { LayoutDashboard, Target, CheckSquare, Goal, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "habits", label: "Habits", icon: Target },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "goals", label: "Goals", icon: Goal },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "stats", label: "Stats", icon: BarChart3 },
];

const Navigation = ({ activeTab, onTabChange, className }: NavigationProps) => {
  return (
    <nav className={cn("overflow-x-auto", className)}>
      <div className="flex min-w-max gap-2 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-2 shadow-lg">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={isActive ? "default" : "ghost"}
              size="default"
              className={`flex items-center gap-2 ${!isActive ? 'text-foreground-secondary hover:text-foreground' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
