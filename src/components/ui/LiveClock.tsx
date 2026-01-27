"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface LiveClockProps {
    className?: string;
}

export const LiveClock = ({ className }: LiveClockProps) => {
    const [date, setDate] = useState<Date | null>(null);

    useEffect(() => {
        setDate(new Date());
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!date) return null; // Prevent hydration mismatch

    // Format parts
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";

    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return (
        <div className={cn(
            "flex items-center gap-4 rounded-full bg-background-secondary/50 backdrop-blur-md border border-white/5 px-6 py-3 font-mono text-sm shadow-sm hover:bg-background-secondary/80 transition-colors duration-300",
            className
        )}>
            {/* Time Section */}
            <div className="flex items-center justify-center min-w-[100px]">
                <span className="text-foreground font-semibold text-base">{hours}</span>
                <span className="text-primary mx-1 animate-pulse">:</span>
                <span className="text-foreground font-semibold text-base">{minutes}</span>
                <span className="text-primary mx-1 animate-pulse">:</span>

                {/* Animated Seconds */}
                <div className="relative w-[22px] h-[24px] overflow-hidden flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={seconds}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute text-foreground font-semibold text-base"
                        >
                            {seconds}
                        </motion.span>
                    </AnimatePresence>
                </div>

                <span className="ml-2 text-muted-foreground text-xs font-medium">{ampm}</span>
            </div>

            {/* Separator */}
            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            {/* Date Section - Hidden on very small screens if needed, but requirements ask for landscape */}
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground whitespace-nowrap">
                <span className="text-foreground">{dayName}</span>
                <span className="opacity-50">·</span>
                <span>{day} {month} {year}</span>
            </div>
        </div>
    );
};
