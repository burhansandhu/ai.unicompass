"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudentProfile } from "@/features/profile/types";
import { getMyProfile } from "@/features/profile/api";
import { StudentProfileForm } from "@/features/profile/components/StudentProfileForm";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoadingProfile(true);
      getMyProfile()
        .then((data) => {
          setProfile(data);
          setIsLoadingProfile(false);
        })
        .catch(() => {
          setIsLoadingProfile(false);
        });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
          <span className="text-xs text-[#667085] font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#3157E8] text-3xl flex items-center justify-center mb-4">
          ✦
        </div>
        <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
          Please sign in to access your dashboard
        </h2>
        <p className="text-sm text-[#667085] mt-1 mb-6 max-w-sm">
          You need an active UniCompass session to view your shortlisted universities, deadlines, and profile.
        </p>
        <Link href="/login">
          <Button size="lg" className="px-8 rounded-xl">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      title: "Profile Completeness",
      count: `${profile?.completeness_percentage || 0}%`,
      icon: "📊",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Academic CGPA",
      count: profile?.cgpa ? `${profile.cgpa} / ${profile.cgpa_scale || 4.0}` : "Not Set",
      icon: "🎓",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "English Proficiency",
      count: profile?.english_overall_score
        ? `${profile.english_test_type || "IELTS"}: ${profile.english_overall_score}`
        : profile?.moi_eligible
        ? "MOI Waiver"
        : "Pending",
      icon: "🗣️",
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      title: "Target Destinations",
      count: profile?.target_destinations?.length
        ? `${profile.target_destinations.length} Selected`
        : "None Selected",
      icon: "🌍",
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  const deadlines = [
    {
      uni: "TU Munich",
      program: "MSc AI",
      country: "Germany",
      date: "31 Jan 2027",
      days: "144 days",
      badge: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8]",
    },
    {
      uni: "University of Toronto",
      program: "MSc CS",
      country: "Canada",
      date: "15 Jan 2027",
      days: "128 days",
      badge: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8]",
    },
    {
      uni: "Oxford University",
      program: "MSc Data Science",
      country: "UK",
      date: "28 Feb 2027",
      days: "164 days",
      badge: "bg-[#FFF4DC] text-[#F59E0B] border-[#FDE68A]",
    },
  ];

  const checklistItems = [
    { step: "Take IELTS / Language Test", status: "Completed", color: "bg-[#EAF8F1] text-[#16A36A] border-[#C6F0D8]" },
    { step: "Prepare Statement of Purpose (SOP)", status: "In Progress", color: "bg-[#FFF4DC] text-[#F59E0B] border-[#FDE68A]" },
    { step: "Request Academic Recommendation Letters (LOR)", status: "Not Started", color: "bg-gray-100 text-gray-600 border-gray-200" },
    { step: "Apply to Target Universities", status: "Not Started", color: "bg-gray-100 text-gray-600 border-gray-200" },
    { step: "Apply for DAAD / Erasmus Scholarships", status: "Not Started", color: "bg-gray-100 text-gray-600 border-gray-200" },
    { step: "Mandatory 28-Day Bank Statement & Visa Application", status: "Not Started", color: "bg-gray-100 text-gray-600 border-gray-200" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Left Sidebar (as shown in reference image) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#E7EAF0] flex-col justify-between fixed h-screen top-0 left-0 z-30">
        <div className="flex flex-col">
          {/* Logo Header (aligned with h-20 topbar) */}
          <div className="h-20 flex items-center px-6 border-b border-[#E7EAF0]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
                ✦
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#152033]">
                UniCompass
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-5 space-y-1 text-sm font-medium">
            {[
              { id: "dashboard", label: "Dashboard", icon: "📊" },
              { id: "profile", label: "My Profile", icon: "👤" },
              { id: "universities", label: "Shortlisted Universities", icon: "🏛️" },
              { id: "scholarships", label: "Saved Scholarships", icon: "🎓" },
              { id: "applications", label: "My Applications", icon: "📝" },
              { id: "deadlines", label: "Deadline Tracker", icon: "⏰" },
              { id: "documents", label: "Documents & Attestation", icon: "📑" },
              { id: "advisor", label: "AI Advisor", icon: "🤖" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((item) => {
              if (item.id === "documents") {
                return (
                  <Link
                    key={item.id}
                    href="/attestation"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors text-[#667085] hover:bg-[#F7F8FC] hover:text-[#3157E8]"
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="truncate flex-1">{item.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Tracker
                    </span>
                  </Link>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-[#EEF2FF] text-[#3157E8] font-bold"
                      : "text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.id === "profile" && profile && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3157E8]/10 text-[#3157E8]">
                      {profile.completeness_percentage}%
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-[#E7EAF0] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#3157E8] text-white font-bold flex items-center justify-center text-sm">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-[#152033] truncate">{user.full_name}</div>
              <div className="text-xs text-[#667085] capitalize truncate">{user.role} Portal</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="w-full text-xs font-semibold justify-center gap-1.5"
          >
            <span>🚪</span> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Dashboard Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-[#E7EAF0] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="lg:hidden flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#3157E8] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                ✦
              </div>
              <span className="font-bold text-lg text-[#152033]">UniCompass</span>
            </Link>
            <h2 className="text-lg font-bold text-[#152033] hidden sm:block tracking-tight">
              Student Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#667085] hover:text-[#152033] hover:bg-[#F7F8FC] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
            <div className="h-5 w-px bg-[#E7EAF0]"></div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF8F1] text-[#16A36A] border border-[#C6F0D8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></span>
                Live Sync Active
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => logout()}
                className="text-xs font-semibold rounded-xl h-9 px-3.5"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {activeTab === "profile" ? (
            <div>
              {isLoadingProfile ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3157E8]"></div>
                  <span className="text-xs text-[#667085]">Loading your academic profile...</span>
                </div>
              ) : profile ? (
                <StudentProfileForm
                  initialProfile={profile}
                  onSaved={(updated) => setProfile(updated)}
                />
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#E7EAF0] p-6">
                  <p className="text-sm text-[#667085]">Could not load profile. Please refresh the page.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Greeting Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#152033] tracking-tight">
                    Welcome back, {user.full_name}! 👋
                  </h1>
                  <p className="text-sm text-[#667085] mt-1">
                    Here&apos;s your study-abroad application overview, profile completeness, and deadline tracker.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTab("profile")}
                    variant="outline"
                    size="sm"
                    className="font-semibold text-xs rounded-xl gap-1.5"
                  >
                    <span>👤</span> Edit Profile
                  </Button>
                  <Link href="/destinations">
                    <Button variant="outline" size="sm" className="font-semibold text-xs rounded-xl">
                      Explore Countries
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="primary" size="sm" className="font-semibold text-xs rounded-xl gap-1.5 shadow-sm">
                      <span>✦</span> AI Advisor
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Profile Completeness Callout Card */}
              {profile && profile.completeness_percentage < 100 && (
                <div className="bg-gradient-to-r from-[#EEF2FF] to-[#E0E7FF]/60 border border-[#3157E8]/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#3157E8] text-white flex items-center justify-center text-xl font-extrabold flex-shrink-0 shadow-xs">
                      {profile.completeness_percentage}%
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#152033]">
                        Complete Your Academic Profile to Unlock Accurate AI Recommendations
                      </h3>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {profile.completeness_percentage >= 60
                          ? "Great progress! Add your English test details and financial budget to enable 1-click matching."
                          : "Add your Matric/FSc marks, Bachelor degree, and target destinations to start receiving matched courses."}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setActiveTab("profile")}
                    size="sm"
                    className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white px-5 text-xs font-bold whitespace-nowrap shadow-xs"
                  >
                    Complete Profile →
                  </Button>
                </div>
              )}

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                  <Card key={stat.title} hoverable className="p-5 flex flex-col justify-between border-[#E7EAF0]">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${stat.iconBg}`}>
                        {stat.icon}
                      </div>
                      <span className="text-xs font-bold text-[#667085] bg-gray-50 px-2 py-0.5 rounded-full">
                        2026/27
                      </span>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#152033] truncate">
                        {stat.count}
                      </div>
                      <div className="text-xs text-[#667085] font-medium mt-1">
                        {stat.title}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Two Columns: Upcoming Deadlines & Application Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Upcoming Deadlines Table */}
                <div className="lg:col-span-6">
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E7EAF0] pb-3">
                      <div>
                        <h3 className="font-bold text-base text-[#152033]">
                          Upcoming Deadlines
                        </h3>
                        <p className="text-xs text-[#667085]">Verified application cutoffs for your shortlisted programs</p>
                      </div>
                      <span className="text-xs font-semibold text-[#3157E8] cursor-pointer hover:underline">
                        Manage
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#667085] uppercase border-b border-[#E7EAF0]">
                            <th className="pb-2 font-semibold">University</th>
                            <th className="pb-2 font-semibold">Country</th>
                            <th className="pb-2 font-semibold">Deadline</th>
                            <th className="pb-2 font-semibold">Days Left</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7EAF0]">
                          {deadlines.map((d, i) => (
                            <tr key={i} className="hover:bg-[#F7F8FC] transition-colors">
                              <td className="py-3 font-bold text-[#152033]">
                                <div>{d.uni}</div>
                                <div className="text-[11px] font-normal text-[#667085]">{d.program}</div>
                              </td>
                              <td className="py-3 text-[#667085]">{d.country}</td>
                              <td className="py-3 text-[#152033] font-medium">{d.date}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full font-semibold border ${d.badge}`}>
                                  {d.days}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs font-semibold">
                        Export to Calendar (.ics)
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Right: Application Progress Checklist */}
                <div className="lg:col-span-6">
                  <Card className="p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E7EAF0] pb-3">
                      <div>
                        <h3 className="font-bold text-base text-[#152033]">
                          Application Progress
                        </h3>
                        <p className="text-xs text-[#667085]">Step-by-step Pakistani student verification milestones</p>
                      </div>
                      <span className="text-xs font-bold text-[#16A36A] bg-[#EAF8F1] px-2.5 py-0.5 rounded-full border border-[#C6F0D8]">
                        1 / 6 Done
                      </span>
                    </div>

                    <div className="space-y-3">
                      {checklistItems.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-[#E7EAF0] hover:border-gray-300 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-md border border-[#D1D5DB] flex items-center justify-center text-xs text-[#3157E8] font-bold">
                              {item.status === "Completed" ? "✓" : i + 1}
                            </div>
                            <span className="text-xs font-semibold text-[#152033] leading-snug">
                              {item.step}
                            </span>
                          </div>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${item.color} flex-shrink-0`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link href="/attestation">
                        <Button variant="outline" size="sm" className="text-xs font-semibold text-[#3157E8] border-[#3157E8]/30 hover:bg-[#EEF2FF]">
                          Open Attestation Tracker (IBCC/HEC/MOFA) →
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Registered Profile Snapshot Details Card */}
              <Card className="p-6 border-[#E7EAF0] bg-white">
                <div className="flex items-center justify-between border-b border-[#E7EAF0] pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-base text-[#152033]">
                      Academic & Financial Profile Snapshot
                    </h3>
                    <p className="text-xs text-[#667085]">Used for real-time RAG AI search and Pakistani visa evaluations</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("profile")}
                    variant="outline"
                    size="sm"
                    className="text-xs font-bold rounded-xl"
                  >
                    Update Profile →
                  </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[#667085] uppercase font-semibold text-[10px]">Academic Degree</span>
                    <p className="font-bold text-sm text-[#152033] mt-0.5 truncate">
                      {profile?.degree_field || profile?.degree_type || "Not configured"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#667085] uppercase font-semibold text-[10px]">Conferring University</span>
                    <p className="font-bold text-sm text-[#152033] mt-0.5 truncate">
                      {profile?.conferring_university || "Not configured"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#667085] uppercase font-semibold text-[10px]">English Qualification</span>
                    <p className="font-bold text-sm text-[#3157E8] mt-0.5 truncate">
                      {profile?.english_overall_score
                        ? `${profile.english_test_type} (${profile.english_overall_score})`
                        : profile?.moi_eligible
                        ? "MOI Waiver Certificate"
                        : "Test Pending"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#667085] uppercase font-semibold text-[10px]">Annual Budget (PKR)</span>
                    <p className="font-bold text-sm text-[#152033] mt-0.5">
                      {profile?.max_annual_budget_pkr
                        ? `PKR ${(profile.max_annual_budget_pkr / 100000).toFixed(1)} Lakhs`
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
