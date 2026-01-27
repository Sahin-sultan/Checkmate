import { motion } from "framer-motion";
import TaskCard from "../TaskCard";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  name: string;
  dueTime: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface TasksTabProps {
  tasks: Task[];
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

const TasksTab = ({ tasks, onToggle }: TasksTabProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <TaskCard tasks={tasks} onToggle={onToggle} fullWidth />
      </motion.div>
      <motion.div variants={item}>
        <motion.div variants={item}>
          <button className="btn-glass-blue w-full">
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add New Task</span>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TasksTab;
