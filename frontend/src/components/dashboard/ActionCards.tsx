import React from 'react';
import { Card } from '@/src/components/ui/card';
import { Video, Link as LinkIcon, Bot, History } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ActionCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    colorClass: string;
    onClick?: () => void;
}

const ActionCard = ({ icon: Icon, title, description, colorClass, onClick }: ActionCardProps) => (
    <Card
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-border/50 bg-gradient-to-br from-card to-card/50"
        onClick={onClick}
    >
        <div className={cn("absolute top-0 right-0 p-4 opacity-10 transition-transform duration-500 group-hover:scale-110", colorClass)}>
            <Icon className="h-24 w-24" />
        </div>

        <div className="p-6 flex flex-col items-start gap-4">
            <div className={cn("p-3 rounded-xl bg-background shadow-sm border", colorClass)}>
                <Icon className="h-6 w-6" />
            </div>

            <div className="space-y-1">
                <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    </Card>
);

export const ActionCards = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
                icon={Video}
                title="Start Meeting"
                description="Create a new instant meeting"
                colorClass="text-blue-600 dark:text-blue-400"
            />
            <ActionCard
                icon={LinkIcon}
                title="Join Meeting"
                description="Enter code to join"
                colorClass="text-purple-600 dark:text-purple-400"
            />
            <ActionCard
                icon={Bot}
                title="AI Interview"
                description="Practice with AI interviewer"
                colorClass="text-indigo-600 dark:text-indigo-400"
            />
            <ActionCard
                icon={History}
                title="History"
                description="View past meetings"
                colorClass="text-amber-600 dark:text-amber-400"
            />
        </div>
    );
};
