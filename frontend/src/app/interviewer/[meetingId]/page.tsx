"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { interviewService } from "@/src/services/interviewService";
import { Loader2, Send, Bot, User } from "lucide-react";

interface Message {
    role: "ai" | "user";
    content: string;
    timestamp: Date;
}

export default function InterviewRoomPage() {
    const params = useParams();
    const router = useRouter();
    const meetingId = params.meetingId as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch first question on mount
    useEffect(() => {
        fetchNextQuestion();
    }, []);

    const fetchNextQuestion = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await interviewService.getNextQuestion(meetingId);
            const question = response.data.question;

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: question,
                    timestamp: new Date(),
                },
            ]);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch question");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: currentAnswer,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setCurrentAnswer("");
        setLoading(true);
        setError("");

        try {
            // Submit answer
            await interviewService.submitAnswer(meetingId, currentAnswer);

            // Fetch next question
            const response = await interviewService.getNextQuestion(meetingId);
            const question = response.data.question;

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: question,
                    timestamp: new Date(),
                },
            ]);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit answer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-4">
                {/* Header */}
                <Card className="bg-card/50 backdrop-blur-md border-border/50">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            AI Interview Session
                        </CardTitle>
                    </CardHeader>
                </Card>

                {/* Messages */}
                <Card className="bg-card/50 backdrop-blur-md border-border/50 min-h-[500px] max-h-[600px] overflow-y-auto">
                    <CardContent className="p-6 space-y-4">
                        {messages.length === 0 && loading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {message.role === "ai" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${message.role === "ai"
                                            ? "bg-muted/50 border border-border/50"
                                            : "bg-primary text-primary-foreground"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <span className="text-xs opacity-70 mt-2 block">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>

                                {message.role === "user" && (
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {loading && messages.length > 0 && (
                            <div className="flex gap-3 justify-start">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div className="bg-muted/50 border border-border/50 rounded-lg p-4">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {/* Answer Input */}
                <Card className="bg-card/50 backdrop-blur-md border-border/50">
                    <CardContent className="p-4">
                        <div className="flex gap-2">
                            <Textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                className="min-h-[100px] resize-none"
                                disabled={loading}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.ctrlKey) {
                                        handleSubmitAnswer();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSubmitAnswer}
                                disabled={loading || !currentAnswer.trim()}
                                className="bg-primary hover:bg-primary/90 h-auto px-6"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Press Ctrl + Enter to submit
                        </p>
                    </CardContent>
                </Card>

                {/* End Interview Button */}
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/dashboard")}
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                        End Interview
                    </Button>
                </div>
            </div>
        </div>
    );
}
