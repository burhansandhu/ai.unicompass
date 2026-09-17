"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/features/content/components/PostCard";
import { CountryDetail } from "@/features/content/types";
import { getCountryBySlug } from "@/features/content/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function CountryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { user, isLoading: isAuthLoading } = useAuth();
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    getCountryBySlug(slug)
      .then((data) => {
        setCountry(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load country guide.");
        setIsLoading(false);
      });
  }, [slug]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        {!user && <Navbar />}
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-[#3157E8] animate-spin" />
          <span className="text-xs text-[#667085]">Loading {slug?.toUpperCase()} guide...</span>
        </div>
        {!user && <Footer />}
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        {!user && <Navbar />}
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="text-4xl mb-3">🌍</div>
          <h2 className="text-2xl font-bold text-[#152033]">Country Guide Not Found</h2>
          <p className="text-sm text-[#667085] mt-1 mb-6 max-w-sm">
            We couldn&apos;t find an active educational guide for &ldquo;{slug}&rdquo;.
          </p>
          <Link href="/destinations">
            <Button className="rounded-xl">Browse All Destinations</Button>
          </Link>
        </div>
        {!user && <Footer />}
      </div>
    );
  }

  const renderCountryContent = () => (
    <>
      {/* Country Hero Banner */}
      <section className="relative bg-[#0B132B] text-white py-16 sm:py-20 overflow-hidden">
        {country.hero_image_url && (
          <div className="absolute inset-0 opacity-25">
            <Image
              src={country.hero_image_url}
              alt={country.name}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/70 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/70 mb-4 font-medium">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span>/</span>
            <span className="text-white font-semibold">{country.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl sm:text-5xl">{country.flag_emoji}</span>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Study in {country.name}
                  </h1>
                  {country.popular_tag && (
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#3157E8] text-white text-xs font-semibold shadow-xs">
                      {country.popular_tag}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed mt-2">
                {country.overview}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={user ? "/universities" : "/register"}>
                <Button className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white px-6 h-11 font-semibold text-sm">
                  {user ? "Explore Universities" : `Start ${country.name} Application`}
                </Button>
              </Link>
              <Link href={user ? "/profile?tab=advisor" : "/chat"}>
                <Button
                  variant="ghost"
                  className="rounded-xl bg-white/10 hover:bg-white/20 text-white hover:text-white border border-white/20 backdrop-blur-xs px-6 h-11 font-semibold text-sm transition-all shadow-xs"
                >
                  ✦ Ask AI Advisor
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Fact Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="text-xs text-white/60">Currency</div>
              <div className="text-lg font-bold text-white mt-1">{country.currency}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="text-xs text-white/60">Avg. Annual Cost (PKR)</div>
              <div className="text-lg font-bold text-white mt-1">{country.avg_cost_pkr || "Check Guide"}</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="text-xs text-white/60">Work While Studying</div>
              <div className="text-lg font-bold text-white mt-1">
                {country.work_hours_per_week || "20 hrs / week"}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
              <div className="text-xs text-white/60">Post-Study Work Visa</div>
              <div className="text-lg font-bold text-white mt-1">
                {country.post_study_work_visa || "18 - 36 Months"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides & Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#152033] tracking-tight flex items-center gap-2">
              <span>📚</span> Educational Guides & Visa Walkthroughs for {country.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Official step-by-step guidance written specifically for Pakistani students.
            </p>
          </div>
        </div>

        {country.posts && country.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {country.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E7EAF0] p-10 text-center">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-[#152033] text-base">
              New Guides for {country.name} Coming Soon
            </h3>
            <p className="text-xs text-[#667085] mt-1 max-w-md mx-auto">
              Our education counselors are currently compiling verified visa and university guides for {country.name}.
            </p>
            <div className="mt-4">
              <Link href={user ? "/profile?tab=advisor" : "/chat"}>
                <Button variant="outline" size="sm" className="rounded-xl text-xs">
                  ✦ Ask AI Advisor about {country.name}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
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
                href="/destinations"
                className="p-2 rounded-xl text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033] transition-colors"
                title="Back to All Destinations"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-[#152033] flex items-center gap-2">
                  <span>{country.flag_emoji} {country.name} Guide</span>
                  {country.popular_tag && (
                    <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
                      {country.popular_tag}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-[#667085] hidden sm:block">
                  Visa guidelines, currency costs, and university options for Pakistani applicants
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/profile?tab=advisor">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs font-semibold rounded-xl gap-1.5 border-[#E7EAF0] hover:bg-[#F7F8FC]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3157E8]" />
                  <span className="hidden sm:inline">Ask AI Advisor</span>
                  <span className="sm:hidden">Advisor</span>
                </Button>
              </Link>
            </div>
          </header>

          <main className="flex-1">
            {renderCountryContent()}
          </main>
        </div>
      </div>
    );
  }

  // Public Guest Layout (No Sidebar, Top Navbar & Footer)
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {renderCountryContent()}
      </main>

      <Footer />
    </div>
  );
}
