"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, MapPin, Tag } from "lucide-react";
import { PortfolioItemType } from "@/lib/sampleData";

interface LightboxProps {
  item: PortfolioItemType | null;
  items: PortfolioItemType[];
  onClose: () => void;
  onNavigate: (item: PortfolioItemType) => void;
}

export default function Lightbox({
  item,
  items,
  onClose,
  onNavigate,
}: LightboxProps) {
  const currentIndex = item ? items.findIndex((i) => i._id === item._id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else if (items.length > 0) {
      onNavigate(items[items.length - 1]);
    }
  }, [currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onNavigate(items[currentIndex + 1]);
    } else if (items.length > 0) {
      onNavigate(items[0]);
    }
  }, [currentIndex, items, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose, handlePrev, handleNext]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close fullscreen preview"
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-neutral-900/80 text-white hover:text-red-500 hover:bg-neutral-800 border border-neutral-700 transition"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 text-white hover:text-red-500 hover:bg-neutral-900 border border-neutral-800 transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        aria-label="Next image"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-black/60 text-white hover:text-red-500 hover:bg-neutral-900 border border-neutral-800 transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image container & Caption */}
      <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-[70vh] sm:h-[75vh] flex items-center justify-center">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-contain"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 w-full max-w-2xl bg-neutral-950/80 border border-neutral-800 p-4 rounded-xl text-center flex flex-col items-center">
          <h3 className="text-xl font-medium text-white tracking-wide">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/40 text-red-400 border border-red-900/40 font-medium">
              <Tag className="w-3.5 h-3.5" />
              {item.category}
            </span>
            {item.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {item.location}
              </span>
            )}
            {item.eventDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {item.eventDate}
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Bharath Kumar Photography &bull; All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
