import { useState, useCallback } from "react";
import { Check, Zap } from "lucide-react";
import Confetti from "./Confetti";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { NeonCheckbox } from "@/components/ui/animated-check-box";

interface Task {
  id: string;
  name: string;
  dueTime: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface TaskCardProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  delay?: number;
  fullWidth?: boolean;
}

const priorityStyles = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low",
};

const TaskCard = ({ tasks, onToggle, delay = 0, fullWidth = false }: TaskCardProps) => {
  const [confetti, setConfetti] = useState<{ x: number; y: number } | null>(null);
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const handleToggle = useCallback((e: React.MouseEvent, task: Task) => {
    if (!task.completed) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setConfetti({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setCelebratingId(task.id);
      setTimeout(() => setCelebratingId(null), 600);
    }
    onToggle(task.id);
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
          <Zap className="h-5 w-5 text-card-foreground" />
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            {fullWidth ? "All Tasks" : "Priority Tasks"}
          </h3>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${priorityStyles[task.priority]} ${celebratingId === task.id ? 'celebrate' : ''}`}
              onClick={(e) => handleToggle(e, task)}
            >
              <div className="pointer-events-none">
                <NeonCheckbox
                  checked={task.completed}
                  onChange={() => { }}
                />
              </div>
              <div className="flex-1">
                <p className={`font-body text-base text-card-foreground ${task.completed ? 'line-through opacity-60' : ''}`}>
                  {task.name}
                </p>
                <p className="font-mono text-xs text-card-foreground/70">
                  Due: {task.dueTime}
                </p>
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

export default TaskCard;
