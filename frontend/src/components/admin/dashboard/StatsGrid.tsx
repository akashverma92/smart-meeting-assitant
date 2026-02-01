"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Users, Video, Activity } from "lucide-react";

interface StatsGridProps {
    data: {
        totalUsers: number;
        totalInterviews: number;
        activeInterviews: number;
    } | null;
}

import Link from "next/link";

export function StatsGrid({ data }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/admin/users" className="block transition-transform hover:scale-[1.02]">
                <StatCard
                    title="Total Users"
                    value={data?.totalUsers || 0}
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    description="Registered platform users - Click for details"
                    color="bg-blue-500/10"
                />
            </Link>
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
