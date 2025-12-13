"use client";

import RegisterForm from "@/src/features/auth/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <RegisterForm />

      <p className="mt-6 text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-400 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
