"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Home, Users, Video, ClipboardList, PenTool, LogOut } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();
    const { user, logoutUser } = useAuth();

    const navItems = [
        { name: "Home", href: "/admin/dashboard", icon: Home },
        { name: "Join Interview", href: "/admin/join", icon: Video },
        { name: "Marks", href: "/admin/marks", icon: ClipboardList },
        { name: "Results", href: "/admin/results", icon: PenTool },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
            <div className="flex flex-col items-center justify-center py-8 border-b border-border">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-3 ring-2 ring-primary/20">
                    <img
                        src={user?.avatarUrl || "/default-avatar.png"}
                        alt="Admin"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h2 className="text-lg font-semibold">{user?.username || "Admin"}</h2>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
