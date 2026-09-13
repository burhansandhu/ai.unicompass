"use client";

import React, { useState } from "react";
import { Building2, Calendar, Sparkles, ChevronDown, Check, Globe, GraduationCap } from "lucide-react";
import { TimelineSummary, SelectedProgramInfo } from "../types";
import { calculateRealtimeDaysLeft } from "../utils";
import { SelectUniversityTrackerModal } from "./SelectUniversityTrackerModal";
import { Button } from "@/components/ui/button";

interface TimelineUniversitySelectorProps {
  summary: TimelineSummary;
  onSelectProgram: (programId: number) => void;
}

export const TimelineUniversitySelector: React.FC<TimelineUniversitySelectorProps> = ({
  summary,
  onSelectProgram,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selected = summary.selected_program;
  const realtimeCutoff = selected ? calculateRealtimeDaysLeft(selected.deadline_date) : null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        {selected ? (
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs">
                  {selected.country_flag_emoji || "🏛️"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      {selected.country_name}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-bold text-[#3157E8] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                      Primary Tracked University
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[#152033] tracking-tight">
                    {selected.university_name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Switch / Change University
                </Button>
              </div>
            </div>

            {/* Program details banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  Target Program
                </div>
                <div className="text-sm font-bold text-[#152033] line-clamp-1">
                  {selected.program_name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Est. Tuition: {selected.annual_tuition_formatted || "Tuition Free"}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Application Cutoff
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#152033]">
                    {selected.deadline_date}
                  </span>
                  {realtimeCutoff && (
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${realtimeCutoff.badgeClass}`}>
                      {realtimeCutoff.daysLeftText}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Synchronized with {summary.intake_label} intake
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  English Requirement
                </div>
                <div>
                  {selected.accepts_moi ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ✓ Pakistani MOI Accepted
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#152033]">
                      IELTS {selected.min_ielts_score ? `${selected.min_ielts_score} Minimum` : "Required"}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selected.accepts_moi ? "No IELTS needed with uni letter" : "Exam slot booking recommended"}
                </div>
              </div>
            </div>

            {/* Quick Switch between shortlisted programs if user has multiple */}
            {summary.program_deadlines.length > 1 && (
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Track another shortlisted program:
                </span>
                {summary.program_deadlines.map((p) => {
                  const isCurrent = p.program_id === selected.program_id;
                  return (
                    <button
                      key={p.program_id}
                      type="button"
                      onClick={() => !isCurrent && onSelectProgram(p.program_id)}
                      className={`text-xs px-3 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                        isCurrent
                          ? "bg-[#3157E8] text-white font-bold shadow-xs cursor-default"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{p.country_flag_emoji}</span>
                      <span>{p.university_name}</span>
                      {isCurrent && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Empty state: prompt student to select a university first */
          <div className="text-center py-6 px-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto text-2xl shadow-xs">
              🏛️
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-[#152033]">
                Select a University to Track Deadlines
              </h3>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                First, select your target university and degree program. Our deadline tracker will automatically calculate real-time cutoffs, IELTS/MOI deadlines, tuition deposit dates, and visa submission windows.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-6 py-2.5 shadow-sm"
            >
              + Select Target University
            </Button>
          </div>
        )}
      </div>

      <SelectUniversityTrackerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProgram={onSelectProgram}
        currentSelectedId={selected?.program_id}
      />
    </>
  );
};
