"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

/**
 * NavBarHeader
 * - Left: logo + greeting message
 * - Right: profile avatar button. Clicking opens a dropdown that shows user email and a Logout button.
 *
 * Notes:
 * - The component assumes you have a logo at /logo.png and a default avatar at /default-avatar.png.
 * - Keeps the waving emoji animation via `animate-wave` class.
 */
export const NavBarHeader: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // close dropdown on outside click or Escape
  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex items-center justify-between gap-4 w-full bg-card/50 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Left: Logo + Greeting */}
      <div className="flex items-center gap-4">
        <div className="relative group w-12 h-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Image
            src="/logo.png"
            alt="App logo"
            width={48}
            height={48}
            priority
            className="relative h-12 w-12 rounded-lg object-cover bg-background"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {greeting}, {user?.username || "User"}
            </span>
            <span className="animate-wave inline-block origin-[70%_70%] hover:animate-spin cursor-default">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ready to ace your next interview?
          </p>
        </div>
      </div>

      {/* Right: Profile button + dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <div className="relative w-9 h-9">
            <Image
              src={user?.avatarUrl || "/default-avatar.png"}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
          </div>
          {/* optional small chevron */}
          <svg
            className="h-4 w-4 text-muted-foreground"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-50">
            <div className="px-4 py-3">
              <div className="text-sm font-medium text-foreground">
                {user?.username || "User"}
              </div>
              <div className="text-xs text-muted-foreground break-all">
                {user?.email || "No email available"}
              </div>
            </div>

            <div className="border-t px-2 py-2">
              <button
                onClick={() => {
                  setOpen(false);
                  logoutUser();
                }}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
