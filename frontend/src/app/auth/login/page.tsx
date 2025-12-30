"use client";

import LoginForm from "@/src/features/auth/components/LoginForm";
import Link from "next/link";
import BackgroundAnimation from "@/src/components/landing/BackgroundAnimation";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 relative flex flex-col items-center justify-center px-4">
      <BackgroundAnimation />

      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        <LoginForm />

        <p className="mt-6 text-sm text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
            Register
          </Link>
        </p>
      </main>
    </div>
  );
}
