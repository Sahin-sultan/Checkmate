import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, User } from 'lucide-react';
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider,
    updateProfile
} from "firebase/auth";
import { toast } from "sonner";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export function SignInCard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    // Update state based on current path
    useEffect(() => {
        setIsSignUp(location.pathname === '/signup');
    }, [location.pathname]);

    // Check for existing session or auth state change
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // If we are logged in, go to home
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Check for redirect result (mobile auth flow)
    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    toast.success("Signed in with Google successfully!");
                    // Navigation will be handled by the onAuthStateChanged effect above
                }
            } catch (error) {
                console.error("Redirect auth error", error);
                toast.error("Failed to sign in via redirect");
            }
        };
        checkRedirect();
    }, []);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // Added name state
    const [isLoading, setIsLoading] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // For 3D card effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleSubmit = async (event: React.MouseEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (name) {
                    await updateProfile(userCredential.user, { displayName: name });
                }
                toast.success("Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Signed in successfully!");
            }
            navigate("/");
        } catch (error: any) {
            console.error(error);
            let message = "An error occurred.";
            if (error.code === 'auth/email-already-in-use') message = "Email is already in use.";
            else if (error.code === 'auth/invalid-email') message = "Invalid email address.";
            else if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
            else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') message = "Invalid email or password.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            if (isMobile) {
                await signInWithRedirect(auth, provider);
                return; // Redirecting...
            }

            await signInWithPopup(auth, provider);
            toast.success("Signed in with Google successfully!");
            navigate("/");
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
                // Fallback to redirect if popup fails
                try {
                    const provider = new GoogleAuthProvider();
                    await signInWithRedirect(auth, provider);
                } catch (e) {
                    toast.error("Failed to sign in with Google.");
                }
            } else {
                toast.error("Failed to sign in with Google.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#050A14] relative overflow-hidden flex items-center justify-center">
            {/* Background gradient effect - Blue/Cyan theme */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-blue-900/40 to-[#050A14]" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Top radial glow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-blue-500/20 blur-[80px]" />
            <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-cyan-400/10 blur-[60px]"
                animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-blue-600/10 blur-[60px]"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1
                }}
            />

            {/* Back to Home Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-8 z-20"
            >
                <Link
                    to="/"
                    className="flex items-center gap-2 text-blue-200/50 hover:text-white transition-all duration-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </motion.div>

            {/* Animated glow spots */}
            <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse opacity-40" />
            <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm relative z-10"
                style={{ perspective: 1500 }}
            >
                <motion.div
                    className="relative"
                    style={{ rotateX, rotateY }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ z: 10 }}
                >
                    <div className="relative group">
                        {/* Card glow effect */}
                        <motion.div
                            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                            animate={{
                                boxShadow: [
                                    "0 0 10px 2px rgba(6, 182, 212, 0.05)",
                                    "0 0 15px 5px rgba(59, 130, 246, 0.1)",
                                    "0 0 10px 2px rgba(6, 182, 212, 0.05)"
                                ],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatType: "mirror"
                            }}
                        />

                        {/* Traveling light beam effect */}
                        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                            {/* Beams (Top, Right, Bottom, Left) */}
                            <motion.div
                                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    left: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" }
                                }}
                            />
                            <motion.div
                                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    top: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 }
                                }}
                            />
                            <motion.div
                                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    right: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 }
                                }}
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    bottom: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 }
                                }}
                            />
                        </div>

                        {/* Glass card background */}
                        <div className="relative bg-[#0b1221]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
                            {/* Inner patterns */}
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                                    backgroundSize: '30px 30px'
                                }}
                            />

                            {/* Header */}
                            <div className="text-center space-y-1 mb-5">
                                <motion.div
                                    key={isSignUp ? "signup-icon" : "signin-icon"}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="mx-auto w-10 h-10 rounded-full border border-cyan-500/30 flex items-center justify-center relative overflow-hidden"
                                >
                                    <img
                                        src="https://res.cloudinary.com/ddzreu2to/image/upload/v1769528073/vecteezy_classic-chess-horse-vectors-art_67945655-removebg-preview_nc3y9f.png"
                                        alt="Checkmate Logo"
                                        className="h-6 w-6 object-contain drop-shadow-md"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-50" />
                                </motion.div>

                                <motion.h1
                                    key={isSignUp ? "signup-title" : "signin-title"}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                                >
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-blue-100/60 text-xs"
                                >
                                    {isSignUp ? "Sign up to get started" : "Sign in to continue to Checkmate"}
                                </motion.p>
                            </div>

                            {/* Form */}
                            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(e as unknown as React.MouseEvent); }} className="space-y-4">
                                <motion.div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {isSignUp && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                {/* Name Input */}
                                                <motion.div
                                                    className={`relative ${focusedInput === "name" ? 'z-10' : ''}`}
                                                    whileFocus={{ scale: 1.02 }}
                                                    whileHover={{ scale: 1.01 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                >
                                                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-cyan-400/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                    <div className="relative flex items-center overflow-hidden rounded-lg">
                                                        <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "name" ? 'text-white' : 'text-white/40'}`} />
                                                        <Input
                                                            type="text"
                                                            placeholder="Full Name"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            onFocus={() => setFocusedInput("name" as any)}
                                                            onBlur={() => setFocusedInput(null)}
                                                            className="w-full bg-[#0F172A]/50 border-transparent focus:border-white/20 text-white placeholder:text-blue-100/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-[#1E293B]/50"
                                                        />
                                                        {focusedInput === "name" && (
                                                            <motion.div
                                                                layoutId="input-highlight"
                                                                className="absolute inset-0 bg-white/5 -z-10"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Email input */}
                                    <motion.div
                                        className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                                        whileFocus={{ scale: 1.02 }}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <div className="absolute -inset-[0.5px] bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-cyan-400/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                        <div className="relative flex items-center overflow-hidden rounded-lg">
                                            <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "email" ? 'text-white' : 'text-white/40'}`} />
                                            <Input
                                                type="email"
                                                placeholder="Email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedInput("email" as any)}
                                                onBlur={() => setFocusedInput(null)}
                                                className="w-full bg-[#0F172A]/50 border-transparent focus:border-white/20 text-white placeholder:text-blue-100/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-[#1E293B]/50"
                                            />
                                            {focusedInput === "email" && (
                                                <motion.div
                                                    layoutId="input-highlight"
                                                    className="absolute inset-0 bg-white/5 -z-10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Password input */}
                                    <motion.div
                                        className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                                        whileFocus={{ scale: 1.02 }}
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    >
                                        <div className="absolute -inset-[0.5px] bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-cyan-400/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                        <div className="relative flex items-center overflow-hidden rounded-lg">
                                            <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "password" ? 'text-white' : 'text-white/40'}`} />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedInput("password" as any)}
                                                onBlur={() => setFocusedInput(null)}
                                                className="w-full bg-[#0F172A]/50 border-transparent focus:border-white/20 text-white placeholder:text-blue-100/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-[#1E293B]/50"
                                            />
                                            <div
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 cursor-pointer"
                                            >
                                                {showPassword ? (
                                                    <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                ) : (
                                                    <EyeClosed className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                )}
                                            </div>
                                            {focusedInput === "password" && (
                                                <motion.div
                                                    layoutId="input-highlight"
                                                    className="absolute inset-0 bg-white/5 -z-10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                                className="appearance-none h-4 w-4 rounded border border-white/20 bg-white/5 checked:bg-cyan-500 checked:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
                                            />
                                            {rememberMe && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute inset-0 flex items-center justify-center text-black pointer-events-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </div>
                                        <label htmlFor="remember-me" className="text-xs text-blue-100/60 hover:text-white transition-colors duration-200">
                                            Remember me
                                        </label>
                                    </div>

                                    {!isSignUp && (
                                        <div className="text-xs relative group/link">
                                            <Link to="/forgot-password" className="text-blue-100/60 hover:text-white transition-colors duration-200">
                                                Forgot password?
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group/button mt-5"
                                >
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                                    <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 -z-10"
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                                            style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                        />
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                <motion.div
                                                    key="loading"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center"
                                                >
                                                    <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                                                </motion.div>
                                            ) : (
                                                <motion.span
                                                    key="button-text"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center justify-center gap-1 text-sm font-medium"
                                                >
                                                    {isSignUp ? "Create Account" : "Sign In"}
                                                    <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.button>

                                <div className="relative mt-2 mb-5 flex items-center">
                                    <div className="flex-grow border-t border-white/5"></div>
                                    <motion.span
                                        className="mx-3 text-xs text-white/40"
                                        initial={{ opacity: 0.7 }}
                                        animate={{ opacity: [0.7, 0.9, 0.7] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        or
                                    </motion.span>
                                    <div className="flex-grow border-t border-white/5"></div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={isLoading}
                                    className="w-full relative group/google"
                                >
                                    <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/google:opacity-70 transition-opacity duration-300" />
                                    <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 flex items-center justify-center text-white/80 group-hover/google:text-white transition-colors duration-300">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-white/80 group-hover/google:text-white transition-colors text-xs">
                                            {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 1, ease: "easeInOut" }}
                                        />
                                    </div>
                                </motion.button>

                                <motion.p
                                    className="text-center text-xs text-blue-100/60 mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                                    <Link
                                        to={isSignUp ? "/login" : "/signup"}
                                        className="relative inline-block group/signup"
                                    >
                                        <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
                                            {isSignUp ? "Sign in" : "Sign up"}
                                        </span>
                                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
                                    </Link>
                                </motion.p>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
