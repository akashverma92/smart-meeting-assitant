"use client";

import LoginForm from "@/src/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <LoginForm />

      <p className="mt-6 text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link href="/auth/register" className="text-blue-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
