import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { LayoutDashboard, Target, CheckSquare, Goal, Calendar, BarChart3 } from "lucide-react";
import DashboardTab from "@/components/tabs/DashboardTab";
import HabitsTab from "@/components/tabs/HabitsTab";
import TasksTab from "@/components/tabs/TasksTab";
import GoalsTab from "@/components/tabs/GoalsTab";
import CalendarTab from "@/components/tabs/CalendarTab";
import StatsTab from "@/components/tabs/StatsTab";
import { GlowCard } from "@/components/ui/spotlight-card";

// Initial data
const initialHabits = [
  { id: "1", name: "Morning Exercise", streak: 7, completed: false },
  { id: "2", name: "Read for 30 minutes", streak: 14, completed: true },
  { id: "3", name: "Meditate", streak: 3, completed: false },
  { id: "4", name: "Drink 8 glasses of water", streak: 21, completed: false },
];

const initialTasks = [
  { id: "1", name: "Finish project proposal", dueTime: "2:00 PM", priority: "high" as const, completed: false },
  { id: "2", name: "Team meeting preparation", dueTime: "4:00 PM", priority: "medium" as const, completed: false },
  { id: "3", name: "Email responses", dueTime: "6:00 PM", priority: "low" as const, completed: false },
];

const initialEvents = [
  { id: "1", name: "Mom's Birthday", date: "January 30, 2026" },
  { id: "2", name: "Dentist Appointment", date: "January 28, 2026", time: "10:00 AM" },
  { id: "3", name: "Project Deadline", date: "February 1, 2026" },
  { id: "4", name: "Annual Review Meeting", date: "February 15, 2026" },
];

const initialGoals = [
  { id: "1", name: "Learn Web Development", target: "3 months target", progress: 45 },
  { id: "2", name: "Read 24 books this year", target: "24 books", progress: 33, current: "8 of 24 complete" },
  { id: "3", name: "Run a 5K marathon", target: "2 months target", progress: 60 },
];

const navItems = [
  { id: "dashboard", name: "Dashboard", url: "#", icon: LayoutDashboard },
  { id: "habits", name: "Habits", url: "#", icon: Target },
  { id: "tasks", name: "Tasks", url: "#", icon: CheckSquare },
  { id: "goals", name: "Goals", url: "#", icon: Goal },
  { id: "calendar", name: "Calendar", url: "#", icon: Calendar },
  { id: "stats", name: "Stats", url: "#", icon: BarChart3 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [habits, setHabits] = useState(initialHabits);
  const [tasks, setTasks] = useState(initialTasks);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(12);

  // Load from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("checkmate-habits");
    const savedTasks = localStorage.getItem("checkmate-tasks");
    const savedTasksCompleted = localStorage.getItem("checkmate-tasks-completed");

    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTasksCompleted) setTasksCompletedToday(JSON.parse(savedTasksCompleted));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("checkmate-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("checkmate-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("checkmate-tasks-completed", JSON.stringify(tasksCompletedToday));
  }, [tasksCompletedToday]);

  const handleToggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }, []);

  const handleToggleTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          if (newCompleted) {
            setTasksCompletedToday((c) => c + 1);
          } else {
            setTasksCompletedToday((c) => Math.max(0, c - 1));
          }
          return { ...task, completed: newCompleted };
        }
        return task;
      });
      return updated;
    });
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            habits={habits}
            tasks={tasks}
            events={initialEvents}
            streak={7}
            tasksCompletedToday={tasksCompletedToday}
            punctualityScore={85}
            onToggleHabit={handleToggleHabit}
            onToggleTask={handleToggleTask}
          />
        );
      case "habits":
        return <HabitsTab habits={habits} onToggle={handleToggleHabit} />;
      case "tasks":
        return <TasksTab tasks={tasks} onToggle={handleToggleTask} />;
      case "goals":
        return <GoalsTab goals={initialGoals} />;
      case "calendar":
        return <CalendarTab events={initialEvents} />;
      case "stats":
        return (
          <StatsTab
            streak={7}
            longestStreak={21}
            completionRate={85}
            totalTasksDone={156}
            weeklyOnTime={12}
            weeklyLate={3}
            monthlyOnTime={45}
            monthlyLate={8}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Replaced Navigation with NavBar */}
      <NavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />



      <main className="mx-auto max-w-7xl px-4 md:px-12 pb-12">
        <GlowCard
          customSize
          className="w-full rounded-2xl p-1"
          spotlightColor={
            activeTab === 'dashboard' ? 'hsl(220 100% 60% / 0.2)' : // Primary Blue
              activeTab === 'habits' ? 'hsl(340 85% 70% / 0.2)' :    // Pastel Pink
                activeTab === 'tasks' ? 'hsl(160 60% 60% / 0.2)' :     // Pastel Mint
                  activeTab === 'goals' ? 'hsl(40 95% 55% / 0.2)' :      // Warning/Gold
                    activeTab === 'calendar' ? 'hsl(200 80% 65% / 0.2)' :  // Pastel Blue
                      activeTab === 'stats' ? 'hsl(270 70% 70% / 0.2)' :     // Pastel Purple
                        'rgba(255, 255, 255, 0.1)'
          }
        >
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </GlowCard>
      </main>
    </div>
  );
};

export default Index;
