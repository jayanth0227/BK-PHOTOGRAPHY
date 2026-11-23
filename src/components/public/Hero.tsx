"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import HeroCamera3D from "@/components/public/HeroCamera3D";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generous 280vh scroll track to make parallax motion much slower, smoother, and cinematic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Continuous scroll-linked parallax:
  // Starts at 0% (exact center) and glides smoothly to the left side without any server/client branching
  const textX = useTransform(scrollYProgress, [0, 0.75], ["0%", "-28%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.75], [1, 0.96]);

  // Continuous alignment interpolation:
  // Identical on both server (SSR) and client, avoiding any hydration mismatch.
  const line1X = useTransform(scrollYProgress, [0, 0.65], [28, 0]);
  const line2X = useTransform(scrollYProgress, [0, 0.65], [-12, 0]);
  const subtitleX = useTransform(scrollYProgress, [0, 0.65], [16, 0]);
  const buttonsX = useTransform(scrollYProgress, [0, 0.65], [90, 0]);

  // Portrait cutout motion: rises smoothly from below the viewport (110% -> 0%)
  const imageY = useTransform(scrollYProgress, [0.08, 0.82], ["110%", "0%"]);
  const imageOpacity = useTransform(scrollYProgress, [0.08, 0.32], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.08, 0.82], [0.94, 1.04]);

  // Ambient mysterious volumetric red aura
  const fogOpacity = useTransform(scrollYProgress, [0.1, 0.7], [0.2, 0.75]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.8], [0.85, 1.25]);

  return (
    <section ref={containerRef} className="relative h-[280vh] bg-black">
      {/* Sticky Hero Stage (stays pinned while user scrolls through the 280vh track, pb-0 to ensure image touches the exact bottom) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black pt-16 pb-0">
        {/* Background Cinematic Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85"
            alt="Cinematic Wedding Photography Background"
            fill
            priority
            className="object-cover object-center opacity-15 filter brightness-35 contrast-130"
          />
          {/* Radial Red & Black Luxury Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
        </div>

        {/* Mysterious Ambient Red Volumetric Light Bloom behind 3D Camera & Portrait */}
        <motion.div
          style={{ opacity: fogOpacity, scale: glowScale }}
          className="absolute right-0 sm:right-6 lg:right-14 bottom-0 w-[420px] sm:w-[600px] lg:w-[750px] h-[420px] sm:h-[600px] lg:h-[750px] bg-red-600/25 rounded-full blur-[140px] pointer-events-none z-0"
        />

        {/* 3D Camera & Aperture Rotating Animation (Positioned in 3D space behind portrait) */}
        <HeroCamera3D scrollYProgress={scrollYProgress} />

        {/* Main Content Area (Text & Buttons) */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
          <motion.div
            style={{
              x: textX,
              scale: textScale,
            }}
            suppressHydrationWarning
            className="w-full max-w-3xl flex flex-col items-start text-left z-20 pointer-events-auto"
          >
            {/* Headline with continuous scroll parallax alignment */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-[1.18] flex flex-col items-start">
              <motion.span style={{ x: line1X }} className="inline-block" suppressHydrationWarning>
                Capturing{" "}
                <span className="font-serif italic text-red-500 font-normal drop-shadow-[0_0_30px_rgba(239,68,68,0.75)]">
                  Raw Emotions
                </span>
                ,
              </motion.span>
              <motion.span style={{ x: line2X }} className="inline-block" suppressHydrationWarning>
                Preserving Timeless Memories
              </motion.span>
            </h1>

            {/* Subtitle with continuous scroll parallax alignment */}
            <motion.p
              style={{ x: subtitleX }}
              suppressHydrationWarning
              className="mt-6 max-w-2xl text-sm sm:text-base lg:text-lg text-neutral-300 font-light leading-relaxed"
            >
              From the sacred rituals of marriage to joyous haldi celebrations and birthday milestones,
              we craft cinematic visuals with artistic composition and passion.
            </motion.p>

            {/* Professional Luxury Action Buttons with continuous scroll parallax alignment */}
            <motion.div
              style={{ x: buttonsX }}
              suppressHydrationWarning
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <a
                href="#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-red-950/70 hover:shadow-red-700/60 hover:scale-[1.03] active:scale-95 transition-all duration-300 group"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 rounded-full bg-neutral-900/80 hover:bg-neutral-850 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase border border-neutral-700/90 hover:border-red-500 hover:text-red-400 backdrop-blur-md shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300"
              >
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Book Your Date</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Portrait Cutout of Bharath Kumar: Direct parent of Image with explicit height to satisfy Next.js Image fill requirements */}
        <motion.div
          style={{
            y: imageY,
            opacity: imageOpacity,
            scale: imageScale,
          }}
          className="absolute right-0 sm:right-0 lg:right-4 xl:right-10 bottom-0 z-20 w-[360px] sm:w-[500px] lg:w-[640px] xl:w-[740px] h-[75vh] sm:h-[88vh] lg:h-[95vh] pointer-events-none select-none"
        >
          <Image
            src="/bharath-cutout.png"
            alt="Bharath Kumar - Lead Photographer"
            fill
            priority
            className="object-contain object-bottom filter contrast-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 500px, 740px"
          />
        </motion.div>
      </div>
    </section>
  );
}
