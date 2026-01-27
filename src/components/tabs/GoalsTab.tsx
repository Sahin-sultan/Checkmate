import { motion } from "framer-motion";
import GoalsCard from "../GoalsCard";
import { Plus } from "lucide-react";

interface GoalItem {
  id: string;
  name: string;
  target: string;
  progress: number;
  current?: string;
}

interface GoalsTabProps {
  goals: GoalItem[];
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

const GoalsTab = ({ goals }: GoalsTabProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <GoalsCard goals={goals} />
      </motion.div>
      <motion.div variants={item}>
        <button className="btn-glass-orange w-full">
          <div className="flex items-center justify-center gap-2">
            <Plus className="h-5 w-5" />
            <span>Add New Goal</span>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GoalsTab;
