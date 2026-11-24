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
import { Calendar, ArrowRight } from "lucide-react";
import HeroCamera3D from "@/components/public/HeroCamera3D";
import HeroTextBackdrop from "@/components/public/HeroTextBackdrop";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking for interactive spotlight, viewfinder HUD & bokeh parallax
  const rawMouseX = useMotionValue(420);
  const rawMouseY = useMotionValue(360);
  const smoothMouseX = useSpring(rawMouseX, { stiffness: 120, damping: 24, mass: 0.5 });
  const smoothMouseY = useSpring(rawMouseY, { stiffness: 120, damping: 24, mass: 0.5 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set(e.clientX - rect.left);
    rawMouseY.set(e.clientY - rect.top);
  };

  // Generous 280vh scroll track to make parallax motion slower, smoother, and cinematic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dynamic Viewfinder Frame bounds:
  // Desktop (md+): shrinks horizontally to the left half (right: 45%, top: 18%, bottom: 10%).
  // Mobile (< md): shrinks vertically to the upper half (top: 11.5% -> 10.5%, bottom: 4% -> 45%), leaving the lower stage clear for 3D camera + portrait.
  const frameRight = useTransform(scrollYProgress, [0, 0.68], ["3%", "45%"]);
  const frameTop = useTransform(scrollYProgress, [0, 0.68], ["13%", "18%"]);
  const frameBottom = useTransform(scrollYProgress, [0, 0.68], ["4%", "10%"]);
  const frameTopMob = useTransform(scrollYProgress, [0, 0.68], ["13%", "12%"]);
  const frameBottomMob = useTransform(scrollYProgress, [0, 0.68], ["4%", "44%"]);

  // Subtle mouse/pointer-driven parallax on the frame itself
  const frameParallaxX = useTransform(smoothMouseX, [0, 1400], [6, -6]);
  const frameParallaxY = useTransform(smoothMouseY, [0, 900], [5, -5]);

  // Mathematically exact continuous center-to-left alignment inside the frame (desktop),
  // while mobile stays cleanly centered inside the upper shrinking viewfinder.
  const alignLeft = useTransform(scrollYProgress, [0, 0.68], ["50%", "0%"]);
  const alignX = useTransform(scrollYProgress, [0, 0.68], ["-50%", "0%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.68], [1, 0.76]);
  const textScaleMob = useTransform(scrollYProgress, [0, 0.68], [1, 0.9]);

  // Portrait cutout motion: rises smoothly from below the viewport (110% -> 0%)
  const imageY = useTransform(scrollYProgress, [0.08, 0.82], ["110%", "0%"]);
  const imageOpacity = useTransform(scrollYProgress, [0.08, 0.32], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0.08, 0.82], [0.94, 1.04]);

  // Ambient mysterious volumetric red aura
  const fogOpacity = useTransform(scrollYProgress, [0.1, 0.7], [0.2, 0.75]);
  const glowScale = useTransform(scrollYProgress, [0.1, 0.8], [0.85, 1.25]);

  return (
    <section ref={containerRef} className="relative h-[260vh] md:h-[280vh] bg-black">
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
          <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />
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
          className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 lg:right-14 bottom-0 w-[300px] sm:w-[440px] md:w-[580px] lg:w-[750px] h-[300px] sm:h-[440px] md:h-[580px] lg:h-[750px] bg-red-600/25 rounded-full blur-[110px] md:blur-[140px] pointer-events-none z-0"
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
          className="absolute left-3 right-3 top-[var(--frame-top-mob)] bottom-[var(--frame-bottom-mob)] md:left-[3%] md:right-[var(--frame-right)] md:top-[var(--frame-top)] md:bottom-[var(--frame-bottom)] z-20 flex items-center justify-center md:justify-start px-4 py-6 sm:px-8 lg:px-12 md:py-0 pointer-events-none"
        >
          {/* Viewfinder Corner Brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-t-2 border-l-2 border-red-600/60 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-t-2 border-r-2 border-white/25 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-b-2 border-l-2 border-white/25 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-8 sm:h-8 lg:w-9 lg:h-9 border-b-2 border-r-2 border-red-600/60 rounded-br-sm" />

          {/* Subtle Viewfinder Hairline Border */}
          <div className="absolute inset-0 border border-white/[0.04] rounded-sm pointer-events-none" />

          {/* Minimalist Camera HUD Metadata */}
          <div className="flex items-center gap-2 sm:gap-3 absolute top-2 sm:top-2.5 left-4 sm:left-10 text-[9px] sm:text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 text-red-500/85">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </span>
            <span>AF-C</span>
            <span className="hidden xs:inline sm:inline">RAW 14-BIT</span>
            <span>f/1.4</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 absolute bottom-2.5 left-10 text-[10px] font-mono tracking-widest text-neutral-600">
            <span>ISO 100</span>
            <span>&bull;</span>
            <span>1/250s</span>
            <span>&bull;</span>
            <span>50mm PRIME</span>
          </div>

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
            {/* Bold Display Headline with Editorial Serif Red Accent */}
            <h1 className="w-full font-display text-[1.45rem] sm:text-4xl md:text-5xl lg:text-[3.1rem] xl:text-[3.65rem] font-extrabold text-white tracking-tight leading-[1.15] md:leading-[1.14] flex flex-col items-center md:items-start">
              <span
                suppressHydrationWarning
                className="hero-align-glide relative inline-block w-fit max-w-full sm:whitespace-nowrap"
              >
                Capturing{" "}
                <span className="font-editorial italic text-red-500 font-extrabold drop-shadow-[0_0_32px_rgba(239,68,68,0.8)]">
                  Raw Emotions
                </span>
                ,
              </span>
              <span
                suppressHydrationWarning
                className="hero-align-glide relative inline-block w-fit max-w-full sm:whitespace-nowrap mt-1"
              >
                Preserving Timeless Memories
              </span>
            </h1>

            {/* Bold & Crisp Subtitle */}
            <p
              suppressHydrationWarning
              className="hero-align-glide relative w-fit max-w-md sm:max-w-xl font-display mt-3 sm:mt-5 md:mt-6 text-xs sm:text-base lg:text-lg text-neutral-200 font-medium sm:font-semibold tracking-wide leading-relaxed px-1 md:px-0"
            >
              From the sacred rituals of marriage to joyous haldi celebrations and birthday milestones,
              we craft cinematic visuals with artistic composition and passion.
            </p>

            {/* Professional Luxury Action Buttons */}
            <div
              suppressHydrationWarning
              className="hero-align-glide relative w-fit max-w-full mt-4 sm:mt-7 md:mt-9 flex flex-row flex-wrap justify-center md:justify-start gap-2.5 sm:gap-4"
            >
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-bold text-[11px] sm:text-sm tracking-wider uppercase shadow-xl shadow-red-950/70 hover:shadow-red-700/60 hover:scale-[1.03] active:scale-95 transition-all duration-300 group whitespace-nowrap"
              >
                <span>Explore Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full bg-neutral-900/80 hover:bg-neutral-850 text-white font-bold text-[11px] sm:text-sm tracking-wider uppercase border border-neutral-700/90 hover:border-red-500 hover:text-red-400 backdrop-blur-md shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                <span>Book Your Date</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Portrait Cutout of Bharath Kumar: Centered lower stage on mobile (< md), right-aligned full stage on desktop (md+) */}
        <motion.div
          style={{
            y: imageY,
            opacity: imageOpacity,
            scale: imageScale,
          }}
          className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 lg:right-2 xl:right-4 bottom-0 z-20 w-[280px] sm:w-[370px] md:w-[540px] lg:w-[620px] xl:w-[720px] h-[41vh] sm:h-[44vh] md:h-[84vh] lg:h-[94vh] pointer-events-none select-none"
        >
          <Image
            src="/bharath-cutout.png"
            alt="Bharath Kumar - Lead Photographer"
            fill
            priority
            className="object-contain object-bottom filter contrast-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 500px, 720px"
          />
        </motion.div>
      </div>
    </section>
  );
}
