import { motion } from "framer-motion";
import GoalsCard from "../GoalsCard";
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
import { useState } from "react";

interface GoalItem {
  id: string;
  name: string;
  target: string;
  progress: number;
  current?: string;
}

interface GoalsTabProps {
  goals: GoalItem[];
  onAdd: (goal: Omit<GoalItem, "id" | "progress">) => void;
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

const GoalsTab = ({ goals, onAdd, onDelete }: GoalsTabProps) => {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && target.trim()) {
      onAdd({
        name,
        target,
        current: current.trim() || undefined,
      });
      setName("");
      setTarget("");
      setCurrent("");
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
        <GoalsCard goals={goals} onDelete={onDelete} />
      </motion.div>
      <motion.div variants={item}>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="btn-glass-orange w-full">
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                <span>Add New Goal</span>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Read Books"
                  className="bg-zinc-900 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Description</Label>
                <Input
                  id="target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="e.g., 24 books this year"
                  className="bg-zinc-900 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current">Current Status (Optional)</Label>
                <Input
                  id="current"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="e.g., 5 read"
                  className="bg-zinc-900 border-white/10 text-white"
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                  Add Goal
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
};

export default GoalsTab;
