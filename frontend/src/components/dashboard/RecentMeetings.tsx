import React, { useEffect, useState } from 'react';
import { MeetingItem } from './MeetingItem';
import { EmptyState } from './EmptyState';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { meetingService } from '@/src/services/meetingService';

import { useRouter } from 'next/navigation';

export const RecentMeetings = () => {
    const router = useRouter();
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await meetingService.getHistory();
                // Transform to match item
                const mapped = res.data.meetings.map((m: any) => ({
                    id: m._id,
                    title: `Session ${m.meetingCode}`,
                    date: new Date(m.createdAt).toLocaleDateString() + ' ' + new Date(m.createdAt).toLocaleTimeString(),
                    type: 'interview', // Currently only interviews
                    duration: 'N/A' // Need to track duration later
                }));
                setMeetings(mapped);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;

    const hasMeetings = meetings.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Recent Meetings</h2>
                {hasMeetings && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => router.push('/history')}
                    >
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>

            {!hasMeetings ? (
                <EmptyState />
            ) : (
                <div className="grid gap-3">
                    {meetings.slice(0, 5).map((meeting) => (
                        <MeetingItem key={meeting.id} {...meeting} />
                    ))}
                </div>
            )}
        </div>
    );
};
