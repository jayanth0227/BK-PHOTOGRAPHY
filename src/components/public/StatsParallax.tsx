"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Award, Heart, Camera, Sparkles } from "lucide-react";

export default function StatsParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track mouse scroll through the pinned 220vh track
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Camera image motion: comes from RIGHT to LEFT, expanding to a large hero size
  const cameraX = useTransform(scrollYProgress, [0, 0.75], ["65%", "0%"]);
  const cameraOpacity = useTransform(scrollYProgress, [0, 0.25], [0.2, 1]);
  const cameraScale = useTransform(scrollYProgress, [0, 0.75], [0.88, 1.05]);
  const cameraRotate = useTransform(scrollYProgress, [0, 0.75], [14, -3]);

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

  // Floating gear badge on camera
  const badgeOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[#070707] border-t border-neutral-900">
      {/* Sticky Stage (remains fixed on screen as user scrolls through the 220vh track) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#070707] pt-16 pb-8">
        {/* Ambient Red Lighting Atmosphere */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute right-0 sm:right-16 lg:right-28 top-1/2 -translate-y-1/2 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none z-0"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Narrative & Sequential One-by-One KPI Cards (Decreased Size) */}
            <div className="lg:col-span-6 space-y-6 z-20">
              <motion.div style={{ opacity: headingOpacity, y: headingY }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  Track Record of Excellence
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
                  Numbers That Reflect Our{" "}
                  <span className="font-serif italic text-red-500 font-normal drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                    Dedication
                  </span>
                </h2>

                <p className="mt-3 text-neutral-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
                  Behind every frame is a team devoted to emotional authenticity, cinematic color grading,
                  and capturing moments that grow more valuable with every passing year.
                </p>
              </motion.div>

              {/* KPI Cards (Decreased Size & Sequential One-by-One Reveal on Scroll) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1 max-w-lg">
                {/* Card 1: 500+ */}
                <motion.div
                  style={{ opacity: card1Opacity, y: card1Y, scale: card1Scale }}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      500<span className="text-red-500">+</span>
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-200">
                    Weddings &amp; Celebrations
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
                    Sacred muhurthams &amp; candid joy.
                  </p>
                </motion.div>

                {/* Card 2: 10+ */}
                <motion.div
                  style={{ opacity: card2Opacity, y: card2Y, scale: card2Scale }}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      10<span className="text-red-500">+</span>
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-200">
                    Years of Experience
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
                    Decade of visual storytelling.
                  </p>
                </motion.div>

                {/* Card 3: 100% */}
                <motion.div
                  style={{ opacity: card3Opacity, y: card3Y, scale: card3Scale }}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                      100<span className="text-red-500">%</span>
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-200">
                    Client Delight &amp; Trust
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
                    Uncompromising handcrafted care.
                  </p>
                </motion.div>

                {/* Card 4: 4.9* */}
                <motion.div
                  style={{ opacity: card4Opacity, y: card4Y, scale: card4Scale }}
                  className="p-4 sm:p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-red-600/50 backdrop-blur-md shadow-lg transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors flex items-center gap-1">
                      4.9 <Star className="w-5 h-5 text-red-500 fill-red-500 inline" />
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
                      <Star className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-neutral-200">
                    Verified Rating
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 font-light">
                    Loved across South India.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Side: Much Bigger Camera in Hand Image (Comes from Right to Left on Scroll) */}
            <div className="lg:col-span-6 relative flex items-center justify-center sm:justify-end">
              <motion.div
                style={{
                  x: cameraX,
                  opacity: cameraOpacity,
                  scale: cameraScale,
                  rotate: cameraRotate,
                }}
                className="relative w-[340px] sm:w-[520px] lg:w-[680px] xl:w-[760px] h-[380px] sm:h-[550px] lg:h-[680px] xl:h-[750px] flex items-center justify-center pointer-events-none select-none"
              >
                <Image
                  src="/camera-cutout.png"
                  alt="Sony Cinema Camera in Hand"
                  fill
                  priority
                  className="object-contain filter contrast-125 brightness-105 drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)]"
                  sizes="(max-width: 640px) 340px, (max-width: 1024px) 520px, 760px"
                />

                {/* Floating Cinema Gear Tag */}
                <motion.div
                  style={{ opacity: badgeOpacity }}
                  className="absolute bottom-6 left-2 sm:bottom-12 sm:left-6 p-3 sm:p-4 rounded-2xl bg-black/90 backdrop-blur-2xl border border-neutral-800 shadow-2xl flex items-center gap-3 z-30 pointer-events-auto"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Full-Frame Cinema Grade</div>
                    <div className="text-[10px] text-neutral-400 font-mono">Sony FX3 &bull; G-Master Prime Optics</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
