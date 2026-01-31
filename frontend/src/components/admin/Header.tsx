"use client";

import { useAuth } from "@/src/hooks/useAuth";

export function Header() {
    return (
        <header className="h-16 flex items-center justify-between px-6 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <h1 className="text-xl font-bold tracking-tight">ADMIN PANEL</h1>
            </div>
        </header>
    );
}
