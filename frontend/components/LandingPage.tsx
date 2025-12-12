"use client";

import { AuthDialog } from "@/components/AuthDialog";
import { Copy, Mic, Video, BrainCircuit } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BrainCircuit className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        SmartMeet
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#about" className="hover:text-white transition-colors">About</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div>
                    {/* Placeholder for small login button if needed, but main CTA is in Hero */}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-32 text-center sm:pt-32">
                <div className="inline-flex items-center px-3 py-1 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                    🚀 AI-Powered Meetings 2.0
                </div>

                <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        Meetings that
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Actually Matter.
                    </span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
                    Transform your interviews and team syncs with real-time transcription,
                    AI-driven insights, and automated action items.
                    Stop taking notes, start making decisions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <AuthDialog />
                    <button className="px-8 py-3 rounded-md text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
                        View API Docs
                    </button>
                </div>

                {/* Feature Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                    <FeatureCard
                        icon={<Video className="w-6 h-6 text-blue-400" />}
                        title="Crystal Clear Video"
                        description="High-definition video calling powered by WebRTC."
                    />
                    <FeatureCard
                        icon={<Mic className="w-6 h-6 text-indigo-400" />}
                        title="Real-time AI Audio"
                        description="Live transcription and smart audio processing."
                    />
                    <FeatureCard
                        icon={<Copy className="w-6 h-6 text-purple-400" />}
                        title="Smart Summaries"
                        description="Automated meeting minutes and action item extraction."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors backdrop-blur-sm">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
