"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { motion } from "framer-motion";

export function DashboardHeader() {
    const { user } = useAuth();
    const displayName = user?.username || "Admin";

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
            <p className="text-muted-foreground flex items-center gap-2">
                Welcome back,
                <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold border border-primary/20 shadow-[0_0_15px_-3px_rgba(var(--primary),0.3)] backdrop-blur-sm"
                >
                    {displayName}
                </motion.span>
                . Here's what's happening today.
            </p>
        </div>
    );
}
