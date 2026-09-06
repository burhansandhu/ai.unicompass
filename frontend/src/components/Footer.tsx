import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-12 border-t border-[#1C2541]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3157E8] flex items-center justify-center text-white font-bold text-base">
                ✦
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                UniCompass
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Your trusted partner for study abroad guidance, official university admissions, verified visa deadlines, and real-time PKR conversions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#3157E8] transition-colors flex items-center justify-center cursor-pointer text-gray-300 hover:text-white"
                >
                  <span className="text-xs uppercase font-bold">{social[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/universities" className="hover:text-white transition-colors">Universities</Link></li>
              <li><Link href="/scholarships" className="hover:text-white transition-colors">Scholarships</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Course Finder</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Cost Calculator</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/attestation" className="hover:text-white transition-colors">Attestation Guide</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition-colors">Visa Guidelines</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">SOP Assistant</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">AI Advisor</Link></li>
              <li><Link href="/profile" className="hover:text-white transition-colors">Student Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Subscribe to Newsletter</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Get the latest updates on scholarships, deadlines, and study abroad tips.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to UniCompass newsletter!"); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-10 px-3 text-xs rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#3157E8] w-full"
                required
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-[#3157E8] text-white hover:bg-[#2545BE] transition-colors flex items-center justify-center font-bold text-sm"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} UniCompass. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-gray-400">Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-gray-400">Terms of Service</a>
            <a href="#cookies" onClick={(e) => e.preventDefault()} className="hover:text-gray-400">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
