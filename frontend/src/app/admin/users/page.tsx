"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Users, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";

interface UserReport {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    createdAt: string;
    totalMeetings: number;
    totalDurationMs: number;
}

export default function UsersReportPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserReport[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace(user ? "/dashboard" : "/auth/login");
            return;
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.role === "admin") {
            const fetchUsers = async () => {
                try {
                    const res = await adminService.getUsersReport();
                    setUsers(res.data);
                } catch (error) {
                    console.error("Failed to fetch users", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUsers();
        }
    }, [user]);

    // Format millisecond duration to Hours:Minutes
    const formatDuration = (ms: number) => {
        if (!ms) return "0h 0m";
        const totalMinutes = Math.floor(ms / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground animate-pulse">Loading users report...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/dashboard"
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Active Users</h2>
                    <p className="text-muted-foreground">Manage and track user activity and session durations.</p>
                </div>
            </div>

            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>User Directory</CardTitle>
                            <CardDescription>A list of all users and their interview statistics.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50 text-left">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Joined Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Interviews</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Total Hours Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, i) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                                                        {user.avatarUrl ? (
                                                            <img
                                                                src={user.avatarUrl}
                                                                alt={user.username}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-xs">
                                                                {user.username.substring(0, 2).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{user.username}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {format(new Date(user.createdAt), "PPP")}
                                            </td>
                                            <td className="p-4 align-middle text-center font-medium">
                                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                                                    {user.totalMeetings}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-right font-mono text-muted-foreground">
                                                {formatDuration(user.totalDurationMs)}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
