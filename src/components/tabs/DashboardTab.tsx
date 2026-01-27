import { motion } from "framer-motion";
import StatsCard from "../StatsCard";
import HabitCard from "../HabitCard";
import TaskCard from "../TaskCard";
import EventsCard from "../EventsCard";

interface Habit {
  id: string;
  name: string;
  streak: number;
  completed: boolean;
}

interface Task {
  id: string;
  name: string;
  dueTime: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface DashboardTabProps {
  habits: Habit[];
  tasks: Task[];
  events: Event[];
  streak: number;
  tasksCompletedToday: number;
  punctualityScore: number;
  onToggleHabit: (id: string) => void;
  onToggleTask: (id: string) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20
    }
  }
};

const DashboardTab = ({
  habits,
  tasks,
  events,
  streak,
  tasksCompletedToday,
  punctualityScore,
  onToggleHabit,
  onToggleTask,
}: DashboardTabProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item} className="h-full">
          <StatsCard value={streak} label="Day Streak" />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard value={tasksCompletedToday} label="Tasks Done Today" />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard value={`${punctualityScore}%`} label="Punctuality Score" />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="h-full">
          <HabitCard habits={habits.slice(0, 3)} onToggle={onToggleHabit} />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <TaskCard tasks={tasks.slice(0, 3)} onToggle={onToggleTask} />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <EventsCard events={events.slice(0, 3)} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;
