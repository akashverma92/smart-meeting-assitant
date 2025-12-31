"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { meetingService } from "@/src/services/meetingService";
import { Upload, Loader2, ArrowRight } from "lucide-react";

export default function InterviewerPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [meetingId, setMeetingId] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError("");
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

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12 flex items-center justify-center">
            <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-md border-border/50 shadow-xl">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        AI Interview
                    </CardTitle>
                    <p className="text-center text-muted-foreground">
                        Upload your resume to start practicing with our AI interviewer
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="resume" className="text-base font-medium">
                            Upload Resume (PDF)
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input
                                id="resume"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                            />
                            {file && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Upload className="h-4 w-4" />
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleStartInterview}
                        disabled={loading || !file}
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Starting Interview...
                            </>
                        ) : (
                            <>
                                Start Interview
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>

                    <div className="pt-4 border-t border-border/50">
                        <h3 className="font-semibold mb-2">What to expect:</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>AI will analyze your resume and ask relevant questions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Practice answering technical and behavioral questions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Get real-time feedback on your responses</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
