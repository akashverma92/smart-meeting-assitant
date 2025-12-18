import React from 'react';
import { Button } from '@/src/components/ui/button';
import { FileText, Calendar, Clock } from 'lucide-react';

interface MeetingItemProps {
    id: string;
    title: string;
    date: string;
    type: 'meeting' | 'interview';
    duration?: string;
}

export const MeetingItem = ({ id, title, date, type, duration }: MeetingItemProps) => {
    return (
        <div className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg ${type === 'interview' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                    {type === 'interview' ? <FileText className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                </div>

                <div className="space-y-1">
                    <h4 className="font-medium leading-none text-base group-hover:text-primary transition-colors">{title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{date}</span>
                        {duration && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {duration}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                View Summary
            </Button>
        </div>
    );
};
