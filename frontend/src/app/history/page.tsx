"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { MeetingItem } from "@/src/components/dashboard/MeetingItem";
import { EmptyState } from "@/src/components/dashboard/EmptyState";
import { meetingService } from "@/src/services/meetingService";
import { Loader2, ArrowLeft, Clock } from "lucide-react";

export default function HistoryPage() {
    const router = useRouter();
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await meetingService.getHistory();
                const mapped = res.data.meetings.map((m: any) => ({
                    id: m._id,
                    title: `Session ${m.meetingCode}`,
                    date: new Date(m.createdAt).toLocaleDateString() + ' ' + new Date(m.createdAt).toLocaleTimeString(),
                    type: 'interview',
                    duration: 'N/A'
                }));
                setMeetings(mapped);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Meeting History</h1>
                    <p className="text-muted-foreground">View your past interview sessions and results</p>
                </div>
            </div>

            {/* List */}
            <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        All Sessions ({meetings.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground animate-pulse">Loading history...</p>
                        </div>
                    ) : meetings.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid gap-3">
                            {meetings.map((meeting, index) => (
                                <div
                                    key={meeting.id}
                                    className="animate-in slide-in-from-bottom-2 fade-in fill-mode-backwards"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <MeetingItem {...meeting} />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
