"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import { Link as LinkIcon, Bot, History, FileText, Sparkles, Zap, Clock, FileBarChart } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ActionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    delay: string;
    onClick?: () => void;
}

const ActionCard = ({ icon: Icon, title, description, gradient, delay, onClick }: ActionCardProps) => (
    <Card
        className={cn(
            "group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm",
            "animate-in fade-in slide-in-from-bottom-8 fill-mode-backwards"
        )}
        style={{ animationDelay: delay }}
        onClick={onClick}
    >
        {/* Hover Gradient Overlay */}
        <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
            gradient
        )} />

        <div className="absolute top-0 right-0 p-4 opacity-5 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12">
            <Icon className="h-32 w-32" />
        </div>

        <div className="p-6 flex flex-col items-start gap-4 relative z-10">
            <div className={cn(
                "p-3 rounded-2xl shadow-lg border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 bg-gradient-to-br",
                gradient,
                "text-white"
            )}>
                <Icon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
                <h3 className="font-bold tracking-tight text-xl group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                    {description}
                </p>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent mt-2 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span>Explore now</span>
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </div>
        </div>
    </Card>
);

export const ActionCards = () => {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
                icon={Bot}
                title="AI Interview"
                description="Practice with our advanced AI interviewer"
                gradient="from-blue-600 to-indigo-600"
                delay="0ms"
                onClick={() => router.push('/interviewer')}
            />
            <ActionCard
                icon={Zap}
                title="Join Meeting"
                description="Enter code to join an existing session"
                gradient="from-purple-600 to-pink-600"
                delay="100ms"
            />
            <ActionCard
                icon={Clock}
                title="History"
                description="View your past meetings and recordings"
                gradient="from-amber-500 to-orange-600"
                delay="200ms"
                onClick={() => router.push('/history')}
            />
            <ActionCard
                icon={FileBarChart}
                title="Results"
                description="Detailed analytics and performance insights"
                gradient="from-emerald-500 to-teal-600"
                delay="300ms"
            />
        </div>
    );
};
