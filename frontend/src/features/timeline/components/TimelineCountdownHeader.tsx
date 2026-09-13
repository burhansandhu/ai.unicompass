"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Download,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  Loader2,
  Calendar,
} from "lucide-react";
import { TimelineSummary } from "../types";
import { downloadCalendarIcs } from "../api";
import { Button } from "@/components/ui/button";

interface TimelineCountdownHeaderProps {
  summary: TimelineSummary;
}

export const TimelineCountdownHeader: React.FC<TimelineCountdownHeaderProps> = ({ summary }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportDone, setExportDone] = useState<boolean>(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportDone(false);
    try {
      await downloadCalendarIcs();
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) {
      console.error("Failed to download ics", err);
    } finally {
      setIsExporting(false);
    }
  };

  const progressPercent = Math.round(
    (summary.completed_milestones / Math.max(1, summary.total_milestones)) * 100
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Intake Target & Global Countdown */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#3157E8] border border-[#3157E8]/20 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Target Intake: {summary.intake_label}
            </span>
            <span className="text-xs text-[#667085]">
              (Program Start: <strong>{summary.anchor_date}</strong>)
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#152033] tracking-tight">
            {summary.days_until_intake} Days Until Intake
          </h2>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Automated reverse timeline synchronizing your IELTS, university cutoffs, mandatory 28-day bank balance, and visa filing.
          </p>
        </div>

        {/* Right: Progress & 1-Click Calendar Export */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center min-w-[130px]">
            <div className="text-lg font-bold text-[#152033]">
              {summary.completed_milestones} / {summary.total_milestones}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
              Milestones Done ({progressPercent}%)
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs font-semibold px-5 py-2.5 h-auto flex items-center gap-2 shadow-sm transition-all"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating .ics Calendar...
              </>
            ) : exportDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Calendar Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export to Calendar (.ics)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3157E8] to-[#10B981] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
