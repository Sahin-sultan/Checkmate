import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { LayoutDashboard, Target, CheckSquare, Goal, Calendar, BarChart3, Wallet } from "lucide-react";
import DashboardTab from "@/components/tabs/DashboardTab";
import HabitsTab from "@/components/tabs/HabitsTab";
import TasksTab from "@/components/tabs/TasksTab";
import GoalsTab from "@/components/tabs/GoalsTab";
import CalendarTab from "@/components/tabs/CalendarTab";
import StatsTab from "@/components/tabs/StatsTab";
import FinanceTab, { Transaction } from "@/components/tabs/FinanceTab";
import { GlowCard } from "@/components/ui/spotlight-card";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

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

interface Goal {
  id: string;
  name: string;
  target: string;
  progress: number;
  current?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time?: string;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

// Initial data
const initialHabits: Habit[] = [
  { id: "1", name: "Morning Exercise", streak: 7, completed: false },
  { id: "2", name: "Read for 30 minutes", streak: 14, completed: true },
  { id: "3", name: "Meditate", streak: 3, completed: false },
  { id: "4", name: "Drink 8 glasses of water", streak: 21, completed: false },
];

const initialTasks: Task[] = [
  { id: "1", name: "Finish project proposal", dueTime: "2:00 PM", priority: "high", completed: false },
  { id: "2", name: "Team meeting preparation", dueTime: "4:00 PM", priority: "medium", completed: false },
  { id: "3", name: "Email responses", dueTime: "6:00 PM", priority: "low", completed: false },
];

const initialEvents: Event[] = [
  { id: "1", name: "Mom's Birthday", date: "January 30, 2026" },
  { id: "2", name: "Dentist Appointment", date: "January 28, 2026", time: "10:00 AM" },
  { id: "3", name: "Project Deadline", date: "February 1, 2026" },
  { id: "4", name: "Annual Review Meeting", date: "February 15, 2026" },
];

const initialGoals: Goal[] = [
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
  { id: "finance", name: "Finance", url: "#", icon: Wallet },
  { id: "stats", name: "Stats", url: "#", icon: BarChart3 },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("checkmate-active-tab") || "dashboard");
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(12);

  // Initialize notification system
  useNotificationSystem(tasks, events);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          avatar: currentUser.photoURL || undefined
        });

        // Only show toast if it's a fresh login (optional logic could go here)
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem("checkmate-habits");
    const savedTasks = localStorage.getItem("checkmate-tasks");
    const savedTasksCompleted = localStorage.getItem("checkmate-tasks-completed");

    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTasksCompleted) setTasksCompletedToday(JSON.parse(savedTasksCompleted));

    const savedGoals = localStorage.getItem("checkmate-goals");
    const savedEvents = localStorage.getItem("checkmate-events");
    const savedTransactions = localStorage.getItem("checkmate-transactions");
    const savedUser = localStorage.getItem("checkmate-user");

    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

    // Load user from local storage while Firebase initializes to prevent flicker
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  // Save activeTab to localStorage
  useEffect(() => {
    localStorage.setItem("checkmate-active-tab", activeTab);
  }, [activeTab]);

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

  useEffect(() => {
    localStorage.setItem("checkmate-goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("checkmate-events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("checkmate-transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("checkmate-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("checkmate-user");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Failed to log out");
    }
  };

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddHabit = (name: string) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      streak: 0,
      completed: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const handleAddTask = (task: Omit<typeof initialTasks[0], "id" | "completed">) => {
    const newTask = {
      id: Date.now().toString(),
      completed: false,
      ...task,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleAddGoal = (goal: Omit<typeof initialGoals[0], "id" | "progress">) => {
    const newGoal = {
      id: Date.now().toString(),
      progress: 0,
      ...goal,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const handleAddEvent = (event: Omit<typeof initialEvents[0], "id">) => {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleToggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  }, []);

  const handleDeleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
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

  const handleDeleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const handleDeleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            habits={habits}
            tasks={tasks}
            events={events} // Use state events here
            streak={7}
            tasksCompletedToday={tasksCompletedToday}
            punctualityScore={85}
            onToggleHabit={handleToggleHabit}
            onToggleTask={handleToggleTask}
          />
        );
      case "habits":
        return <HabitsTab habits={habits} onToggle={handleToggleHabit} onAdd={handleAddHabit} onDelete={handleDeleteHabit} />;
      case "tasks":
        return <TasksTab tasks={tasks} onToggle={handleToggleTask} onAdd={handleAddTask} onDelete={handleDeleteTask} />;
      case "goals":
        return <GoalsTab goals={goals} onAdd={handleAddGoal} onDelete={handleDeleteGoal} />;
      case "calendar":
        return <CalendarTab events={events} onAdd={handleAddEvent} onDelete={handleDeleteEvent} />;
      case "finance":
        return (
          <FinanceTab
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
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

  // Swipe Logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = navItems.findIndex(item => item.id === activeTab);
      if (isLeftSwipe && currentIndex < navItems.length - 1) {
        setActiveTab(navItems[currentIndex + 1].id);
      }
      if (isRightSwipe && currentIndex > 0) {
        setActiveTab(navItems[currentIndex - 1].id);
      }
    }
  };

  return (
    <div
      className="min-h-screen pb-24 touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout} />

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
                      activeTab === 'finance' ? 'hsl(142 70% 50% / 0.2)' :   // Emerald Green
                        activeTab === 'stats' ? 'hsl(270 70% 70% / 0.2)' :     // Pastel Purple
                          'rgba(255, 255, 255, 0.1)'
          }
        >
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
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
