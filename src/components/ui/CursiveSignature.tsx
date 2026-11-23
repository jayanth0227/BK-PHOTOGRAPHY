"use client";

import React from "react";
import Link from "next/link";

interface CursiveSignatureProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CursiveSignature({
  className = "",
  size = "sm",
}: CursiveSignatureProps) {
  const sizeStyles = {
    sm: {
      name: "text-2xl sm:text-[26px]",
      initials: "text-3xl sm:text-[34px]",
      sub: "text-[8px] sm:text-[9px] tracking-[0.3em]",
      spacing: "gap-1",
    },
    md: {
      name: "text-3xl sm:text-4xl",
      initials: "text-4xl sm:text-5xl",
      sub: "text-[10px] tracking-[0.32em]",
      spacing: "gap-1.5",
    },
    lg: {
      name: "text-4xl sm:text-5xl",
      initials: "text-5xl sm:text-6xl",
      sub: "text-[12px] tracking-[0.36em]",
      spacing: "gap-2",
    },
  }[size];

  return (
    <Link
      href="/"
      className={`group inline-flex flex-col items-center justify-center select-none focus:outline-none transition-transform hover:scale-[1.02] ${className}`}
    >
      {/* Cursive Name with Bold Crimson Red Initials */}
      <div className={`font-signature flex items-baseline tracking-normal leading-none font-normal ${sizeStyles.name}`}>
        <span className={`text-red-500 font-bold italic mr-[0.5px] drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] group-hover:text-red-400 transition-colors ${sizeStyles.initials}`}>
          B
        </span>
        <span className="text-white italic mr-2.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          harath
        </span>
        <span className={`text-red-500 font-bold italic mr-[0.5px] drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] group-hover:text-red-400 transition-colors ${sizeStyles.initials}`}>
          K
        </span>
        <span className="text-white italic drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          umar
        </span>
      </div>

      {/* Underline separator & Sleek Uppercase Subtitle */}
      <div className={`w-full flex items-center justify-center ${sizeStyles.spacing} -mt-0.5 sm:-mt-1`}>
        <div className="h-[1px] w-2.5 sm:w-3.5 bg-red-600/70" />
        <span className={`uppercase font-sans font-semibold text-neutral-300 group-hover:text-white transition-colors ${sizeStyles.sub}`}>
          PHOTOGRAPHY
        </span>
        <div className="h-[1px] w-2.5 sm:w-3.5 bg-red-600/70" />
      </div>
    </Link>
  );
}
