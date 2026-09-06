"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const destinations = [
    {
      name: "United States",
      flag: "🇺🇸",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
      tag: "Top STEM & Tech",
    },
    {
      name: "United Kingdom",
      flag: "🇬🇧",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
      tag: "1-Year Master's",
    },
    {
      name: "Canada",
      flag: "🇨🇦",
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop",
      tag: "Post-Study Work",
    },
    {
      name: "Germany",
      flag: "🇩🇪",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop",
      tag: "Zero/Low Tuition",
    },
    {
      name: "Australia",
      flag: "🇦🇺",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop",
      tag: "Top Quality Living",
    },
    {
      name: "France",
      flag: "🇫🇷",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop",
      tag: "Global Culture & Arts",
    },
  ];

  const quickFeatures = [
    {
      icon: "🌍",
      title: "Find Your Country",
      desc: "Get AI recommendation based on your profile",
      link: "/destinations",
    },
    {
      icon: "🏛️",
      title: "Find Your University",
      desc: "Discover universities that match your criteria",
      link: "/universities",
    },
    {
      icon: "🎓",
      title: "Scholarships",
      desc: "Explore 2,300+ scholarships worldwide",
      link: "/scholarships",
    },
    {
      icon: "🧮",
      title: "Cost Calculator",
      desc: "Estimate your total study cost in seconds",
      link: "/profile",
    },
  ];

  const topUniversities = [
    {
      name: "MIT",
      location: "Massachusetts, USA",
      rank: "#1 in the World",
      badgeBg: "bg-red-50 text-red-700 border-red-100",
    },
    {
      name: "University of Oxford",
      location: "Oxford, UK",
      rank: "#2 in the World",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      name: "University of Toronto",
      location: "Toronto, Canada",
      rank: "#3 in the World",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      name: "Technical University of Munich",
      location: "Munich, Germany",
      rank: "#4 in the World",
      badgeBg: "bg-sky-50 text-sky-700 border-sky-100",
    },
    {
      name: "University of Melbourne",
      location: "Melbourne, Australia",
      rank: "#5 in the World",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100",
    },
  ];

  const upcomingDeadlines = [
    {
      uni: "University of Toronto",
      program: "MSc Computer Science",
      country: "Canada",
      deadline: "15 Jan 2027",
      daysLeft: "128 days",
      badgeColor: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8]",
    },
    {
      uni: "TU Munich (TUM)",
      program: "MSc Artificial Intelligence",
      country: "Germany",
      deadline: "31 Jan 2027",
      daysLeft: "144 days",
      badgeColor: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8]",
    },
    {
      uni: "University of Oxford",
      program: "MSc Data Science",
      country: "UK",
      deadline: "28 Feb 2027",
      daysLeft: "164 days",
      badgeColor: "bg-[#FFF4DC] text-[#F59E0B] border-[#FDE68A]",
    },
    {
      uni: "University of Melbourne",
      program: "MSc Engineering",
      country: "Australia",
      deadline: "15 Mar 2027",
      daysLeft: "179 days",
      badgeColor: "bg-[#FFF4DC] text-[#F59E0B] border-[#FDE68A]",
    },
  ];

  const articles = [
    {
      title: "How to Write a Perfect Statement of Purpose (SOP)",
      tag: "Guide",
      tagColor: "bg-purple-100 text-purple-700",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
      date: "5 Sep 2026",
      readTime: "5 min read",
    },
    {
      title: "UK Student Visa Process Step by Step",
      tag: "Visa",
      tagColor: "bg-blue-100 text-blue-700",
      image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop",
      date: "5 Sep 2026",
      readTime: "6 min read",
    },
    {
      title: "Top 10 Fully Funded Scholarships in Europe",
      tag: "Scholarship",
      tagColor: "bg-amber-100 text-amber-700",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop",
      date: "5 Sep 2026",
      readTime: "5 min read",
    },
    {
      title: "How to Get Admission in Top German Universities",
      tag: "Tips",
      tagColor: "bg-emerald-100 text-emerald-700",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
      date: "5 Sep 2026",
      readTime: "5 min read",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E7EAF0]/60 bg-gradient-to-b from-white to-[#F7F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] text-[#3157E8] text-xs font-semibold tracking-wide border border-[#E0E7FF]">
                  <span>✦</span> NEXT-GEN STUDY ABROAD PLATFORM
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#152033] tracking-tight leading-[1.12]">
                  Your Future <br />
                  <span className="text-[#3157E8]">Starts Here</span>
                </h1>

                <p className="text-base sm:text-lg text-[#667085] max-w-lg leading-relaxed">
                  Find the best countries, universities and scholarships that match your profile. Real-time RAG AI search grounded in official university portals.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/register">
                    <Button size="lg" className="rounded-xl px-7 shadow-sm gap-2 font-semibold">
                      <span>✦ Start AI Advisor</span>
                    </Button>
                  </Link>
                  <Link href="/destinations">
                    <Button variant="outline" size="lg" className="rounded-xl px-7 font-semibold">
                      Explore Countries
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Visual & Social Proof Card */}
              <div className="lg:col-span-6 relative flex justify-center items-center">
                {/* Visual Backdrop with landmarks & student cutout */}
                <div className="relative w-full max-w-[480px] h-[400px] sm:h-[460px] flex items-center justify-center">
                  {/* Subtle radial circle aura */}
                  <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#3157E8]/15 to-[#60A5FA]/20 blur-2xl -z-10"></div>
                  
                  {/* Backdrop ring */}
                  <div className="absolute w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full border border-[#3157E8]/20 bg-white/60 shadow-sm flex items-center justify-center">
                    {/* Landmark illustrations / emojis */}
                    <div className="absolute top-4 left-10 text-2xl opacity-60">🇬🇧 🏛️</div>
                    <div className="absolute top-8 right-10 text-2xl opacity-60">🗽 ✈️</div>
                    <div className="absolute bottom-10 left-8 text-2xl opacity-60">🇩🇪 🎓</div>
                    <div className="absolute bottom-6 right-12 text-2xl opacity-60">🇦🇺 🌏</div>
                  </div>

                  {/* Student Image */}
                  <div className="relative z-10 w-[240px] sm:w-[290px] h-[340px] sm:h-[410px] rounded-3xl overflow-hidden shadow-card border-4 border-white">
                    <Image
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                      alt="Student studying abroad"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Floating Social Proof Card */}
                  <div className="absolute top-6 right-0 sm:-right-4 z-20 bg-white p-3.5 sm:p-4 rounded-2xl shadow-cardHover border border-[#E7EAF0] max-w-[190px] backdrop-blur-sm animate-fade-in">
                    <div className="text-[11px] font-semibold text-[#667085] uppercase tracking-wide">
                      Trusted by
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-[#152033] tracking-tight">
                      25,000+
                    </div>
                    <div className="text-xs text-[#667085] font-medium">
                      Students Worldwide
                    </div>
                    
                    {/* Avatars Stack */}
                    <div className="flex items-center gap-1 mt-2.5">
                      <div className="flex -space-x-2">
                        {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80",
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&fit=crop&q=80",
                          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&fit=crop&q=80"
                        ].map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="Student avatar"
                            className="w-6 h-6 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                      <div className="ml-1 flex items-center text-xs font-bold text-amber-500">
                        <span>★</span>
                        <span className="text-[#152033] ml-0.5 text-[11px]">4.9/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR DESTINATIONS */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
                Popular Destinations
              </h2>
              <p className="text-sm text-[#667085] mt-0.5">
                Top study destinations with verified visa guidelines and tuition models.
              </p>
            </div>
            <Link href="/destinations" className="text-sm font-semibold text-[#3157E8] hover:underline flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest) => (
              <Link href="/destinations" key={dest.name} className="group">
                <Card hoverable className="p-2.5 h-full flex flex-col justify-between overflow-hidden">
                  <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-xs font-bold shadow-xs">
                      {dest.flag}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#152033] group-hover:text-[#3157E8] transition-colors line-clamp-1">
                      {dest.name}
                    </h3>
                    <p className="text-[11px] text-[#667085] mt-0.5 line-clamp-1">
                      {dest.tag}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* 4 QUICK ACTION FEATURES */}
        <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickFeatures.map((feat) => (
              <Link href={feat.link} key={feat.title} className="group">
                <Card hoverable className="p-5 flex items-start gap-4 border-[#E7EAF0]">
                  <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-[#3157E8] group-hover:text-white transition-colors">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#152033] group-hover:text-[#3157E8] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* TOP UNIVERSITIES */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
                Top Universities
              </h2>
              <p className="text-sm text-[#667085] mt-0.5">
                Globally recognized partner institutions with MOI waiver compatibility.
              </p>
            </div>
            <Link href="/universities" className="text-sm font-semibold text-[#3157E8] hover:underline flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topUniversities.map((uni) => (
              <Card hoverable key={uni.name} className="p-5 flex flex-col justify-between border-[#E7EAF0]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#172554] text-white font-bold flex items-center justify-center text-sm mb-3">
                    {uni.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-sm text-[#152033] line-clamp-1">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-[#667085] mt-0.5 line-clamp-1">
                    {uni.location}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E7EAF0]">
                  <span className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-full border ${uni.badgeBg}`}>
                    {uni.rank}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* UPCOMING APPLICATION DEADLINES & AI PROMO BANNER */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Deadlines Table Card */}
            <div className="lg:col-span-8">
              <Card className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[#152033]">
                      Upcoming Application Deadlines
                    </h2>
                    <span className="text-xs text-[#667085] font-medium">Fall 2026 / Spring 2027</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E7EAF0] text-[#667085] text-xs uppercase">
                          <th className="pb-3 font-semibold">University</th>
                          <th className="pb-3 font-semibold">Program</th>
                          <th className="pb-3 font-semibold">Country</th>
                          <th className="pb-3 font-semibold">Deadline</th>
                          <th className="pb-3 font-semibold">Days Left</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E7EAF0]">
                        {upcomingDeadlines.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#F7F8FC] transition-colors">
                            <td className="py-3.5 font-bold text-[#152033]">{item.uni}</td>
                            <td className="py-3.5 text-[#667085]">{item.program}</td>
                            <td className="py-3.5 text-[#152033]">{item.country}</td>
                            <td className="py-3.5 text-[#667085]">{item.deadline}</td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${item.badgeColor}`}>
                                {item.daysLeft}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7EAF0] flex justify-center">
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="font-semibold text-xs">
                      View all application deadlines
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* AI Advisor Promo Card */}
            <div className="lg:col-span-4">
              <div className="h-full bg-gradient-to-br from-[#EEF2FF] to-white border border-[#E0E7FF] rounded-card p-6 flex flex-col justify-between relative overflow-hidden shadow-card">
                <div className="relative z-10 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-[#3157E8] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    ✦
                  </div>
                  <h3 className="text-xl font-bold text-[#152033] tracking-tight">
                    Not Sure Where To Start?
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    Let our AI advisor guide you to the best options based on your Pakistani academic qualifications, IELTS/MOI status, and budget in PKR.
                  </p>
                </div>

                {/* Robot visual */}
                <div className="my-4 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-card flex items-center justify-center text-5xl">
                    🤖
                  </div>
                </div>

                <div className="relative z-10">
                  <Link href="/register">
                    <Button variant="primary" size="md" className="w-full font-bold text-sm">
                      Start Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES & GUIDES */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
                Latest Articles & Guides
              </h2>
              <p className="text-sm text-[#667085] mt-0.5">
                Expert tips on visas, HEC attestation, SOP drafting, and bank balance preparation.
              </p>
            </div>
            <Link href="/destinations" className="text-sm font-semibold text-[#3157E8] hover:underline flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {articles.map((art) => (
              <Card hoverable key={art.title} className="p-0 overflow-hidden flex flex-col border-[#E7EAF0]">
                <div className="relative w-full h-44 bg-gray-100">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${art.tagColor}`}>
                      {art.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm text-[#152033] leading-snug line-clamp-2">
                    {art.title}
                  </h3>
                  <div className="mt-4 pt-3 border-t border-[#E7EAF0] flex items-center justify-between text-xs text-[#667085]">
                    <span>{art.date}</span>
                    <span>{art.readTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
