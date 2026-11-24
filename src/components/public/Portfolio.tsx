"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, Sparkles, MapPin, Calendar } from "lucide-react";
import { PortfolioItemType, INITIAL_PORTFOLIO_ITEMS } from "@/lib/sampleData";
import Lightbox from "@/components/ui/Lightbox";

const CATEGORIES = [
  "All",
  "Marriage",
  "Haldi",
  "Birthday",
  "Pre-Wedding",
  "Portraits",
] as const;

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [items, setItems] = useState<PortfolioItemType[]>(INITIAL_PORTFOLIO_ITEMS);
  const [activeLightboxItem, setActiveLightboxItem] = useState<PortfolioItemType | null>(null);

  // Fetch live photos from database (with fallback to sample items)
  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        console.warn("Using sample portfolio items:", err);
      }
    }
    fetchPortfolio();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-black relative border-t border-neutral-900 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            Our Visual Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Moments Frozen In <span className="font-serif italic text-red-500">Perfection</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-base font-light">
            Every frame tells a chapter of authentic love, laughter, and heritage. Browse our
            curated portfolio below.
          </p>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 mt-8"
            suppressHydrationWarning
          >
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 ${
                    active
                      ? "bg-red-600 text-white shadow-lg shadow-red-900/50 scale-105"
                      : "bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-neutral-950 border border-neutral-800/80 hover:border-red-600/60 transition-all duration-500 hover:shadow-2xl hover:shadow-red-950/40"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Category Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-neutral-700/60">
                  {item.category}
                </span>
              </div>

              {/* Hover Eye Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-900/50 backdrop-blur-sm">
                  <Eye className="w-6 h-6" />
                </div>
              </div>

              {/* Bottom Details Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-serif text-white font-medium group-hover:text-red-300 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-neutral-400">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                      {item.location}
                    </span>
                  )}
                  {item.eventDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      {item.eventDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-neutral-400 bg-neutral-900/30 rounded-2xl border border-neutral-800">
            <p>No photos found in this category yet.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        item={activeLightboxItem}
        items={filteredItems}
        onClose={() => setActiveLightboxItem(null)}
        onNavigate={(item) => setActiveLightboxItem(item)}
      />
    </section>
  );
}
