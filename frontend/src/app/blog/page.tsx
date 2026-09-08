"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard } from "@/features/content/components/PostCard";
import { Post } from "@/features/content/types";
import { getPosts } from "@/features/content/api";

export default function BlogDirectoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["All", "Visa Guidance", "Scholarships", "Admissions", "Cost of Living", "Tips"];

  useEffect(() => {
    setIsLoading(true);
    getPosts({ category: selectedCategory === "All" ? undefined : selectedCategory })
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [selectedCategory]);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#3157E8] text-xs font-semibold mb-3 border border-blue-200">
            <span>📚</span> Knowledge Base & Step-by-Step Walkthroughs
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#152033] tracking-tight">
            Study Abroad Guides & Latest Articles
          </h1>
          <p className="text-sm text-[#667085] mt-3 leading-relaxed">
            Written and vetted by education counselors: visa step-by-step guides, 28-day financial balance rules, scholarship deadlines, and university application strategies.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles (e.g. UK Visa, Scholarships, Germany)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7EAF0] bg-white text-xs text-[#152033] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#3157E8]"
              />
              <span className="absolute left-3.5 top-3.5 text-[#667085] text-sm">🔍</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-[#3157E8] text-white shadow-xs"
                  : "bg-white border border-[#E7EAF0] text-[#667085] hover:text-[#152033] hover:bg-[#F7F8FC]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3157E8]"></div>
            <span className="text-xs text-[#667085]">Loading educational articles...</span>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E7EAF0] p-8">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-bold text-[#152033]">No articles found</h3>
            <p className="text-xs text-[#667085] mt-1">Try choosing another category or clearing your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
