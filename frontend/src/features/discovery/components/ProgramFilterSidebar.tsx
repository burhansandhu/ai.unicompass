"use client";

import React from "react";
import {
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Coins,
  BookOpen,
} from "lucide-react";
import { ProgramFilterState } from "../types";

interface ProgramFilterSidebarProps {
  filters: ProgramFilterState;
  onChange: (newFilters: ProgramFilterState) => void;
  onReset: () => void;
  isLoggedIn: boolean;
  totalMatches: number;
}

export const ProgramFilterSidebar: React.FC<ProgramFilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  isLoggedIn,
  totalMatches,
}) => {
  const countries = [
    { name: "All Countries", slug: "" },
    { name: "United Kingdom 🇬🇧", slug: "united-kingdom" },
    { name: "Germany 🇩🇪", slug: "germany" },
    { name: "Canada 🇨🇦", slug: "canada" },
    { name: "Australia 🇦🇺", slug: "australia" },
    { name: "United States 🇺🇸", slug: "united-states" },
    { name: "France 🇫🇷", slug: "france" },
  ];

  const degreeLevels = ["All", "Masters", "Bachelors"];

  const disciplines = [
    "All Disciplines",
    "Computer Science & IT",
    "Engineering",
    "Business & Management",
    "Health Sciences",
  ];

  const budgetPresets = [
    { label: "Any Budget", value: undefined },
    { label: "Tuition-Free (Rs 0)", value: 3600000 }, // Covers living only
    { label: "Under 40 Lakhs PKR", value: 4000000 },
    { label: "Under 75 Lakhs PKR", value: 7500000 },
    { label: "Under 1.2 Crore PKR", value: 12000000 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#3157E8]" />
          <h2 className="text-sm font-bold text-[#152033]">Filter & Match</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#667085] hover:text-[#3157E8] flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-[#152033] mb-1.5 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-[#3157E8]" />
          Search Programs or Universities
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="e.g. Data Science, Oxford, Munich..."
            className="w-full px-3.5 py-2 pl-9 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Match My Profile Toggle (If logged in) */}
      {isLoggedIn && (
        <div className="p-3 rounded-xl bg-[#EEF2FF] border border-[#3157E8]/20">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3157E8]" />
              <div>
                <div className="text-xs font-bold text-[#152033]">Match My Profile</div>
                <p className="text-[11px] text-[#667085]">Filter using my CGPA, PKR budget & English</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!filters.match_my_profile}
              onChange={(e) => onChange({ ...filters, match_my_profile: e.target.checked })}
              className="w-4 h-4 text-[#3157E8] rounded border-slate-300 focus:ring-[#3157E8]"
            />
          </label>
        </div>
      )}

      {/* MOI English Waiver Only Toggle */}
      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <div>
              <div className="text-xs font-bold text-[#152033]">MOI Waiver Only (No IELTS)</div>
              <p className="text-[11px] text-[#667085]">Universities accepting Pakistani English letters</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={!!filters.moi_only}
            onChange={(e) => onChange({ ...filters, moi_only: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
        </label>
      </div>

      {/* Destination Country Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
          <Globe2 className="w-3.5 h-3.5 text-[#3157E8]" />
          Target Destination
        </label>
        <div className="space-y-1">
          {countries.map((ctry) => (
            <button
              key={ctry.slug}
              type="button"
              onClick={() => onChange({ ...filters, country_slug: ctry.slug || undefined })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                (filters.country_slug || "") === ctry.slug
                  ? "bg-[#3157E8] text-white font-semibold"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{ctry.name}</span>
              {(filters.country_slug || "") === ctry.slug && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Degree Level Filter */}
      <div>
        <label className="block text-xs font-semibold text-[#152033] mb-2 flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-[#3157E8]" />
          Degree Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {degreeLevels.map((lvl) => {
            const isSelected = (filters.degree_level || "All") === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ ...filters, degree_level: lvl === "All" ? undefined : lvl })}
                className={`py-1.5 px-2 text-xs rounded-lg font-semibold transition-colors text-center ${
                  isSelected
                    ? "bg-[#3157E8] text-white shadow-sm"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discipline / Field of Study */}
      <div>
        <label className="block text-xs font-semibold text-[#152033] mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#3157E8]" />
          Field of Study
        </label>
        <select
          value={filters.discipline || "All Disciplines"}
          onChange={(e) =>
            onChange({
              ...filters,
              discipline: e.target.value === "All Disciplines" ? undefined : e.target.value,
            })
          }
          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033] bg-white"
        >
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Max Annual Budget in PKR */}
      <div>
        <label className="block text-xs font-semibold text-[#152033] mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#3157E8]" />
            Max Annual Budget (PKR)
          </span>
          {filters.max_budget_pkr && (
            <span className="text-[11px] font-bold text-[#3157E8]">
              Rs {(filters.max_budget_pkr / 100000).toFixed(0)} Lakhs
            </span>
          )}
        </label>

        <div className="space-y-1.5">
          {budgetPresets.map((b, idx) => {
            const isSelected = filters.max_budget_pkr === b.value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onChange({ ...filters, max_budget_pkr: b.value })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#3157E8]/10 text-[#3157E8] font-bold border border-[#3157E8]/30"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{b.label}</span>
                {isSelected && <span className="text-[#3157E8]">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
