"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { adminService } from "@/src/services/adminService";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card";
import { ArrowLeft, CheckCircle2, Bot, User, MessageSquare } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";

interface Answer {
    _id: string;
    question: string;
    answer: string;
    aiScore?: number;
    feedback?: string;
}

interface Meeting {
    _id: string;
    createdAt: string;
    adminScore?: number;
    adminFeedback?: string;
    createdBy: {
        username: string;
        email: string;
        avatarUrl?: string;
    };
}

export default function EvaluationPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);

    // Form state
    const [adminScore, setAdminScore] = useState<number | "">("");
    const [adminFeedback, setAdminFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== "admin")) {
            router.replace("/auth/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (id && user?.role === "admin") {
            const fetchData = async () => {
                try {
                    const res = await adminService.getMeetingDetails(id);
                    setMeeting(res.data.meeting);
                    setAnswers(res.data.answers);
                    if (res.data.meeting.adminScore) {
                        setAdminScore(res.data.meeting.adminScore);
                    }
                    if (res.data.meeting.adminFeedback) {
                        setAdminFeedback(res.data.meeting.adminFeedback);
                    }
                } catch (error) {
                    console.error("Failed to fetch details", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, user]);

    // Derived stats
    const aiAvgScore = useMemo(() => {
        if (!answers.length) return 0;
        const scoredAnswers = answers.filter(a => typeof a.aiScore === 'number');
        if (!scoredAnswers.length) return 0;
        const total = scoredAnswers.reduce((sum, a) => sum + (a.aiScore || 0), 0);
        return parseFloat((total / scoredAnswers.length).toFixed(1));
    }, [answers]);

    const finalScore = useMemo(() => {
        const adminVal = typeof adminScore === 'number' ? adminScore : 0;
        return parseFloat(((aiAvgScore + adminVal) / 2).toFixed(1));
    }, [aiAvgScore, adminScore]);

    const handleSubmit = async () => {
        if (typeof adminScore !== 'number' || adminScore < 0 || adminScore > 10) return;

        try {
            setSubmitting(true);
            await adminService.gradeMeeting(id, adminScore, adminFeedback);
            router.refresh();
            // Show toast or alert?
        } catch (error) {
            console.error("Failed to save evaluation", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!meeting) return <div>Meeting not found</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto p-4">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/marks"
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Evaluation Details</h2>
                    <p className="text-muted-foreground">Reviewing interview for {meeting.createdBy.username}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Info & Questions - Left Col */}
                <div className="lg:col-span-2 space-y-6">
                    {answers.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="bg-muted/30 pb-3">
                                    <div className="flex items-start gap-3">
                                        <Bot className="w-5 h-5 text-primary mt-1" />
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-medium">Question {i + 1}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{item.question}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-muted-foreground mt-1" />
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Candidate Answer</h4>
                                            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.answer}</p>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-start gap-3 bg-secondary/20 p-3 rounded-lg">
                                        <MessageSquare className="w-4 h-4 text-primary mt-1" />
                                        <div className="w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="text-sm font-semibold">AI Analysis</h4>
                                                <Badge variant="outline" className="ml-2 font-mono">
                                                    Score: {item.aiScore || 0}/10
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.feedback || "No feedback provided."}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Grading Panel - Right Col */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        <Card className="border-primary/20 shadow-lg">
                            <CardHeader className="bg-primary/5 border-b border-primary/10">
                                <CardTitle>Final Grading</CardTitle>
                                <CardDescription>Consolidate AI and Human scores</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* AI Score Display */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">AI Average Score</label>
                                    <div className="flex items-center gap-2">
                                        <div className="text-2xl font-bold">{aiAvgScore}</div>
                                        <span className="text-sm text-muted-foreground">/ 10</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/50 transition-all duration-1000"
                                            style={{ width: `${(aiAvgScore / 10) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Human Score Input */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Your Score (0-10)</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            value={adminScore}
                                            onChange={(e) => {
                                                const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                                                if (val === "" || (val >= 0 && val <= 10)) {
                                                    setAdminScore(val);
                                                }
                                            }}
                                            className="text-lg font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Feedback (Optional)</label>
                                    <Textarea
                                        value={adminFeedback}
                                        onChange={(e) => setAdminFeedback(e.target.value)}
                                        placeholder="Add your comments here..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <Separator />

                                {/* Final Score Calculation */}
                                <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                                    <span className="font-semibold text-lg">Final Grade</span>
                                    <div className="text-3xl font-black text-primary">
                                        {typeof adminScore === 'number' ? finalScore : "--"}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={submitting || typeof adminScore !== 'number'}
                                >
                                    {submitting ? "Saving..." : "Submit Evaluation"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
