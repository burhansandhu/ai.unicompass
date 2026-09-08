"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Country, CountryCreatePayload } from "../types";
import { createCountry, updateCountry } from "../api";

interface CountryEditorModalProps {
  countryToEdit?: Country | null;
  onSuccess: (savedCountry: Country) => void;
  onCancel: () => void;
}

export function CountryEditorModal({
  countryToEdit,
  onSuccess,
  onCancel,
}: CountryEditorModalProps) {
  const [name, setName] = useState(countryToEdit?.name || "");
  const [code, setCode] = useState(countryToEdit?.code || "");
  const [slug, setSlug] = useState(countryToEdit?.slug || "");
  const [flagEmoji, setFlagEmoji] = useState(countryToEdit?.flag_emoji || "");
  const [currency, setCurrency] = useState(countryToEdit?.currency || "EUR");
  const [avgCostPkr, setAvgCostPkr] = useState(countryToEdit?.avg_cost_pkr || "");
  const [popularTag, setPopularTag] = useState(countryToEdit?.popular_tag || "");
  const [heroImageUrl, setHeroImageUrl] = useState(countryToEdit?.hero_image_url || "");
  const [overview, setOverview] = useState(countryToEdit?.overview || "");
  const [isActive, setIsActive] = useState(countryToEdit ? countryToEdit.is_active : true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!countryToEdit) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Country name is required.");
      return;
    }
    if (!code.trim()) {
      setError("Country code is required (for example: IT, MY, SE).");
      return;
    }
    if (!flagEmoji.trim()) {
      setError("Flag emoji is required.");
      return;
    }
    if (!overview.trim()) {
      setError("Please provide a brief overview for students.");
      return;
    }

    setIsSubmitting(true);

    const payload: CountryCreatePayload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      slug: slug.trim() || undefined,
      flag_emoji: flagEmoji.trim(),
      currency: currency.trim().toUpperCase() || "USD",
      avg_cost_pkr: avgCostPkr.trim() || undefined,
      popular_tag: popularTag.trim() || undefined,
      hero_image_url: heroImageUrl.trim() || undefined,
      overview: overview.trim(),
      is_active: isActive,
    };

    try {
      let saved: Country;
      if (countryToEdit) {
        saved = await updateCountry(countryToEdit.id, payload);
      } else {
        saved = await createCountry(payload);
      }
      onSuccess(saved);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to save destination. Please check your fields.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#E7EAF0] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E7EAF0] flex items-center justify-between bg-[#F7F8FC]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#3157E8]">
              Destination Management
            </span>
            <h2 className="text-xl font-bold text-[#152033] mt-0.5 flex items-center gap-2">
              <span>{flagEmoji || "🌍"}</span>
              <span>
                {countryToEdit ? `Edit Destination: ${countryToEdit.name}` : "Add New Study Destination"}
              </span>
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-[#667085] hover:text-[#152033] p-2 rounded-xl hover:bg-gray-200/50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Row 1: Name, Code & Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Country Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. Italy, Malaysia, Sweden"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Code <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. IT, MY"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={5}
                required
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Flag Emoji <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 🇮🇹"
                value={flagEmoji}
                onChange={(e) => setFlagEmoji(e.target.value)}
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Row 2: Slug Preview & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7 space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                URL Slug <span className="text-xs text-[#667085] font-normal">(Auto-generated)</span>
              </label>
              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-[#E7EAF0] text-[#667085] px-3 py-2 rounded-l-xl text-xs font-mono">
                  /destinations/
                </span>
                <Input
                  className="rounded-l-none font-mono text-xs"
                  placeholder="italy"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Currency Code
              </label>
              <Input
                placeholder="e.g. EUR, MYR, SEK, USD"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                maxLength={6}
              />
            </div>
          </div>

          {/* Row 3: Avg Cost PKR & Popular Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Average Annual Cost (PKR)
              </label>
              <Input
                placeholder="e.g. PKR 1,800,000 - 2,800,000 / year"
                value={avgCostPkr}
                onChange={(e) => setAvgCostPkr(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#152033]">
                Popular Tag / Badge
              </label>
              <Input
                placeholder="e.g. Top European Pick, Low Tuition"
                value={popularTag}
                onChange={(e) => setPopularTag(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Hero / Cover Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#152033]">
              Destination Cover Image URL
            </label>
            <Input
              placeholder="https://images.unsplash.com/..."
              value={heroImageUrl}
              onChange={(e) => setHeroImageUrl(e.target.value)}
            />
            {heroImageUrl && (
              <div className="relative w-full h-36 rounded-xl overflow-hidden mt-2 border border-[#E7EAF0] bg-gray-100">
                <Image
                  src={heroImageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Row 5: Overview Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#152033]">
              Country Overview & Guidance Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide a student-friendly overview: universities, post-study work visa policies, tuition fees, and admission tips for Pakistani applicants..."
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className="w-full rounded-xl border border-[#E7EAF0] p-3 text-xs text-[#152033] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              required
            />
          </div>

          {/* Row 6: Active Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F7F8FC] border border-[#E7EAF0]">
            <div>
              <span className="text-xs font-bold text-[#152033] block">
                Publish Status
              </span>
              <span className="text-[11px] text-[#667085]">
                Active destinations are visible on public catalog and can be linked to articles.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A36A]"></div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E7EAF0] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-xl text-xs bg-[#3157E8] text-white hover:bg-[#2544BA] px-5"
            >
              {isSubmitting
                ? "Saving Destination..."
                : countryToEdit
                ? "Update Destination"
                : "Create Destination"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
