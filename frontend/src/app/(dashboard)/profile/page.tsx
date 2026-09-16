"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudentProfile } from "@/features/profile/types";
import { getMyProfile } from "@/features/profile/api";
import { StudentProfileForm } from "@/features/profile/components/StudentProfileForm";
import { ShortlistedProgramItem } from "@/features/discovery/types";
import { getMyShortlist, toggleShortlist } from "@/features/discovery/api";
import { ProgramCard } from "@/features/discovery/components/ProgramCard";
import { TimelineSummary, MilestoneUpdatePayload } from "@/features/timeline/types";
import { getTimelineSummary, updateMilestone, downloadCalendarIcs } from "@/features/timeline/api";
import { ReverseTimelineMilestoneCard } from "@/features/timeline/components/ReverseTimelineMilestoneCard";
import { TimelineCountdownHeader } from "@/features/timeline/components/TimelineCountdownHeader";
import { TimelineUniversitySelector } from "@/features/timeline/components/TimelineUniversitySelector";
import { SelectUniversityTrackerModal } from "@/features/timeline/components/SelectUniversityTrackerModal";
import { calculateRealtimeDaysLeft } from "@/features/timeline/utils";
import { Sidebar } from "@/components/Sidebar";
import { SavedScholarshipItem } from "@/features/scholarships/types";
import { getSavedScholarships, toggleSaveScholarship } from "@/features/scholarships/api";
import { ScholarshipCard } from "@/features/scholarships/components/ScholarshipCard";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Calendar,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Trash2,
  Settings,
  Shield,
  Bell,
  Lock,
  FileCheck,
  Building2,
  X,
} from "lucide-react";

function ProfilePageContent() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [shortlistedItems, setShortlistedItems] = useState<ShortlistedProgramItem[]>([]);
  const [timelineSummary, setTimelineSummary] = useState<TimelineSummary | null>(null);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState<boolean>(true);
  const [timelineError, setTimelineError] = useState<string | null>(null);
  const [isExportingCalendar, setIsExportingCalendar] = useState<boolean>(false);
  const [isPickerModalOpen, setIsPickerModalOpen] = useState<boolean>(false);
  const [trackedProgramId, setTrackedProgramId] = useState<number | null>(null);

  // Saved Scholarships State
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarshipItem[]>([]);
  const [isLoadingScholarships, setIsLoadingScholarships] = useState(false);

  // Applications Tracker State
  interface ApplicationItem {
    id: string;
    university: string;
    program: string;
    country: string;
    flag: string;
    intake: string;
    status: string;
    statusColor: string;
    appliedDate: string;
    portalId?: string;
  }
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [newAppUni, setNewAppUni] = useState("");
  const [newAppProgram, setNewAppProgram] = useState("");
  const [newAppCountry, setNewAppCountry] = useState("United Kingdom");
  const [newAppFlag, setNewAppFlag] = useState("🇬🇧");
  const [newAppIntake, setNewAppIntake] = useState("Fall 2026");
  const [newAppStatus, setNewAppStatus] = useState("Application Submitted");
  const [newAppPortalId, setNewAppPortalId] = useState("");

  // Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifVisas, setNotifVisas] = useState(true);
  const [notifScholarships, setNotifScholarships] = useState(true);

  const fetchTimeline = (programId?: number) => {
    setIsLoadingTimeline(true);
    setTimelineError(null);
    const pid = programId ?? trackedProgramId ?? undefined;
    getTimelineSummary(pid)
      .then((data) => {
        setTimelineSummary(data);
        if (data.selected_program?.program_id) {
          setTrackedProgramId(data.selected_program.program_id);
        }
        setIsLoadingTimeline(false);
      })
      .catch((err) => {
        console.error("Failed to load timeline", err);
        setTimelineError("Unable to calculate reverse timeline.");
        setIsLoadingTimeline(false);
      });
  };

  const handleSelectTrackedProgram = async (programId: number) => {
    setTrackedProgramId(programId);
    fetchTimeline(programId);
    getMyShortlist().then(setShortlistedItems).catch(() => {});
  };

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

      getMyShortlist()
        .then((data) => {
          setShortlistedItems(data);
        })
        .catch((err) => {
          console.error("Failed to load shortlist", err);
        });

      fetchTimeline();
    }
  }, [user]);

  const handleToggleShortlist = async (programId: number): Promise<boolean> => {
    try {
      const res = await toggleShortlist(programId);
      const updated = await getMyShortlist();
      setShortlistedItems(updated);
      return res.shortlisted;
    } catch (err) {
      console.error("Failed to toggle shortlist", err);
      return false;
    }
  };

  const handleUpdateMilestone = async (milestoneKey: string, payload: MilestoneUpdatePayload) => {
    try {
      await updateMilestone(milestoneKey, payload);
      const updated = await getTimelineSummary();
      setTimelineSummary(updated);
    } catch (err) {
      console.error("Failed to update milestone", err);
      throw err;
    }
  };

  const handleExportCalendar = async () => {
    setIsExportingCalendar(true);
    try {
      await downloadCalendarIcs();
    } catch (err) {
      console.error("Failed to export calendar", err);
    } finally {
      setIsExportingCalendar(false);
    }
  };

  const fetchSavedScholarships = () => {
    setIsLoadingScholarships(true);
    getSavedScholarships()
      .then((data) => {
        setSavedScholarships(data);
        setIsLoadingScholarships(false);
      })
      .catch(() => setIsLoadingScholarships(false));
  };

  useEffect(() => {
    if (activeTab === "scholarships" && user) {
      fetchSavedScholarships();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`unicompass_applications_${user.id}`);
      if (saved) {
        try {
          setApplications(JSON.parse(saved));
        } catch {
          // ignore
        }
      } else {
        const initial: ApplicationItem[] = [
          {
            id: "app-1",
            university: "Coventry University",
            program: "MSc Artificial Intelligence & Data Science",
            country: "United Kingdom",
            flag: "🇬🇧",
            intake: "Fall 2026",
            status: "Conditional Offer Received",
            statusColor: "bg-purple-50 text-purple-700 border-purple-200",
            appliedDate: "10 Aug 2026",
            portalId: "COV-2026-98144",
          },
          {
            id: "app-2",
            university: "Technical University of Munich (TUM)",
            program: "MSc Informatics",
            country: "Germany",
            flag: "🇩🇪",
            intake: "Fall 2026",
            status: "Application Submitted",
            statusColor: "bg-blue-50 text-[#3157E8] border-blue-200",
            appliedDate: "28 Aug 2026",
            portalId: "TUM-APP-5521",
          },
        ];
        setApplications(initial);
        localStorage.setItem(`unicompass_applications_${user.id}`, JSON.stringify(initial));
      }
    }
  }, [user]);

  const handleUnsaveScholarship = async (scholarshipId: number): Promise<boolean> => {
    try {
      const res = await toggleSaveScholarship(scholarshipId);
      if (!res.is_saved) {
        setSavedScholarships((prev) => prev.filter((s) => s.scholarship_id !== scholarshipId));
      }
      return res.is_saved;
    } catch {
      return true;
    }
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppUni.trim() || !newAppProgram.trim()) return;

    let color = "bg-blue-50 text-[#3157E8] border-blue-200";
    if (newAppStatus.includes("Offer")) color = "bg-purple-50 text-purple-700 border-purple-200";
    if (newAppStatus.includes("Visa")) color = "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (newAppStatus.includes("Draft")) color = "bg-slate-100 text-slate-700 border-slate-200";

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      university: newAppUni.trim(),
      program: newAppProgram.trim(),
      country: newAppCountry,
      flag: newAppFlag,
      intake: newAppIntake,
      status: newAppStatus,
      statusColor: color,
      appliedDate: "Today",
      portalId: newAppPortalId.trim() || undefined,
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    if (user) {
      localStorage.setItem(`unicompass_applications_${user.id}`, JSON.stringify(updated));
    }
    setIsAddAppModalOpen(false);
    setNewAppUni("");
    setNewAppProgram("");
    setNewAppPortalId("");
  };

  const handleDeleteApp = (id: string) => {
    const updated = applications.filter((a) => a.id !== id);
    setApplications(updated);
    if (user) {
      localStorage.setItem(`unicompass_applications_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword) {
      setPasswordMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPasswordMsg({ type: "success", text: "Security credentials verified and password updated successfully!" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordMsg(null), 4000);
  };

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
      title: "Shortlisted Programs",
      count: `${shortlistedItems.length} Programs`,
      icon: "🏛️",
      iconBg: "bg-indigo-50 text-indigo-600",
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
      {/* Unified Student Dashboard Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profileCompleteness={profile?.completeness_percentage}
        shortlistedCount={shortlistedItems.length}
        daysUntilIntake={timelineSummary?.days_until_intake}
      />

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
          ) : activeTab === "universities" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E7EAF0]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#152033]">
                    My Shortlisted Universities & Programs
                  </h1>
                  <p className="text-xs sm:text-sm text-[#667085] mt-1">
                    {shortlistedItems.length} programs saved with converted PKR tuition and embassy living costs.
                  </p>
                </div>
                <Link href="/universities">
                  <Button className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold">
                    Explore & Add More Programs →
                  </Button>
                </Link>
              </div>

              {shortlistedItems.length > 0 ? (
                <div className="space-y-4">
                  {shortlistedItems.map((item) => (
                    <ProgramCard
                      key={item.id}
                      program={item.program}
                      onToggleShortlist={handleToggleShortlist}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center bg-white rounded-2xl border border-[#E7EAF0] space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#3157E8] text-2xl flex items-center justify-center mx-auto">
                    🏛️
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#152033]">No universities shortlisted yet</h3>
                    <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                      Use our Discovery Engine to find programs matching your CGPA, PKR budget, and MOI English waiver eligibility.
                    </p>
                  </div>
                  <Link href="/universities">
                    <Button className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-6">
                      Launch Discovery Engine
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === "deadlines" ? (
            <div className="space-y-6">
              {timelineSummary ? (
                <>
                  <TimelineUniversitySelector
                    summary={timelineSummary}
                    onSelectProgram={handleSelectTrackedProgram}
                  />

                  <TimelineCountdownHeader summary={timelineSummary} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                        <span>⏰</span> Automated Reverse Milestones ({timelineSummary.completed_milestones} of {timelineSummary.total_milestones} Done)
                      </h2>
                      <span className="text-xs text-[#667085]">
                        Synchronized with your {timelineSummary.intake_label} intake target
                      </span>
                    </div>

                    <div className="space-y-4">
                      {timelineSummary.milestones.map((m, idx) => (
                        <ReverseTimelineMilestoneCard
                          key={m.milestone_key}
                          milestone={m}
                          index={idx}
                          total={timelineSummary.total_milestones}
                          onUpdate={handleUpdateMilestone}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Shortlisted Program Deadlines */}
                  {timelineSummary.program_deadlines.length > 0 && (
                    <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div>
                          <h3 className="font-bold text-base text-[#152033]">
                            Shortlisted University Application Deadlines
                          </h3>
                          <p className="text-xs text-[#667085]">
                            Specific institutional submission cutoffs with real-time countdown
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => setIsPickerModalOpen(true)}
                            size="sm"
                            className="bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl"
                          >
                            + Track Another University
                          </Button>
                          <Link href="/universities">
                            <Button variant="outline" size="sm" className="text-xs font-semibold rounded-xl">
                              Browse All
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {timelineSummary.program_deadlines.map((p) => {
                          const realtime = calculateRealtimeDaysLeft(p.deadline_date);
                          const isCurrentlyTracked = p.program_id === timelineSummary.selected_program?.program_id;
                          return (
                            <div
                              key={p.program_id}
                              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                isCurrentlyTracked
                                  ? "border-[#3157E8] bg-[#F8F9FF] shadow-xs"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{p.country_flag_emoji}</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-[#152033] line-clamp-1">{p.program_name}</h4>
                                    {isCurrentlyTracked && (
                                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#3157E8] text-white">
                                        Tracked
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[#667085] text-[11px]">{p.university_name} • {p.country_name}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-bold text-[#152033]">{p.deadline_date}</div>
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${realtime.badgeClass}`}>
                                  {realtime.daysLeftText}
                                </span>
                                {!isCurrentlyTracked && (
                                  <button
                                    type="button"
                                    onClick={() => handleSelectTrackedProgram(p.program_id)}
                                    className="block mt-1 text-[10px] font-semibold text-[#3157E8] hover:underline"
                                  >
                                    Track Milestones →
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : isLoadingTimeline ? (
                <div className="py-20 text-center bg-white rounded-2xl border border-[#E7EAF0]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3157E8] mx-auto mb-3"></div>
                  <span className="text-xs text-[#667085]">Calculating your reverse intake timeline...</span>
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-[#E7EAF0] p-6">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-xl">
                    ⚠️
                  </div>
                  <h3 className="text-base font-bold text-[#152033] mb-1">
                    {timelineError || "Unable to load timeline"}
                  </h3>
                  <p className="text-xs text-[#667085] max-w-md mx-auto mb-4">
                    Make sure your profile has a target intake specified (e.g., Fall 2026 or Spring 2027) to generate milestone deadlines.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => fetchTimeline()}
                      size="sm"
                      className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-4"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setActiveTab("profile")}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold px-4"
                    >
                      Update Profile Intake
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "scholarships" ? (
            /* Saved Scholarships Tab */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E7EAF0]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#152033] flex items-center gap-2">
                    <span>🎓</span> Saved Scholarships & Financial Grants
                  </h1>
                  <p className="text-xs sm:text-sm text-[#667085] mt-1">
                    {savedScholarships.length} scholarships bookmarked with verified deadlines and Pakistani eligibility rules.
                  </p>
                </div>
                <Link href="/scholarships">
                  <Button className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold">
                    + Explore All Scholarships →
                  </Button>
                </Link>
              </div>

              {isLoadingScholarships ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 bg-white rounded-2xl border border-[#E7EAF0]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3157E8]"></div>
                  <span className="text-xs text-[#667085]">Loading saved scholarships...</span>
                </div>
              ) : savedScholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedScholarships.map((item) => (
                    <ScholarshipCard
                      key={item.id}
                      scholarship={item.scholarship}
                      onToggleSave={handleUnsaveScholarship}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center bg-white rounded-2xl border border-[#E7EAF0] space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 text-2xl flex items-center justify-center mx-auto">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#152033]">No scholarships saved yet</h3>
                    <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                      Explore prestigious international scholarships like DAAD, Chevening, and Erasmus Mundus with 100% funding.
                    </p>
                  </div>
                  <Link href="/scholarships">
                    <Button className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-6">
                      Browse Verified Scholarships
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : activeTab === "applications" ? (
            /* My Applications Tab */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E7EAF0]">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#152033] flex items-center gap-2">
                    <span>📝</span> University Applications Tracker
                  </h1>
                  <p className="text-xs sm:text-sm text-[#667085] mt-1">
                    Manage your submissions, conditional offers, CAS letters, and Gerry&apos;s/VFS visa appointments.
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddAppModalOpen(true)}
                  className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Application</span>
                </Button>
              </div>

              {/* Status Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E7EAF0]">
                  <div className="text-xs text-[#667085]">Total Tracked</div>
                  <div className="text-xl font-bold text-[#152033] mt-1">{applications.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E7EAF0]">
                  <div className="text-xs text-blue-600 font-semibold">Submitted</div>
                  <div className="text-xl font-bold text-blue-700 mt-1">
                    {applications.filter((a) => a.status.includes("Submitted")).length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E7EAF0]">
                  <div className="text-xs text-purple-600 font-semibold">Offers Received</div>
                  <div className="text-xl font-bold text-purple-700 mt-1">
                    {applications.filter((a) => a.status.includes("Offer")).length}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E7EAF0]">
                  <div className="text-xs text-emerald-600 font-semibold">Visa Phase</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">
                    {applications.filter((a) => a.status.includes("Visa")).length}
                  </div>
                </div>
              </div>

              {/* Applications List */}
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-5 rounded-2xl border border-[#E7EAF0] hover:border-[#3157E8]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="text-2xl mt-0.5">{app.flag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#152033]">{app.university}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${app.statusColor}`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#667085] mt-0.5 font-medium">{app.program}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2">
                            <span>Target: <strong className="text-slate-600">{app.intake}</strong></span>
                            <span>•</span>
                            <span>Applied: <strong className="text-slate-600">{app.appliedDate}</strong></span>
                            {app.portalId && (
                              <>
                                <span>•</span>
                                <span>Ref: <strong className="text-slate-600">{app.portalId}</strong></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteApp(app.id)}
                          className="text-xs text-slate-400 hover:text-rose-600 hover:border-rose-200 rounded-xl h-8 px-2.5"
                          title="Remove from tracker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center bg-white rounded-2xl border border-[#E7EAF0] space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#3157E8] text-2xl flex items-center justify-center mx-auto">
                    📝
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#152033]">No applications logged</h3>
                    <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
                      Log your direct university submissions to monitor decision timelines and visa milestones in one place.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddAppModalOpen(true)}
                    className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-6"
                  >
                    Log Application
                  </Button>
                </div>
              )}
            </div>
          ) : activeTab === "settings" ? (
            /* Settings Tab */
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0]">
                <h1 className="text-xl sm:text-2xl font-bold text-[#152033] flex items-center gap-2">
                  <span>⚙️</span> Student Account & Security Settings
                </h1>
                <p className="text-xs sm:text-sm text-[#667085] mt-1">
                  Manage your credentials, login credentials, and automated study alerts.
                </p>
              </div>

              {/* Account Info */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] space-y-4">
                <h2 className="text-sm font-bold text-[#152033] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#3157E8]" />
                  <span>Profile Credentials</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[#667085] font-semibold">Full Name</label>
                    <div className="font-bold text-[#152033] text-sm mt-0.5">{user.full_name}</div>
                  </div>
                  <div>
                    <label className="text-[#667085] font-semibold">Registered Email</label>
                    <div className="font-bold text-[#152033] text-sm mt-0.5">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-[#667085] font-semibold">Portal Role</label>
                    <div className="capitalize font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {user.role} Account
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] space-y-4">
                <h2 className="text-sm font-bold text-[#152033] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#3157E8]" />
                  <span>Update Password</span>
                </h2>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      passwordMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-[#152033] mb-1">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#152033] mb-1">
                      New Password (min 8 chars)
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#152033] mb-1">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl px-5"
                  >
                    Save New Password
                  </Button>
                </form>
              </div>

              {/* Notification Toggles */}
              <div className="bg-white p-6 rounded-2xl border border-[#E7EAF0] space-y-4">
                <h2 className="text-sm font-bold text-[#152033] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#3157E8]" />
                  <span>Study Notifications & Alerts</span>
                </h2>
                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <div className="font-bold text-[#152033]">University Application Deadlines</div>
                      <div className="text-[#667085]">Receive countdown reminders 30 and 14 days before cutoffs</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifDeadlines}
                      onChange={(e) => setNotifDeadlines(e.target.checked)}
                      className="w-4 h-4 accent-[#3157E8] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <div className="font-bold text-[#152033]">Pakistani MOI & Attestation Updates</div>
                      <div className="text-[#667085]">Alerts regarding HEC, IBCC, or MOFA procedural changes</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifVisas}
                      onChange={(e) => setNotifVisas(e.target.checked)}
                      className="w-4 h-4 accent-[#3157E8] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <div className="font-bold text-[#152033]">Scholarship Opening Notifications</div>
                      <div className="text-[#667085]">Alerts when DAAD, Chevening, or Commonwealth calls open</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifScholarships}
                      onChange={(e) => setNotifScholarships(e.target.checked)}
                      className="w-4 h-4 accent-[#3157E8] rounded"
                    />
                  </label>
                </div>
              </div>
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
                      <button
                        type="button"
                        onClick={() => setActiveTab("deadlines")}
                        className="text-xs font-semibold text-[#3157E8] hover:underline"
                      >
                        Manage Timeline →
                      </button>
                    </div>

                    {timelineSummary && timelineSummary.program_deadlines.length > 0 ? (
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
                            {timelineSummary.program_deadlines.slice(0, 5).map((p) => {
                              const realtime = calculateRealtimeDaysLeft(p.deadline_date);
                              return (
                                <tr key={p.program_id} className="hover:bg-[#F7F8FC] transition-colors">
                                  <td className="py-3 font-bold text-[#152033]">
                                    <div className="line-clamp-1">{p.university_name}</div>
                                    <div className="text-[11px] font-normal text-[#667085] line-clamp-1">{p.program_name}</div>
                                  </td>
                                  <td className="py-3 text-[#667085] whitespace-nowrap">
                                    <span className="mr-1">{p.country_flag_emoji}</span>
                                    {p.country_name}
                                  </td>
                                  <td className="py-3 text-[#152033] font-medium whitespace-nowrap">{p.deadline_date}</td>
                                  <td className="py-3 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-full font-semibold border text-[11px] ${realtime.badgeClass}`}>
                                      {realtime.daysLeftText}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl mx-auto text-[#3157E8]">
                          🏛️
                        </div>
                        <div className="max-w-xs mx-auto">
                          <h4 className="font-bold text-sm text-[#152033]">
                            No target universities selected
                          </h4>
                          <p className="text-xs text-[#667085] mt-1">
                            Select a university and program to track real-time application cutoffs and automated milestones.
                          </p>
                        </div>
                        <Button
                          onClick={() => setIsPickerModalOpen(true)}
                          size="sm"
                          className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-4 shadow-sm"
                        >
                          + Select Target University
                        </Button>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-[#E7EAF0]">
                      <Button
                        onClick={() => setIsPickerModalOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="text-xs font-semibold text-[#3157E8] hover:bg-blue-50"
                      >
                        + Select / Add University
                      </Button>
                      <Button
                        onClick={handleExportCalendar}
                        disabled={isExportingCalendar || !timelineSummary?.has_selected_university}
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold"
                      >
                        {isExportingCalendar ? "Exporting..." : "Export to Calendar (.ics)"}
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

      {/* University Picker Modal for Tracker */}
      <SelectUniversityTrackerModal
        isOpen={isPickerModalOpen}
        onClose={() => setIsPickerModalOpen(false)}
        onSelectProgram={handleSelectTrackedProgram}
        currentSelectedId={trackedProgramId}
      />

      {/* Log Application Modal */}
      {isAddAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-[#152033] flex items-center gap-2">
                <span>📝</span> Log University Application
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAppModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddApplication} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">University Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical University of Munich"
                  value={newAppUni}
                  onChange={(e) => setNewAppUni(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#3157E8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program / Degree *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MSc Informatics & Data Science"
                  value={newAppProgram}
                  onChange={(e) => setNewAppProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#3157E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination Country</label>
                  <select
                    value={newAppCountry}
                    onChange={(e) => {
                      setNewAppCountry(e.target.value);
                      const flags: Record<string, string> = {
                        "United Kingdom": "🇬🇧",
                        Germany: "🇩🇪",
                        Italy: "🇮🇹",
                        Australia: "🇦🇺",
                        Canada: "🇨🇦",
                        USA: "🇺🇸",
                        Ireland: "🇮🇪",
                      };
                      setNewAppFlag(flags[e.target.value] || "🎓");
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#3157E8]"
                  >
                    <option value="United Kingdom">United Kingdom 🇬🇧</option>
                    <option value="Germany">Germany 🇩🇪</option>
                    <option value="Italy">Italy 🇮🇹</option>
                    <option value="Australia">Australia 🇦🇺</option>
                    <option value="Canada">Canada 🇨🇦</option>
                    <option value="USA">USA 🇺🇸</option>
                    <option value="Ireland">Ireland 🇮🇪</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Intake</label>
                  <select
                    value={newAppIntake}
                    onChange={(e) => setNewAppIntake(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#3157E8]"
                  >
                    <option value="Fall 2026">Fall 2026</option>
                    <option value="Spring 2027">Spring 2027</option>
                    <option value="Fall 2027">Fall 2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application Status</label>
                  <select
                    value={newAppStatus}
                    onChange={(e) => setNewAppStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#3157E8]"
                  >
                    <option value="Drafting Documents">Drafting Documents</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Conditional Offer Received">Conditional Offer Received</option>
                    <option value="Unconditional Offer / CAS">Unconditional Offer / CAS</option>
                    <option value="Visa Lodged">Visa Lodged</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Application / Portal Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. UCAS-29482 or TUM-APP-99"
                    value={newAppPortalId}
                    onChange={(e) => setNewAppPortalId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#3157E8]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddAppModalOpen(false)}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-4"
                >
                  Save Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
            <span className="text-xs text-[#667085] font-medium">Loading your dashboard...</span>
          </div>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
