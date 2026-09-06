"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "../types";

export function RegisterForm() {
  const { register, isSubmitting, error } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });
    } catch {
      // Handled in useAuth hook
    }
  };

  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {displayError && (
        <div className="p-3.5 rounded-button bg-[#FDF2F2] border border-[#FDE8E8] text-[#E5484D] text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. Muhammad Ali"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      {/* Role Selection Tabs */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#152033]">Account Type</label>
        <div className="grid grid-cols-2 gap-2 bg-[#F7F8FC] p-1 rounded-button border border-[#E7EAF0]">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`h-9 text-xs font-semibold rounded-lg transition-all ${
              role === "student"
                ? "bg-white text-[#3157E8] shadow-sm border border-[#E7EAF0]"
                : "text-[#667085] hover:text-[#152033]"
            }`}
          >
            🎓 Student Portal
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`h-9 text-xs font-semibold rounded-lg transition-all ${
              role === "admin"
                ? "bg-white text-[#3157E8] shadow-sm border border-[#E7EAF0]"
                : "text-[#667085] hover:text-[#152033]"
            }`}
          >
            🛡️ Admin / Counselor
          </button>
        </div>
      </div>

      <div className="relative">
        <Input
          label="Password (min 8 characters)"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-xs font-medium text-[#667085] hover:text-[#152033]"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <Input
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        required
      />

      <div className="text-xs text-[#667085] leading-relaxed">
        By creating an account, you agree to UniCompass&apos;s{" "}
        <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#3157E8] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#3157E8] hover:underline">
          Privacy Policy
        </a>.
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full mt-2"
      >
        Create Account
      </Button>

      <div className="text-center text-sm text-[#667085] mt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#3157E8] hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
}
