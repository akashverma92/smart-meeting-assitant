"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/src/components/admin/dashboard/DashboardHeader";
import { StatsGrid } from "@/src/components/admin/dashboard/StatsGrid";
import { ActivityChart } from "@/src/components/admin/dashboard/ActivityChart";
import { TopUsersList } from "@/src/components/admin/dashboard/TopUsersList";

// Types
interface TopUser {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    interviewCount: number;
}

interface ChartData {
    activeInterviews: number;
    totalInterviews: number;
    totalUsers: number;
    chartData: { _id: string; count: number }[];
    topUsers: TopUser[];
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ChartData | null>(null);

    // Guard Clause: Redirect if not admin
    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace(user ? "/dashboard" : "/auth/login");
            return;
        }
    }, [user, authLoading, router]);

    // Data Fetching
    useEffect(() => {
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
    }, [user]);

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

    return (
        <div className="space-y-8 p-1">
            <DashboardHeader />

            <StatsGrid data={data} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ActivityChart data={data?.chartData || []} />
                <TopUsersList users={data?.topUsers || []} />
            </div>
        </div>
    );
}
