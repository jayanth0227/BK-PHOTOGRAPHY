"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Award, Heart, Camera, Sparkles } from "lucide-react";
import StatsCamera3DBackdrop from "@/components/public/StatsCamera3DBackdrop";
import SonyFX3Illustration from "@/components/public/SonyFX3Illustration";

export default function StatsParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track mouse scroll through the pinned 220vh track
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Camera image motion: comes from RIGHT to LEFT, rotating counter-clockwise (opposite to backdrop)
  const cameraX = useTransform(scrollYProgress, [0, 0.75], ["65%", "0%"]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.25], [0.2, 1]);
  const cameraScale = useTransform(scrollYProgress, [0, 0.75], [0.88, 1.05]);
  const cameraRotate = useTransform(scrollYProgress, [0, 0.75], [16, -4]);

  // Ambient red backlight following the camera
  const glowOpacity = useTransform(scrollYProgress, [0.05, 0.7], [0.1, 0.85]);

  // Heading smooth entrance
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);
  const headingY = useTransform(scrollYProgress, [0, 0.15], [20, 0]);

  // Sequential one-by-one reveal of the 4 KPI cards as user scrolls
  const card1Opacity = useTransform(scrollYProgress, [0.05, 0.22], [0, 1]);
  const card1Y = useTransform(scrollYProgress, [0.05, 0.22], [30, 0]);
  const card1Scale = useTransform(scrollYProgress, [0.05, 0.22], [0.92, 1]);

  const card2Opacity = useTransform(scrollYProgress, [0.22, 0.38], [0, 1]);
  const card2Y = useTransform(scrollYProgress, [0.22, 0.38], [30, 0]);
  const card2Scale = useTransform(scrollYProgress, [0.22, 0.38], [0.92, 1]);

  const card3Opacity = useTransform(scrollYProgress, [0.38, 0.54], [0, 1]);
  const card3Y = useTransform(scrollYProgress, [0.38, 0.54], [30, 0]);
  const card3Scale = useTransform(scrollYProgress, [0.38, 0.54], [0.92, 1]);

  const card4Opacity = useTransform(scrollYProgress, [0.54, 0.70], [0, 1]);
  const card4Y = useTransform(scrollYProgress, [0.54, 0.70], [30, 0]);
  const card4Scale = useTransform(scrollYProgress, [0.54, 0.70], [0.92, 1]);

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[#070707] border-t border-neutral-900">
      {/* Sticky Stage (remains fixed on screen as user scrolls through the 220vh track) */}
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-[#070707] pt-20 pb-3 sm:pt-24 sm:pb-8">
        {/* Ambient Red Lighting Atmosphere */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute right-0 sm:right-16 lg:right-28 top-1/2 -translate-y-1/2 w-[320px] sm:w-[650px] h-[320px] sm:h-[650px] bg-red-600/20 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none z-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-center">
            {/* Left Side: Narrative & Sequential One-by-One KPI Cards */}
            <div className="lg:col-span-6 space-y-3 sm:space-y-6 z-20">
              <motion.div style={{ opacity: headingOpacity, y: headingY }}>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                  Track Record of Excellence
                </div>

                <h2 className="text-xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
                  Numbers That Reflect Our{" "}
                  <span className="font-serif italic text-red-500 font-normal drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    Dedication
                  </span>
                </h2>

                <p className="mt-1.5 sm:mt-3 text-neutral-300 text-[11px] sm:text-sm font-light leading-relaxed max-w-lg">
                  Behind every frame is a team devoted to emotional authenticity, cinematic color grading,
                  and capturing moments that grow more valuable with every passing year.
                </p>
              </motion.div>

              {/* KPI Cards (2x2 on mobile and desktop for clean fit inside sticky viewport) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-0.5 sm:pt-1 max-w-lg">
                {/* Card 1: 500+ */}
                <motion.div
                  style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
                  className="p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      500<span className="text-red-500">+</span>
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <h4 className="text-[11px] sm:text-sm font-semibold text-neutral-200 leading-snug">
                    Weddings &amp; Celebrations
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 font-light leading-snug">
                    Sacred muhurthams &amp; candid joy.
                  </p>
                </motion.div>

                {/* Card 2: 10+ */}
                <motion.div
                  style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
                  className="p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      10<span className="text-red-500">+</span>
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <h4 className="text-[11px] sm:text-sm font-semibold text-neutral-200 leading-snug">
                    Years of Experience
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 font-light leading-snug">
                    Decade of visual storytelling.
                  </p>
                </motion.div>

                {/* Card 3: 100% */}
                <motion.div
                  style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
                  className="p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      100<span className="text-red-500">%</span>
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <h4 className="text-[11px] sm:text-sm font-semibold text-neutral-200 leading-snug">
                    Client Delight &amp; Trust
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 font-light leading-snug">
                    Uncompromising handcrafted care.
                  </p>
                </motion.div>

                {/* Card 4: 4.9* */}
                <motion.div
                  style={{ opacity: card4Opacity, y: card4Y, scale: card4Scale }}
                  className="p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors flex items-center gap-1">
                      4.9 <Star className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500 inline" />
                    </span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <h4 className="text-[11px] sm:text-sm font-semibold text-neutral-200 leading-snug">
                    Verified Rating
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 font-light leading-snug">
                    Loved across South India.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Side: 3D Camera Optics Backdrop + Sony FX3 Illustration */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              {/* 3D Animated Optical Portal & Volumetric Light Beam behind the Camera */}
              <StatsCamera3DBackdrop scrollYProgress={scrollYProgress} />

              <motion.div
                style={{
                  x: cameraX,
                  opacity: cameraOpacity,
                  scale: cameraScale,
                  rotate: cameraRotate,
                }}
                className="relative z-10 flex items-center justify-center pointer-events-none select-none"
              >
                <SonyFX3Illustration scrollYProgress={scrollYProgress} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
