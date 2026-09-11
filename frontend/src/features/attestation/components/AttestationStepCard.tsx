"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Save,
  Loader2,
  Calendar,
  Hash,
  Building2,
  Coins,
} from "lucide-react";
import { AttestationStep, AttestationStatus, AttestationStepUpdatePayload } from "../types";

interface AttestationStepCardProps {
  step: AttestationStep;
  index: number;
  totalSteps: number;
  onUpdate: (stepKey: string, payload: AttestationStepUpdatePayload) => Promise<void>;
}

export const AttestationStepCard: React.FC<AttestationStepCardProps> = ({
  step,
  index,
  totalSteps,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"procedure" | "requirements" | "notes">("procedure");
  const [status, setStatus] = useState<AttestationStatus>(step.status);
  const [notes, setNotes] = useState<string>(step.notes || "");
  const [trackingNumber, setTrackingNumber] = useState<string>(step.tracking_number || "");
  const [appointmentDate, setAppointmentDate] = useState<string>(step.appointment_date || "");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleStatusChange = async (newStatus: AttestationStatus) => {
    setStatus(newStatus);
    try {
      await onUpdate(step.step_key, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      setStatus(step.status);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onUpdate(step.step_key, {
        status,
        notes,
        tracking_number: trackingNumber,
        appointment_date: appointmentDate,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (st: AttestationStatus) => {
    switch (st) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            Not Started
          </span>
        );
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm ${
        status === "completed"
          ? "border-emerald-200 ring-1 ring-emerald-100"
          : status === "in_progress"
          ? "border-amber-200 ring-1 ring-amber-100"
          : "border-slate-200"
      }`}
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                status === "completed"
                  ? "bg-emerald-600 text-white"
                  : status === "in_progress"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#3157E8]">
                  Step {index + 1} of {totalSteps}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-[#667085] flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {step.authority_name}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#152033] mt-0.5">{step.title}</h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-0.5">{step.subtitle}</p>
            </div>
          </div>

          {/* Quick status selector & Expand toggle */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => handleStatusChange("not_started")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  status === "not_started"
                    ? "bg-white text-slate-800 shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Not Started
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("in_progress")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  status === "in_progress"
                    ? "bg-amber-500 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                In Progress
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("completed")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  status === "completed"
                    ? "bg-emerald-600 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Completed ✓
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Meta Badges */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60">
              <Clock className="w-3.5 h-3.5 text-[#3157E8]" />
              Est. Time: <strong className="font-semibold">{step.estimated_duration}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/60">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              Fee: <strong className="font-semibold">{step.estimated_fee_pkr}</strong>
            </span>
          </div>

          <a
            href={step.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3157E8]/10 hover:bg-[#3157E8]/20 text-[#3157E8] font-semibold transition-colors"
          >
            Official E-Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-[#FAFBFD] p-5 sm:p-6 rounded-b-2xl">
          {/* Important alert note if present */}
          {step.important_note && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Important Rule: </strong>
                {step.important_note}
              </div>
            </div>
          )}

          {/* Sub-tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5">
            <button
              type="button"
              onClick={() => setActiveTab("procedure")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "procedure"
                  ? "bg-[#3157E8] text-white shadow-sm"
                  : "text-[#667085] hover:text-[#152033] hover:bg-slate-100"
              }`}
            >
              Step-by-Step Procedure
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("requirements")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "requirements"
                  ? "bg-[#3157E8] text-white shadow-sm"
                  : "text-[#667085] hover:text-[#152033] hover:bg-slate-100"
              }`}
            >
              Document Checklist ({step.requirements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notes")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === "notes"
                  ? "bg-[#3157E8] text-white shadow-sm"
                  : "text-[#667085] hover:text-[#152033] hover:bg-slate-100"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Notes & Tracking
              {(trackingNumber || notes) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>

          {/* Tab 1: Step-by-Step Procedure */}
          {activeTab === "procedure" && (
            <div className="space-y-3">
              {step.procedure_steps.map((proc, pIdx) => (
                <div
                  key={pIdx}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-start gap-3 text-xs sm:text-sm text-[#152033]"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-[#3157E8] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                    {pIdx + 1}
                  </span>
                  <span className="leading-relaxed">{proc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Document Checklist */}
          {activeTab === "requirements" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {step.requirements.map((req, rIdx) => (
                <div
                  key={rIdx}
                  className="p-3 rounded-xl bg-white border border-slate-200/80 flex items-start gap-2.5 text-xs text-[#152033]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#3157E8] shrink-0 mt-0.5" />
                  <span className="leading-snug">{req}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: My Notes & Tracking */}
          {activeTab === "notes" && (
            <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#152033] mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#3157E8]" />
                    Tracking / Challan Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-948201481 or Challan #48201"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#152033] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#3157E8]" />
                    Appointment / Submission Date
                  </label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#152033] mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#3157E8]" />
                  Personal Notes / Remarks
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your center location, officer name, courier center token, or pending documents..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8] text-[#152033]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Notes saved successfully!
                  </span>
                ) : (
                  <span className="text-xs text-[#667085]">
                    Saved privately to your UniCompass account.
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Details
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
