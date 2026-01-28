"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { meetingService } from "@/src/services/meetingService";
import { Upload, Loader2, ArrowRight, FileText, CheckCircle2, Sparkles, Brain, Target, TrendingUp, X } from "lucide-react";

export default function InterviewerPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 🗣️ Speak welcome message
    useEffect(() => {
        const welcomeText = "Welcome! To begin your interview, please upload your resume.";
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(welcomeText);
            // Optional: Select a better voice
            // const voices = window.speechSynthesis.getVoices();
            // utterance.voice = voices.find(v => v.lang.includes('en')) || null;
            window.speechSynthesis.cancel(); // specific safety
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Please upload a PDF file");
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "application/pdf") {
                setFile(droppedFile);
                setError("");
            } else {
                setError("Please upload a PDF file");
            }
        }
    };

    const handleStartInterview = async () => {
        if (!file) {
            setError("Please upload your resume first");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Step 1: Start meeting
            const meetingResponse = await meetingService.startMeeting();
            const { meetingId: newMeetingId } = meetingResponse.data;
            setMeetingId(newMeetingId);

            // Step 2: Upload resume
            await meetingService.uploadResume(newMeetingId, file);

            // Step 3: Navigate to interview room
            router.push(`/interviewer/${newMeetingId}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to start interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-8 lg:p-12 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-5xl w-full relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm font-medium text-primary">AI-Powered Interview Practice</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent animate-gradient">
                        Start Your AI Interview
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Upload your resume and let our advanced AI interviewer help you prepare for your dream job
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Section */}
                    <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Upload className="h-6 w-6 text-primary" />
                                Upload Resume
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Drag and Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`
                                    relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
                                    ${isDragging
                                        ? "border-primary bg-primary/10 scale-105"
                                        : file
                                            ? "border-green-500 bg-green-500/5"
                                            : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                                    }
                                `}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                {!file ? (
                                    <div className="text-center space-y-4">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Upload className={`h-8 w-8 text-primary ${isDragging ? "animate-bounce" : ""}`} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold mb-1">
                                                {isDragging ? "Drop your resume here" : "Drag & drop your resume"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                or click to browse (PDF only)
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                        <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                <p className="font-semibold truncate max-w-[250px]">{file.name}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile();
                                            }}
                                            className="text-destructive hover:text-destructive/80"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Remove
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                onClick={handleStartInterview}
                                disabled={loading || !file}
                                className="w-full bg-gradient-to-r from-primary via-purple-600 to-primary hover:from-primary/90 hover:via-purple-600/90 hover:to-primary/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Preparing Interview...
                                    </>
                                ) : (
                                    <>
                                        Start Interview
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Features Section */}
                    <div className="space-y-4">
                        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-xl border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary/20 group-hover:scale-110 transition-transform duration-300">
                                        <Brain className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">AI-Powered Analysis</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Our AI analyzes your resume to ask relevant, personalized questions tailored to your experience
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/10 to-primary/10 backdrop-blur-xl border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <Target className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Real-Time Feedback</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Get instant feedback on your answers to improve your interview performance
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border-amber-500/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Track Your Progress</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Monitor your improvement over time with detailed analytics and insights
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
