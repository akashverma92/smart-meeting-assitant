"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideArrowRight } from "lucide-react";

export function AuthDialog() {
    const [activeTab, setActiveTab] = useState("login");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login clicked");
        // TODO: Implement Login Logic
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Signup clicked");
        // TODO: Implement Signup Logic
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                    Ready to Use <LucideArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold">Welcome Back</DialogTitle>
                    <DialogDescription className="text-center">
                        Sign in to your account or create a new one to get started.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-0 shadow-none">
                            <CardHeader className="px-0">
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your workspace.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-0">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="m@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">Sign In</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signup">
                        <Card className="border-0 shadow-none">
                            <CardHeader className="px-0">
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>
                                    Start your journey with Smart Meeting Assistant.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 px-0">
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input id="signup-email" type="email" placeholder="m@example.com" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input id="signup-password" type="password" required />
                                    </div>
                                    <Button type="submit" className="w-full">Create Account</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
