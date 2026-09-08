import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Country } from "../types";

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Link
      href={`/destinations/${country.slug}`}
      className="group bg-white rounded-2xl border border-[#E7EAF0] overflow-hidden shadow-xs hover:shadow-md hover:border-[#3157E8]/40 transition-all flex flex-col"
    >
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {country.hero_image_url ? (
          <Image
            src={country.hero_image_url}
            alt={country.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-3xl">
            {country.flag_emoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-xs font-bold text-[#152033] shadow-xs">
          <span>{country.flag_emoji}</span>
          <span>{country.name}</span>
        </div>
        {country.popular_tag && (
          <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full bg-[#3157E8] text-white text-[11px] font-semibold shadow-xs">
            {country.popular_tag}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
            {country.overview}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#E7EAF0] flex items-center justify-between text-xs">
          {country.avg_cost_pkr && (
            <span className="font-semibold text-[#152033]">{country.avg_cost_pkr}</span>
          )}
          <span className="text-[#3157E8] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
            Explore Guide →
          </span>
        </div>
      </div>
    </Link>
  );
}
