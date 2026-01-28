"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { interviewService } from "@/src/services/interviewService";
import { Loader2, Send, Bot, User, LogOut, Sparkles, MessageSquare, Volume2, VolumeX, Mic, MicOff } from "lucide-react";

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

    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 🗣️ Text-to-Speech Helper
    const speakText = (text: string) => {
        if (!isAudioEnabled || typeof window === 'undefined') return;

        // Cancel previous speech/timers
        window.speechSynthesis.cancel();
        if (timerRef.current) clearTimeout(timerRef.current);

        const utterance = new SpeechSynthesisUtterance(text);

        // When speech ends, start listening
        utterance.onend = () => {
            console.log("Speech ended. Starting listener...");
            startListening();
        };

        window.speechSynthesis.speak(utterance);
    };

    // Trigger Speech when AI message arrives
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === "ai") {
            speakText(lastMsg.content);
        }
    }, [messages]);

    // Initialize Speech Recognition
    const startListening = () => {
        if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) {
            console.warn("Speech recognition not supported");
            // Fallback or just ignore
            return;
        }

        // Stop any existing instance
        if (recognitionRef.current) recognitionRef.current.stop();

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            // We DON'T clear the 8s timer here. 
            // We wait for actual speech (onresult) to confirm active participation.
            // If user stays silent, the 8s timer will fire and skip.
        };

        recognition.onresult = (event: any) => {
            // Speech detected! NOW we clear the "No Speech" 8s timer
            if (timerRef.current) clearTimeout(timerRef.current);

            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result) => result.transcript)
                .join('');

            setCurrentAnswer(transcript);

            // Silence Detection: Submits 3 seconds after speech stops
            timerRef.current = setTimeout(() => {
                console.log("Silence detected (3s). Stopping & submitting...");
                recognition.stop();
                // Rely on useEffect monitoring !isListening to submit
            }, 3000);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Logic handled by useEffect below
        };

        recognitionRef.current = recognition;
        recognition.start();

        // ⏱️ Patiently wait 8 seconds for the user to START speaking
        // If no speech detected by then, we auto-skipping.
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            console.log("No speech detected for 8 seconds. Auto-skipping.");
            recognition.stop();
            handleSubmitAnswer("Pass (No response)");
        }, 8000);
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
    };

    // Auto-submit when listening stops and we have an answer
    // We use a useEffect to monitor isListening toggling off
    useEffect(() => {
        if (!isListening && currentAnswer.trim().length > 0 && !loading) {
            // Wait brief moment to ensure final transcript
            const t = setTimeout(() => {
                handleSubmitAnswer();
            }, 500);
            return () => clearTimeout(t);
        }
    }, [isListening]);

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

    const handleSubmitAnswer = async (forcedAnswer?: string) => {
        const answerText = forcedAnswer || currentAnswer;
        if (!answerText.trim()) return;

        // Clear any running timers
        if (timerRef.current) clearTimeout(timerRef.current);
        // Stop speaking
        window.speechSynthesis.cancel();

        const userMessage: Message = {
            role: "user",
            content: answerText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const answerToSubmit = answerText;
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
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setIsAudioEnabled(!isAudioEnabled);
                                    window.speechSynthesis.cancel();
                                    if (timerRef.current) clearTimeout(timerRef.current);
                                }}
                                className="ml-2 gap-2"
                            >
                                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
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

                {/* Voice Interaction Area */}
                <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center justify-center gap-6">

                        {/* Mic Visualizer */}
                        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-500 ${isListening ? "bg-red-500/10 scale-110" : "bg-primary/10"
                            }`}>
                            {isListening && (
                                <>
                                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                                    <div className="absolute inset-0 rounded-full bg-red-500/10 animate-pulse delay-75" />
                                </>
                            )}

                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={loading || isFinished}
                                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isListening
                                    ? "bg-red-500 text-white shadow-red-500/50"
                                    : "bg-primary text-white shadow-primary/50"
                                    } shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isListening ? <Mic className="h-8 w-8 animate-pulse" /> : <MicOff className="h-8 w-8" />}
                            </button>
                        </div>

                        {/* Status Text & Transcript */}
                        <div className="text-center space-y-4 max-w-2xl w-full">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">
                                    {isListening ? "Listening..." : isFinished ? "Interview Completed" : "Waiting for response..."}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isListening ? "Speak clearly now" : "Bot is speaking..."}
                                </p>
                            </div>

                            {/* Live Transcript Preview */}
                            {(currentAnswer || isListening) && (
                                <div className="p-4 rounded-xl bg-background/50 border border-border/50 min-h-[80px] flex items-center justify-center text-center">
                                    <p className="text-lg font-medium text-foreground/80 leading-relaxed">
                                        {currentAnswer || <span className="text-muted-foreground/50 italic">Your answer will appear here...</span>}
                                    </p>
                                </div>
                            )}

                            {/* Manual Controls (Backup) */}
                            <div className="flex justify-center gap-3 pt-2">
                                {/* Skip Button Removed for Professional Feel */}
                                <Button
                                    onClick={() => handleSubmitAnswer()}
                                    disabled={loading || isFinished || !currentAnswer.trim()}
                                    className="bg-primary hover:bg-primary/90 w-full max-w-xs"
                                >
                                    Done Speaking / Submit Early
                                </Button>
                            </div>
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
