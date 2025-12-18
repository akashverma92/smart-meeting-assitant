"use client";

import React, { useEffect } from "react";
import { NavBarHeader } from "@/src/components/navbar/NavBarHeader";
import { PrimaryActions } from "@/src/components/dashboard/PrimaryActions";
import { ActionCards } from "@/src/components/dashboard/ActionCards";
import { RecentMeetings } from "@/src/components/dashboard/RecentMeetings";
import { useAuth } from "@/src/hooks/useAuth";
import { authService } from "@/src/services/authService";

export default function DashboardPage() {
  const { fetchUser, logoutUser } = useAuth();

  // Silent token refresh logic
  const refreshTokenAndFetch = async () => {
    try {
      await authService.me(); // Try fetching user
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Access token expired
        try {
          await authService.refresh(); // Call refresh endpoint
          await fetchUser(); // Retry fetching user
        } catch {
          logoutUser(); // If refresh fails, log out
        }
      }
    }
  };

  useEffect(() => {
    refreshTokenAndFetch();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="space-y-6">
        <NavBarHeader />
        <PrimaryActions />
      </section>

      {/* Main Content Area */}
      <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ActionCards />
        <div className="pt-4">
          <RecentMeetings />
        </div>
      </section>
    </div>
  );
}
