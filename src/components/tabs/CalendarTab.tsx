import { motion } from "framer-motion";
import EventsCard from "../EventsCard";
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

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface CalendarTabProps {
  events: Event[];
  onAdd: (event: Omit<Event, "id">) => void;
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

const formatTime12h = (time24: string) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  let h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const CalendarTab = ({ events, onAdd, onDelete }: CalendarTabProps) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && date.trim()) {
      onAdd({
        name,
        date,
        time: time.trim() ? formatTime12h(time) : undefined,
      });
      setName("");
      setDate("");
      setTime("12:00");
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
        <EventsCard events={events} onDelete={onDelete} fullWidth />
      </motion.div>
      <motion.div variants={item}>
        <motion.div variants={item}>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="btn-glass-green w-full">
                <div className="flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Event</span>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Dentist Appointment"
                    className="bg-zinc-900 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g., January 30, 2026"
                    className="bg-zinc-900 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time (Optional)</Label>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white w-full h-10 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                    Add Event
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

export default CalendarTab;
