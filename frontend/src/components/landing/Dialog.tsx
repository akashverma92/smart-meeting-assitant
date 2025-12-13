// this file contains the dialog component for login and signup functionality.

"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import Link from "next/link";

export default function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:from-blue-700 hover:to-indigo-700 
                     text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
          Get Started
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[380px] text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to SmartMeet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
