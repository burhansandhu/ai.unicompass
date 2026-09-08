"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const { login, logout, isSubmitting } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Please enter your administrator email.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    try {
      // Login without auto-redirect to verify role first
      const user = await login({ email: email.trim(), password }, undefined);
      if (user.role !== "admin") {
        logout();
        setFormError("Access denied. This account does not have administrator privileges. Please use the Student Portal.");
        return;
      }
      router.push("/admin");
    } catch (err: any) {
      setFormError(err.message || "Invalid email or password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && (
        <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#FDE8E8] text-[#E5484D] text-sm flex items-start gap-2.5 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{formError}</span>
        </div>
      )}

      <Input
        label="Admin Email"
        type="email"
        placeholder="admin@unicompass.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-[38px] text-xs font-semibold text-[#667085] hover:text-[#152033] transition-colors"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className="w-full mt-2 rounded-xl bg-[#152033] hover:bg-[#0B132B] text-white shadow-sm font-semibold text-sm h-11"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
            Authenticating Admin...
          </span>
        ) : (
          "Sign In to Admin Portal"
        )}
      </Button>
    </form>
  );
}
