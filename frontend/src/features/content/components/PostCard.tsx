import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "visa guidance":
      case "visa":
        return "bg-blue-100 text-blue-700";
      case "scholarship":
      case "scholarships":
        return "bg-amber-100 text-amber-700";
      case "admissions":
      case "tips":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-purple-100 text-purple-700";
    }
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-xs hover:shadow-md hover:border-[#3157E8]/40 transition-all flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative h-48 w-full bg-slate-100 overflow-hidden block">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#152033] to-[#3157E8] text-white text-3xl font-bold">
            ✦
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#667085] mb-2">
            <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
            <span>•</span>
            <span>{post.read_time}</span>
            {post.country && (
              <>
                <span>•</span>
                <span className="font-semibold text-[#152033]">{post.country.flag_emoji} {post.country.name}</span>
              </>
            )}
          </div>

          <h3 className="font-bold text-base text-[#152033] group-hover:text-[#3157E8] transition-colors line-clamp-2 leading-snug">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs text-[#667085] mt-2 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E7EAF0] flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            By <span className="font-semibold text-[#152033]">{post.author?.full_name || "UniCompass Editorial"}</span>
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-xs font-bold text-[#3157E8] group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
          >
            Read Article →
          </Link>
        </div>
      </div>
    </article>
  );
}
