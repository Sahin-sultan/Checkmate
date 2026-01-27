import { motion } from "framer-motion";
import StatsCard from "../StatsCard";
import { BarChart3 } from "lucide-react";

interface StatsTabProps {
  streak: number;
  longestStreak: number;
  completionRate: number;
  totalTasksDone: number;
  weeklyOnTime: number;
  weeklyLate: number;
  monthlyOnTime: number;
  monthlyLate: number;
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

const StatsTab = ({
  streak,
  longestStreak,
  completionRate,
  totalTasksDone,
  weeklyOnTime,
  weeklyLate,
  monthlyOnTime,
  monthlyLate,
}: StatsTabProps) => {
  const weeklyPercentage = Math.round((weeklyOnTime / (weeklyOnTime + weeklyLate)) * 100);
  const monthlyPercentage = Math.round((monthlyOnTime / (monthlyOnTime + monthlyLate)) * 100);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item} className="h-full">
          <StatsCard value={streak} label="Current Streak" />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard value={longestStreak} label="Longest Streak" />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard value={`${completionRate}%`} label="Completion Rate" />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard value={totalTasksDone} label="Total Tasks Done" />
        </motion.div>
      </div>

      {/* Punctuality Analysis */}
      <motion.div variants={item}>
        <div className="card-earthy p-6">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-card-foreground" />
            <h3 className="font-heading text-lg font-semibold text-card-foreground">
              Punctuality Analysis
            </h3>
          </div>

          <div className="space-y-6">
            {/* This Week */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-body text-sm text-card-foreground">This Week</span>
                <span className="font-mono text-sm text-card-foreground/70">
                  On-time: {weeklyOnTime} | Late: {weeklyLate}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${weeklyPercentage}%` }}
                />
              </div>
              <p className="mt-1 text-right font-mono text-xs text-primary">
                {weeklyPercentage}%
              </p>
            </div>

            {/* This Month */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-body text-sm text-card-foreground">This Month</span>
                <span className="font-mono text-sm text-card-foreground/70">
                  On-time: {monthlyOnTime} | Late: {monthlyLate}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${monthlyPercentage}%` }}
                />
              </div>
              <p className="mt-1 text-right font-mono text-xs text-primary">
                {monthlyPercentage}%
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsTab;
