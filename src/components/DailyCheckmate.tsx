import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, XCircle, CheckCircle, Crown } from "lucide-react";
import Confetti from "./Confetti";

interface DailyCheckmateProps {
    tasks: { id: string; name: string; completed: boolean }[];
    habits: { id: string; name: string; completed: boolean }[];
}

const DailyCheckmate = ({ tasks, habits }: DailyCheckmateProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [animationStage, setAnimationStage] = useState<"initial" | "calculating" | "result">("initial");

    const totalItems = tasks.length + habits.length;
    const completedItems = tasks.filter(t => t.completed).length + habits.filter(h => h.completed).length;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    const isWin = percentage >= 80;

    useEffect(() => {
        if (isOpen) {
            setAnimationStage("calculating");
            const timer = setTimeout(() => {
                setAnimationStage("result");
                if (isWin) {
                    setShowConfetti(true);
                }
            }, 2000);
            return () => clearTimeout(timer);
        } else {
            setAnimationStage("initial");
            setShowConfetti(false);
        }
    }, [isOpen, isWin]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 hover:bg-indigo-500/30 text-indigo-100 mb-6 group relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        Daily Checkmate Review
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 text-white overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                {showConfetti && <Confetti x={window.innerWidth / 2} y={window.innerHeight / 2} onComplete={() => setShowConfetti(false)} />}

                <AnimatePresence mode="wait">
                    {animationStage === "calculating" && (
                        <motion.div
                            key="calculating"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="relative w-24 h-24">
                                <motion.div
                                    className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                                    {percentage}%
                                </div>
                            </div>
                            <p className="text-zinc-400 animate-pulse">Analyzing your day...</p>
                        </motion.div>
                    )}

                    {animationStage === "result" && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-6 w-full"
                        >
                            <div className="relative">
                                {isWin ? (
                                    <motion.div
                                        initial={{ rotate: -10, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                        className="relative"
                                    >
                                        <Crown className="w-24 h-24 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                                        <motion.div
                                            className="absolute -top-1 -right-1"
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <div className="text-4xl">✨</div>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ rotate: 10, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                    >
                                        <div className="text-6xl grayscale opacity-80">♟️</div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="text-center space-y-2">
                                <motion.h2
                                    className={`text-3xl font-bold ${isWin ? "bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent" : "text-zinc-400"}`}
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                >
                                    {isWin ? "Checkmate!" : "Stalemate"}
                                </motion.h2>
                                <p className="text-zinc-400">
                                    {isWin
                                        ? "You absolutely crushed it today! The board is yours."
                                        : "Close game. Review your strategy and win tomorrow."}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full bg-white/5 rounded-xl p-4">
                                <div className="text-center border-r border-white/10">
                                    <div className="text-2xl font-bold text-emerald-400">{completedItems}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-rose-400">{totalItems - completedItems}</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Missed</div>
                                </div>
                            </div>

                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Daily Score</span>
                                    <span className={isWin ? "text-yellow-500" : "text-zinc-400"}>{percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${isWin ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-zinc-600"}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
};

export default DailyCheckmate;
