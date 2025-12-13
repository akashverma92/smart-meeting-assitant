export type AuthProvider = "email" | "google";

export interface Organization {
  name?: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  authProvider: AuthProvider;

  profileImage?: string;
  organization?: Organization;

  role: "individual";
  onboardingCompleted: boolean;

  createdAt: string;
}
