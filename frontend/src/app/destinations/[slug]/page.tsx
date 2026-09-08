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
import { Button } from "@/components/ui/button";

export default function CountryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
          <span className="text-xs text-[#667085]">Loading {slug?.toUpperCase()} guide...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
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
                <Link href="/register">
                  <Button className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white px-6 h-11 font-semibold text-sm">
                    Start {country.name} Application
                  </Button>
                </Link>
                <Link href="/chat">
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
                <div className="text-lg font-bold text-white mt-1">20 hrs / week</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xs p-4 rounded-xl border border-white/10">
                <div className="text-xs text-white/60">Post-Study Work Visa</div>
                <div className="text-lg font-bold text-white mt-1">18 - 36 Months</div>
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
                <Link href="/chat">
                  <Button variant="outline" size="sm" className="rounded-xl text-xs">
                    ✦ Ask AI Advisor about {country.name}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
