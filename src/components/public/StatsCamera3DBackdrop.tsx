"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface StatsCamera3DBackdropProps {
  scrollYProgress: MotionValue<number>;
}

export default function StatsCamera3DBackdrop({
  scrollYProgress,
}: StatsCamera3DBackdropProps) {
  // 3D rotations & spatial glide rotating strictly OPPOSITE to the foreground camera illustration
  const x = useTransform(scrollYProgress, [0, 0.75], ["35%", "0%"]);
  const rotateY = useTransform(scrollYProgress, [0, 0.85], [34, 10]);
  const rotateX = useTransform(scrollYProgress, [0, 0.85], [-16, 10]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.85], [-55, 145]);
  const scale = useTransform(scrollYProgress, [0, 0.75], [0.72, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.85], [0, 0.9, 0.95]);

  // Synchronized clockwise inner optical rings & iris (all rotating opposite to the counter-clockwise camera)
  const middleRingRotate = useTransform(scrollYProgress, [0, 0.85], [0, 90]);
  const innerRotate = useTransform(scrollYProgress, [0, 0.85], [0, 140]);
  const ringPulseScale = useTransform(scrollYProgress, [0, 0.5, 0.85], [0.85, 1.08, 1]);

  return (
    <motion.div
      style={{
        x,
        opacity,
        scale,
        perspective: 1200,
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
    >
      {/* Volumetric Lens Light Cone projecting leftwards along the camera's aim */}
      <motion.div
        style={{ scale: ringPulseScale }}
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-[520px] h-[260px] -rotate-12 bg-gradient-to-l from-red-600/20 via-red-700/10 to-transparent blur-3xl rounded-full pointer-events-none"
      />

      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[240px] sm:w-[400px] lg:w-[540px] h-[240px] sm:h-[400px] lg:h-[540px] flex items-center justify-center"
      >
        {/* Layer 1 (-50px Z): 3D Camera Sensor Perspective Grid */}
        <div
          style={{ transform: "translateZ(-50px)" }}
          className="absolute w-[95%] h-[95%] rounded-full border border-red-900/30 bg-neutral-950/35 backdrop-blur-sm overflow-hidden"
        >
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(220,38,38,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(220,38,38,0.18) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        {/* Layer 2 (-10px Z): Outer Cinema Optics Telemetry Ring */}
        <div
          style={{ transform: "translateZ(-10px)" }}
          className="absolute w-[88%] h-[88%] rounded-full border-2 border-neutral-800/80 shadow-[0_0_50px_rgba(220,38,38,0.28)] flex items-center justify-center"
        >
          <div className="absolute inset-2.5 rounded-full border border-dashed border-red-600/45 flex items-center justify-center">
            <span className="absolute top-1.5 text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-red-400 font-bold">
              FX3 CINE &bull; f/1.4 GM
            </span>
            <span className="absolute bottom-1.5 text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-neutral-500">
              4K 120FPS &bull; S-LOG3
            </span>
            <span className="absolute left-2 text-[7px] font-mono text-neutral-500">AF-C</span>
            <span className="absolute right-2 text-[7px] font-mono text-red-500">REC</span>
          </div>
        </div>

        {/* Layer 3 (+25px Z): Metallic Focus Gear Ring (rotates clockwise with optical portal) */}
        <motion.div
          style={{
            transform: "translateZ(25px)",
            rotate: middleRingRotate,
          }}
          className="absolute w-[70%] h-[70%] rounded-full border border-white/15 bg-neutral-950/45 shadow-inner flex items-center justify-center"
        >
          <div className="w-[92%] h-[92%] rounded-full border border-dashed border-red-700/45" />
        </motion.div>

        {/* Layer 4 (+55px Z): Counter-Rotating 8-Blade Optical Shutter Iris */}
        <motion.div
          style={{
            transform: "translateZ(55px)",
            rotate: innerRotate,
          }}
          className="absolute w-[52%] h-[52%] rounded-full flex items-center justify-center"
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <div
              key={i}
              style={{
                transform: `rotate(${angle}deg) translate(28%, -15%)`,
              }}
              className="absolute w-[52%] h-[25%] bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-l border-red-600/60 shadow-lg rounded-tl-full opacity-90"
            />
          ))}

          {/* Glowing Crimson Optical Core */}
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black border-2 border-red-500/80 shadow-[0_0_32px_rgba(239,68,68,0.85)] flex items-center justify-center">
            <div className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-red-600 to-red-400 animate-pulse shadow-[0_0_16px_rgba(239,68,68,1)]" />
          </div>
        </motion.div>

        {/* Layer 5 (+85px Z): Front Glass Coating Reflection */}
        <div
          style={{ transform: "translateZ(85px)" }}
          className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-tr from-red-600/20 via-transparent to-white/10 border border-white/20 pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}
