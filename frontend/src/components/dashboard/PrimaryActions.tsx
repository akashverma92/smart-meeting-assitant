import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Video, UserSquare2 } from 'lucide-react';

export const PrimaryActions = () => {
    return (
        <div className="flex flex-wrap gap-4">
            <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <Video className="mr-2 h-5 w-5" />
                Start Meeting
            </Button>

            <Button
                variant="outline"
                size="lg"
                className="bg-card hover:bg-accent border-primary/20 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
                <UserSquare2 className="mr-2 h-5 w-5 text-indigo-600" />
                AI Interview
            </Button>
        </div>
    );
};
