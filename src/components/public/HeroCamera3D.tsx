"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface HeroCamera3DProps {
  scrollYProgress: MotionValue<number>;
}

export default function HeroCamera3D({ scrollYProgress }: HeroCamera3DProps) {
  // 3D Rotations tied to mouse scroll progression
  const rotateY = useTransform(scrollYProgress, [0.05, 0.85], [-35, 25]);
  const rotateX = useTransform(scrollYProgress, [0.05, 0.85], [20, -10]);
  const rotateZ = useTransform(scrollYProgress, [0.05, 0.85], [-15, 140]);
  const scale = useTransform(scrollYProgress, [0.05, 0.85], [0.65, 1.2]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.25, 0.85], [0, 0.95, 0.9]);

  // Aperture blades counter-rotation (creates mechanical iris effect)
  const irisRotation = useTransform(scrollYProgress, [0.05, 0.85], [0, 240]);
  const irisScale = useTransform(scrollYProgress, [0.05, 0.85], [0.75, 1.15]);

  return (
    <motion.div
      style={{
        opacity,
        scale,
        perspective: 1200,
      }}
      className="absolute right-0 sm:right-2 lg:right-6 xl:right-12 bottom-0 w-[340px] sm:w-[500px] lg:w-[620px] h-[340px] sm:h-[500px] lg:h-[620px] pointer-events-none select-none z-10 flex items-center justify-center"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Outer 3D Camera Body Silhouette Frame */}
        <div
          style={{ transform: "translateZ(-40px)" }}
          className="absolute w-[80%] h-[68%] rounded-3xl border border-red-800/40 bg-neutral-950/60 backdrop-blur-md shadow-2xl flex items-center justify-center"
        >
          {/* Top Prism Viewfinder bump */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-7 rounded-t-xl bg-neutral-900 border-t border-x border-red-700/50 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          </div>

          {/* Grip detail lines */}
          <div className="absolute right-3 top-6 bottom-6 w-8 rounded-r-xl border-l border-neutral-800 bg-neutral-900/40" />

          {/* Shutter Speed Dial */}
          <div className="absolute top-2 right-14 w-8 h-4 rounded-full border border-neutral-700 bg-neutral-900 flex items-center justify-center">
            <span className="text-[7px] text-red-500 font-mono">1/250</span>
          </div>
        </div>

        {/* Ambient Pulsing Back-glow Core */}
        <div
          style={{ transform: "translateZ(-20px)" }}
          className="absolute w-[75%] h-[75%] rounded-full bg-gradient-to-tr from-red-600/30 via-red-950/20 to-transparent blur-3xl pointer-events-none"
        />

        {/* Concentric Cine Lens Barrel Rings */}
        {/* Ring 1: Outer Focus Ring */}
        <div
          style={{ transform: "translateZ(0px)" }}
          className="absolute w-[78%] h-[78%] rounded-full border-2 border-neutral-800/90 shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center justify-center"
        >
          {/* Millimeter Focal Markings */}
          <div className="absolute inset-2 rounded-full border border-dashed border-red-600/40 flex items-center justify-center">
            <span className="absolute top-1 text-[8px] sm:text-[9px] font-mono tracking-widest text-red-400 font-bold">
              85mm F/1.2 G-MASTER
            </span>
            <span className="absolute bottom-1 text-[8px] sm:text-[9px] font-mono tracking-widest text-neutral-500">
              CINE OPTICS &bull; E-MOUNT
            </span>
            <span className="absolute left-2 text-[7px] font-mono text-neutral-600">&infin;</span>
            <span className="absolute right-2 text-[7px] font-mono text-red-500">0.85m</span>
          </div>
        </div>

        {/* Ring 2: Metallic Serrated Grip Ring (with translateZ) */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="absolute w-[64%] h-[64%] rounded-full border border-neutral-700 bg-neutral-950/70 shadow-inner flex items-center justify-center"
        >
          <div className="w-full h-full rounded-full border border-red-900/40 opacity-70" />
        </div>

        {/* Ring 3: Rotating Aperture Iris & Blades (Interlocking mechanism) */}
        <motion.div
          style={{
            transform: "translateZ(50px)",
            rotate: irisRotation,
            scale: irisScale,
          }}
          className="absolute w-[50%] h-[50%] rounded-full flex items-center justify-center"
        >
          {/* 8 Interlocking Aperture Blades */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <div
              key={i}
              style={{
                transform: `rotate(${angle}deg) translate(28%, -15%)`,
              }}
              className="absolute w-20 h-10 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-l border-red-600/60 shadow-lg rounded-tl-full opacity-90"
            />
          ))}

          {/* Central Aperture Pupil with Glowing Red Core */}
          <div className="relative w-14 h-14 rounded-full bg-black border-2 border-red-500/80 shadow-[0_0_30px_rgba(239,68,68,0.9)] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]" />
          </div>
        </motion.div>

        {/* Ring 4: Front Glass Reflection Element */}
        <div
          style={{ transform: "translateZ(75px)" }}
          className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-tr from-red-600/20 via-transparent to-blue-500/10 border border-white/20 pointer-events-none backdrop-blur-[1px]"
        />
      </motion.div>
    </motion.div>
  );
}
