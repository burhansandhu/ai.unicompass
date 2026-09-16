"use client";

import React, { useState, useEffect } from "react";
import { Scholarship, ScholarshipCreatePayload } from "../types";
import { Country } from "@/features/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Sparkles, Loader2 } from "lucide-react";

interface ScholarshipEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: ScholarshipCreatePayload, id?: number) => Promise<void>;
  scholarship: Scholarship | null;
  countries: Country[];
}

export const ScholarshipEditorModal: React.FC<ScholarshipEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  scholarship,
  countries,
}) => {
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [countryId, setCountryId] = useState<number | null>(null);
  const [degreeLevel, setDegreeLevel] = useState("Masters");
  const [coverageType, setCoverageType] = useState("Fully Funded");
  const [amountValue, setAmountValue] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [eligibilityCriteria, setEligibilityCriteria] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scholarship) {
      setTitle(scholarship.title);
      setProvider(scholarship.provider);
      setCountryId(scholarship.country_id);
      setDegreeLevel(scholarship.degree_level);
      setCoverageType(scholarship.coverage_type);
      setAmountValue(scholarship.amount_value || "");
      setDeadlineDate(scholarship.deadline_date);
      setEligibilityCriteria(scholarship.eligibility_criteria || "");
      setApplicationLink(scholarship.application_link || "");
      setDescription(scholarship.description || "");
      setIsActive(scholarship.is_active);
    } else {
      setTitle("");
      setProvider("");
      setCountryId(null);
      setDegreeLevel("Masters");
      setCoverageType("Fully Funded");
      setAmountValue("");
      setDeadlineDate("");
      setEligibilityCriteria("");
      setApplicationLink("");
      setDescription("");
      setIsActive(true);
    }
    setError(null);
  }, [scholarship, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter scholarship title.");
      return;
    }
    if (!provider.trim()) {
      setError("Please enter scholarship provider / sponsoring body.");
      return;
    }
    if (!deadlineDate.trim()) {
      setError("Please specify the application deadline date (e.g. 31 Oct 2026).");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          title: title.trim(),
          provider: provider.trim(),
          country_id: countryId || null,
          degree_level: degreeLevel,
          coverage_type: coverageType,
          amount_value: amountValue.trim() || undefined,
          deadline_date: deadlineDate.trim(),
          eligibility_criteria: eligibilityCriteria.trim() || undefined,
          application_link: applicationLink.trim() || undefined,
          description: description.trim() || undefined,
          is_active: isActive,
        },
        scholarship?.id
      );
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save scholarship.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E7EAF0] shadow-xl w-full max-w-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7EAF0] flex items-center justify-between bg-[#F8F9FF]">
          <div>
            <h2 className="text-lg font-bold text-[#152033] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3157E8]" />
              <span>{scholarship ? "Edit Scholarship" : "Add New International Scholarship"}</span>
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Curate verified scholarship schemes for Pakistani study-abroad applicants
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Scholarship Title *
              </label>
              <Input
                placeholder="e.g. DAAD Helmut-Schmidt Programme"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Provider / Sponsoring Organization *
              </label>
              <Input
                placeholder="e.g. German Academic Exchange Service (DAAD)"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Destination Country
              </label>
              <select
                value={countryId || ""}
                onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 px-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-hidden focus:border-[#3157E8]"
              >
                <option value="">International / Multi-Country</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag_emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Degree Level *
              </label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-hidden focus:border-[#3157E8]"
              >
                <option value="Masters">Master&apos;s (Postgraduate)</option>
                <option value="Bachelors">Bachelor&apos;s (Undergraduate)</option>
                <option value="PhD">PhD / Doctorate</option>
                <option value="All Levels">All Degree Levels</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Coverage Type *
              </label>
              <select
                value={coverageType}
                onChange={(e) => setCoverageType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-hidden focus:border-[#3157E8]"
              >
                <option value="Fully Funded">Fully Funded (Tuition + Stipend + Flights)</option>
                <option value="Full Tuition">Full Tuition Waiver</option>
                <option value="Partial Tuition">Partial Tuition Discount</option>
                <option value="Living Stipend Only">Living Stipend Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Application Deadline Date *
              </label>
              <Input
                placeholder="e.g. 31 Oct 2026 or 15 Jan 2027"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Award / Coverage Details
              </label>
              <Input
                placeholder="e.g. 100% Tuition + €934/month + Flights"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Official Application / Portal URL
              </label>
              <Input
                type="url"
                placeholder="https://www.daad.de/..."
                value={applicationLink}
                onChange={(e) => setApplicationLink(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Eligibility Criteria & Requirements
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Minimum 3.0 CGPA, Pakistani citizenship, 16 years education, IELTS 6.5 or MOI eligible..."
                value={eligibilityCriteria}
                onChange={(e) => setEligibilityCriteria(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-hidden focus:border-[#3157E8] resize-y"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#152033] mb-1.5">
                Program Description & Guidance
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary and tips for Pakistani applicants..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-hidden focus:border-[#3157E8] resize-y"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3157E8] hover:bg-[#2546c7] text-white text-xs font-semibold rounded-xl px-5 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{scholarship ? "Save Changes" : "Publish Scholarship"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
