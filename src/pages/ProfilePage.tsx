import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft,
    Camera,
    User,
    Mail,
    Shield,
    Loader2,
    Check
} from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { updateProfile, updateEmail } from "firebase/auth";
import { toast } from "sonner";

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const [isLoading, setIsLoading] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }

            if (email !== user.email) {
                await updateEmail(user, email);
            }

            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error("Security check failed. Please log in again to update heavy credentials.");
                // clean redirect to login could go here
            } else {
                toast.error("Failed to update profile: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <p>Please log in to view your profile.</p>
                <Link to="/login" className="mt-4 text-blue-500 hover:underline">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 md:pt-24 px-4 relative max-w-2xl mx-auto">
            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full hover:bg-white/10 text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="relative group">
                    {/* Consistent Glow Effect */}
                    <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl" />

                    <div className="relative bg-zinc-900/60 backdrop-blur-md border border-white/10 p-8 rounded-2xl text-center space-y-4">
                        <div className="relative inline-block">
                            <Avatar className="w-32 h-32 border-4 border-zinc-800 shadow-2xl mx-auto">
                                <AvatarImage src={user.photoURL || undefined} className="object-cover" />
                                <AvatarFallback className="text-4xl bg-zinc-800 text-white">{displayName?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white">{displayName || "User"}</h2>
                            <p className="text-zinc-400">{user.email}</p>
                        </div>

                        <div className="flex items-center justify-center gap-2 pt-4">
                            <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Email Verified: {user.emailVerified ? "Yes" : "No"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <Card className="bg-zinc-900/60 border-white/10 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white">Personal Information</CardTitle>
                        <CardDescription className="text-zinc-400">Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Display Name
                                </label>
                                <Input
                                    value={displayName}
                                    onChange={(e) => {
                                        setDisplayName(e.target.value);
                                        setIsEditing(true);
                                    }}
                                    className="bg-zinc-950/50 border-white/10 text-white"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </label>
                                <Input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setIsEditing(true);
                                    }}
                                    className="bg-zinc-950/50 border-white/10 text-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={!isEditing || isLoading}
                                    className="bg-white text-black hover:bg-zinc-200 min-w-[120px]"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

            </motion.div>
        </div>
    );
}
