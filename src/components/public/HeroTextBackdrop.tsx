"use client";

import React from "react";
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useTransform,
} from "framer-motion";

interface HeroTextBackdropProps {
  scrollYProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const BOKEH_ORBS = [
  { size: 180, left: "8%", top: "20%", color: "rgba(220, 38, 38, 0.22)", blur: 40, depth: 18 },
  { size: 110, left: "26%", top: "68%", color: "rgba(239, 68, 68, 0.18)", blur: 28, depth: 28 },
  { size: 75, left: "42%", top: "24%", color: "rgba(255, 255, 255, 0.08)", blur: 18, depth: 36 },
  { size: 140, left: "14%", top: "78%", color: "rgba(185, 28, 28, 0.2)", blur: 34, depth: 22 },
  { size: 55, left: "36%", top: "52%", color: "rgba(248, 113, 113, 0.15)", blur: 14, depth: 42 },
  { size: 90, left: "5%", top: "48%", color: "rgba(255, 255, 255, 0.06)", blur: 22, depth: 30 },
];

export default function HeroTextBackdrop({
  scrollYProgress,
  mouseX,
  mouseY,
}: HeroTextBackdropProps) {
  // Interactive cursor spotlight radial gradient
  const spotlightBg = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, rgba(220, 38, 38, 0.18), rgba(220, 38, 38, 0.05) 45%, transparent 75%)`;

  // Subtle grid parallax tied to scroll
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.65, 0.35]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Interactive Cursor Spotlight */}
      <motion.div
        style={{ background: spotlightBg }}
        className="absolute inset-0 transition-opacity duration-300"
      />

      {/* 2. Subtle Camera Viewfinder Rule-of-Thirds Grid */}
      <motion.div
        style={{ y: gridY, opacity: gridOpacity }}
        className="absolute inset-0"
      >
        <div
          className="w-full h-[130%] opacity-25"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
            maskImage:
              "radial-gradient(ellipse 80% 75% at 45% 50%, black 35%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 75% at 45% 50%, black 35%, transparent 85%)",
          }}
        />
      </motion.div>

      {/* 3. Floating 35mm Bokeh Light Orbs with Scroll + Mouse Parallax */}
      {BOKEH_ORBS.map((orb, idx) => (
        <BokehOrb
          key={idx}
          orb={orb}
          index={idx}
          scrollYProgress={scrollYProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}

interface BokehOrbProps {
  orb: {
    size: number;
    left: string;
    top: string;
    color: string;
    blur: number;
    depth: number;
  };
  index: number;
  scrollYProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function BokehOrb({
  orb,
  index,
  scrollYProgress,
  mouseX,
  mouseY,
}: BokehOrbProps) {
  const x = useTransform(mouseX, [0, 1400], [-orb.depth, orb.depth]);
  const yMouse = useTransform(mouseY, [0, 900], [-orb.depth * 0.7, orb.depth * 0.7]);
  const yScroll = useTransform(
    scrollYProgress,
    [0, 1],
    [0, (index % 2 === 0 ? -1 : 1) * (40 + index * 14)]
  );

  return (
    <motion.div
      style={{
        width: orb.size,
        height: orb.size,
        left: orb.left,
        top: orb.top,
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 72%)`,
        filter: `blur(${orb.blur}px)`,
        x,
        y: yMouse,
        translateY: yScroll,
      }}
      animate={{
        scale: [1, 1.12, 1],
        opacity: [0.65, 1, 0.65],
      }}
      transition={{
        duration: 5 + index * 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-full pointer-events-none"
    />
  );
}
