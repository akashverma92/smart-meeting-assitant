"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { interviewService } from "@/src/services/interviewService";
import { Loader2, Send, Bot, User, LogOut, Sparkles, MessageSquare } from "lucide-react";

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
    const [isTyping, setIsTyping] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Prevent double fetch in strict mode
    const initialFetchDone = useRef(false);

    // Fetch first question on mount
    useEffect(() => {
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
            fetchNextQuestion();
        }
    }, []);

    const fetchNextQuestion = async () => {
        setLoading(true);
        setIsTyping(true);
        setError("");

        try {
            // Simulate typing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));

            const response = await interviewService.getNextQuestion(meetingId);

            if (response.data.finished) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        content: response.data.message || "Interview completed. Thank you for your time!",
                        timestamp: new Date(),
                    },
                ]);
                setIsFinished(true);
                return;
            }

            const question = response.data.question;

            setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === "ai" && lastMsg.content === question) {
                    return prev;
                }
                return [
                    ...prev,
                    {
                        role: "ai",
                        content: question,
                        timestamp: new Date(),
                    },
                ];
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to fetch question");
        } finally {
            setLoading(false);
            setIsTyping(false);
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
        const answerToSubmit = currentAnswer;
        setCurrentAnswer("");
        setLoading(true);
        setIsTyping(true);
        setError("");

        try {
            // Submit answer
            await interviewService.submitAnswer(meetingId, answerToSubmit);

            // Simulate AI thinking time
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Fetch next question
            const response = await interviewService.getNextQuestion(meetingId);

            if (response.data.finished) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        content: response.data.message || "Interview completed. Thank you for your time!",
                        timestamp: new Date(),
                    },
                ]);
                setIsFinished(true);
                return;
            }

            const question = response.data.question;

            setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === "ai" && lastMsg.content === question) {
                    return prev;
                }
                return [
                    ...prev,
                    {
                        role: "ai",
                        content: question,
                        timestamp: new Date(),
                    },
                ];
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit answer");
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-5xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                                        AI Interview Session
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Answer thoughtfully and take your time
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push("/dashboard")}
                                className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                End Interview
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Messages Container */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
                    <CardContent
                        ref={chatContainerRef}
                        className="p-6 space-y-6 min-h-[500px] max-h-[600px] overflow-y-auto scroll-smooth"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'hsl(var(--primary) / 0.3) transparent'
                        }}
                    >
                        {messages.length === 0 && loading && (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                                        <Bot className="h-8 w-8 text-primary" />
                                    </div>
                                    <Sparkles className="h-5 w-5 text-primary absolute -top-1 -right-1 animate-ping" />
                                </div>
                                <p className="text-muted-foreground animate-pulse">AI is preparing your first question...</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex gap-3 animate-in slide-in-from-bottom-2 fade-in duration-500 ${message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {message.role === "ai" && (
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-primary/10">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${message.role === "ai"
                                        ? "bg-gradient-to-br from-muted/80 to-muted/50 border border-border/50"
                                        : "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                                        }`}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    <span className="text-xs opacity-60 mt-2 block">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {message.role === "user" && (
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center ring-2 ring-primary/20">
                                        <User className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-2 fade-in">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center ring-2 ring-primary/10">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div className="bg-gradient-to-br from-muted/80 to-muted/50 border border-border/50 rounded-2xl p-4 shadow-lg">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in slide-in-from-top-2 backdrop-blur-sm">
                        <p className="font-medium">⚠️ {error}</p>
                    </div>
                )}

                {/* Answer Input */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl">
                    <CardContent className="p-4">
                        <div className="flex gap-3">
                            <Textarea
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                placeholder={isFinished ? "Interview completed." : "Type your answer here... (Ctrl + Enter to submit)"}
                                className="min-h-[120px] resize-none border-border/50 focus:border-primary/50 transition-colors bg-background/50"
                                disabled={loading || isFinished}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && e.ctrlKey) {
                                        e.preventDefault();
                                        handleSubmitAnswer();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSubmitAnswer}
                                disabled={loading || !currentAnswer.trim() || isFinished}
                                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-auto px-8 shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                                )}
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <kbd className="px-2 py-0.5 rounded bg-muted text-xs">Ctrl</kbd>
                                <span>+</span>
                                <kbd className="px-2 py-0.5 rounded bg-muted text-xs">Enter</kbd>
                                <span>to submit</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {currentAnswer.length} characters
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx global>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce {
                    animation: bounce 1s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
