"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getMyProfile } from "@/features/profile/api";
import { getMyShortlist } from "@/features/discovery/api";
import { getTimelineSummary } from "@/features/timeline/api";

export interface SidebarProps {
  activeTab: string; // "dashboard" | "profile" | "universities" | "scholarships" | "applications" | "deadlines" | "documents" | "advisor" | "settings"
  onTabChange?: (tab: string) => void;
  profileCompleteness?: number;
  shortlistedCount?: number;
  daysUntilIntake?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  profileCompleteness: propProfileCompleteness,
  shortlistedCount: propShortlistedCount,
  daysUntilIntake: propDaysUntilIntake,
}) => {
  const { user, logout } = useAuth();
  const [profileComp, setProfileComp] = useState<number | undefined>(propProfileCompleteness);
  const [shortlistCount, setShortlistCount] = useState<number | undefined>(propShortlistedCount);
  const [daysLeft, setDaysLeft] = useState<number | undefined>(propDaysUntilIntake);

  useEffect(() => {
    if (propProfileCompleteness !== undefined) setProfileComp(propProfileCompleteness);
  }, [propProfileCompleteness]);

  useEffect(() => {
    if (propShortlistedCount !== undefined) setShortlistCount(propShortlistedCount);
  }, [propShortlistedCount]);

  useEffect(() => {
    if (propDaysUntilIntake !== undefined) setDaysLeft(propDaysUntilIntake);
  }, [propDaysUntilIntake]);

  // If props were not supplied (e.g. on /attestation page), fetch badges once for current user
  useEffect(() => {
    if (user) {
      if (propProfileCompleteness === undefined) {
        getMyProfile()
          .then((p) => setProfileComp(p?.completeness_percentage || 0))
          .catch(() => {});
      }
      if (propShortlistedCount === undefined) {
        getMyShortlist()
          .then((items) => setShortlistCount(items?.length || 0))
          .catch(() => {});
      }
      if (propDaysUntilIntake === undefined) {
        getTimelineSummary()
          .then((s) => setDaysLeft(s?.days_until_intake))
          .catch(() => {});
      }
    }
  }, [user, propProfileCompleteness, propShortlistedCount, propDaysUntilIntake]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "profile", label: "My Profile", icon: "👤" },
    { id: "universities", label: "Shortlisted Universities", icon: "🏛️" },
    { id: "scholarships", label: "Saved Scholarships", icon: "🎓" },
    { id: "applications", label: "My Applications", icon: "📝" },
    { id: "deadlines", label: "Deadline Tracker", icon: "⏰" },
    { id: "documents", label: "Documents & Attestation", icon: "📑" },
    { id: "advisor", label: "AI Advisor", icon: "🤖" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-[#E7EAF0] flex-col fixed inset-y-0 left-0 z-30 overflow-hidden">
      {/* Logo Header (aligned with h-20 topbar) */}
      <div className="h-20 shrink-0 flex items-center px-6 border-b border-[#E7EAF0]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            ✦
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#152033]">
            UniCompass
          </span>
        </Link>
      </div>

      {/* Navigation Links (Scrollable if height is constrained) */}
      <nav className="flex-1 overflow-y-auto min-h-0 px-3 py-3 space-y-1 text-sm font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          // Documents always routes to /attestation
          if (item.id === "documents") {
            return (
              <Link
                key={item.id}
                href="/attestation"
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors text-[13px] ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#3157E8] font-bold"
                    : "text-[#667085] hover:bg-[#F7F8FC] hover:text-[#3157E8]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="truncate flex-1">{item.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Tracker
                </span>
              </Link>
            );
          }

          const targetHref = item.id === "dashboard" ? "/profile" : `/profile?tab=${item.id}`;

          return (
            <Link
              key={item.id}
              href={targetHref}
              onClick={(e) => {
                if (onTabChange) {
                  e.preventDefault();
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors text-[13px] ${
                isActive
                  ? "bg-[#EEF2FF] text-[#3157E8] font-bold"
                  : "text-[#667085] hover:bg-[#F7F8FC] hover:text-[#152033]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="truncate flex-1">{item.label}</span>
              {item.id === "profile" && profileComp !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3157E8]/10 text-[#3157E8]">
                  {profileComp}%
                </span>
              )}
              {item.id === "universities" && shortlistCount !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3157E8]/10 text-[#3157E8]">
                  {shortlistCount}
                </span>
              )}
              {item.id === "deadlines" && daysLeft !== undefined && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {daysLeft}d left
                </span>
              )}
              {item.id === "advisor" && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Sign Out (Always visible, pinned to bottom) */}
      {user && (
        <div className="shrink-0 p-3.5 border-t border-[#E7EAF0] bg-[#FAFAFC] space-y-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-[#3157E8] text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              {user.full_name?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden min-w-0 flex-1">
              <div className="text-xs font-bold text-[#152033] truncate">{user.full_name}</div>
              <div className="text-[11px] text-[#667085] capitalize truncate">{user.role} Portal</div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="w-full h-8 text-xs font-semibold justify-center gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors rounded-xl shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
