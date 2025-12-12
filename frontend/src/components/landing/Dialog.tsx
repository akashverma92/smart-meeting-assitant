// this file contains the dialog component for login and signup functionality.

"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { LucideArrowRight } from "lucide-react";

export default function AuthDialog() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Get Started <LucideArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Choose an option to continue.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN UI */}
          <TabsContent value="login">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to continue.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>

                <Button className="w-full">
                  Continue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGNUP UI */}
          <TabsContent value="signup">
            <Card className="border-0 shadow-none">
              <CardHeader className="px-0">
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Create your SmartMeet workspace.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-0">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="you@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" />
                </div>

                <Button className="w-full">
                  Create Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
