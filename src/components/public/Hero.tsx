"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  motion,
  MotionStyle,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Calendar, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import HeroCamera3D from "@/components/public/HeroCamera3D";
import HeroTextBackdrop from "@/components/public/HeroTextBackdrop";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking for interactive spotlight, viewfinder HUD & bokeh parallax
  const rawMouseX = useMotionValue(360);
  const rawMouseY = useMotionValue(280);
  const smoothMouseX = useSpring(rawMouseX, { stiffness: 120, damping: 24, mass: 0.5 });
  const smoothMouseY = useSpring(rawMouseY, { stiffness: 120, damping: 24, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set(e.clientX - rect.left);
    rawMouseY.set(e.clientY - rect.top);
  };

  // Generous scroll track across both mobile & desktop for smooth scroll-linked parallax reveal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dynamic Viewfinder Frame bounds:
  // Starts full-viewport (text-only centered stage) on BOTH mobile and desktop,
  // then shrinks smoothly into the left half (desktop) or upper half (mobile) on scroll.
  const frameRight = useTransform(scrollYProgress, [0, 0.65], ["3%", "45%"]);
  const frameTop = useTransform(scrollYProgress, [0, 0.65], ["13%", "17%"]);
  const frameBottom = useTransform(scrollYProgress, [0, 0.65], ["4%", "9%"]);
  const frameTopMob = useTransform(scrollYProgress, [0, 0.65], ["11.5%", "10%"]);
  const frameBottomMob = useTransform(scrollYProgress, [0, 0.65], ["4%", "49%"]);

  // Subtle mouse/pointer-driven parallax on the frame itself
  const frameParallaxX = useTransform(smoothMouseX, [0, 1400], [6, -6]);
  const frameParallaxY = useTransform(smoothMouseY, [0, 900], [5, -5]);

  // Mathematically exact continuous center-to-left alignment inside the frame (desktop),
  // while mobile stays cleanly centered inside the shrinking upper viewfinder.
  const alignLeft = useTransform(scrollYProgress, [0, 0.65], ["50%", "0%"]);
  const alignX = useTransform(scrollYProgress, [0, 0.65], ["-50%", "0%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.65], [1, 0.78]);
  const textScaleMob = useTransform(scrollYProgress, [0, 0.65], [1, 0.94]);

  // Portrait cutout motion (shared across mobile & desktop):
  // Hidden at start (y = 0) so only text is visible, then rises smoothly with parallax on scroll.
  const imageY = useTransform(scrollYProgress, [0.06, 0.72], ["108%", "0%"]);
  const imageOpacity = useTransform(scrollYProgress, [0.06, 0.28], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.06, 0.72], [0.92, 1.05]);

  // Ambient red volumetric background bloom intensifies as portrait & 3D optics emerge
  const fogOpacity = useTransform(scrollYProgress, [0.04, 0.68], [0.16, 0.85]);
  const glowScale = useTransform(scrollYProgress, [0.04, 0.75], [0.82, 1.25]);

  // Subtle scroll cue visible at initial load, fading cleanly once scrolling begins
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.14], [0.9, 0]);

  return (
    <section ref={containerRef} className="relative h-[230vh] md:h-[260vh] bg-black">
      {/* Sticky Hero Stage (stays pinned while user scrolls through the track, pb-0 to ensure image touches the exact bottom) */}
      <div
        onPointerMove={handlePointerMove}
        className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-black pt-14 md:pt-16 pb-0"
      >
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
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-red-600/10 rounded-full blur-[130px] sm:blur-[160px] pointer-events-none" />
        </div>

        {/* Creative & Interactive Photography Background (Spotlight, Grid, Bokeh Orbs) */}
        <HeroTextBackdrop
          scrollYProgress={scrollYProgress}
          mouseX={smoothMouseX}
          mouseY={smoothMouseY}
        />

        {/* Mysterious Ambient Red Volumetric Light Bloom behind 3D Camera & Portrait */}
        <motion.div
          style={{ opacity: fogOpacity, scale: glowScale }}
          className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 lg:right-14 bottom-0 w-[340px] sm:w-[460px] md:w-[580px] lg:w-[750px] h-[340px] sm:h-[460px] md:h-[580px] lg:h-[750px] bg-red-600/25 rounded-full blur-[110px] md:blur-[140px] pointer-events-none z-0"
        />

        {/* 3D Camera & Aperture Rotating Animation (Positioned in 3D space behind portrait) */}
        <HeroCamera3D scrollYProgress={scrollYProgress} />

        {/* Synchronized Viewfinder Frame + Hero Text & Buttons */}
        <motion.div
          style={
            {
              "--frame-right": frameRight,
              "--frame-top": frameTop,
              "--frame-bottom": frameBottom,
              "--frame-top-mob": frameTopMob,
              "--frame-bottom-mob": frameBottomMob,
              x: frameParallaxX,
              y: frameParallaxY,
            } as unknown as MotionStyle
          }
          suppressHydrationWarning
          className="absolute left-3 right-3 top-[var(--frame-top-mob)] bottom-[var(--frame-bottom-mob)] md:left-[3%] md:right-[var(--frame-right)] md:top-[var(--frame-top)] md:bottom-[var(--frame-bottom)] z-30 flex items-center justify-center md:justify-start px-3 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:px-12 md:py-0 pointer-events-none"
        >
          {/* Viewfinder Corner Brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-t-2 border-l-2 border-red-600/60 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-t-2 border-r-2 border-white/25 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-b-2 border-l-2 border-white/25 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-b-2 border-r-2 border-red-600/60 rounded-br-sm" />

          {/* Subtle Viewfinder Hairline Border */}
          <div className="absolute inset-0 border border-white/[0.04] rounded-sm pointer-events-none" />

          {/* Minimalist Camera HUD Metadata */}
          <div className="flex items-center gap-2 sm:gap-3 absolute top-2 sm:top-2.5 left-3.5 sm:left-10 text-[8.5px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-red-500/85">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </span>
            <span>AF-C</span>
            <span className="hidden min-[380px]:inline sm:inline">RAW 14-BIT</span>
            <span>f/1.4</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 absolute bottom-2.5 left-10 text-[10px] font-mono tracking-widest text-neutral-600">
            <span>ISO 100</span>
            <span>&bull;</span>
            <span>1/250s</span>
            <span>&bull;</span>
            <span>50mm PRIME</span>
          </div>

          {/* Initial Scroll Cue (fades away once scrolling starts) */}
          <motion.div
            style={{ opacity: scrollHintOpacity }}
            className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-neutral-400 uppercase pointer-events-none"
          >
            <span>Scroll</span>
            <ChevronDown className="w-3 h-3 text-red-500 animate-bounce" />
          </motion.div>

          {/* Text & Buttons locked inside the Viewfinder Frame */}
          <motion.div
            style={
              {
                "--hero-text-scale": textScale,
                "--hero-text-scale-mob": textScaleMob,
                "--align-left": alignLeft,
                "--align-x": alignX,
              } as unknown as MotionStyle
            }
            suppressHydrationWarning
            className="hero-text-scale w-full flex flex-col items-center md:items-start text-center md:text-left z-20 pointer-events-auto origin-center md:origin-left"
          >
            {/* Editorial Studio Pill Eyebrow */}
            <div
              suppressHydrationWarning
              className="hero-align-glide relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-red-950/45 border border-red-800/45 text-red-400 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-2.5 sm:mb-4 whitespace-nowrap"
            >
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 flex-shrink-0" />
              <span>Weddings &bull; Haldi &bull; Cinema</span>
            </div>

            {/* Bold 2-Line Display Headline with Editorial Serif Red Accent */}
            <h1 className="w-full font-display text-[1.22rem] min-[390px]:text-[1.36rem] sm:text-4xl md:text-[2.2rem] lg:text-[3.05rem] xl:text-[3.65rem] font-extrabold text-white tracking-tight leading-[1.16] md:leading-[1.14] flex flex-col items-center md:items-start">
              <span
                suppressHydrationWarning
                className="hero-align-glide relative inline-block w-fit max-w-full min-[360px]:whitespace-nowrap"
              >
                Capturing{" "}
                <span className="font-editorial italic text-red-500 font-extrabold drop-shadow-[0_0_32px_rgba(239,68,68,0.8)]">
                  Raw Emotions
                </span>
                ,
              </span>
              <span
                suppressHydrationWarning
                className="hero-align-glide relative inline-block w-fit max-w-full min-[360px]:whitespace-nowrap mt-0.5 sm:mt-1"
              >
                Preserving Timeless Memories
              </span>
            </h1>

            {/* Crisp Balanced Subtitle */}
            <p
              suppressHydrationWarning
              className="hero-align-glide relative w-fit max-w-[36ch] sm:max-w-xl font-display mt-2.5 sm:mt-4 md:mt-5 text-[11.5px] min-[390px]:text-xs sm:text-base lg:text-lg text-neutral-300 font-medium sm:font-semibold tracking-wide leading-relaxed px-1 md:px-0"
            >
              From sacred marriage vows to vibrant haldi celebrations and milestone birthdays,
              we craft timeless visuals with soul and precision.
            </p>

            {/* Professional Luxury Action Buttons — Side by Side across Mobile, Tablet, and Desktop */}
            <div
              suppressHydrationWarning
              className="hero-align-glide relative w-full md:w-fit max-w-[340px] min-[390px]:max-w-[370px] sm:max-w-md md:max-w-full mt-4 sm:mt-6 md:mt-8 flex flex-row flex-nowrap items-center justify-center md:justify-start gap-2 sm:gap-3.5 lg:gap-4"
            >
              <a
                href="#portfolio"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 min-[390px]:gap-1.5 sm:gap-2.5 px-2.5 min-[390px]:px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 lg:py-4 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-bold text-[10px] min-[390px]:text-[11px] sm:text-xs lg:text-sm tracking-normal min-[390px]:tracking-wide sm:tracking-wider uppercase shadow-xl shadow-red-950/70 hover:shadow-red-700/60 hover:scale-[1.03] active:scale-95 transition-all duration-300 group whitespace-nowrap"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-3 h-3 min-[390px]:w-3.5 min-[390px]:h-3.5 sm:w-4 sm:h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1 min-[390px]:gap-1.5 sm:gap-2 px-2.5 min-[390px]:px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 lg:py-4 rounded-full bg-neutral-900/80 hover:bg-neutral-850 text-white font-bold text-[10px] min-[390px]:text-[11px] sm:text-xs lg:text-sm tracking-normal min-[390px]:tracking-wide sm:tracking-wider uppercase border border-neutral-700/90 hover:border-red-500 hover:text-red-400 backdrop-blur-md shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                <Calendar className="w-3 h-3 min-[390px]:w-3.5 min-[390px]:h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <span>Book Your Date</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Portrait Cutout of Bharath Kumar: Hidden at start (y = 0) and rises with parallax on scroll */}
        <motion.div
          style={{
            y: imageY,
            opacity: imageOpacity,
            scale: imageScale,
          }}
          className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 lg:right-2 xl:right-4 bottom-0 z-20 w-[115vw] max-w-[540px] sm:w-[580px] md:w-[500px] lg:w-[620px] xl:w-[720px] h-[65dvh] sm:h-[67dvh] md:h-[84vh] lg:h-[94vh] pointer-events-none select-none origin-bottom"
        >
          <Image
            src="/bharath-cutout.png"
            alt="Bharath Kumar - Lead Photographer"
            fill
            priority
            className="object-contain object-bottom filter contrast-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            sizes="(max-width: 640px) 540px, (max-width: 1024px) 580px, 720px"
          />
        </motion.div>
      </div>
    </section>
  );
}
