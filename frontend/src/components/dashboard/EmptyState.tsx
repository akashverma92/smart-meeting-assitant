import React from 'react';
import { CalendarX2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-xl border-muted bg-muted/20">
            <div className="p-4 rounded-full bg-background mb-4 shadow-sm">
                <CalendarX2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No meetings yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
                Your meeting history will appear here once you complete your first session.
            </p>
            <Button variant="outline">Schedule a Meeting</Button>
        </div>
    );
};
