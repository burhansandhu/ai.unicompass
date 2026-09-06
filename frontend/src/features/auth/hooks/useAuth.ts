"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, LoginCredentials, RegisterCredentials } from "../types";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize and check existing session
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const cachedUser = localStorage.getItem("unicompass_user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        const freshUser = await getCurrentUser();
        if (isMounted) {
          setUser(freshUser);
          localStorage.setItem("unicompass_user", JSON.stringify(freshUser));
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials, redirectTo = "/profile") => {
      setIsSubmitting(true);
      setError(null);
      try {
        const loggedInUser = await loginUser(credentials);
        setUser(loggedInUser);
        router.push(redirectTo);
        return loggedInUser;
      } catch (err: any) {
        setError(err.message || "Login failed. Please check your credentials.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials, redirectTo = "/login?registered=true") => {
      setIsSubmitting(true);
      setError(null);
      try {
        const res = await registerUser(credentials);
        router.push(redirectTo);
        return res;
      } catch (err: any) {
        setError(err.message || "Registration failed. Please try again.");
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  return {
    user,
    isLoading,
    isSubmitting,
    error,
    setError,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
