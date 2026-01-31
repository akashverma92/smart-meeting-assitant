"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Users, Video, Calendar, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalInterviews: 0,
        activeInterviews: 0,
    });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace(user ? "/dashboard" : "/auth/login");
            return;
        }

        if (user?.role === "admin") {
            fetchStats();
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const res = await adminService.getStats();
            // Expecting { totalUsers, totalInterviews, activeInterviews, chartData }
            const data = res.data;

            setStats({
                totalUsers: data.totalUsers || 0,
                totalInterviews: data.totalInterviews || 0,
                activeInterviews: data.activeInterviews || 0,
            });

            // Update chart data if we want to use the backend agg
            if (data.chartData && data.chartData.length > 0) {
                // Transform backend { _id: "2024-01-01", count: 5 } to chart format
                const chartData = data.chartData.map((d: any) => d.count);
                // You might want to setState for 'data' here too
            }

        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading stats...</div>;
    }

    // Simple CSS Bar Chart Data
    const data = [40, 70, 45, 90, 60, 80, 50]; // Dummy trend data
    const max = Math.max(...data);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<Users className="text-blue-500" />}
                    trend="+12%"
                />
                <StatCard
                    title="Total Interviews"
                    value={stats.totalInterviews}
                    icon={<Video className="text-purple-500" />}
                    trend="+5%"
                />
                <StatCard
                    title="Active Sessions"
                    value={stats.activeInterviews}
                    icon={<Calendar className="text-green-500" />}
                    trend="Now"
                />
            </div>

            {/* Analytics Chart Section */}
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Interview Activity (Current Week)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 w-full flex items-end justify-between gap-2 px-4 pt-4">
                        {data.map((value, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group w-full">
                                <div className="relative w-full max-w-[50px] bg-muted/30 rounded-t-md overflow-hidden h-full flex items-end">
                                    <div
                                        className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-500 ease-out rounded-t-md"
                                        style={{ height: `${(value / max) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend: string }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-muted rounded-full">
                            {icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{title}</p>
                            <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                        {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
