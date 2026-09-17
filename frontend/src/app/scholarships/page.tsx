"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Scholarship } from "@/features/scholarships/types";
import { getScholarships, toggleSaveScholarship } from "@/features/scholarships/api";
import { ScholarshipCard } from "@/features/scholarships/components/ScholarshipCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import {
  Sparkles,
  Search,
  Globe2,
  Award,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScholarshipsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
  const [selectedDegree, setSelectedDegree] = useState<string | undefined>(undefined);
  const [selectedCoverage, setSelectedCoverage] = useState<string | undefined>(undefined);

  const countriesList = [
    { label: "All Destinations", value: undefined },
    { label: "🇬🇧 United Kingdom", value: "uk" },
    { label: "🇩🇪 Germany", value: "germany" },
    { label: "🇫🇷 France", value: "france" },
    { label: "🇦🇺 Australia", value: "australia" },
    { label: "🇨🇦 Canada", value: "canada" },
    { label: "🇺🇸 United States", value: "usa" },
  ];

  const coverageList = [
    { label: "All Coverage", value: undefined },
    { label: "✨ Fully Funded", value: "Fully Funded" },
    { label: "🎓 Full Tuition", value: "Full Tuition" },
    { label: "🏷️ Partial Tuition", value: "Partial" },
  ];

  const degreeLevels = [
    { label: "All Degrees", value: undefined },
    { label: "Master's (Postgrad)", value: "Masters" },
    { label: "Bachelor's (Undergrad)", value: "Bachelors" },
    { label: "PhD / Doctorate", value: "PhD" },
  ];

  const fetchScholarships = async () => {
    setIsLoading(true);
    try {
      const data = await getScholarships({
        search: search.trim() || undefined,
        country_slug: selectedCountry,
        degree_level: selectedDegree,
        coverage_type: selectedCoverage,
      });
      setScholarships(data);
    } catch (err) {
      console.error("Failed to load scholarships", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchScholarships();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedCountry, selectedDegree, selectedCoverage]);

  const handleToggleSave = async (id: number): Promise<boolean> => {
    if (!user) {
      setToastMessage("Please sign in or register to bookmark scholarships to your dashboard.");
      setTimeout(() => setToastMessage(null), 3500);
      return false;
    }
    try {
      const res = await toggleSaveScholarship(id);
      setToastMessage(res.message);
      setTimeout(() => setToastMessage(null), 3000);
      return res.is_saved;
    } catch (err) {
      console.error("Error saving scholarship", err);
      return false;
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin" />
          <span className="text-xs text-[#667085] font-medium">Loading scholarships directory...</span>
        </div>
      </div>
    );
  }

  const renderToast = () => (
    toastMessage ? (
      <div className="fixed bottom-6 right-6 z-50 bg-[#152033] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-slideUp text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>{toastMessage}</span>
        {!user && (
          <Link
            href="/login"
            className="text-[#48CAE4] underline hover:text-white ml-2 font-bold"
          >
            Log In →
          </Link>
        )}
      </div>
    ) : null
  );

  const renderGrid = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#152033] tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-[#3157E8]" />
            <span>Available Scholarships</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {scholarships.length}
            </span>
          </h2>
        </div>

        {user && (
          <Link href="/profile?tab=scholarships">
            <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl gap-1.5">
              <span>View My Saved Scholarships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#3157E8]" />
          <span className="text-xs text-[#667085] font-medium">
            Loading verified scholarship programs...
          </span>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E7EAF0] p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
            🎓
          </div>
          <h3 className="text-lg font-bold text-[#152033]">No scholarships found</h3>
          <p className="text-xs text-[#667085] max-w-md mx-auto">
            No scholarship schemes match your current search query or filter selection. Try clearing filters or selecting a different country.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setSelectedCountry(undefined);
              setSelectedDegree(undefined);
              setSelectedCoverage(undefined);
            }}
            className="text-xs font-semibold rounded-xl"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((s) => (
            <ScholarshipCard
              key={s.id}
              scholarship={s}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Authenticated Student Layout (Shows Dashboard Sidebar)
  if (user) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex">
        {/* Unified Student Dashboard Sidebar */}
        <Sidebar activeTab="scholarships" />

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
                  <span>International Scholarships</span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
                    Directory
                  </span>
                </h1>
                <p className="text-xs text-[#667085] hidden sm:block">
                  Verified grants, tuition waivers, and funded opportunities for Pakistani students
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/profile?tab=scholarships">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-xl gap-1.5 border-[#E7EAF0] hover:bg-[#F7F8FC]"
                >
                  <Award className="w-3.5 h-3.5 text-[#3157E8]" />
                  <span className="hidden sm:inline">My Saved Scholarships</span>
                  <span className="sm:hidden">Saved</span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Dashboard Body */}
          <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Filter & Search Card in Dashboard View */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157E8] text-[11px] font-bold border border-[#E0E7FF] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>2026–2027 Intakes</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#152033]">
                    Search & Filter Scholarships
                  </h2>
                </div>
                <div className="text-xs text-[#667085]">
                  Showing <strong className="text-[#152033]">{scholarships.length}</strong> available programs
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search scholarship name, provider, or country (e.g. DAAD, Chevening, Germany)..."
                  className="w-full pl-10 pr-12 h-11 rounded-xl border border-[#E7EAF0] bg-[#F7F8FC] focus:bg-white focus:outline-hidden focus:border-[#3157E8] text-sm text-[#152033] placeholder:text-[#667085] transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex flex-col gap-3 pt-1">
                {/* Country Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-bold text-[#667085] mr-2 shrink-0 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5" /> Country:
                  </span>
                  {countriesList.map((c) => {
                    const isActive = selectedCountry === c.value;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setSelectedCountry(c.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-[#3157E8] text-white shadow-xs"
                            : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033]"
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>

                {/* Coverage & Degree Pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#667085] mr-1">Coverage:</span>
                    {coverageList.map((cov) => {
                      const isActive = selectedCoverage === cov.value;
                      return (
                        <button
                          key={cov.label}
                          type="button"
                          onClick={() => setSelectedCoverage(cov.value)}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            isActive
                              ? "bg-emerald-600 text-white font-bold shadow-xs"
                              : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC]"
                          }`}
                        >
                          {cov.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[#667085] mr-1">Degree:</span>
                    {degreeLevels.map((d) => {
                      const isActive = selectedDegree === d.value;
                      return (
                        <button
                          key={d.label}
                          type="button"
                          onClick={() => setSelectedDegree(d.value)}
                          className={`px-2.5 py-1 rounded-lg transition-all ${
                            isActive
                              ? "bg-[#152033] text-white font-bold shadow-xs"
                              : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC]"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Scholarships Grid */}
            {renderGrid()}
          </main>
        </div>

        {renderToast()}
      </div>
    );
  }

  // Public Guest Layout (No Sidebar, Top Navbar & Footer)
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      {renderToast()}

      {/* Hero Header */}
      <section className="bg-white border-b border-[#E7EAF0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157E8] text-xs font-bold border border-[#E0E7FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pakistani Student Scholarship Directory 2026–2027</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#152033] tracking-tight leading-tight">
              Verified International Scholarships for Pakistani Students
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#667085] leading-relaxed">
              Explore government and university scholarship programs across Europe, the UK, Australia, and North America. Includes 100% tuition coverage, living stipends, return flights, and Pakistani MOI English waiver policies.
            </p>
          </div>

          {/* Search Bar */}
          <div className="pt-2 max-w-2xl">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scholarship name, provider, or country (e.g. DAAD, Chevening, Germany)..."
                className="w-full pl-12 pr-4 h-12 rounded-2xl border border-[#E7EAF0] bg-[#F7F8FC] focus:bg-white focus:outline-hidden focus:border-[#3157E8] text-sm text-[#152033] placeholder:text-[#667085] shadow-2xs transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-2 flex flex-col gap-3">
            {/* Country Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-[#667085] mr-2 shrink-0 flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" /> Country:
              </span>
              {countriesList.map((c) => {
                const isActive = selectedCountry === c.value;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setSelectedCountry(c.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-[#3157E8] text-white shadow-xs"
                        : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033]"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Coverage & Degree Pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="text-[#667085] mr-1">Coverage:</span>
                {coverageList.map((cov) => {
                  const isActive = selectedCoverage === cov.value;
                  return (
                    <button
                      key={cov.label}
                      type="button"
                      onClick={() => setSelectedCoverage(cov.value)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white font-bold shadow-xs"
                          : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC]"
                      }`}
                    >
                      {cov.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#667085] mr-1">Degree:</span>
                {degreeLevels.map((d) => {
                  const isActive = selectedDegree === d.value;
                  return (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setSelectedDegree(d.value)}
                      className={`px-3 py-1 rounded-xl transition-all ${
                        isActive
                          ? "bg-[#152033] text-white font-bold shadow-xs"
                          : "bg-white border border-[#E7EAF0] text-[#667085] hover:bg-[#F7F8FC]"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderGrid()}
      </main>

      <Footer />
    </div>
  );
}

