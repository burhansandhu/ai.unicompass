import React from "react";
import Link from "next/link";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      {/* Refined Header (h-20) */}
      <header className="px-6 sm:px-10 h-20 flex items-center justify-between border-b border-[#E7EAF0] bg-white sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#152033] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            ✦
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight text-[#152033]">
              UniCompass
            </span>
          </div>
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

          <Link
            href="/login"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#3157E8] hover:bg-[#EEF2FF] transition-colors"
          >
            <span>Student Portal →</span>
          </Link>
        </div>
      </header>

      {/* Main Split Authentication Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-[#E7EAF0] shadow-sm bg-white min-h-[500px]">
          {/* Left Dark Showcase Panel */}
          <div className="bg-[#0B132B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#3157E8]/15 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#48CAE4]/10 blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold mb-6 border border-white/10">
                <span>🛡️</span> Counselor & Admin Central
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug mb-4">
                Manage UniCompass Platform & Knowledge
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Secure access for authorized administrators, educational counselors, and content editors to manage articles, student inquiries, and system knowledge.
              </p>
            </div>

            <div className="relative z-10 pt-8 space-y-3 border-t border-white/10">
              <div className="flex items-center gap-3 text-xs text-white/80">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Publish & curate country guides and scholarships</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Oversee student application timelines and attestations</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/80">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">✓</span>
                <span>Audit official grounding domains & reverse engine data</span>
              </div>
            </div>
          </div>

          {/* Right Authentication Form */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
                <span>🔒</span> Restricted Staff Access
              </div>
              <h1 className="text-2xl font-bold text-[#152033] tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-sm text-[#667085] mt-1">
                Enter your authorized administrator credentials to proceed.
              </p>
            </div>

            <AdminLoginForm />

            <div className="mt-6 pt-4 border-t border-[#E7EAF0] text-center">
              <p className="text-xs text-[#667085]">
                Are you a prospective student?{" "}
                <Link href="/login" className="text-[#3157E8] font-bold hover:underline">
                  Sign in through Student Portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-[#667085] border-t border-[#E7EAF0] bg-white">
        © {new Date().getFullYear()} UniCompass Education Consultancy. Authorized personnel only.
      </footer>
    </div>
  );
}
