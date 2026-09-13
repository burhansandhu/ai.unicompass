"use client";

import React, { useState, useEffect } from "react";
import { Search, Building2, MapPin, Calendar, CheckCircle, GraduationCap, X, Sparkles, Loader2 } from "lucide-react";
import { getPrograms, toggleShortlist } from "@/features/discovery/api";
import { Program } from "@/features/discovery/types";
import { Button } from "@/components/ui/button";

interface SelectUniversityTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram: (programId: number) => void;
  currentSelectedId?: number | null;
}

export const SelectUniversityTrackerModal: React.FC<SelectUniversityTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectProgram,
  currentSelectedId,
}) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingId, setIsSubmittingId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getPrograms()
        .then((data) => {
          setPrograms(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load programs for tracker", err);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const disciplines = ["All", "Computer Science & IT", "Engineering", "Business & Management"];

  const filteredPrograms = programs.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.country_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline = selectedDiscipline === "All" || p.discipline === selectedDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  const handleSelect = async (program: Program) => {
    setIsSubmittingId(program.id);
    try {
      if (!program.is_shortlisted) {
        await toggleShortlist(program.id);
      }
      onSelectProgram(program.id);
      onClose();
    } catch (err) {
      console.error("Failed to track program", err);
    } finally {
      setIsSubmittingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF2FF] text-[#3157E8] mb-1.5">
              <Sparkles className="w-3 h-3" />
              Target University Selector
            </div>
            <h2 className="text-xl font-bold text-[#152033] tracking-tight">
              Select University to Track Deadlines
            </h2>
            <p className="text-xs text-[#667085] mt-0.5">
              Choose your target program to generate tailored reverse intake milestones, real-time cutoffs, and visa dates.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, program, or destination country..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#152033] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3157E8]/20 focus:border-[#3157E8]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {disciplines.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDiscipline(d)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedDiscipline === d
                    ? "bg-[#3157E8] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Programs List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#3157E8] mx-auto" />
              <p className="text-xs text-[#667085]">Loading available universities & programs...</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-[#152033]">No universities matched your search</p>
              <p className="text-xs text-[#667085]">Try adjusting your search query or discipline filter.</p>
            </div>
          ) : (
            filteredPrograms.map((p) => {
              const isCurrent = currentSelectedId === p.id;
              const isSubmitting = isSubmittingId === p.id;

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCurrent
                      ? "border-[#3157E8] bg-[#F8F9FF] shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{p.country_flag_emoji}</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {p.university_name} • {p.country_name}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3157E8] text-white">
                          Currently Tracking
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[#152033] leading-snug">
                      {p.name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        {p.degree_level}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Cutoff: <strong className="text-[#152033]">{p.application_deadline_fall || p.application_deadline_spring || "Open"}</strong>
                      </span>
                      {p.accepts_moi && (
                        <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                          ✓ Pakistani MOI Accepted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 sm:self-center">
                    <Button
                      onClick={() => handleSelect(p)}
                      disabled={isSubmitting}
                      size="sm"
                      className={`text-xs font-semibold rounded-xl px-4 py-2 h-auto ${
                        isCurrent
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          : "bg-[#3157E8] hover:bg-[#2546c7] text-white shadow-sm"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          Selecting...
                        </>
                      ) : isCurrent ? (
                        "Keep Tracking"
                      ) : (
                        "Track Deadlines"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-[#667085]">
          <span>
            Showing <strong>{filteredPrograms.length}</strong> accredited partner university programs
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
