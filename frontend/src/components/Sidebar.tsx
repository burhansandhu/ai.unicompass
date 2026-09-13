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
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            // Documents always routes to /attestation
            if (item.id === "documents") {
              return (
                <Link
                  key={item.id}
                  href="/attestation"
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
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

            // If an onTabChange handler is provided (e.g. profile page with tabs)
            if (onTabChange) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
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
                </button>
              );
            }

            // Default: Link to /profile?tab=...
            const targetHref = item.id === "dashboard" ? "/profile" : `/profile?tab=${item.id}`;
            return (
              <Link
                key={item.id}
                href={targetHref}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-colors ${
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
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout */}
      {user && (
        <div className="p-5 border-t border-[#E7EAF0] space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#3157E8] text-white font-bold flex items-center justify-center text-sm shadow-xs">
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
            className="w-full text-xs font-semibold justify-center gap-1.5 border-slate-200 hover:bg-slate-50"
          >
            <span>🚪</span> Sign Out
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
