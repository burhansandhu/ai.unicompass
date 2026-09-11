"use client";

import React from "react";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Info } from "lucide-react";
import { AttestationSummary } from "../types";

interface AttestationProgressBannerProps {
  summary: AttestationSummary;
}

export const AttestationProgressBanner: React.FC<AttestationProgressBannerProps> = ({ summary }) => {
  const notStartedSteps =
    summary.total_steps - summary.completed_steps - summary.in_progress_steps;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Title & Progress Bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#3157E8]" />
              <span className="text-sm font-bold text-[#152033]">
                Legalization Readiness Score
              </span>
            </div>
            <span className="text-sm font-extrabold text-[#3157E8]">
              {summary.completion_percentage}% Completed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className="h-full bg-gradient-to-r from-[#3157E8] to-[#10B981] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${summary.completion_percentage}%` }}
            />
          </div>

          <p className="text-xs text-[#667085] mt-2">
            {summary.completion_percentage === 100 ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> All primary educational and identity documents are fully legalized for visa submission!
              </span>
            ) : (
              `Complete all 4 verification milestones to ensure your documents are legally accepted by foreign embassies and visa officers.`
            )}
          </p>
        </div>

        {/* Right: Metric Pills */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-center min-w-[90px]">
            <div className="text-lg font-bold text-slate-700">{notStartedSteps}</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Not Started</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-center min-w-[90px]">
            <div className="text-lg font-bold text-amber-700">{summary.in_progress_steps}</div>
            <div className="text-[11px] font-medium text-amber-600 mt-0.5">In Progress</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-center min-w-[90px]">
            <div className="text-lg font-bold text-emerald-700">{summary.completed_steps}</div>
            <div className="text-[11px] font-medium text-emerald-600 mt-0.5">Completed</div>
          </div>
        </div>
      </div>

      {/* Recommended Verification Sequence Ribbon */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-[#3157E8]" />
          <span className="text-xs font-bold text-[#152033] uppercase tracking-wide">
            Mandatory Verification Sequence in Pakistan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#152033]">1. Matric & Inter</span>
              <p className="text-[11px] text-[#667085]">BISE Board Verification</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden md:block" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#152033]">2. IBCC Equivalency</span>
              <p className="text-[11px] text-[#667085]">Attestation with QR Code</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden md:block" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#152033]">3. HEC E-Portal</span>
              <p className="text-[11px] text-[#667085]">Degree & Transcript Stamp</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden md:block" />
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-[#3157E8]">4. MOFA / Apostille</span>
              <p className="text-[11px] text-blue-700">Final Legalization Stamp</p>
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3157E8] shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
