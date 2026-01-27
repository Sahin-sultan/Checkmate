import { motion } from "framer-motion";
import HabitCard from "../HabitCard";
import { Plus } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  streak: number;
  completed: boolean;
}

interface HabitsTabProps {
  habits: Habit[];
  onToggle: (id: string) => void;
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

const HabitsTab = ({ habits, onToggle }: HabitsTabProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <HabitCard habits={habits} onToggle={onToggle} fullWidth />
      </motion.div>
      <motion.div variants={item}>
        <motion.div variants={item}>
          <button className="btn-glass-purple w-full">
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add New Habit</span>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HabitsTab;
