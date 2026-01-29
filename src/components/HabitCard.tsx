import { useState, useCallback } from "react";
import { Check, Target, Trash2 } from "lucide-react";
import Confetti from "./Confetti";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { NeonCheckbox } from "@/components/ui/animated-check-box";

interface Habit {
  id: string;
  name: string;
  streak: number;
  completed: boolean;
}

interface HabitCardProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  delay?: number;
  fullWidth?: boolean;
}

const HabitCard = ({ habits, onToggle, onDelete, delay = 0, fullWidth = false }: HabitCardProps) => {
  const [confetti, setConfetti] = useState<{ x: number; y: number } | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const handleToggle = useCallback((e: React.MouseEvent, habit: Habit) => {
    if (!habit.completed) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setConfetti({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setCelebratingId(habit.id);
      setTimeout(() => setCelebratingId(null), 600);
    }
    onToggle(habit.id);
  }, [onToggle]);

  return (
    <div
      className={`card-earthy p-6 relative overflow-hidden ${fullWidth ? 'col-span-full' : ''}`}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-card-foreground" />
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            {fullWidth ? "All Habits" : "Today's Habits"}
          </h3>
        </div>

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`habit-item ${celebratingId === habit.id ? 'celebrate' : ''}`}
              onClick={(e) => handleToggle(e, habit)}
            >
              <div className="pointer-events-none">
                <NeonCheckbox
                  checked={habit.completed}
                  onChange={() => { }}
                />
              </div>
              <div className="flex-1">
                <p className={`font-body text-base text-card-foreground ${habit.completed ? 'line-through opacity-60' : ''}`}>
                  {habit.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-background-tertiary px-3 py-1">
                  <span className="streak-fire">🔥</span>
                  <span className="font-mono text-sm text-foreground">{habit.streak}</span>
                </div>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(habit.id);
                    }}
                    className="p-2 text-white/40 hover:text-red-500 transition-colors"
                    title="Delete Habit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {confetti && (
          <Confetti
            x={confetti.x}
            y={confetti.y}
            onComplete={() => setConfetti(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HabitCard;
