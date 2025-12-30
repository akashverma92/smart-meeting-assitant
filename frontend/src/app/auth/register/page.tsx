"use client";

import RegisterForm from "@/src/features/auth/components/RegisterForm";
import Link from "next/link";
import BackgroundAnimation from "@/src/components/landing/BackgroundAnimation";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 relative flex flex-col items-center justify-center px-4">
      <BackgroundAnimation />

      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        <RegisterForm />

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-400 hover:underline hover:text-blue-300 transition-colors">
            Login
          </Link>
        </p>
      </main>
    </div>
  );
}
