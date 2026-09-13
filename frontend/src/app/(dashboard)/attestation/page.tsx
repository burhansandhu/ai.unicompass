"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ArrowLeft,
  Printer,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { AttestationSummary, AttestationStepUpdatePayload } from "@/features/attestation/types";
import { getMyAttestationSteps, updateAttestationStep } from "@/features/attestation/api";
import { AttestationStepCard } from "@/features/attestation/components/AttestationStepCard";
import { AttestationProgressBanner } from "@/features/attestation/components/AttestationProgressBanner";
import { Sidebar } from "@/components/Sidebar";

export default function AttestationPage() {
  const { user, isLoading: isAuthLoading, logout } = useAuth();
  const [summary, setSummary] = useState<AttestationSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getMyAttestationSteps()
        .then((data) => {
          setSummary(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load attestation steps", err);
          setIsLoading(false);
        });
    }
  }, [user]);

  const handleStepUpdate = async (stepKey: string, payload: AttestationStepUpdatePayload) => {
    try {
      const updatedStep = await updateAttestationStep(stepKey, payload);
      // Refresh summary to recompute percentage
      const newSummary = await getMyAttestationSteps();
      setSummary(newSummary);
    } catch (err) {
      console.error("Error updating step", err);
      throw err;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const faqs = [
    {
      q: "Does MOFA accept un-attested degrees or certificates?",
      a: "No. The Ministry of Foreign Affairs (MOFA) only legalizes documents that have already been stamped by the respective primary authority: IBCC for Matric/Intermediate, and HEC for Bachelor's/Master's/PhD degrees. Submitting un-attested documents to MOFA will result in rejection.",
    },
    {
      q: "What is the Hague Apostille Convention, and does it apply to Pakistan?",
      a: "Pakistan officially acceded to the Hague Apostille Convention in 2023. If you are applying to an Apostille member country (e.g. UK, Germany, USA, France, Italy, Australia), you can get an official MOFA Apostille Certificate online via apostille.mofa.gov.pk, which eliminates the need for further embassy legalization.",
    },
    {
      q: "What if there is a spelling mismatch between my CNIC and Matric certificate?",
      a: "Both HEC and IBCC require exact name and father's name matching across your CNIC and educational certificates. If there is a mismatch, you must get your CNIC corrected with NADRA or obtain an official correction token from your Board before applying for attestation.",
    },
    {
      q: "Can I use TCS courier instead of traveling to HEC or IBCC centers?",
      a: "Yes! Both HEC and IBCC have official partnerships with TCS courier. You can select 'Courier Service' in your online application, submit your documents at a designated TCS Express Center, and receive the attested originals back at your doorstep.",
    },
    {
      q: "How long is a Police Character Certificate valid for visa filing?",
      a: "Police Character Certificates issued by the Police Khidmat Markaz are generally valid for 3 to 6 months depending on your target country's embassy guidelines. We recommend applying for it approximately 30 to 45 days before your scheduled visa appointment.",
    },
  ];

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin" />
          <span className="text-xs text-[#667085] font-medium">Loading attestation tracker...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F8FC] p-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] text-[#3157E8] text-3xl flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#152033] tracking-tight">
          Sign In to Track Document Attestation
        </h2>
        <p className="text-sm text-[#667085] mt-1 mb-6 max-w-sm">
          Save your HEC, IBCC, and MOFA attestation milestones, challan numbers, and tracking notes privately in your UniCompass account.
        </p>
        <Link href="/login">
          <Button size="lg" className="px-8 rounded-xl bg-[#3157E8] hover:bg-[#2546c7] text-white">
            Go to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex">
      {/* Unified Student Dashboard Sidebar */}
      <Sidebar activeTab="documents" />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar (h-20 aligned) */}
        <header className="h-20 bg-white border-b border-[#E7EAF0] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Return to Student Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#152033] tracking-tight">
                  Document Attestation & Legalization Tracker
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#3157E8] border border-blue-200">
                  Pakistani Students
                </span>
              </div>
              <p className="text-xs text-[#667085] hidden sm:block">
                Verify your secondary, tertiary, and civil documents across IBCC, HEC, MOFA, and PKM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              Print Checklist
            </button>
            <Link href="/profile">
              <Button size="sm" className="bg-[#3157E8] hover:bg-[#2546c7] text-white rounded-xl text-xs">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </header>

        {/* Body Content */}
        <div className="p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-[#3157E8] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#667085]">Loading your document verification status...</p>
            </div>
          ) : summary ? (
            <>
              {/* Progress & Sequence Banner */}
              <AttestationProgressBanner summary={summary} />

              {/* Milestone Cards List */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#152033] flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#3157E8]" />
                    Verification Milestones ({summary.completed_steps} of {summary.total_steps} Completed)
                  </h2>
                  <span className="text-xs text-[#667085]">
                    Click any milestone to view official requirements, fees, and procedures.
                  </span>
                </div>

                {summary.steps.map((step, idx) => (
                  <AttestationStepCard
                    key={step.step_key}
                    step={step}
                    index={idx}
                    totalSteps={summary.total_steps}
                    onUpdate={handleStepUpdate}
                  />
                ))}
              </div>

              {/* Frequently Asked Questions */}
              <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-[#3157E8]" />
                  <h3 className="text-base font-bold text-[#152033]">
                    Pakistan Attestation Rules & FAQs
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {faqs.map((faq, fIdx) => (
                    <div key={fIdx} className="py-3.5">
                      <button
                        type="button"
                        onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                        className="w-full flex items-center justify-between text-left gap-4 font-semibold text-xs sm:text-sm text-[#152033] hover:text-[#3157E8] transition-colors"
                      >
                        <span>{faq.q}</span>
                        {activeFaq === fIdx ? (
                          <ChevronUp className="w-4 h-4 text-[#3157E8] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {activeFaq === fIdx && (
                        <p className="mt-2 text-xs sm:text-sm text-[#667085] leading-relaxed pl-1">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">
                Unable to load attestation milestones.
              </p>
              <p className="text-xs text-slate-500 mt-1">Please refresh the page to retry.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
