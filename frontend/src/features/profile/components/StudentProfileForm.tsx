"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StudentProfile, StudentProfileUpdatePayload } from "../types";
import { updateMyProfile } from "../api";

interface StudentProfileFormProps {
  initialProfile: StudentProfile;
  onSaved: (updatedProfile: StudentProfile) => void;
}

export function StudentProfileForm({ initialProfile, onSaved }: StudentProfileFormProps) {
  const [activeSection, setActiveSection] = useState<"academic" | "language" | "work" | "financial">("academic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [secondaryType, setSecondaryType] = useState(initialProfile.secondary_education_type || "Matriculation (Science)");
  const [secondaryGrades, setSecondaryGrades] = useState(initialProfile.secondary_grades || "");
  const [higherSecondaryType, setHigherSecondaryType] = useState(initialProfile.higher_secondary_type || "FSc Pre-Engineering");
  const [higherSecondaryGrades, setHigherSecondaryGrades] = useState(initialProfile.higher_secondary_grades || "");

  const [degreeLevel, setDegreeLevel] = useState(initialProfile.degree_level || "Masters");
  const [degreeType, setDegreeType] = useState(initialProfile.degree_type || "4-Year BS Honors");
  const [degreeField, setDegreeField] = useState(initialProfile.degree_field || "");
  const [conferringUni, setConferringUni] = useState(initialProfile.conferring_university || "");
  const [cgpa, setCgpa] = useState<string>(initialProfile.cgpa?.toString() || "");
  const [cgpaScale, setCgpaScale] = useState<number>(initialProfile.cgpa_scale || 4.0);
  const [hecRecognized, setHecRecognized] = useState(initialProfile.hec_recognized ?? true);
  const [gradYear, setGradYear] = useState<string>(initialProfile.graduation_year?.toString() || "2024");

  const [testType, setTestType] = useState(initialProfile.english_test_type || "IELTS Academic");
  const [overallScore, setOverallScore] = useState<string>(initialProfile.english_overall_score?.toString() || "");
  const [listening, setListening] = useState<string>(initialProfile.listening_score?.toString() || "");
  const [reading, setReading] = useState<string>(initialProfile.reading_score?.toString() || "");
  const [writing, setWriting] = useState<string>(initialProfile.writing_score?.toString() || "");
  const [speaking, setSpeaking] = useState<string>(initialProfile.speaking_score?.toString() || "");
  const [moiEligible, setMoiEligible] = useState(initialProfile.moi_eligible || false);
  const [testDatePlanned, setTestDatePlanned] = useState(initialProfile.test_date_or_planned || "");

  const [workYears, setWorkYears] = useState<number>(initialProfile.work_experience_years || 0);
  const [jobTitle, setJobTitle] = useState(initialProfile.current_job_title || "");
  const [gapYears, setGapYears] = useState<number>(initialProfile.academic_gap_years || 0);
  const [gapExplanation, setGapExplanation] = useState(initialProfile.gap_explanation || "");

  const [maxBudgetPkr, setMaxBudgetPkr] = useState<string>(initialProfile.max_annual_budget_pkr?.toString() || "3500000");
  const [fundingSource, setFundingSource] = useState(initialProfile.funding_source || "Self-funded / Family Support");
  const [has28DayBalance, setHas28DayBalance] = useState(initialProfile.has_28_day_bank_balance || false);
  const [targetDestinations, setTargetDestinations] = useState<string[]>(
    initialProfile.target_destinations?.length > 0 ? initialProfile.target_destinations : ["United Kingdom", "Germany"]
  );
  const [targetIntake, setTargetIntake] = useState(initialProfile.target_intake || "Fall 2026 (September / October)");

  const toggleDestination = (dest: string) => {
    setTargetDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const payload: StudentProfileUpdatePayload = {
      secondary_education_type: secondaryType,
      secondary_grades: secondaryGrades.trim() || null,
      higher_secondary_type: higherSecondaryType,
      higher_secondary_grades: higherSecondaryGrades.trim() || null,

      degree_level: degreeLevel,
      degree_type: degreeType,
      degree_field: degreeField.trim() || null,
      conferring_university: conferringUni.trim() || null,
      cgpa: cgpa ? parseFloat(cgpa) : null,
      cgpa_scale: cgpaScale,
      hec_recognized: hecRecognized,
      graduation_year: gradYear ? parseInt(gradYear, 10) : null,

      english_test_type: testType,
      english_overall_score: overallScore ? parseFloat(overallScore) : null,
      listening_score: listening ? parseFloat(listening) : null,
      reading_score: reading ? parseFloat(reading) : null,
      writing_score: writing ? parseFloat(writing) : null,
      speaking_score: speaking ? parseFloat(speaking) : null,
      moi_eligible: moiEligible,
      test_date_or_planned: testDatePlanned.trim() || null,

      work_experience_years: workYears,
      current_job_title: jobTitle.trim() || null,
      academic_gap_years: gapYears,
      gap_explanation: gapExplanation.trim() || null,

      max_annual_budget_pkr: maxBudgetPkr ? parseFloat(maxBudgetPkr) : null,
      funding_source: fundingSource,
      has_28_day_bank_balance: has28DayBalance,
      target_destinations: targetDestinations,
      target_degree_level: degreeLevel,
      target_field: degreeField.trim() || null,
      target_intake: targetIntake,
    };

    try {
      const updated = await updateMyProfile(payload);
      onSaved(updated);
      setSuccessMessage("Your profile has been saved and your eligibility score updated!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPkrCurrency = (valStr: string) => {
    const num = parseFloat(valStr);
    if (isNaN(num)) return "PKR 0";
    if (num >= 10000000) {
      return `PKR ${(num / 10000000).toFixed(2)} Crore`;
    }
    if (num >= 100000) {
      return `PKR ${(num / 100000).toFixed(1)} Lakhs`;
    }
    return `PKR ${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Profile Header & Completeness Indicator */}
      <div className="bg-white rounded-2xl border border-[#E7EAF0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#3157E8] text-xs font-semibold mb-2">
            <span>🇵🇰</span> Pakistani Academic & Financial Profile
          </div>
          <h1 className="text-2xl font-extrabold text-[#152033] tracking-tight">
            Comprehensive Eligibility Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 max-w-xl">
            Accurate academic metrics, IELTS/MOI details, and PKR budgets power your RAG AI advisor recommendations and visa success algorithms.
          </p>
        </div>

        <div className="bg-[#F7F8FC] p-4 rounded-xl border border-[#E7EAF0] min-w-[240px] text-center md:text-right">
          <div className="flex items-center justify-between gap-4 mb-2 text-xs font-bold text-[#152033]">
            <span>Profile Completeness</span>
            <span className="text-sm font-extrabold text-[#3157E8]">
              {initialProfile.completeness_percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#3157E8] h-full transition-all duration-500 rounded-full"
              style={{ width: `${initialProfile.completeness_percentage}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-[#667085] mt-1.5 block">
            {initialProfile.completeness_percentage >= 80
              ? "✓ Ready for AI Program Matching"
              : "Complete all sections to unlock course matching"}
          </span>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7EAF0] pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: "academic", label: "1. Academic History", icon: "🎓" },
          { id: "language", label: "2. English & Language", icon: "🗣️" },
          { id: "work", label: "3. Work & Gap Years", icon: "💼" },
          { id: "financial", label: "4. Budget & Preferences", icon: "💰" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as typeof activeSection)}
            className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? "bg-[#3157E8] text-white shadow-xs font-bold"
                : "text-[#667085] hover:text-[#152033] hover:bg-gray-100"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Academic Background */}
        {activeSection === "academic" && (
          <Card className="p-6 border-[#E7EAF0] space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                <span>🏛️</span> Secondary & Higher Secondary Education
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Pakistani Matric/FSc or International O/A-Levels grade scale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Secondary Education</label>
                <select
                  value={secondaryType}
                  onChange={(e) => setSecondaryType(e.target.value)}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="Matriculation (Science)">Matriculation (Science)</option>
                  <option value="Matriculation (Arts / Computer)">Matriculation (Arts / Computer)</option>
                  <option value="O-Levels (Cambridge / Edexcel)">O-Levels (Cambridge / Edexcel)</option>
                  <option value="Other High School">Other High School</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Secondary Marks / Percentage / Grades</label>
                <Input
                  placeholder="e.g. 940/1100 (85%) or 4 As, 2 Bs"
                  value={secondaryGrades}
                  onChange={(e) => setSecondaryGrades(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Higher Secondary / Intermediate</label>
                <select
                  value={higherSecondaryType}
                  onChange={(e) => setHigherSecondaryType(e.target.value)}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="FSc Pre-Engineering">FSc Pre-Engineering</option>
                  <option value="FSc Pre-Medical">FSc Pre-Medical</option>
                  <option value="ICS (Computer Science)">ICS (Computer Science)</option>
                  <option value="ICom (Commerce)">ICom (Commerce)</option>
                  <option value="FA (Humanities)">FA (Humanities)</option>
                  <option value="A-Levels (Cambridge)">A-Levels (Cambridge)</option>
                  <option value="DAE (Diploma in Associate Engineering)">DAE (Diploma in Associate Engineering)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Intermediate Marks / Percentage / Grades</label>
                <Input
                  placeholder="e.g. 890/1100 (81%) or A*AA"
                  value={higherSecondaryGrades}
                  onChange={(e) => setHigherSecondaryGrades(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7EAF0]">
              <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                <span>🎓</span> Tertiary / Higher Education (University)
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Your highest completed or currently enrolled university degree.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Degree Format</label>
                <select
                  value={degreeType}
                  onChange={(e) => setDegreeType(e.target.value)}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="4-Year BS Honors">4-Year BS Honors (16-Year Education)</option>
                  <option value="2-Year BA/BSc">2-Year BA/BSc (14-Year Education)</option>
                  <option value="5-Year Professional (MBBS / DPT / Pharm-D)">5-Year Professional (MBBS / DPT / Pharm-D)</option>
                  <option value="1.5 to 2-Year MS / MPhil">1.5 to 2-Year MS / MPhil (18-Year)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Major / Field of Study</label>
                <Input
                  placeholder="e.g. BS Computer Science, BBA, Electrical Eng."
                  value={degreeField}
                  onChange={(e) => setDegreeField(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Conferring University</label>
                <Input
                  placeholder="e.g. NUST, FAST-NUCES, COMSATS, Punjab Uni"
                  value={conferringUni}
                  onChange={(e) => setConferringUni(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Cumulative CGPA</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  placeholder="e.g. 3.42"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">CGPA Scale</label>
                <select
                  value={cgpaScale}
                  onChange={(e) => setCgpaScale(parseFloat(e.target.value))}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="4.0">4.0 Scale (Standard)</option>
                  <option value="5.0">5.0 Scale</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Graduation Year</label>
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E7EAF0] bg-[#F7F8FC] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hecRecognized}
                    onChange={(e) => setHecRecognized(e.target.checked)}
                    className="rounded text-[#3157E8] focus:ring-[#3157E8]"
                  />
                  <span className="text-xs font-semibold text-[#152033]">HEC Recognized Institution</span>
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 2: English Language Proficiency & Waivers */}
        {activeSection === "language" && (
          <Card className="p-6 border-[#E7EAF0] space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                <span>🗣️</span> English Proficiency & Medium of Instruction (MOI)
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Essential for UK CAS, German APS, and visa eligibility criteria.
              </p>
            </div>

            {/* MOI Waiver Banner */}
            <div className="p-4 rounded-xl bg-[#EEF2FF] border border-[#3157E8]/20 flex items-start gap-3">
              <input
                type="checkbox"
                id="moi_checkbox"
                checked={moiEligible}
                onChange={(e) => setMoiEligible(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-[#3157E8] focus:ring-[#3157E8]"
              />
              <label htmlFor="moi_checkbox" className="text-xs text-[#152033] cursor-pointer leading-relaxed">
                <strong className="block font-bold text-sm text-[#3157E8]">
                  Claim Medium of Instruction (MOI) English Waiver
                </strong>
                My university degree was taught 100% in English, and I can obtain an official English Proficiency Certificate from my Registrar. Many UK and European universities accept this in place of IELTS!
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Standardized Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="IELTS Academic">IELTS Academic</option>
                  <option value="PTE Academic">PTE Academic</option>
                  <option value="TOEFL iBT">TOEFL iBT</option>
                  <option value="Duolingo English Test (DET)">Duolingo English Test (DET)</option>
                  <option value="MOI Certificate Only">MOI Certificate Only</option>
                  <option value="Planning to Take Test Soon">Planning to Take Test Soon</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Overall Score / Band</label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 7.0 for IELTS, 68 for PTE"
                  value={overallScore}
                  onChange={(e) => setOverallScore(e.target.value)}
                />
              </div>
            </div>

            {testType !== "MOI Certificate Only" && testType !== "Planning to Take Test Soon" && (
              <div>
                <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-3">
                  Band Breakdown (Minimum requirement filters)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#152033]">Listening</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 7.5"
                      value={listening}
                      onChange={(e) => setListening(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#152033]">Reading</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 6.5"
                      value={reading}
                      onChange={(e) => setReading(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#152033]">Writing</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 6.5"
                      value={writing}
                      onChange={(e) => setWriting(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#152033]">Speaking</label>
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 7.0"
                      value={speaking}
                      onChange={(e) => setSpeaking(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">Test Date / Planned Status</label>
              <Input
                placeholder="e.g. Completed in May 2026, or Booking date for November 2026"
                value={testDatePlanned}
                onChange={(e) => setTestDatePlanned(e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* SECTION 3: Work Experience & Gap Years */}
        {activeSection === "work" && (
          <Card className="p-6 border-[#E7EAF0] space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                <span>💼</span> Work Experience & Post-Graduation Gap
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Helps evaluate visa credibility and university work-gap acceptance policies.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Total Work Experience (Years)</label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g. 2.5"
                  value={workYears}
                  onChange={(e) => setWorkYears(parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Current / Recent Job Title</label>
                <Input
                  placeholder="e.g. Software Engineer, Marketing Associate"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">Academic Gap Duration (Years)</label>
              <Input
                type="number"
                step="0.5"
                min="0"
                placeholder="e.g. 1.0"
                value={gapYears}
                onChange={(e) => setGapYears(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">Gap Activity Explanation</label>
              <textarea
                rows={3}
                placeholder="Briefly explain any post-graduation gaps (e.g. preparing for IELTS/GRE, freelancing, job hunting, medical reasons)..."
                value={gapExplanation}
                onChange={(e) => setGapExplanation(e.target.value)}
                className="w-full rounded-xl border border-[#E7EAF0] p-3 text-xs text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              />
            </div>
          </Card>
        )}

        {/* SECTION 4: Financials & Target Preferences */}
        {activeSection === "financial" && (
          <Card className="p-6 border-[#E7EAF0] space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                <span>💰</span> Financial Budget & Intake Preferences (PKR)
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Matches programs within your family's budget and checks 28-day bank balance readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#152033]">Maximum Annual Budget (PKR)</label>
                  <span className="text-xs font-extrabold text-[#3157E8]">
                    {formatPkrCurrency(maxBudgetPkr)}
                  </span>
                </div>
                <Input
                  type="number"
                  step="50000"
                  placeholder="e.g. 3500000 (35 Lakhs)"
                  value={maxBudgetPkr}
                  onChange={(e) => setMaxBudgetPkr(e.target.value)}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "20 Lakhs", val: "2000000" },
                    { label: "35 Lakhs", val: "3500000" },
                    { label: "50 Lakhs", val: "5000000" },
                    { label: "75 Lakhs", val: "7500000" },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setMaxBudgetPkr(preset.val)}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-[11px] text-[#667085] hover:bg-gray-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#152033]">Primary Funding Source</label>
                <select
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                >
                  <option value="Self-funded / Family Support">Self-funded / Family Support</option>
                  <option value="Seeking 100% Full Scholarship">Seeking 100% Full Scholarship</option>
                  <option value="Partial Scholarship + Savings">Partial Scholarship + Savings</option>
                  <option value="Bank Loan / Official Sponsor">Bank Loan / Official Sponsor</option>
                </select>
              </div>
            </div>

            {/* 28-Day Bank Statement Readiness */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="bank_balance_checkbox"
                checked={has28DayBalance}
                onChange={(e) => setHas28DayBalance(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="bank_balance_checkbox" className="text-xs text-[#152033] cursor-pointer leading-relaxed">
                <strong className="block font-bold text-sm text-amber-900">
                  28-Day Bank Statement Maturation Ready
                </strong>
                I or my official financial sponsor (parents) can deposit and hold the required living expenses and tuition balance in a verified bank account for at least 28 consecutive days before applying for the student visa.
              </label>
            </div>

            {/* Target Destinations */}
            <div>
              <label className="text-xs font-bold text-[#152033] block mb-2">
                Target Study Abroad Destinations (Select all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: "United Kingdom", flag: "🇬🇧" },
                  { name: "Germany", flag: "🇩🇪" },
                  { name: "Canada", flag: "🇨🇦" },
                  { name: "Australia", flag: "🇦🇺" },
                  { name: "United States", flag: "🇺🇸" },
                  { name: "France", flag: "🇫🇷" },
                ].map((country) => {
                  const isSelected = targetDestinations.includes(country.name);
                  return (
                    <button
                      key={country.name}
                      type="button"
                      onClick={() => toggleDestination(country.name)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? "bg-[#EEF2FF] border-[#3157E8] text-[#3157E8] shadow-xs"
                          : "bg-white border-[#E7EAF0] text-[#667085] hover:border-gray-300"
                      }`}
                    >
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                      {isSelected && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Intake */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">Target Application Intake</label>
              <select
                value={targetIntake}
                onChange={(e) => setTargetIntake(e.target.value)}
                className="w-full rounded-xl border border-[#E7EAF0] p-2.5 text-xs bg-white text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              >
                <option value="Fall 2026 (September / October)">Fall 2026 (September / October) — Main Intake</option>
                <option value="Spring 2027 (January / February)">Spring 2027 (January / February) — Winter Intake</option>
                <option value="Summer 2027 (May / June)">Summer 2027 (May / June)</option>
              </select>
            </div>
          </Card>
        )}

        {/* Global Save Button Bar */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E7EAF0] shadow-xs sticky bottom-4 z-20">
          <div className="text-xs text-[#667085]">
            Changes are saved to your central student profile record.
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white px-8 font-bold"
          >
            {isSubmitting ? "Saving Profile..." : "Save & Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
