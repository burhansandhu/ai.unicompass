import React, { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { GoogleOAuthButton } from "@/features/auth/components/GoogleOAuthButton";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      {/* Refined Header */}
      <header className="px-6 sm:px-10 h-20 flex items-center justify-between border-b border-[#E7EAF0] bg-white sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            ✦
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#152033]">
            UniCompass
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#667085] hover:text-[#152033] hover:bg-[#F7F8FC] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <div className="h-4 w-px bg-[#E7EAF0]"></div>

          <span className="text-xs sm:text-sm text-[#667085] hidden md:inline">
            Don&apos;t have an account?
          </span>
          <Link href="/register">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl px-4 h-10 font-semibold text-xs sm:text-sm border-[#E7EAF0] text-[#152033] hover:border-[#3157E8] hover:text-[#3157E8] hover:bg-[#EEF2FF]/50 transition-all"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-card border border-[#E7EAF0] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Branding Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#172554] to-[#1E3A8A] text-white p-10 flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#3157E8]/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm border border-white/15">
                ✦ 25,000+ Students Worldwide
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-snug">
                The smart way to plan your international education.
              </h2>
              <ul className="space-y-3.5 text-sm text-blue-100">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">✓</span>
                  Official .ac.uk & .edu domain grounding
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">✓</span>
                  Live PKR tuition & living expense conversion
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">✓</span>
                  Automated reverse intake deadline timeline
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">✓</span>
                  Pakistani document attestation tracker (HEC/IBCC)
                </li>
              </ul>
            </div>

            {/* Testimonial Card */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/15 bg-white/5 p-4 rounded-2xl backdrop-blur-xs">
              <div className="flex text-amber-400 text-xs gap-0.5 mb-2">
                {"★★★★★"}
              </div>
              <p className="text-xs text-white/90 italic leading-relaxed">
                &ldquo;UniCompass removed all the confusion regarding 28-day bank statements and MOI waivers. I matched with TUM within 5 minutes.&rdquo;
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-xs">
                  H
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Hamza R.</div>
                  <div className="text-[10px] text-blue-200">MSc Informatics · Germany</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#152033] tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-[#667085] mt-1">
                  Enter your credentials to access your student dashboard
                </p>
              </div>

              {/* Social Login */}
              <GoogleOAuthButton text="Sign in with Google" />

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E7EAF0]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-[#667085] font-medium">
                    Or sign in with email
                  </span>
                </div>
              </div>

              {/* Form */}
              <Suspense fallback={<div className="h-40 flex items-center justify-center text-sm text-[#667085]">Loading...</div>}>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-4 text-center text-xs text-[#667085] border-t border-[#E7EAF0]/60 bg-white">
        © 2026 UniCompass. Trusted study-abroad planning and decision platform.
      </footer>
    </div>
  );
}
