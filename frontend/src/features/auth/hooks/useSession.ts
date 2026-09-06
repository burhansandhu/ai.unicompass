"use client";

import { useAuth } from "./useAuth";

export function useSession() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  return {
    user,
    isLoading,
    isAuthenticated,
    isStudent: user?.role === "student",
    isAdmin: user?.role === "admin",
    logout,
  };
}
