"use client";

import React, { useState } from "react";
import {
  Heart,
  Building2,
  MapPin,
  Calendar,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Coins,
  Clock,
  Loader2,
  Check,
} from "lucide-react";
import { Program } from "../types";

interface ProgramCardProps {
  program: Program;
  onToggleShortlist: (programId: number) => Promise<boolean>;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onToggleShortlist }) => {
  const [isShortlisted, setIsShortlisted] = useState<boolean>(program.is_shortlisted);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    try {
      const newState = await onToggleShortlist(program.id);
      setIsShortlisted(newState);
    } catch (err) {
      console.error("Failed to toggle shortlist", err);
    } finally {
      setIsToggling(false);
    }
  };

  // Format currency in Lakhs or Millions PKR for Pakistani readability
  const formatPkrLakhs = (val: number) => {
    if (val === 0) return "Rs 0 (Tuition Free)";
    const inLakhs = val / 100000;
    if (inLakhs >= 100) {
      return `Rs ${(inLakhs / 100).toFixed(2)} Crore`;
    }
    return `Rs ${inLakhs.toFixed(1)} Lakhs`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#3157E8]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner & Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
              {program.country_flag_emoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#667085] flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {program.university_name}
                </span>
                {program.university_world_ranking && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    #{program.university_world_ranking} Worldwide
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#152033] mt-0.5 group-hover:text-[#3157E8] transition-colors line-clamp-1">
                {program.name}
              </h3>
              <p className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {program.university_city}, {program.country_name}
              </p>
            </div>
          </div>

          {/* Shortlist Heart Action Button */}
          <button
            type="button"
            onClick={handleHeartClick}
            disabled={isToggling}
            className={`p-2.5 rounded-xl border transition-all duration-150 shrink-0 ${
              isShortlisted
                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/50"
            }`}
            title={isShortlisted ? "Remove from Shortlist" : "Save to Shortlist"}
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            ) : (
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isShortlisted ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
            )}
          </button>
        </div>

        {/* Feature Badges: MOI, CGPA, Discipline */}
        <div className="flex flex-wrap items-center gap-1.5 my-3">
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3157E8] border border-blue-200">
            {program.degree_level} • {program.duration_years} {program.duration_years === 1 ? "Year" : "Years"}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {program.discipline}
          </span>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Min CGPA {program.min_cgpa}
          </span>

          {/* MOI English Waiver Badge */}
          {program.moi_waiver_eligible ? (
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"
              title={program.moi_conditions || "Accepts English Medium of Instruction letter from Pakistani universities"}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              MOI Waiver Accepted ✓ (No IELTS)
            </span>
          ) : program.min_ielts_score ? (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
              IELTS {program.min_ielts_score}+
            </span>
          ) : null}

          {/* Profile Match Score Badge if matched */}
          {program.match_status && (
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                program.match_status === "eligible"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : program.match_status === "competitive"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {program.match_status === "eligible"
                ? "Highly Eligible"
                : program.match_status === "competitive"
                ? "Competitive Match"
                : "Stretch Program"}
            </span>
          )}
        </div>

        {/* Real-time PKR Cost Breakdown Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#FAFBFD] border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1 text-[11px]">
              <Coins className="w-3.5 h-3.5 text-[#3157E8]" />
              Annual Tuition Fee:
            </span>
            <span className="font-semibold text-[#152033]">
              {program.annual_tuition_original === 0 ? (
                <strong className="text-emerald-600 font-bold">€0 (Tuition-Free Public)</strong>
              ) : (
                <>
                  {program.currency_symbol}
                  {program.annual_tuition_original.toLocaleString()} ({formatPkrLakhs(program.annual_tuition_pkr)})
                </>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="flex items-center gap-1 text-[11px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Embassy Living Threshold:
            </span>
            <span className="font-semibold text-[#152033]">
              ≈ {formatPkrLakhs(program.annual_living_cost_pkr)} / yr
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between font-bold text-[#152033]">
            <span className="text-[11px] text-slate-700">Total Out-of-Pocket / yr:</span>
            <span className="text-sm font-extrabold text-[#3157E8]">
              {formatPkrLakhs(program.total_annual_cost_pkr)}
            </span>
          </div>
        </div>

        {/* Match reason notice if available */}
        {program.match_reason && (
          <p className="mt-2.5 text-[11px] text-[#667085] italic line-clamp-1">
            {program.match_reason}
          </p>
        )}
      </div>

      {/* Footer: Deadlines & Actions */}
      <div className="px-5 py-3.5 sm:px-6 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-[#3157E8]" />
          <span>
            {program.application_deadline_fall ? (
              <>
                Fall Cutoff: <strong className="font-semibold text-slate-800">{program.application_deadline_fall}</strong>
              </>
            ) : (
              "Rolling Admissions"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {program.description && (
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Verified Intake 2026/27
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
