"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Post } from "@/features/content/types";
import { getPostBySlug } from "@/features/content/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BlogPostReaderPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    getPostBySlug(slug)
      .then((data) => {
        setPost(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load article.");
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
          <span className="text-xs text-[#667085]">Loading educational article...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="text-4xl mb-3">📄</div>
          <h2 className="text-2xl font-bold text-[#152033]">Article Not Found</h2>
          <p className="text-sm text-[#667085] mt-1 mb-6 max-w-sm">
            The guide or article you are looking for does not exist or has been removed.
          </p>
          <Link href="/blog">
            <Button className="rounded-xl">Browse All Guides</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Simple Markdown Line Formatter for rich readability without heavy runtime parser
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) {
        return (
          <h1 key={idx} className="text-2xl sm:text-3xl font-extrabold text-[#152033] mt-8 mb-4 tracking-tight">
            {trimmed.replace("# ", "")}
          </h1>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#152033] mt-6 mb-3 tracking-tight">
            {trimmed.replace("## ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-lg font-bold text-[#152033] mt-4 mb-2">
            {trimmed.replace("### ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#3157E8] bg-[#EEF2FF]/60 p-4 rounded-r-xl my-4 text-sm text-[#152033] italic">
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-[#334155] my-1 leading-relaxed">
            {trimmed.replace(/^[-*]\s+/, "")}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="ml-5 list-decimal text-sm text-[#334155] my-1 leading-relaxed">
            {trimmed.replace(/^\d+\.\s+/, "")}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={idx} className="h-3" />;
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-[#334155] leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#667085] mb-6">
          <Link href="/" className="hover:text-[#152033]">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#152033]">Guides & Articles</Link>
          <span>/</span>
          <span className="text-[#152033] font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Article Content */}
          <article className="lg:col-span-2 space-y-6">
            {/* Header Meta */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#3157E8] border border-blue-200">
                  {post.category}
                </span>
                <span className="text-xs text-[#667085]">• {post.read_time}</span>
                <span className="text-xs text-[#667085]">• {post.views_count} views</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#152033] tracking-tight leading-snug">
                {post.title}
              </h1>

              {/* Author & Date Bar */}
              <div className="flex items-center gap-3 pt-2 pb-4 border-b border-[#E7EAF0]">
                <div className="w-10 h-10 rounded-full bg-[#152033] text-white flex items-center justify-center font-bold text-sm">
                  {post.author?.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#152033]">
                    {post.author?.full_name || "UniCompass Editorial Team"}
                  </div>
                  <div className="text-[11px] text-[#667085]">
                    Published on {new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xs border border-[#E7EAF0]">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* Excerpt Callout */}
            <div className="p-5 rounded-2xl bg-[#EEF2FF] border border-[#3157E8]/20 text-sm sm:text-base font-medium text-[#1E3A8A] leading-relaxed">
              💡 <span className="font-semibold">Summary:</span> {post.excerpt}
            </div>

            {/* Formatted Article Body */}
            <div className="bg-white rounded-2xl border border-[#E7EAF0] p-6 sm:p-10 shadow-xs">
              {renderFormattedContent(post.content)}
            </div>
          </article>

          {/* Right Sidebar Widgets */}
          <aside className="space-y-6">
            {/* Associated Country Card */}
            {post.country && (
              <Card className="p-6 border border-[#E7EAF0] shadow-xs space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                  Destination Guide
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{post.country.flag_emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#152033]">
                      Study in {post.country.name}
                    </h3>
                    {post.country.popular_tag && (
                      <span className="text-xs text-[#3157E8] font-semibold">
                        {post.country.popular_tag}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {post.country.overview}
                </p>
                {post.country.avg_cost_pkr && (
                  <div className="p-3 rounded-xl bg-[#F7F8FC] text-xs">
                    <span className="text-[#667085]">Average Cost: </span>
                    <span className="font-bold text-[#152033]">{post.country.avg_cost_pkr}</span>
                  </div>
                )}
                <Link href={`/destinations/${post.country.slug}`} className="block">
                  <Button className="w-full rounded-xl text-xs bg-[#3157E8] text-white">
                    Explore {post.country.name} Guide →
                  </Button>
                </Link>
              </Card>
            )}

            {/* AI Advisor Prompt Card */}
            <Card className="p-6 border border-[#E7EAF0] bg-gradient-to-br from-[#0B132B] to-[#1D2D50] text-white shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#3157E8] flex items-center justify-center text-lg font-bold text-white shadow-xs">
                ✦
              </div>
              <h3 className="text-base font-bold text-white">
                Have questions about this guide?
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Our AI educational advisor can evaluate your grades, IELTS scores, and budget specifically for this program.
              </p>
              <Link href="/chat" className="block pt-2">
                <Button className="w-full rounded-xl text-xs bg-white text-[#0B132B] hover:bg-slate-100 font-bold">
                  Ask AI Advisor Free
                </Button>
              </Link>
            </Card>

            {/* Back to All Articles */}
            <div className="text-center">
              <Link href="/blog" className="text-xs font-bold text-[#3157E8] hover:underline">
                ← View all study abroad articles
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
