"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E7EAF0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight text-[#152033]">
              UniCompass
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#667085]">
          <Link href="/" className="text-[#3157E8] font-semibold transition-colors">
            Home
          </Link>
          <Link href="/destinations" className="hover:text-[#152033] transition-colors flex items-center gap-1">
            Destinations
            <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <Link href="/universities" className="hover:text-[#152033] transition-colors">
            Universities
          </Link>
          <Link href="/scholarships" className="hover:text-[#152033] transition-colors">
            Scholarships
          </Link>
          <Link href="/chat" className="hover:text-[#152033] transition-colors">
            AI Advisor
          </Link>
          <Link href="/attestation" className="hover:text-[#152033] transition-colors">
            Attestation
          </Link>
        </nav>

        {/* Auth Buttons / User Avatar */}
        <div className="hidden md:flex items-center gap-3.5">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-all border border-[#E0E7FF]">
                <div className="w-7 h-7 rounded-full bg-[#3157E8] text-white flex items-center justify-center text-xs font-bold">
                  {user.full_name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-semibold text-[#152033]">{user.full_name.split(" ")[0]}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()} className="text-xs font-semibold text-[#667085] hover:text-[#E5484D]">
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button
                  type="button"
                  className="h-10 px-4 text-sm font-semibold text-[#152033] hover:text-[#3157E8] hover:bg-[#F7F8FC] rounded-xl transition-colors"
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button
                  type="button"
                  className="h-10 px-5 text-sm font-semibold text-white bg-[#3157E8] hover:bg-[#2545BE] active:scale-[0.98] rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#667085] hover:text-[#152033] rounded-lg hover:bg-gray-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white border-b border-[#E7EAF0] space-y-3">
          <Link href="/" className="block py-2 text-sm font-semibold text-[#3157E8]">
            Home
          </Link>
          <Link href="/destinations" className="block py-2 text-sm text-[#667085]">
            Destinations
          </Link>
          <Link href="/universities" className="block py-2 text-sm text-[#667085]">
            Universities
          </Link>
          <Link href="/scholarships" className="block py-2 text-sm text-[#667085]">
            Scholarships
          </Link>
          <Link href="/chat" className="block py-2 text-sm text-[#667085]">
            AI Advisor
          </Link>
          <div className="pt-3 border-t border-[#E7EAF0] flex gap-2">
            {user ? (
              <>
                <Link href="/profile" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="primary" size="sm" className="w-full rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
