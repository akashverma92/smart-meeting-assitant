"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

interface TopUser {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    interviewCount: number;
}

interface TopUsersListProps {
    users: TopUser[];
}

export function TopUsersList({ users }: TopUsersListProps) {
    return (
        <Card className="col-span-1 shadow-sm border-border/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Top Active Users
                </CardTitle>
                <CardDescription>Users with the most interview sessions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {users.map((user, i) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground ring-2 ring-transparent group-hover:ring-primary/20 transition-all overflow-hidden">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                                    ) : (
                                        user.username.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium leading-none group-hover:text-primary transition-colors">{user.username}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{user.interviewCount}</span>
                                <span className="text-xs text-muted-foreground">interviews</span>
                            </div>
                        </motion.div>
                    ))}

                    {(!users || users.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                            No user activity found.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
