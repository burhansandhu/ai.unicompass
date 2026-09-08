"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isJustRegistered = searchParams.get("registered") === "true";

  const { login, isSubmitting, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Please enter both your email and password.");
      return;
    }

    try {
      const user = await login({ email, password }, undefined);
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }
    } catch {
      // Error handled in hook
    }
  };

  const displayError = formError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isJustRegistered && !displayError && (
        <div className="p-3.5 rounded-button bg-[#EAF8F1] border border-[#C6F0D8] text-[#16A36A] text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}

      {displayError && (
        <div className="p-3.5 rounded-button bg-[#FDF2F2] border border-[#FDE8E8] text-[#E5484D] text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
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
          className="absolute right-3 top-[38px] text-xs font-medium text-[#667085] hover:text-[#152033]"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer text-[#667085]">
          <input
            type="checkbox"
            className="w-4 h-4 rounded text-[#3157E8] border-[#E7EAF0] focus:ring-[#3157E8]"
          />
          <span>Remember me</span>
        </label>
        <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset link will be sent to your email."); }} className="font-medium text-[#3157E8] hover:underline">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        isLoading={isSubmitting}
        className="w-full mt-2"
      >
        Sign In
      </Button>

      <div className="text-center text-sm text-[#667085] mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#3157E8] hover:underline">
          Create an account
        </Link>
      </div>

      <div className="text-center text-xs text-[#667085] pt-3 border-t border-[#E7EAF0]/60">
        Administrator or Counselor?{" "}
        <Link href="/admin/login" className="font-semibold text-[#152033] hover:text-[#3157E8] hover:underline">
          Sign In Here →
        </Link>
      </div>
    </form>
  );
}
