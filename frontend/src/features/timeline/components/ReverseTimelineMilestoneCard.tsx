"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Save,
  Loader2,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { MilestoneItem, MilestoneUpdatePayload } from "../types";

interface ReverseTimelineMilestoneCardProps {
  milestone: MilestoneItem;
  index: number;
  total: number;
  onUpdate: (milestoneKey: string, payload: MilestoneUpdatePayload) => Promise<void>;
}

export const ReverseTimelineMilestoneCard: React.FC<ReverseTimelineMilestoneCardProps> = ({
  milestone,
  index,
  total,
  onUpdate,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(milestone.is_completed);
  const [notes, setNotes] = useState<string>(milestone.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleToggleCompleted = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    try {
      await onUpdate(milestone.milestone_key, { is_completed: nextState });
    } catch (err) {
      console.error("Failed to update milestone", err);
      setIsCompleted(!nextState);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdate(milestone.milestone_key, {
        is_completed: isCompleted,
        notes,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Completed ✓
        </span>
      );
    }
    if (milestone.status === "passed") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          {Math.abs(milestone.days_left)} days overdue
        </span>
      );
    }
    if (milestone.status === "due_soon") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          Due Soon ({milestone.days_left} days left)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#3157E8] border border-blue-200">
        <Clock className="w-3.5 h-3.5 text-[#3157E8]" />
        {milestone.days_left} days left
      </span>
    );
  };

  const isBankBalanceMilestone = milestone.milestone_key === "bank_balance_start";

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm overflow-hidden ${
        isCompleted
          ? "border-emerald-200 ring-1 ring-emerald-50"
          : isBankBalanceMilestone
          ? "border-amber-300 ring-1 ring-amber-100"
          : "border-slate-200"
      }`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Sequence circle */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                isCompleted
                  ? "bg-emerald-600 text-white"
                  : isBankBalanceMilestone
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {isCompleted ? "✓" : index + 1}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3157E8]">
                  Milestone {index + 1} of {total}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 capitalize">{milestone.category} Target</span>
                {isBankBalanceMilestone && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Mandatory 28-Day Rule
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#152033] mt-0.5">
                {milestone.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
                {milestone.description}
              </p>
            </div>
          </div>

          {/* Target date pill & completion checkbox */}
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            {getStatusBadge()}

            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/80 transition-colors">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleToggleCompleted}
                className="w-4 h-4 text-[#3157E8] rounded border-slate-300 focus:ring-[#3157E8]"
              />
              <span className="text-xs font-semibold text-[#152033]">
                {isCompleted ? "Completed" : "Mark Done"}
              </span>
            </label>
          </div>
        </div>

        {/* Date & Tip Section */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-[#3157E8]" />
            <span>Target Deadline:</span>
            <strong className="font-bold text-[#152033]">{milestone.target_date}</strong>
          </div>

          <button
            type="button"
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className="text-xs text-[#3157E8] font-semibold hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            {notes ? "Edit Notes / Remarks" : "+ Add Personal Notes"}
            {isEditingNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Pakistani Guidance Tip Callout */}
        <div className="mt-3.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/70 flex items-start gap-2.5 text-xs text-blue-950">
          <ShieldAlert className="w-4 h-4 text-[#3157E8] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-semibold text-blue-900">Pakistani Visa Advisory: </strong>
            {milestone.pakistani_guidance_tip}
          </div>
        </div>

        {/* Expandable Notes Input */}
        {isEditingNotes && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <label className="block text-xs font-semibold text-[#152033]">
              Personal Notes & Application Reminders
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bank branch contacted for statement, appointment confirmed with consultant, etc."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033] bg-white"
            />
            <div className="flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notes saved!
                </span>
              ) : (
                <span className="text-[11px] text-slate-500">
                  Synced privately with your calendar export (.ics).
                </span>
              )}
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Note
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
