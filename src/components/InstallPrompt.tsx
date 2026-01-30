
import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
            } else {
                console.log("User dismissed the install prompt");
            }
            setDeferredPrompt(null);
            setShowPrompt(false);
        });
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-24 left-4 right-4 z-50 md:left-auto md:right-8 md:w-80"
            >
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <Download className="h-5 w-5" />
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-white">Install App</p>
                            <p className="text-zinc-400">Add to Home Screen</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 rounded-full p-0 text-zinc-400 hover:bg-white/10 hover:text-white"
                            onClick={() => setShowPrompt(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-white text-black hover:bg-white/90"
                            onClick={handleInstallClick}
                        >
                            Install
                        </Button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
