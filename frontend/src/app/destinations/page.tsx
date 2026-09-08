"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CountryCard } from "@/features/content/components/CountryCard";
import { Country } from "@/features/content/types";
import { getCountries } from "@/features/content/api";

export default function DestinationsPage() {
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7EAF0] bg-white text-xs text-[#152033] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              />
              <span className="absolute left-3.5 top-3.5 text-[#667085] text-sm">🔍</span>
            </div>
          </div>
        </div>

        {/* Grid of Countries */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
            <span className="text-xs text-[#667085]">Loading destination guides...</span>
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
            <p className="text-xs text-[#667085] mt-1">Try adjusting your search keywords.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
