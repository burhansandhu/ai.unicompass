"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Country, Post, PostCreatePayload } from "../types";
import { getCountries, createPost, updatePost } from "../api";

interface RichTextEditorProps {
  postToEdit?: Post | null;
  onSuccess: (savedPost: Post) => void;
  onCancel: () => void;
}

export function RichTextEditor({ postToEdit, onSuccess, onCancel }: RichTextEditorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [title, setTitle] = useState(postToEdit?.title || "");
  const [slug, setSlug] = useState(postToEdit?.slug || "");
  const [category, setCategory] = useState(postToEdit?.category || "Visa Guidance");
  const [countryId, setCountryId] = useState<string>(postToEdit?.country_id?.toString() || "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(postToEdit?.featured_image_url || "");
  const [readTime, setReadTime] = useState(postToEdit?.read_time || "5 min read");
  const [excerpt, setExcerpt] = useState(postToEdit?.excerpt || "");
  const [content, setContent] = useState(postToEdit?.content || "");
  const [isPublished, setIsPublished] = useState(postToEdit ? postToEdit.is_published : true);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCountries().then(setCountries).catch(() => {});
  }, []);

  const categories = [
    "Visa Guidance",
    "Scholarships",
    "Admissions",
    "Cost of Living",
    "Application Strategy",
    "General Tips",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }
    if (!excerpt.trim()) {
      setError("Please provide a short summary/excerpt.");
      return;
    }
    if (!content.trim()) {
      setError("Article body content cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    const payload: PostCreatePayload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      category,
      country_id: countryId ? parseInt(countryId, 10) : null,
      featured_image_url: featuredImageUrl.trim() || null,
      read_time: readTime.trim() || "5 min read",
      excerpt: excerpt.trim(),
      content: content.trim(),
      is_published: isPublished,
    };

    try {
      let saved: Post;
      if (postToEdit) {
        saved = await updatePost(postToEdit.id, payload);
      } else {
        saved = await createPost(payload);
      }
      onSuccess(saved);
    } catch (err: any) {
      setError(err.message || "Failed to save article. Please verify your fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl border border-[#E7EAF0] my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E7EAF0] flex items-center justify-between bg-[#F7F8FC]">
          <div>
            <h2 className="text-lg font-bold text-[#152033]">
              {postToEdit ? "Edit Article / Guide" : "Create New Country Guide & Article"}
            </h2>
            <p className="text-xs text-[#667085]">
              Publish country-specific guidance, scholarships, and visa walkthroughs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E7EAF0] bg-white hover:bg-[#F7F8FC] text-[#152033]"
            >
              {previewMode ? "✏️ Back to Editor" : "👁️ Live Preview"}
            </button>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#667085] hover:bg-[#E7EAF0] hover:text-[#152033]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3.5 mb-4 rounded-xl bg-[#FDF2F2] border border-[#FDE8E8] text-[#E5484D] text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {previewMode ? (
            /* Live Reader Preview */
            <div className="space-y-6 max-w-2xl mx-auto py-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {category}
                </span>
                <span className="text-xs text-[#667085]">• {readTime}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#152033] leading-tight">
                {title || "Untitled Article"}
              </h1>
              <p className="text-sm text-[#667085] italic leading-relaxed">
                {excerpt || "No excerpt provided."}
              </p>
              {featuredImageUrl && (
                <div className="relative h-64 w-full rounded-xl overflow-hidden">
                  <Image
                    src={featuredImageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="prose prose-slate max-w-none text-sm text-[#152033] leading-relaxed whitespace-pre-wrap">
                {content || "No content written yet."}
              </div>
            </div>
          ) : (
            /* Form Fields */
            <form onSubmit={handleSubmit} id="article-form" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Article Title *"
                  placeholder="e.g. UK Student Visa Process Step by Step (2026)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <Input
                  label="Custom URL Slug (Optional)"
                  placeholder="e.g. uk-student-visa-guide"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#152033] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#152033] mb-1.5">
                    Associated Destination Country
                  </label>
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs font-medium text-[#152033] bg-white focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                  >
                    <option value="">-- General (All Countries) --</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag_emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Estimated Reading Time"
                  placeholder="e.g. 5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                />
              </div>

              <Input
                label="Featured Image URL"
                placeholder="https://images.unsplash.com/..."
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
              />

              <div>
                <label className="block text-xs font-semibold text-[#152033] mb-1.5">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  placeholder="A concise 1-2 sentence overview displayed on article cards..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs text-[#152033] placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#152033]">
                    Article Body Content (Markdown Supported) *
                  </label>
                  <span className="text-[11px] text-[#667085]">Supports # Headers, lists, quotes, links</span>
                </div>
                <textarea
                  rows={10}
                  placeholder={`# Overview\n\nWrite your educational guide here...\n\n## Requirements\n- Point 1\n- Point 2\n\n> Note: Important visa deadlines.`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7EAF0] text-xs text-[#152033] placeholder:text-[#667085] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3157E8] border-[#E7EAF0] focus:ring-[#3157E8]"
                  />
                  <span className="text-xs font-semibold text-[#152033]">
                    Publish immediately (visible to all students and public visitors)
                  </span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E7EAF0] flex items-center justify-between bg-[#F7F8FC]">
          <Button variant="outline" size="sm" onClick={onCancel} className="rounded-xl text-xs">
            Cancel
          </Button>

          <Button
            type="submit"
            form="article-form"
            disabled={isSubmitting}
            className="rounded-xl bg-[#3157E8] hover:bg-[#2544BA] text-white text-xs font-semibold px-5 h-9"
          >
            {isSubmitting ? "Saving..." : postToEdit ? "Update Article" : "Publish Article"}
          </Button>
        </div>
      </div>
    </div>
  );
}
