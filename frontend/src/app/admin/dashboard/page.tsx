"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { meetingService } from "@/src/services/meetingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Loader2, LayoutDashboard, FileText, Play } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";

export default function AdminDashboard() {
    const router = useRouter();
    // User useAuth to ensure auto-fetch on reload
    const { user, loading: authLoading } = useAuth(); // Was useSelector before
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && user) {
            if (user.role !== "admin") {
                router.replace("/dashboard");
            } else {
                fetchAllMeetings();
            }
        } else if (!authLoading && !user) {
            router.replace("/auth/login");
        }
    }, [user, authLoading, router]);

    const fetchAllMeetings = async () => {
        try {
            const res = await meetingService.getAllMeetings();
            setMeetings(res.data.meetings);
        } catch (error) {
            console.error("Failed to fetch meetings", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        return null; // Don't render anything while redirecting
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Monitor and evaluate interview sessions</p>
                    </div>
                    <Button onClick={() => router.push("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" /> User View
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Interviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="h-12 px-4 text-left font-medium">Date</th>
                                        <th className="h-12 px-4 text-left font-medium">Candidate</th>
                                        <th className="h-12 px-4 text-left font-medium">Meeting ID</th>
                                        <th className="h-12 px-4 text-left font-medium">Status</th>
                                        <th className="h-12 px-4 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meetings.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                No meetings found.
                                            </td>
                                        </tr>
                                    ) : (
                                        meetings.map((meeting) => (
                                            <tr key={meeting._id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="p-4 align-middle">
                                                    {new Date(meeting.createdAt).toLocaleDateString()}
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(meeting.createdAt).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle font-medium">
                                                    {meeting.createdBy?.username || "Unknown"}
                                                    <div className="text-xs text-muted-foreground">{meeting.createdBy?.email}</div>
                                                </td>
                                                <td className="p-4 align-middle font-mono text-xs">
                                                    {meeting.meetingCode}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge variant={meeting.state === 'COMPLETED' ? 'default' : 'secondary'}>
                                                        {meeting.state.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => router.push(`/meetings/${meeting._id}/summary`)}
                                                        >
                                                            <FileText className="h-4 w-4 mr-1" /> Report
                                                        </Button>
                                                        {meeting.state !== 'COMPLETED' ? (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => router.push(`/interviewer/${meeting._id}`)}
                                                            >
                                                                <Play className="h-4 w-4 mr-1" /> Join
                                                            </Button>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
