"use client";

import React, { useState } from "react";
import { Scholarship } from "../types";
import { calculateRealtimeDaysLeft } from "@/features/timeline/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Calendar,
  ExternalLink,
  Bookmark,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onToggleSave?: (id: number) => Promise<boolean>;
  onEdit?: (s: Scholarship) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onToggleSave,
  onEdit,
  onDelete,
  isAdmin = false,
}) => {
  const [isSaved, setIsSaved] = useState(scholarship.is_saved);
  const [isSaving, setIsSaving] = useState(false);

  const deadlineInfo = calculateRealtimeDaysLeft(scholarship.deadline_date);

  const handleSave = async () => {
    if (!onToggleSave || isSaving) return;
    setIsSaving(true);
    try {
      const nextState = await onToggleSave(scholarship.id);
      setIsSaved(nextState);
    } catch {
      // Handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  const getCoverageColor = (cov: string) => {
    const c = cov.toLowerCase();
    if (c.includes("fully funded")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (c.includes("partial")) {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    return "bg-blue-50 text-[#3157E8] border-blue-200";
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7EAF0] hover:border-[#3157E8]/40 hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="country flag">
              {scholarship.country_flag_emoji || "🌍"}
            </span>
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
              {scholarship.country_name || "International"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scholarship.deadline_date && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${deadlineInfo.badgeClass}`}
              >
                <Clock className="w-3 h-3" />
                {deadlineInfo.daysLeftText}
              </span>
            )}

            {!isAdmin && onToggleSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={`p-2 rounded-xl border transition-all ${
                  isSaved
                    ? "bg-[#3157E8] text-white border-[#3157E8]"
                    : "bg-white text-slate-400 border-slate-200 hover:text-[#3157E8] hover:border-slate-300"
                }`}
                title={isSaved ? "Saved to your dashboard" : "Save scholarship"}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>
        </div>

        {/* Title & Provider */}
        <h3 className="font-bold text-lg text-[#152033] group-hover:text-[#3157E8] transition-colors leading-snug line-clamp-2 mb-1.5">
          {scholarship.title}
        </h3>
        <p className="text-xs font-semibold text-[#667085] mb-4 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#3157E8]" />
          <span>{scholarship.provider}</span>
        </p>

        {/* Badge Group */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${getCoverageColor(
              scholarship.coverage_type
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            {scholarship.coverage_type}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-slate-500" />
            {scholarship.degree_level}
          </span>
        </div>

        {/* Coverage Amount Callout */}
        {scholarship.amount_value && (
          <div className="p-3 rounded-xl bg-[#F8F9FF] border border-[#E0E7FF] mb-4">
            <div className="text-[11px] font-bold text-[#3157E8] uppercase tracking-wider mb-0.5">
              Award & Coverage
            </div>
            <div className="text-xs font-medium text-[#152033] line-clamp-2">
              {scholarship.amount_value}
            </div>
          </div>
        )}

        {/* Eligibility Snippet */}
        {scholarship.eligibility_criteria && (
          <div className="text-xs text-[#667085] mb-4 line-clamp-3">
            <strong className="text-slate-800 font-semibold">Eligibility: </strong>
            {scholarship.eligibility_criteria}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-[#E7EAF0] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#667085]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Deadline: <strong className="text-slate-700">{scholarship.deadline_date}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {scholarship.application_link ? (
            <a
              href={scholarship.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button
                size="sm"
                className="w-full bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl gap-1.5 h-9"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </a>
          ) : (
            <Button
              size="sm"
              disabled
              variant="outline"
              className="flex-1 text-xs font-semibold rounded-xl h-9 text-slate-400"
            >
              Check University Portal
            </Button>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(scholarship)}
                  className="text-xs rounded-xl h-9 px-3"
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(scholarship.id)}
                  className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 rounded-xl h-9 px-3"
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
