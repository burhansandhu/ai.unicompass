"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Compass,
  GraduationCap,
  Sparkles,
  Loader2,
  BookmarkCheck,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Program, ProgramFilterState } from "@/features/discovery/types";
import { getPrograms, toggleShortlist } from "@/features/discovery/api";
import { ProgramCard } from "@/features/discovery/components/ProgramCard";
import { ProgramFilterSidebar } from "@/features/discovery/components/ProgramFilterSidebar";

export default function UniversitiesDiscoveryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<ProgramFilterState>({
    search: "",
    country_slug: undefined,
    degree_level: undefined,
    discipline: undefined,
    max_budget_pkr: undefined,
    moi_only: false,
    match_my_profile: false,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPrograms = async (currentFilters: ProgramFilterState) => {
    setIsLoading(true);
    try {
      const data = await getPrograms(currentFilters);
      setPrograms(data);
    } catch (err) {
      console.error("Failed to load programs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrograms(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleToggleShortlist = async (programId: number): Promise<boolean> => {
    if (!user) {
      setToastMessage("Please log in to shortlist programs to your dashboard.");
      setTimeout(() => setToastMessage(null), 3500);
      return false;
    }
    try {
      const res = await toggleShortlist(programId);
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000);
      return res.shortlisted;
    } catch (err) {
      console.error("Error shortlisting program", err);
      return false;
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      country_slug: undefined,
      degree_level: undefined,
      discipline: undefined,
      max_budget_pkr: undefined,
      moi_only: false,
      match_my_profile: false,
    });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin" />
          <span className="text-xs text-[#667085] font-medium">Loading university discovery...</span>
        </div>
      </div>
    );
  }

  const renderToast = () => (
    toastMessage ? (
      <div className="fixed bottom-6 right-6 z-50 bg-[#152033] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5">
        <BookmarkCheck className="w-4 h-4 text-[#3157E8]" />
        <span>{toastMessage}</span>
        {!user && (
          <Link
            href="/login"
            className="text-[#48CAE4] underline hover:text-white ml-1.5 font-bold"
          >
            Log In →
          </Link>
        )}
      </div>
    ) : null
  );

  const renderDiscoveryGrid = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Filter Sidebar */}
      <aside className="lg:col-span-4 sticky top-24">
        <ProgramFilterSidebar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          isLoggedIn={!!user}
          totalMatches={programs.length}
        />
      </aside>

      {/* Right Column: Program Cards Catalog */}
      <section className="lg:col-span-8 space-y-4">
        {/* Top Bar: Count & Active Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm text-xs">
          <div className="text-slate-600">
            Found <strong className="text-[#152033] font-bold text-sm">{programs.length}</strong> matching programs
            {filters.country_slug && (
              <span className="ml-1 text-[#3157E8] font-semibold">in {filters.country_slug}</span>
            )}
            {filters.moi_only && (
              <span className="ml-1 text-emerald-600 font-semibold">(MOI Waiver only)</span>
            )}
          </div>

          {isLoading && (
            <div className="flex items-center gap-1.5 text-xs text-[#3157E8] font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </div>
          )}
        </div>

        {/* Program Cards Grid */}
        {isLoading && programs.length === 0 ? (
          <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center">
            <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin mx-auto mb-3" />
            <p className="text-xs sm:text-sm text-[#667085]">
              Calculating Pakistani eligibility and converting PKR costs...
            </p>
          </div>
        ) : programs.length > 0 ? (
          <div className="space-y-4">
            {programs.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onToggleShortlist={handleToggleShortlist}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#3157E8] flex items-center justify-center mx-auto text-xl">
              🔍
            </div>
            <div>
              <h3 className="text-base font-bold text-[#152033]">No programs match your exact filters</h3>
              <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                Try relaxing your budget filter in PKR or clearing specific country selections to see more available options.
              </p>
            </div>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset All Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );

  // Authenticated Student Layout (Shows Dashboard Sidebar)
  if (user) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex">
        {/* Unified Student Dashboard Sidebar */}
        <Sidebar activeTab="universities" />

        {/* Main Content Dashboard Area */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top Header Bar */}
          <header className="h-20 bg-white border-b border-[#E7EAF0] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#3157E8] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  ✦
                </div>
                <span className="font-bold text-base text-[#152033]">UniCompass</span>
              </Link>
              <Link
                href="/profile"
                className="p-2 rounded-xl text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033] transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-[#152033] flex items-center gap-2">
                  <span>University & Program Discovery</span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
                    Matching Engine
                  </span>
                </h1>
                <p className="text-xs text-[#667085] hidden sm:block">
                  Explore degree programs tailored for Pakistani students with MOI waivers & PKR budget conversions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/profile?tab=universities">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-xl gap-1.5 border-[#E7EAF0] hover:bg-[#F7F8FC]"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#3157E8]" />
                  <span className="hidden sm:inline">My Shortlisted Universities</span>
                  <span className="sm:hidden">Shortlist</span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Dashboard Body */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {renderDiscoveryGrid()}
          </main>
        </div>

        {renderToast()}
      </div>
    );
  }

  // Public Guest Layout (With Navbar and Footer)
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      {renderToast()}

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/80 pt-10 pb-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#3157E8] border border-[#3157E8]/20 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  Module 4: Discovery & Matching Engine
                </span>
                <span className="text-xs text-[#667085] hidden sm:inline">• Live PKR Calculations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#152033] tracking-tight">
                University & Program Discovery
              </h1>
              <p className="text-sm text-[#667085] mt-1.5 max-w-2xl">
                Explore degree programs tailored for Pakistani students. Filter by minimum CGPA, real-time PKR tuition & embassy living costs, and discover universities accepting <strong>MOI English waivers</strong> with no IELTS required.
              </p>
            </div>

            <Link href="/register">
              <Button size="sm" className="rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#3157E8] text-white hover:bg-[#2546c7]">
                <Sparkles className="w-3.5 h-3.5" />
                Sign Up to Shortlist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-8 w-full">
        {renderDiscoveryGrid()}
      </main>

      <Footer />
    </div>
  );
}
