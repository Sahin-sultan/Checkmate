import { motion } from "framer-motion";
import TaskCard from "../TaskCard";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { useState } from "react";

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
  onAdd: (task: Omit<Task, "id" | "completed">) => void;
  onDelete: (id: string) => void;
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

const TasksTab = ({ tasks, onToggle, onAdd, onDelete }: TasksTabProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [dueTime, setDueTime] = useState("12:00 PM");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim() && dueTime.trim()) {
      onAdd({
        name: newTaskName,
        dueTime,
        priority,
      });
      setNewTaskName("");
      setDueTime("12:00 PM");
      setPriority("medium");
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <TaskCard tasks={tasks} onToggle={onToggle} onDelete={onDelete} fullWidth />
      </motion.div>
      <motion.div variants={item}>
        <motion.div variants={item}>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="btn-glass-blue w-full">
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Task</span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input
                    id="task-name"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="e.g., Submit Report"
                    className="bg-zinc-900 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-time">Due Time</Label>
                  <TimePicker
                    value={dueTime}
                    onChange={(t) => setDueTime(t)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priority}
                    onValueChange={(value: "high" | "medium" | "low") =>
                      setPriority(value)
                    }
                  >
                    <SelectTrigger className="bg-zinc-900 border-white/10 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 text-white">
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Add Task
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TasksTab;
