"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Users, Video, Calendar, ArrowUpRight, TrendingUp, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Types
interface ChartData {
    activeInterviews: number;
    totalInterviews: number;
    totalUsers: number;
    chartData: { _id: string; count: number }[];
    topUsers: {
        _id: string;
        username: string;
        email: string;
        avatarUrl?: string;
        interviewCount: number;
    }[];
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ChartData | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace(user ? "/dashboard" : "/auth/login");
            return;
        }

        if (user?.role === "admin") {
            const fetchData = async () => {
                try {
                    const res = await adminService.getStats();
                    setData(res.data);
                } catch (error) {
                    console.error("Failed to fetch stats", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground animate-pulse">Loading dashboard statistics...</p>
                </div>
            </div>
        );
    }

    // Process chart data to ensure 7 days
    const chartDataMap = new Map(data?.chartData.map(d => [d._id, d.count]));
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        return {
            date: dateStr,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            count: chartDataMap.get(dateStr) || 0
        };
    });

    const maxCount = Math.max(...last7Days.map(d => d.count), 5); // Minimum max of 5 for scale

    return (
        <div className="space-y-8 p-1">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={data?.totalUsers || 0}
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    description="Registered platform users"
                    color="bg-blue-500/10"
                />
                <StatCard
                    title="Total Interviews"
                    value={data?.totalInterviews || 0}
                    icon={<Video className="w-5 h-5 text-purple-500" />}
                    description="Completed interview sessions"
                    color="bg-purple-500/10"
                />
                <StatCard
                    title="Active Sessions"
                    value={data?.activeInterviews || 0}
                    icon={<Activity className="w-5 h-5 text-green-500" />}
                    description="Currently ongoing"
                    color="bg-green-500/10"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Analytics Chart */}
                <Card className="col-span-1 shadow-sm border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Interview Activity
                        </CardTitle>
                        <CardDescription>Number of interviews over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 w-full flex items-end justify-between gap-4 px-2 pt-8">
                            {last7Days.map((item, i) => (
                                <div key={item.date} className="flex flex-col items-center gap-3 w-full h-full justify-end group cursor-pointer">
                                    <div className="relative w-full bg-muted/30 rounded-t-lg overflow-hidden flex items-end h-full">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(item.count / maxCount) * 100}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            className="w-full bg-primary/80 group-hover:bg-primary transition-colors rounded-t-lg min-h-[4px]"
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border">
                                            {item.count}
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                        {item.day}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Users Table */}
                <Card className="col-span-1 shadow-sm border-border/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            Top Active Users
                        </CardTitle>
                        <CardDescription>Users with the most interview sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {data?.topUsers.map((user, i) => (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.username.substring(0, 2).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium leading-none group-hover:text-primary transition-colors">{user.username}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{user.interviewCount}</span>
                                        <span className="text-xs text-muted-foreground">interviews</span>
                                    </div>
                                </motion.div>
                            ))}

                            {(!data?.topUsers || data.topUsers.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No user activity found.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description, color }: { title: string, value: number, icon: React.ReactNode, description: string, color: string }) {
    return (
        <Card className="border-border/60 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${color}`}>
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <h3 className="text-2xl font-bold tracking-tight">{value.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
