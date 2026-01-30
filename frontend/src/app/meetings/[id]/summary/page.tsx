"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { meetingService } from "@/src/services/meetingService";
import { Loader2, ArrowLeft, Calendar, Clock, MessageSquare, Award, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";

export default function MeetingSummaryPage() {
    const params = useParams();
    const router = useRouter();
    const meetingId = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await meetingService.getSummary(meetingId);
                setData(res.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load summary");
            } finally {
                setLoading(false);
            }
        };

        if (meetingId) {
            fetchSummary();
        }
    }, [meetingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Generating your personalized summary...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 inline-block">
                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </div>
        );
    }

    const { meeting, answers } = data;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Actions */}
                <Button
                    variant="ghost"
                    className="gap-2 pl-0 hover:pl-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" /> Back to History
                </Button>

                {/* Overview Card */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary to-purple-600" />
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl md:text-3xl font-bold">Interview Analysis</CardTitle>
                                <p className="text-muted-foreground">Session ID: {meeting.meetingCode}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(meeting.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
                                    <Clock className="h-4 w-4" />
                                    {new Date(meeting.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    {/* Stats Row */}
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/20">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Questions Answered</p>
                                    <p className="text-2xl font-bold">{answers.length}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Completion Status</p>
                                    <p className="text-2xl font-bold capitalize ">{meeting.state.replace('_', ' ').toLowerCase()}</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Overall Performance</p>
                                    <p className="text-2xl font-bold">Good</p>
                                    {/* Placeholder, calculate real avg later */}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Q&A Timeline */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold tracking-tight">Question Breakdown</h2>
                    {answers.length === 0 ? (
                        <Card className="p-8 text-center text-muted-foreground bg-muted/20 border-border/50 border-dashed">
                            No answers recorded for this session.
                        </Card>
                    ) : (
                        answers.map((item: any, index: number) => (
                            <Card key={item._id} className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.question}</h3>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline" className="text-xs uppercase opacity-70">
                                                        {item.stage || "General"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                            <User className="h-4 w-4" /> Your Answer
                                        </h4>
                                        <div className="p-4 rounded-xl bg-background border text-sm leading-relaxed whitespace-pre-wrap">
                                            {item.answer}
                                        </div>
                                    </div>

                                    {/* AI Feedback Section */}
                                    {(item.aiFeedback || item.aiScore) && (
                                        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="h-4 w-4 text-indigo-500" />
                                                <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">AI Feedback</h4>
                                                {item.aiScore && (
                                                    <Badge className={`ml-auto ${item.aiScore > 7 ? 'bg-green-500' : item.aiScore > 4 ? 'bg-amber-500' : 'bg-red-500'}`}>
                                                        Score: {item.aiScore}/10
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed">
                                                {item.aiFeedback}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Simple Icon components if missing in Lucide import (Wait, I imported User/Sparkles but not defined in Lucide import line)
import { User, Sparkles } from "lucide-react";
