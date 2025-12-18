"use client";

import React from "react";
import { useAuth } from "@/src/hooks/useAuth";

export const NavBarHeader = () => {
  const { user, logoutUser } = useAuth();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Welcome Message */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Welcome back, {user?.username || "User"}{" "}
          <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Ready to start a smart meeting?
        </p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutUser}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};
