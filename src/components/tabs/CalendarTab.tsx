import { motion } from "framer-motion";
import EventsCard from "../EventsCard";
import { Plus } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface CalendarTabProps {
  events: Event[];
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

const CalendarTab = ({ events }: CalendarTabProps) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item}>
        <EventsCard events={events} fullWidth />
      </motion.div>
      <motion.div variants={item}>
        <motion.div variants={item}>
          <button className="btn-glass-green w-full">
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add New Event</span>
            </div>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CalendarTab;
