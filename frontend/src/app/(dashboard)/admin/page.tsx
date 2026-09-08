"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "articles" | "students" | "settings">("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#152033]"></div>
          <span className="text-xs text-[#667085] font-medium">Verifying administrator authorization...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to /admin/login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#152033] text-white text-3xl flex items-center justify-center mb-4 shadow-sm">
          🛡️
        </div>
        <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
          Admin Portal Authentication Required
        </h2>
        <p className="text-sm text-[#667085] mt-1 mb-6 max-w-sm">
          You must be signed in with an authorized administrator or counselor account to access this management area.
        </p>
        <Link href="/admin/login">
          <Button size="lg" className="px-8 rounded-xl bg-[#152033] hover:bg-[#0B132B] text-white">
            Go to Admin Login
          </Button>
        </Link>
      </div>
    );
  }

  // Logged in but not admin -> show access denied
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 text-3xl flex items-center justify-center mb-4 shadow-sm">
          ⛔
        </div>
        <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
          Access Restricted
        </h2>
        <p className="text-sm text-[#667085] mt-1 mb-6 max-w-md">
          Your account (<span className="font-semibold text-[#152033]">{user.email}</span>) has the <span className="font-bold text-[#3157E8]">Student</span> role and does not have administrative privileges.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/profile">
            <Button size="lg" className="rounded-xl">
              Go to Student Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="rounded-xl"
          >
            Sign Out & Switch Account
          </Button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Registered Students",
      count: "1,248",
      change: "+18 this week",
      icon: "👥",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Published Articles & Guides",
      count: "24",
      change: "4 in review",
      icon: "📝",
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Active Consultation Leads",
      count: "87",
      change: "12 pending contact",
      icon: "🎓",
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      title: "Grounding Official Domains",
      count: "148",
      change: "100% verified .edu/.ac.uk",
      icon: "🛡️",
      iconBg: "bg-purple-50 text-purple-600",
    },
  ];

  const recentStudents = [
    {
      name: "Hamza Sheikh",
      email: "hamza.sheikh@example.pk",
      target: "UK (MSc Computing)",
      registered: "Today, 14:22",
      status: "Profile 80%",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      name: "Ayesha Malik",
      email: "ayesha.m@example.pk",
      target: "Germany (Data Eng)",
      registered: "Yesterday",
      status: "Shortlisting",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      name: "Zainab Tariq",
      email: "zainab.t@example.pk",
      target: "Canada (MBA)",
      registered: "2 days ago",
      status: "Needs Attestation",
      statusColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  const publishedArticles = [
    {
      title: "UK Student Visa Process Step by Step: 2026 Guide for Pakistani Students",
      category: "Visa Guidance",
      author: "Burhan Ul Haq (Admin)",
      views: "1,420",
      status: "Published",
      date: "5 Sep 2026",
    },
    {
      title: "Top 10 Fully Funded European Scholarships (DAAD & Erasmus)",
      category: "Scholarships",
      author: "UniCompass Editorial",
      views: "2,890",
      status: "Published",
      date: "3 Sep 2026",
    },
    {
      title: "How to Get Admission in Top German Public Universities with Zero Tuition",
      category: "Admissions",
      author: "Burhan Ul Haq (Admin)",
      views: "3,110",
      status: "Published",
      date: "1 Sep 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0B132B] text-white flex-col justify-between fixed h-screen top-0 left-0 z-30">
        <div className="flex flex-col">
          {/* Logo Header (h-20 aligned) */}
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
                ✦
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white">
                  UniCompass
                </span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                  Admin Central
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === "overview"
                  ? "bg-[#3157E8] text-white font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === "articles"
                  ? "bg-[#3157E8] text-white font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>📝</span>
              <span className="flex-1">Manage Articles (CMS)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                Blog
              </span>
            </button>

            <button
              onClick={() => setActiveTab("students")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === "students"
                  ? "bg-[#3157E8] text-white font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>👥</span>
              <span>Students & Inquiries</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                activeTab === "settings"
                  ? "bg-[#3157E8] text-white font-bold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>⚙️</span>
              <span>Platform Settings</span>
            </button>
          </nav>
        </div>

        {/* Admin Card & Sign Out */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-[#0B132B] font-bold flex items-center justify-center text-sm shadow-sm">
              {user.full_name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">{user.full_name}</div>
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Super Administrator</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout();
              router.push("/admin/login");
            }}
            className="w-full text-xs font-semibold justify-center gap-1.5 border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <span>🚪</span> Sign Out Admin
          </Button>
        </div>
      </aside>

      {/* Main Content Dashboard Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar (h-20 aligned) */}
        <header className="h-20 bg-white border-b border-[#E7EAF0] px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0B132B] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                ✦
              </div>
              <span className="font-bold text-lg text-[#152033]">UniCompass Admin</span>
            </Link>
            <div className="hidden sm:flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#152033] tracking-tight">
                Admin Management Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                Counselor Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#667085] hover:text-[#152033] hover:bg-[#F7F8FC] transition-colors border border-[#E7EAF0]"
            >
              <span>🌐</span> View Live Website ↗
            </Link>
            <div className="h-5 w-px bg-[#E7EAF0]"></div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EAF8F1] text-[#16A36A] border border-[#C6F0D8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse"></span>
                PostgreSQL Live
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/admin/login");
                }}
                className="lg:hidden text-xs font-semibold rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <>
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B132B] to-[#1D2D50] text-white p-6 sm:p-8 rounded-2xl shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-amber-300 mb-2">
                    <span>👑</span> Administrator Authority Active
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome back, {user.full_name}!
                  </h1>
                  <p className="text-sm text-white/70 mt-1 max-w-xl">
                    Here is an overview of platform activity, published country blogs, student inquiries, and database metrics.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setActiveTab("articles")}
                    className="bg-[#3157E8] hover:bg-[#2544BA] text-white rounded-xl text-sm font-semibold h-11 px-5"
                  >
                    ✍️ Create Article
                  </Button>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((card, i) => (
                  <Card key={i} className="p-5 border border-[#E7EAF0] shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${card.iconBg}`}>
                        {card.icon}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {card.change}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-[#152033] tracking-tight">
                      {card.count}
                    </div>
                    <div className="text-xs font-medium text-[#667085] mt-1">
                      {card.title}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Two Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Students & Inquiries */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#152033] tracking-tight flex items-center gap-2">
                      <span>👥</span> Recent Student Registrations
                    </h2>
                    <button
                      onClick={() => setActiveTab("students")}
                      className="text-xs font-semibold text-[#3157E8] hover:underline"
                    >
                      View all students →
                    </button>
                  </div>

                  <Card className="border border-[#E7EAF0] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#F7F8FC] border-b border-[#E7EAF0] text-xs font-bold text-[#667085] uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3">Student Name</th>
                            <th className="px-5 py-3">Target Country/Program</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Registered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E7EAF0]">
                          {recentStudents.map((s, idx) => (
                            <tr key={idx} className="hover:bg-[#F7F8FC]/50 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="font-semibold text-[#152033]">{s.name}</div>
                                <div className="text-xs text-[#667085]">{s.email}</div>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-[#152033] font-medium">
                                {s.target}
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.statusColor}`}>
                                  {s.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-[#667085]">
                                {s.registered}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Quick Management Actions */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-[#152033] tracking-tight flex items-center gap-2">
                    <span>⚡</span> Administrator Actions
                  </h2>

                  <Card className="p-5 border border-[#E7EAF0] space-y-3">
                    <button
                      onClick={() => setActiveTab("articles")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] hover:bg-[#EEF2FF] text-[#152033] hover:text-[#3157E8] transition-colors border border-[#E7EAF0] text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">✍️</span>
                        <div>
                          <div className="text-xs font-bold">Write New Article / Blog</div>
                          <div className="text-[11px] text-[#667085]">Publish country guides for students</div>
                        </div>
                      </div>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("students")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] hover:bg-[#EEF2FF] text-[#152033] hover:text-[#3157E8] transition-colors border border-[#E7EAF0] text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📥</span>
                        <div>
                          <div className="text-xs font-bold">Export Student Directory</div>
                          <div className="text-[11px] text-[#667085]">Download registered leads (CSV)</div>
                        </div>
                      </div>
                      <span>→</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F8FC] hover:bg-[#EEF2FF] text-[#152033] hover:text-[#3157E8] transition-colors border border-[#E7EAF0] text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛡️</span>
                        <div>
                          <div className="text-xs font-bold">Domain Grounding Audit</div>
                          <div className="text-[11px] text-[#667085]">Check official university domains</div>
                        </div>
                      </div>
                      <span>→</span>
                    </button>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#152033] tracking-tight flex items-center gap-2.5">
                    <span>📝</span> Articles & Country Guides CMS
                  </h1>
                  <p className="text-sm text-[#667085] mt-1">
                    Manage articles, visa walkthroughs, and scholarship announcements published on the live website.
                  </p>
                </div>
                <Button className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white">
                  + Add New Article
                </Button>
              </div>

              <Card className="border border-[#E7EAF0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F7F8FC] border-b border-[#E7EAF0] text-xs font-bold text-[#667085] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Article Title</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Author</th>
                        <th className="px-5 py-3">Views</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7EAF0]">
                      {publishedArticles.map((art, idx) => (
                        <tr key={idx} className="hover:bg-[#F7F8FC]/50 transition-colors">
                          <td className="px-5 py-4 font-semibold text-[#152033] max-w-md">
                            {art.title}
                          </td>
                          <td className="px-5 py-4 text-xs">
                            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
                              {art.category}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#667085]">
                            {art.author}
                          </td>
                          <td className="px-5 py-4 text-xs font-semibold text-[#152033]">
                            {art.views}
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF8F1] text-[#16A36A] border border-[#C6F0D8]">
                              ● {art.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-xs font-semibold text-[#3157E8] hover:underline px-2 py-1">
                                Edit
                              </button>
                              <button className="text-xs font-semibold text-red-600 hover:underline px-2 py-1">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-[#152033] tracking-tight flex items-center gap-2.5">
                  <span>👥</span> Registered Students & Inquiries
                </h1>
                <p className="text-sm text-[#667085] mt-1">
                  All student leads registered through UniCompass portal with application milestone statuses.
                </p>
              </div>

              <Card className="border border-[#E7EAF0] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F7F8FC] border-b border-[#E7EAF0] text-xs font-bold text-[#667085] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Student Name</th>
                        <th className="px-5 py-3">Target Country</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Registered</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7EAF0]">
                      {recentStudents.map((s, idx) => (
                        <tr key={idx} className="hover:bg-[#F7F8FC]/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-[#152033]">{s.name}</div>
                            <div className="text-xs text-[#667085]">{s.email}</div>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-[#152033]">
                            {s.target}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s.statusColor}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-[#667085]">
                            {s.registered}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button size="sm" variant="outline" className="text-xs rounded-lg">
                              Contact Lead
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h1 className="text-2xl font-bold text-[#152033] tracking-tight flex items-center gap-2.5">
                  <span>⚙️</span> Platform & Grounding Settings
                </h1>
                <p className="text-sm text-[#667085] mt-1">
                  Architecture controls and strict official domain whitelisting enforcement.
                </p>
              </div>

              <Card className="p-6 border border-[#E7EAF0] space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#E7EAF0]">
                  <div>
                    <div className="text-sm font-bold text-[#152033]">Strict Domain Whitelisting</div>
                    <div className="text-xs text-[#667085]">Only allow citations from .ac.uk, .edu.au, .edu, and official embassy portals</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">Enforced</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#E7EAF0]">
                  <div>
                    <div className="text-sm font-bold text-[#152033]">Automated Reverse Intake Engine</div>
                    <div className="text-xs text-[#667085]">Calculates 28-day bank balance & attestation countdowns for Fall/Spring</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">Active</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-bold text-[#152033]">Database Engine</div>
                    <div className="text-xs text-[#667085]">PostgreSQL Async on Render Cloud with SQLAlchemy ORM</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">Healthy</span>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
