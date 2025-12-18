import React from 'react';
import { MeetingItem } from './MeetingItem';
import { EmptyState } from './EmptyState';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export const RecentMeetings = () => {
    // Mock data for demonstration - in real app this would come from props or a query
    const meetings = [
        {
            id: '1',
            title: 'Project Sync',
            date: 'Yesterday, 2:00 PM',
            type: 'meeting' as const,
            duration: '45 min'
        },
        {
            id: '2',
            title: 'Mock Interview',
            date: '2 days ago',
            type: 'interview' as const,
            duration: '30 min'
        }
    ];

    const hasMeetings = meetings.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Recent Meetings</h2>
                {hasMeetings && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>

            {!hasMeetings ? (
                <EmptyState />
            ) : (
                <div className="grid gap-3">
                    {meetings.map((meeting) => (
                        <MeetingItem key={meeting.id} {...meeting} />
                    ))}
                </div>
            )}
        </div>
    );
};
