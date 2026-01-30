import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Moon, Sun, Monitor, Bell, Lock, Globe, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen pt-16 md:pt-24 px-4 relative max-w-2xl mx-auto">
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
            >
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full hover:bg-white/10 text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                </div>

                {/* Section: Appearance */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider pl-1">Appearance</h2>
                    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Moon className="w-4 h-4" />
                                </div>
                                <div className="text-white">
                                    <p className="font-medium">Dark Mode</p>
                                    <p className="text-xs text-zinc-400">Adjust the appearance of the app</p>
                                </div>
                            </div>
                            <Switch checked={true} />
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Monitor className="w-4 h-4" />
                                </div>
                                <p className="font-medium">Theme Preference</p>
                            </div>
                            <span className="text-sm text-zinc-500">System</span>
                        </div>
                    </div>
                </div>

                {/* Section: Notifications */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider pl-1">Notifications</h2>
                    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div className="text-white">
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-xs text-zinc-400">Get alerts for upcoming tasks</p>
                                </div>
                            </div>
                            <Switch checked={true} />
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                    <Volume2 className="w-4 h-4" />
                                </div>
                                <p className="font-medium">Sound Effects</p>
                            </div>
                            <Switch checked={true} />
                        </div>
                    </div>
                </div>

                {/* Section: General */}
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider pl-1">General</h2>
                    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md text-white">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700/20 flex items-center justify-center text-zinc-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <p className="font-medium">Privacy & Security</p>
                            </div>
                            <ChevronLeft className="w-4 h-4 rotate-180 text-zinc-600" />
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors text-left border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-700/20 flex items-center justify-center text-zinc-400">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <p className="font-medium">Language</p>
                            </div>
                            <span className="text-sm text-zinc-500 mr-2">English</span>
                        </button>
                    </div>
                </div>

                <div className="pt-8 text-center">
                    <p className="text-xs text-zinc-600">Checkmate v1.0.0</p>
                </div>

            </motion.div>
        </div>
    );
}
