import React from 'react';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { Video, UserSquare2 } from 'lucide-react';

export const PrimaryActions = () => {
    const router = useRouter();

    return (
        <div className="flex flex-wrap gap-4">
            <Button
                size="lg"
                onClick={() => router.push('/interviewer')}
                className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            >
                <Video className="mr-2 h-5 w-5" />
                Start New Mock Interview
            </Button>
        </div>
    );
};
