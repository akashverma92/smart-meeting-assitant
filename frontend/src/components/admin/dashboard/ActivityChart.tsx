"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityChartProps {
    data: { _id: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
    // Process chart data to ensure 7 days
    const chartDataMap = new Map(data.map(d => [d._id, d.count]));
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
    );
}
