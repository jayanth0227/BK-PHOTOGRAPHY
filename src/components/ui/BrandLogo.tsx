"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showImage?: boolean;
  className?: string;
}

export default function BrandLogo({
  size = "md",
  showImage = true,
  className = "",
}: BrandLogoProps) {
  // Dimension mappings
  const imgDimensions = {
    sm: { width: 140, height: 45 },
    md: { width: 190, height: 60 },
    lg: { width: 260, height: 85 },
    xl: { width: 340, height: 110 },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center group focus:outline-none transition-transform hover:scale-[1.02] ${className}`}
    >
      {showImage ? (
        <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
          <Image
            src="/logo.jpg"
            alt="Bharath Kumar Photography"
            width={imgDimensions.width}
            height={imgDimensions.height}
            style={{ width: "auto", height: "auto" }}
            className="object-contain filter contrast-125 brightness-105"
            priority
          />
        </div>
      ) : (
        <div className="flex flex-col items-center select-none text-center">
          {/* Camera aperture icon */}
          <div className="mb-1 text-white">
            <svg
              className="w-7 h-7 mx-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>

          {/* Script Name with Red Monogram */}
          <div className="flex items-baseline text-2xl sm:text-3xl font-serif tracking-tight leading-none">
            <span className="text-red-600 font-extrabold text-3xl sm:text-4xl italic mr-[1px] drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]">
              B
            </span>
            <span className="text-white font-medium italic mr-2 text-xl sm:text-2xl font-serif">
              harath
            </span>
            <span className="text-red-600 font-extrabold text-3xl sm:text-4xl italic mr-[1px] drop-shadow-[0_0_12px_rgba(220,38,38,0.7)]">
              K
            </span>
            <span className="text-white font-medium italic text-xl sm:text-2xl font-serif">
              umar
            </span>
          </div>

          {/* Divider bar */}
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent my-1" />

          {/* Subtitle */}
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-neutral-300 font-semibold pl-[0.35em]">
            Photography
          </span>
        </div>
      )}
    </Link>
  );
}
