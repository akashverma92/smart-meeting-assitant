// "use client";

// import React from "react";
// import { useAuth } from "@/src/hooks/useAuth";

// export const NavBarHeader = () => {
//   const { user, logoutUser } = useAuth();

//   return (
//     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//       {/* Welcome Message */}
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
//           Welcome back, {user?.username || "User"}{" "}
//           <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
//         </h1>
//         <p className="text-muted-foreground text-sm md:text-base">
//           Ready to start a smart meeting?
//         </p>
//       </div>

//       {/* Logout Button */}
//       <button
//         onClick={logoutUser}
//         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";

/**
 * NavBarHeader
 * - Left: logo + greeting message
 * - Right: profile avatar button. Clicking opens a dropdown that shows user email and a Logout button.
 * - Removed the standalone logout button from the header.
 *
 * Notes:
 * - The component assumes you have a logo at /logo.png and a default avatar at /default-avatar.png.
 * - Keeps the waving emoji animation via `animate-wave` class (add CSS in global stylesheet if missing).
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

  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Left: Logo + Greeting */}
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="App logo"
          className="h-10 w-10 rounded-md object-cover"
        />

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome back, {user?.username || "User"}{" "}
            <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Ready to start a smart meeting?
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
          <img
            src={user?.avatarUrl || "/default-avatar.png"}
            alt="Profile"
            className="h-9 w-9 rounded-full object-cover"
          />
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
