export type AuthProvider = "email" | "google";

export interface Organization {
  name?: string;
  logo?: string;
}

export interface User {
  id: string;
  username: string; // Matches backend
  name?: string;    // Keep for compatibility if needed
  email: string;
  authProvider: AuthProvider;

  avatarUrl?: string; // Matches backend
  profileImage?: string;
  organization?: Organization;

  role: "user" | "admin";
  onboardingCompleted: boolean;

  createdAt: string;
}
