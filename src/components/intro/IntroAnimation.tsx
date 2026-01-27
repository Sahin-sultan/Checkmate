"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const IntroAnimation = () => {
    // Start visible by default, will check storage in effect
    const [isVisible, setIsVisible] = useState(true);
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        // Check if we've already shown the intro in this session
        const hasPlayed = sessionStorage.getItem("introPlayed");

        if (hasPlayed) {
            setIsVisible(false);
            setShouldRender(false);
            return;
        }

        // Lock body scroll
        document.body.style.overflow = "hidden";

        // Sequence timing
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("introPlayed", "true");

            // Unlock body scroll after transition
            setTimeout(() => {
                document.body.style.overflow = "unset";
                setShouldRender(false);
            }, 1000); // Wait for exit animation
        }, 3500); // 3.5s duration

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="intro-overlay"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground"
                >
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.2, 1],
                                opacity: [0, 0.3, 0.1],
                                rotate: [0, 45, 90]
                            }}
                            transition={{ duration: 3, ease: "circOut" }}
                            className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-primary/20 blur-3xl"
                        />
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: [0.8, 1.2, 1],
                                opacity: [0, 0.2, 0.1],
                                rotate: [0, -45, -90]
                            }}
                            transition={{ duration: 3, delay: 0.2, ease: "circOut" }}
                            className="absolute -bottom-[20%] -left-[20%] w-[80vw] h-[80vw] rounded-full bg-secondary/30 blur-3xl"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo Icon Animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            transition={{
                                duration: 1.2,
                                type: "spring",
                                stiffness: 100,
                                damping: 20
                            }}
                            className="mb-8 text-8xl"
                        >
                            <img
                                src="https://res.cloudinary.com/ddzreu2to/image/upload/v1769528073/vecteezy_classic-chess-horse-vectors-art_67945655-removebg-preview_nc3y9f.png"
                                alt="Checkmate Logo"
                                className="h-24 w-24 object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Main Text Reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
                                className="text-6xl md:text-8xl font-heading font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-shine"
                            >
                                CHECKMATE
                            </motion.h1>
                        </div>

                        {/* Subtext Reveal */}
                        <div className="mt-4 overflow-hidden">
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                                className="text-xl md:text-2xl font-body text-muted-foreground tracking-widest uppercase"
                            >
                                Master your day
                            </motion.p>
                        </div>

                        {/* Loading Line */}
                        <motion.div
                            className="mt-12 h-1 bg-border w-48 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                        >
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
