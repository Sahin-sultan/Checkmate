import { Goal, Trash2 } from "lucide-react";


interface GoalItem {
  id: string;
  name: string;
  target: string;
  progress: number;
  current?: string;
}

interface GoalsCardProps {
  goals: GoalItem[];
  onDelete?: (id: string) => void;
  delay?: number;
}

const GoalsCard = ({ goals, onDelete, delay = 0 }: GoalsCardProps) => {
  return (
    <div
      className="card-earthy col-span-full p-6"
    >
      <div className="mb-4 flex items-center gap-2">
        <Goal className="h-5 w-5 text-card-foreground" />
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          Active Goals
        </h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-lg border border-white/5 p-4 transition-all duration-300 hover:bg-white/5 relative group"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-body text-base font-medium text-card-foreground">
                {goal.name}
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-primary">
                  {goal.progress}%
                </span>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(goal.id);
                    }}
                    className="text-white/40 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="mb-3 font-mono text-xs text-card-foreground/70">
              {goal.current ? `${goal.current} • ` : ""}{goal.target}
            </p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default GoalsCard;
