"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountryCard } from "@/features/content/components/CountryCard";
import { Country } from "@/features/content/types";
import { getCountries } from "@/features/content/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import {
  ArrowLeft,
  Search,
  Globe2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DestinationsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCountries()
      .then((data) => {
        setCountries(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.popular_tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin" />
          <span className="text-xs text-[#667085] font-medium">Loading destination guides...</span>
        </div>
      </div>
    );
  }

  const renderCountriesGrid = () => (
    isLoading ? (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-[#3157E8] animate-spin" />
        <span className="text-xs text-[#667085] font-medium">Loading destination guides...</span>
      </div>
    ) : filteredCountries.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </div>
    ) : (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#E7EAF0] p-8">
        <div className="text-3xl mb-2">🌐</div>
        <h3 className="font-bold text-[#152033]">No destinations found</h3>
        <p className="text-xs text-[#667085] mt-1 mb-4">Try adjusting your search keywords.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchQuery("")}
          className="text-xs font-semibold rounded-xl"
        >
          Reset Search
        </Button>
      </div>
    )
  );

  // Authenticated Student Layout (Shows Dashboard Sidebar)
  if (user) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex">
        {/* Unified Student Dashboard Sidebar */}
        <Sidebar activeTab="destinations" />

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
                  <span>Study Abroad Destinations</span>
                  <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
                    24+ Countries
                  </span>
                </h1>
                <p className="text-xs text-[#667085] hidden sm:block">
                  Country guides, post-study work permits, visa requirements & PKR cost breakdowns for Pakistani students
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/universities">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-xl gap-1.5 border-[#E7EAF0] hover:bg-[#F7F8FC]"
                >
                  <Globe2 className="w-3.5 h-3.5 text-[#3157E8]" />
                  <span className="hidden sm:inline">Explore Universities</span>
                  <span className="sm:hidden">Universities</span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Dashboard Body */}
          <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
            {/* Search & Intro Card in Dashboard View */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7EAF0] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#3157E8] text-[11px] font-bold border border-[#E0E7FF] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Global Educational Pathways</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#152033]">
                    Explore Countries & Visa Guidelines
                  </h2>
                </div>
                <div className="text-xs text-[#667085]">
                  Showing <strong className="text-[#152033]">{filteredCountries.length}</strong> destination guides
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
                <input
                  type="text"
                  placeholder="Search by country (e.g. United Kingdom, Germany, Australia)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 h-11 rounded-xl border border-[#E7EAF0] bg-[#F7F8FC] focus:bg-white focus:outline-hidden focus:border-[#3157E8] text-sm text-[#152033] placeholder:text-[#667085] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Grid */}
            {renderCountriesGrid()}
          </main>
        </div>
      </div>
    );
  }

  // Public Guest Layout (No Sidebar, Top Navbar & Footer)
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157E8] text-xs font-semibold mb-3 border border-[#3157E8]/20">
            <span>🌍</span> Explore 24+ Global Study Destinations
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#152033] tracking-tight">
            Choose Your Ideal Study Abroad Destination
          </h1>
          <p className="text-sm text-[#667085] mt-3 leading-relaxed">
            Detailed guides tailored for Pakistani students: post-study work permits, zero-tuition options, PKR currency breakdowns, and visa requirements.
          </p>

          {/* Search Filter */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by country (e.g. United Kingdom, Germany)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E7EAF0] bg-white text-xs text-[#152033] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              />
              <span className="absolute left-3.5 top-3.5 text-[#667085] text-sm">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid of Countries */}
        {renderCountriesGrid()}
      </main>

      <Footer />
    </div>
  );
}
