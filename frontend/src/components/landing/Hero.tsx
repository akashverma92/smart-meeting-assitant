"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <div className="inline-flex items-center px-3 py-1 mb-8 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
        AI-Powered Meetings 1.0.0
      </div>

      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
        <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Interviews
        </span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          Reimagined with AI.
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed">
        Experience AI-led interviews designed to assess, guide, and improve your skills through intelligent questioning and structured evaluation.
        Focus on your answers — the AI takes care of the rest.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link href="/auth/login" className="px-8 py-3 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
          Get Started
        </Link>
        <button className="px-8 py-3 rounded-md text-sm font-medium text-gray-300 hover:text-white border border-white/10 hover:bg-white/5 transition-all">
          View API Docs
        </button>
      </div>
    </>
  );
}
