"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Search, ArrowLeft, ChevronLeft, ChevronRight, PenTool } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

interface Meeting {
    _id: string;
    meetingCode: string;
    state: string;
    createdAt: string;
    adminScore?: number;
    createdBy: {
        _id: string;
        username: string;
        email: string;
        avatarUrl?: string;
    };
}

interface PaginationState {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function MarksPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchMeetings = useCallback(async () => {
        if (!user || user.role !== "admin") return;

        try {
            setLoading(true);
            const res = await adminService.getCompletedMeetings(pagination.page, pagination.limit, debouncedSearch);
            if (res.data && res.data.data) {
                setMeetings(res.data.data);
                setPagination(prev => ({
                    ...prev,
                    total: res.data.pagination.total,
                    totalPages: res.data.pagination.totalPages
                }));
            } else {
                setMeetings([]);
            }
        } catch (error) {
            console.error("Failed to fetch meetings", error);
        } finally {
            setLoading(false);
        }
    }, [user, pagination.page, pagination.limit, debouncedSearch]);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace(user ? "/dashboard" : "/auth/login");
            return;
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    if (authLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-muted-foreground animate-pulse">Loading...</p>
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
                    <h2 className="text-3xl font-bold tracking-tight">Marks & Evaluation</h2>
                    <p className="text-muted-foreground">Review completed interviews and assign scores.</p>
                </div>
            </div>

            <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Interview Sessions</CardTitle>
                            <CardDescription>
                                Showing {meetings.length} of {pagination.total} completed sessions
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by user or email..."
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
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Score</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="h-64 text-center">
                                            <div className="flex justify-center items-center h-full">
                                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : meetings.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No completed interviews found.
                                        </td>
                                    </tr>
                                ) : (
                                    meetings.map((meeting, i) => (
                                        <motion.tr
                                            key={meeting._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b transition-colors hover:bg-muted/50"
                                        >
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden ring-2 ring-transparent">
                                                        {meeting.createdBy?.avatarUrl ? (
                                                            <img
                                                                src={meeting.createdBy.avatarUrl}
                                                                alt={meeting.createdBy.username}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-xs">
                                                                {meeting.createdBy?.username?.substring(0, 2).toUpperCase() || "??"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground">{meeting.createdBy?.username || "Unknown"}</div>
                                                        <div className="text-xs text-muted-foreground">{meeting.createdBy?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {format(new Date(meeting.createdAt), "PPP p")}
                                            </td>
                                            <td className="p-4 align-middle text-center font-medium">
                                                {meeting.adminScore !== undefined ? (
                                                    <Badge variant={meeting.adminScore >= 7 ? "default" : "secondary"}>
                                                        {meeting.adminScore} / 10
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Button size="sm" asChild>
                                                    <Link href={`/admin/marks/${meeting._id}`}>
                                                        <PenTool className="w-4 h-4 mr-2" />
                                                        Evaluate
                                                    </Link>
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages || loading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
