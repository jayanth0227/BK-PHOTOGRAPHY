"use client";

import React, { useMemo } from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface SonyFX3IllustrationProps {
  scrollYProgress: MotionValue<number>;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Vec2 {
  x: number;
  y: number;
  zDepth: number;
}

// 3/4 Studio Product Projection (shows top deck, sculpted grip, right cooling vents & full lens barrel)
const YAW = (-36 * Math.PI) / 180;
const PITCH = (21 * Math.PI) / 180;
const ROLL = (-10 * Math.PI) / 180;
const SCALE = 192;
const CX = 412;
const CY = 302;

function project(p: Vec3): Vec2 {
  const cosY = Math.cos(YAW);
  const sinY = Math.sin(YAW);
  const x1 = p.x * cosY + p.z * sinY;
  const y1 = p.y;
  const z1 = -p.x * sinY + p.z * cosY;

  const cosP = Math.cos(PITCH);
  const sinP = Math.sin(PITCH);
  const x2 = x1;
  const y2 = y1 * cosP + z1 * sinP;
  const z2 = -y1 * sinP + z1 * cosP;

  const cosR = Math.cos(ROLL);
  const sinR = Math.sin(ROLL);
  const x3 = x2 * cosR - y2 * sinR;
  const y3 = x2 * sinR + y2 * cosR;

  // Mild studio perspective foreshortening without distorting lens circularity
  const persp = 1 / (1 - z2 * 0.055);

  return {
    x: CX + x3 * SCALE * persp,
    y: CY + y3 * SCALE * persp,
    zDepth: z2,
  };
}

function ptsToPath(pts: Vec2[], close = true): string {
  if (pts.length === 0) return "";
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

// Compute exact SVG 2D affine matrix for placing flat text/badges/ports flush on any 3D plane
function planeMatrix(origin: Vec3, uDir: Vec3, vDir: Vec3): string {
  const eps = 0.04;
  const p0 = project(origin);
  const pu = project({
    x: origin.x + uDir.x * eps,
    y: origin.y + uDir.y * eps,
    z: origin.z + uDir.z * eps,
  });
  const pv = project({
    x: origin.x + vDir.x * eps,
    y: origin.y + vDir.y * eps,
    z: origin.z + vDir.z * eps,
  });

  const factor = 1 / (eps * SCALE);
  const a = (pu.x - p0.x) * factor;
  const b = (pu.y - p0.y) * factor;
  const c = (pv.x - p0.x) * factor;
  const d = (pv.y - p0.y) * factor;

  return `matrix(${a.toFixed(4)} ${b.toFixed(4)} ${c.toFixed(4)} ${d.toFixed(4)} ${p0.x.toFixed(2)} ${p0.y.toFixed(2)})`;
}

// Build a projected 3D circle perpendicular to Z
function buildCirclePts(cx: number, cy: number, r: number, z: number, steps = 96): Vec2[] {
  const pts: Vec2[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    pts.push(project({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), z }));
  }
  return pts;
}

function buildDiscPath(cx: number, cy: number, r: number, z: number, steps = 96): string {
  return ptsToPath(buildCirclePts(cx, cy, r, z, steps));
}

function buildRingPath(cx: number, cy: number, rOuter: number, rInner: number, z: number, steps = 96): string {
  const outer = buildCirclePts(cx, cy, rOuter, z, steps);
  const inner = buildCirclePts(cx, cy, rInner, z, steps).reverse();
  return `${ptsToPath(outer)} ${ptsToPath(inner)}`;
}

interface BarrelSection {
  id: string;
  silhouettePath: string;
  rearArcPath: string;
  frontRimPath: string;
  frontCapPath: string;
  gradStart: Vec2;
  gradEnd: Vec2;
  ribLines: string[];
  ticks: string[];
}

// Build a mathematically smooth 3D cylindrical/conical lens barrel section with exact tangent silhouette
function buildSmoothBarrelSection(opts: {
  id: string;
  cx: number;
  cy: number;
  r0: number;
  r1: number;
  z0: number;
  z1: number;
  steps?: number;
  ribCount?: number;
  tickCount?: number;
}): BarrelSection {
  const { id, cx, cy, r0, r1, z0, z1, steps = 96, ribCount = 0, tickCount = 0 } = opts;

  const c0 = buildCirclePts(cx, cy, r0, z0, steps);
  const c1 = buildCirclePts(cx, cy, r1, z1, steps);

  // Determine front-facing vs back-facing side using centered tangent cross product
  const cross: number[] = [];
  for (let i = 0; i < steps; i++) {
    const prev = c0[(i - 1 + steps) % steps];
    const next = c0[(i + 1) % steps];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const dx = c1[i].x - c0[i].x;
    const dy = c1[i].y - c0[i].y;
    cross.push(tx * dy - ty * dx);
  }

  let startIdx = -1;
  let endIdx = -1;
  for (let i = 0; i < steps; i++) {
    const prev = (i - 1 + steps) % steps;
    if (cross[prev] < 0 && cross[i] >= 0) startIdx = i;
    if (cross[prev] >= 0 && cross[i] < 0) endIdx = prev;
  }

  const silhouettePts: Vec2[] = [];
  const rearArcPts: Vec2[] = [];
  const frontVisibleArcPts: Vec2[] = [];

  if (startIdx !== -1 && endIdx !== -1) {
    // Interpolate exact tangent point at startIdx transition
    const pPrev = (startIdx - 1 + steps) % steps;
    const tStart = Math.abs(cross[pPrev]) / (Math.abs(cross[pPrev]) + Math.abs(cross[startIdx]) + 1e-9);
    const lerpPt = (a: Vec2, b: Vec2, t: number): Vec2 => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      zDepth: a.zDepth + (b.zDepth - a.zDepth) * t,
    });

    const c0Start = lerpPt(c0[pPrev], c0[startIdx], tStart);
    const c1Start = lerpPt(c1[pPrev], c1[startIdx], tStart);

    const eNext = (endIdx + 1) % steps;
    const tEnd = Math.abs(cross[endIdx]) / (Math.abs(cross[endIdx]) + Math.abs(cross[eNext]) + 1e-9);
    const c0End = lerpPt(c0[endIdx], c0[eNext], tEnd);
    const c1End = lerpPt(c1[endIdx], c1[eNext], tEnd);

    // Walk rear visible arc on C0 (cross >= 0)
    silhouettePts.push(c0Start);
    rearArcPts.push(c0Start);
    let idx = startIdx;
    for (let guard = 0; guard < steps; guard++) {
      silhouettePts.push(c0[idx]);
      rearArcPts.push(c0[idx]);
      if (idx === endIdx) break;
      idx = (idx + 1) % steps;
    }
    silhouettePts.push(c0End);
    rearArcPts.push(c0End);

    // Walk front outer silhouette arc on C1 (cross < 0)
    silhouettePts.push(c1End);
    idx = eNext;
    for (let guard = 0; guard < steps; guard++) {
      if (idx === startIdx) break;
      silhouettePts.push(c1[idx]);
      idx = (idx + 1) % steps;
    }
    silhouettePts.push(c1Start);

    // Front-facing rim arc on C1 (separating side barrel from front cap)
    frontVisibleArcPts.push(c1Start);
    idx = startIdx;
    for (let guard = 0; guard < steps; guard++) {
      frontVisibleArcPts.push(c1[idx]);
      if (idx === endIdx) break;
      idx = (idx + 1) % steps;
    }
    frontVisibleArcPts.push(c1End);
  } else {
    silhouettePts.push(...c1);
  }

  // Compute perpendicular gradient vector across barrel diameter (key light top-left -> shadow bottom-right)
  const o0 = project({ x: cx, y: cy, z: z0 });
  const o1 = project({ x: cx, y: cy, z: z1 });
  const axisDx = o1.x - o0.x;
  const axisDy = o1.y - o0.y;
  const axisLen = Math.hypot(axisDx, axisDy) || 1;
  // (-axisDy, axisDx) points top-left when axis points down-left
  const perpX = -axisDy / axisLen;
  const perpY = axisDx / axisLen;
  const midX = (o0.x + o1.x) * 0.5;
  const midY = (o0.y + o1.y) * 0.5;
  const rMidPx = ((r0 + r1) * 0.5) * SCALE;

  const gradStart: Vec2 = { x: midX + perpX * rMidPx, y: midY + perpY * rMidPx, zDepth: 0 };
  const gradEnd: Vec2 = { x: midX - perpX * rMidPx, y: midY - perpY * rMidPx, zDepth: 0 };

  // Clipped surface grip ribs on front-facing half
  const ribLines: string[] = [];
  if (ribCount > 0) {
    for (let i = 0; i < ribCount; i++) {
      const a = (i / ribCount) * Math.PI * 2;
      const p0 = project({ x: cx + r0 * Math.cos(a), y: cy + r0 * Math.sin(a), z: z0 });
      const p1 = project({ x: cx + r1 * Math.cos(a), y: cy + r1 * Math.sin(a), z: z1 });
      const pPrev = project({
        x: cx + r0 * Math.cos(a - 0.05),
        y: cy + r0 * Math.sin(a - 0.05),
        z: z0,
      });
      const pNext = project({
        x: cx + r0 * Math.cos(a + 0.05),
        y: cy + r0 * Math.sin(a + 0.05),
        z: z0,
      });
      const c = (pNext.x - pPrev.x) * (p1.y - p0.y) - (pNext.y - pPrev.y) * (p1.x - p0.x);
      if (c > 0) {
        ribLines.push(ptsToPath([p0, p1], false));
      }
    }
  }

  // Aperture / focus indicator tick marks along upper-right visible arc
  const ticks: string[] = [];
  if (tickCount > 0) {
    const zMid = z0 + (z1 - z0) * 0.25;
    const zTick = z0 + (z1 - z0) * 0.65;
    for (let i = 0; i < tickCount; i++) {
      const a = -Math.PI * 0.72 + (i / (tickCount - 1)) * Math.PI * 0.58;
      const pA = project({ x: cx + r0 * Math.cos(a), y: cy + r0 * Math.sin(a), z: zMid });
      const pB = project({ x: cx + r1 * Math.cos(a), y: cy + r1 * Math.sin(a), z: zTick });
      ticks.push(ptsToPath([pA, pB], false));
    }
  }

  return {
    id,
    silhouettePath: ptsToPath(silhouettePts),
    rearArcPath: ptsToPath(rearArcPts, false),
    frontRimPath: ptsToPath(frontVisibleArcPts, false),
    frontCapPath: ptsToPath(c1),
    gradStart,
    gradEnd,
    ribLines,
    ticks,
  };
}

// Build a smooth vertical cylinder (dials, buttons) with seamless silhouette
function buildVerticalControlCylinder(opts: {
  cx: number;
  cz: number;
  r: number;
  yTop: number;
  yBot: number;
  steps?: number;
  knurled?: boolean;
}) {
  const { cx, cz, r, yTop, yBot, steps = 48, knurled = false } = opts;
  const topPts: Vec2[] = [];
  const botPts: Vec2[] = [];
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    topPts.push(project({ x: cx + r * Math.cos(a), y: yTop, z: cz + r * Math.sin(a) }));
    botPts.push(project({ x: cx + r * Math.cos(a), y: yBot, z: cz + r * Math.sin(a) }));
  }

  // Find leftmost & rightmost points in projected X for clean silhouette
  let minIdx = 0;
  let maxIdx = 0;
  for (let i = 1; i < steps; i++) {
    if (topPts[i].x < topPts[minIdx].x) minIdx = i;
    if (topPts[i].x > topPts[maxIdx].x) maxIdx = i;
  }

  // Front-facing arc on bottom (largest Y screen coordinates between minIdx and maxIdx)
  const arcA: Vec2[] = [];
  const arcB: Vec2[] = [];
  let idx = minIdx;
  while (true) {
    arcA.push(botPts[idx]);
    if (idx === maxIdx) break;
    idx = (idx + 1) % steps;
  }
  idx = minIdx;
  while (true) {
    arcB.push(botPts[idx]);
    if (idx === maxIdx) break;
    idx = (idx - 1 + steps) % steps;
  }
  const avgYA = arcA.reduce((s, p) => s + p.y, 0) / arcA.length;
  const avgYB = arcB.reduce((s, p) => s + p.y, 0) / arcB.length;
  const frontBotArc = avgYA >= avgYB ? arcA : arcB;

  const sidePath = ptsToPath([
    topPts[minIdx],
    ...frontBotArc,
    topPts[maxIdx],
  ]);

  const knurlLines: string[] = [];
  if (knurled) {
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2;
      const pT = project({ x: cx + r * Math.cos(a), y: yTop, z: cz + r * Math.sin(a) });
      const pB = project({ x: cx + r * Math.cos(a), y: yBot, z: cz + r * Math.sin(a) });
      if (pT.zDepth > project({ x: cx, y: yTop, z: cz }).zDepth - 0.02) {
        knurlLines.push(ptsToPath([pT, pB], false));
      }
    }
  }

  const centerTop = project({ x: cx, y: yTop, z: cz });
  const rPx = r * SCALE;

  return {
    sidePath,
    topPath: ptsToPath(topPts),
    knurlLines,
    gradStart: { x: centerTop.x - rPx, y: centerTop.y },
    gradEnd: { x: centerTop.x + rPx, y: centerTop.y },
  };
}

export default function SonyFX3Illustration({
  scrollYProgress,
}: SonyFX3IllustrationProps) {
  // Smooth 3D tilt & float driven by scroll (counter-clockwise family, opposing background)
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 8]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -5]);
  const floatY = useTransform(scrollYProgress, [0, 0.5, 1], [14, -4, 8]);
  const sheenOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.55, 0.95, 0.72, 0.9]);
  const tallyGlow = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.55, 1, 0.75, 1]);

  const geo = useMemo(() => {
    // ── 1. SONY FX3 CHASSIS (Real-world ratio: 129.7mm W x 77.8mm H x 84.5mm D -> 1.66 x 1.00 x 1.06) ──
    const bx0 = -0.84;
    const bx1 = 0.82;
    const by0 = -0.50;
    const by1 = 0.50;
    const bz0 = -1.04;
    const bz1 = 0.0;
    const b = 0.065; // Precision chamfer bevel

    const cx0 = bx0 + b;
    const cx1 = bx1 - b;
    const cy0 = by0 + b;
    const cy1 = by1 - b;
    const cz0 = bz0 + b;
    const cz1 = bz1 - b;

    const topFace = ptsToPath([
      project({ x: cx0, y: by0, z: cz0 }),
      project({ x: cx1, y: by0, z: cz0 }),
      project({ x: cx1, y: by0, z: cz1 }),
      project({ x: cx0, y: by0, z: cz1 }),
    ]);

    const topFrontChamfer = ptsToPath([
      project({ x: cx0, y: by0, z: cz1 }),
      project({ x: cx1, y: by0, z: cz1 }),
      project({ x: cx1, y: cy0, z: bz1 }),
      project({ x: cx0, y: cy0, z: bz1 }),
    ]);

    const topRightChamfer = ptsToPath([
      project({ x: cx1, y: by0, z: cz0 }),
      project({ x: bx1, y: cy0, z: cz0 }),
      project({ x: bx1, y: cy0, z: cz1 }),
      project({ x: cx1, y: by0, z: cz1 }),
    ]);

    const topFrontRightCorner = ptsToPath([
      project({ x: cx1, y: by0, z: cz1 }),
      project({ x: bx1, y: cy0, z: cz1 }),
      project({ x: cx1, y: cy0, z: bz1 }),
    ]);

    const topLeftChamfer = ptsToPath([
      project({ x: bx0, y: cy0, z: cz1 }),
      project({ x: bx0, y: cy0, z: cz0 }),
      project({ x: cx0, y: by0, z: cz0 }),
      project({ x: cx0, y: by0, z: cz1 }),
    ]);

    const topLeftFrontCorner = ptsToPath([
      project({ x: cx0, y: by0, z: cz1 }),
      project({ x: cx0, y: cy0, z: bz1 }),
      project({ x: bx0, y: cy0, z: bz1 }),
      project({ x: bx0, y: cy0, z: cz1 }),
    ]);

    const frontRightChamfer = ptsToPath([
      project({ x: cx1, y: cy0, z: bz1 }),
      project({ x: bx1, y: cy0, z: cz1 }),
      project({ x: bx1, y: cy1, z: cz1 }),
      project({ x: cx1, y: cy1, z: bz1 }),
    ]);

    const rightSideFace = ptsToPath([
      project({ x: bx1, y: cy0, z: cz1 }),
      project({ x: bx1, y: cy0, z: cz0 }),
      project({ x: bx1, y: cy1, z: cz0 }),
      project({ x: bx1, y: cy1, z: cz1 }),
    ]);

    const frontFace = ptsToPath([
      project({ x: bx0, y: cy0, z: bz1 }),
      project({ x: cx1, y: cy0, z: bz1 }),
      project({ x: cx1, y: cy1, z: bz1 }),
      project({ x: cx1, y: by1, z: bz1 }),
      project({ x: cx0, y: by1, z: bz1 }),
      project({ x: bx0, y: cy1, z: bz1 }),
    ]);

    const bottomRightChamfer = ptsToPath([
      project({ x: cx1, y: cy1, z: bz1 }),
      project({ x: bx1, y: cy1, z: cz1 }),
      project({ x: cx1, y: by1, z: cz1 }),
      project({ x: cx1, y: by1, z: bz1 }),
    ]);

    // Subtle chassis seam line dividing magnesium top shell and matte front plate
    const chassisSeam = ptsToPath(
      [
        project({ x: bx1 + 0.002, y: -0.26, z: cz0 + 0.04 }),
        project({ x: bx1 + 0.002, y: -0.26, z: cz1 }),
        project({ x: cx1, y: -0.26, z: bz1 + 0.002 }),
      ],
      false
    );

    // ── 2. RIGHT SIDE COOLING LOUVERS, PORT DOOR & D-RING STRAP LUG ──
    const ventInset = ptsToPath([
      project({ x: bx1 + 0.002, y: -0.18, z: -0.22 }),
      project({ x: bx1 + 0.002, y: -0.18, z: -0.66 }),
      project({ x: bx1 + 0.002, y: 0.34, z: -0.66 }),
      project({ x: bx1 + 0.002, y: 0.34, z: -0.22 }),
    ]);

    const vents: string[] = [];
    for (let i = 0; i < 7; i++) {
      const vy = -0.12 + i * 0.068;
      vents.push(
        ptsToPath(
          [
            project({ x: bx1 + 0.004, y: vy, z: -0.26 }),
            project({ x: bx1 + 0.004, y: vy, z: -0.62 }),
          ],
          false
        )
      );
    }

    const strapLugMatrix = planeMatrix(
      { x: bx1 + 0.01, y: -0.34, z: -0.18 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 }
    );

    // ── 3. SCULPTED ERGONOMIC HAND GRIP (Smooth continuous extruded contour) ──
    // Rounded-D profile in XZ plane merging seamlessly from chassis front into ergonomic curve
    const gripProfileXZ: Array<{ x: number; z: number }> = [];
    const gripSteps = 32;
    for (let i = 0; i <= gripSteps; i++) {
      const t = i / gripSteps;
      const a = Math.PI * (1 - t); // pi -> 0 along front bulge
      const gx = -0.66 + 0.22 * Math.cos(a);
      const gz = 0.02 + 0.25 * Math.sin(a) * (1 + 0.14 * Math.sin(a));
      gripProfileXZ.push({ x: gx, z: gz });
    }
    // Wrap back behind left edge to body seam
    gripProfileXZ.push({ x: -0.44, z: -0.06 });
    gripProfileXZ.push({ x: -0.84, z: -0.18 });
    gripProfileXZ.push({ x: -0.89, z: -0.04 });

    const gripTopPts = gripProfileXZ.slice(0, gripSteps + 1).map((p) => {
      // Slanted ergonomic shutter deck: slopes slightly down toward the front
      const ySlant = -0.44 + Math.max(0, p.z) * 0.12;
      return project({ x: p.x, y: ySlant, z: p.z });
    });
    const gripBotPts = gripProfileXZ.slice(0, gripSteps + 1).map((p) =>
      project({ x: p.x, y: 0.48, z: p.z })
    );

    // Build smooth non-self-intersecting outer silhouette for the grip front bulge
    let gripMinIdx = 0;
    let gripMaxIdx = 0;
    for (let i = 1; i < gripBotPts.length; i++) {
      if (gripBotPts[i].x < gripBotPts[gripMinIdx].x) gripMinIdx = i;
      if (gripBotPts[i].x > gripBotPts[gripMaxIdx].x) gripMaxIdx = i;
    }
    const gripBodyPts = [
      ...gripTopPts.slice(gripMinIdx, gripMaxIdx + 1),
      ...gripBotPts.slice(gripMinIdx, gripMaxIdx + 1).reverse(),
    ];
    const gripBodyPath = ptsToPath(gripBodyPts);
    const gripTopPath = ptsToPath([
      ...gripTopPts,
      project({ x: -0.44, y: -0.44, z: 0.0 }),
      project({ x: -0.84, y: -0.44, z: -0.04 }),
    ]);

    // Front finger control wheel embedded on front of grip
    const frontDialMatrix = planeMatrix(
      { x: -0.64, y: -0.23, z: 0.265 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }
    );

    // ── 4. TOP CONTROLS: SHUTTER, REC, MODE DIALS, 1/4"-20 THREADS, HOTSHOE ──
    const shutterCollar = buildVerticalControlCylinder({
      cx: -0.66,
      cz: 0.12,
      r: 0.105,
      yTop: -0.445,
      yBot: -0.41,
    });
    const shutterBtn = buildVerticalControlCylinder({
      cx: -0.66,
      cz: 0.12,
      r: 0.068,
      yTop: -0.475,
      yBot: -0.445,
    });
    const recBtn = buildVerticalControlCylinder({
      cx: -0.45,
      cz: -0.10,
      r: 0.064,
      yTop: -0.54,
      yBot: -0.50,
    });
    const modeDial = buildVerticalControlCylinder({
      cx: -0.42,
      cz: -0.44,
      r: 0.145,
      yTop: -0.575,
      yBot: -0.50,
      knurled: true,
    });
    const rearDial = buildVerticalControlCylinder({
      cx: -0.66,
      cz: -0.68,
      r: 0.11,
      yTop: -0.555,
      yBot: -0.50,
      knurled: true,
    });

    // Multi-Interface Hotshoe centered on top deck (above lens axis lx = +0.08)
    const shoeBase = ptsToPath([
      project({ x: -0.09, y: -0.542, z: -0.68 }),
      project({ x: 0.25, y: -0.542, z: -0.68 }),
      project({ x: 0.25, y: -0.542, z: -0.28 }),
      project({ x: -0.09, y: -0.542, z: -0.28 }),
    ]);
    const shoeFront = ptsToPath([
      project({ x: -0.09, y: -0.542, z: -0.28 }),
      project({ x: 0.25, y: -0.542, z: -0.28 }),
      project({ x: 0.25, y: -0.50, z: -0.28 }),
      project({ x: -0.09, y: -0.50, z: -0.28 }),
    ]);
    const shoeRight = ptsToPath([
      project({ x: 0.25, y: -0.542, z: -0.68 }),
      project({ x: 0.25, y: -0.50, z: -0.68 }),
      project({ x: 0.25, y: -0.50, z: -0.28 }),
      project({ x: 0.25, y: -0.542, z: -0.28 }),
    ]);
    const shoeInner = ptsToPath([
      project({ x: -0.03, y: -0.543, z: -0.63 }),
      project({ x: 0.19, y: -0.543, z: -0.63 }),
      project({ x: 0.19, y: -0.543, z: -0.33 }),
      project({ x: -0.03, y: -0.543, z: -0.33 }),
    ]);

    // 3 iconic FX3 1/4"-20 top accessory mounting holes
    const mountThreads = [
      planeMatrix({ x: 0.08, y: -0.502, z: -0.84 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      planeMatrix({ x: 0.48, y: -0.502, z: -0.30 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
      planeMatrix({ x: 0.48, y: -0.502, z: -0.74 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }),
    ];

    // Exact perspective-projected matrices for SONY, FX3, and Lens Release
    const sonyTopMatrix = planeMatrix(
      { x: 0.08, y: -0.502, z: -0.15 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 }
    );
    const fx3FrontMatrix = planeMatrix(
      { x: 0.56, y: -0.31, z: 0.004 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }
    );
    const tallyPos = project({ x: 0.56, y: -0.405, z: 0.004 });
    const lensReleaseMatrix = planeMatrix(
      { x: -0.35, y: 0.14, z: 0.004 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 }
    );

    // ── 5. SONY FE 50mm f/1.4 GM LENS SYSTEM (True Circular Geometry along +Z) ──
    const lx = 0.08;
    const ly = 0.04;

    // 5a. Stainless Steel E-Mount Base Flange
    const mountSection = buildSmoothBarrelSection({
      id: "mount",
      cx: lx,
      cy: ly,
      r0: 0.372,
      r1: 0.372,
      z0: 0.0,
      z1: 0.045,
    });

    // 5b. Sony Alpha Metallic Crimson-Orange Mount Ring
    const redMountSection = buildSmoothBarrelSection({
      id: "redMount",
      cx: lx,
      cy: ly,
      r0: 0.378,
      r1: 0.378,
      z0: 0.045,
      z1: 0.085,
    });

    // 5c. Tapered Rear Barrel (signature GM flare from mount to wide aperture barrel)
    const rearTaperSection = buildSmoothBarrelSection({
      id: "rearTaper",
      cx: lx,
      cy: ly,
      r0: 0.368,
      r1: 0.432,
      z0: 0.085,
      z1: 0.34,
    });

    // 5d. Knurled Aperture Ring
    const apertureSection = buildSmoothBarrelSection({
      id: "aperture",
      cx: lx,
      cy: ly,
      r0: 0.442,
      r1: 0.442,
      z0: 0.34,
      z1: 0.47,
      ribCount: 84,
      tickCount: 9,
    });

    // 5e. Satin Mid Collar (houses G-Master red square badge & FE 50/1.4 GM marking)
    const midCollarSection = buildSmoothBarrelSection({
      id: "midCollar",
      cx: lx,
      cy: ly,
      r0: 0.438,
      r1: 0.444,
      z0: 0.47,
      z1: 0.65,
    });

    // 5f. Wide Rubberized Fine-Ribbed Focus Ring
    const focusSection = buildSmoothBarrelSection({
      id: "focus",
      cx: lx,
      cy: ly,
      r0: 0.458,
      r1: 0.458,
      z0: 0.65,
      z1: 1.00,
      ribCount: 96,
    });

    // 5g. Thin Crimson G-Master Pinstripe Ring
    const frontRedSection = buildSmoothBarrelSection({
      id: "frontRed",
      cx: lx,
      cy: ly,
      r0: 0.456,
      r1: 0.456,
      z0: 1.00,
      z1: 1.028,
    });

    // 5h. Front Bayonet Step Collar
    const frontCollarSection = buildSmoothBarrelSection({
      id: "frontCollar",
      cx: lx,
      cy: ly,
      r0: 0.454,
      r1: 0.464,
      z0: 1.028,
      z1: 1.13,
    });

    // 5i. Precision Cylindrical Lens Hood (ALC-SH173 style — pure circular symmetry!)
    const zHood0 = 1.13;
    const zHood1 = 1.48;
    const rHoodOuter0 = 0.472;
    const rHoodOuter1 = 0.494;
    const rHoodInner = 0.466;

    const hoodOuterSection = buildSmoothBarrelSection({
      id: "hoodOuter",
      cx: lx,
      cy: ly,
      r0: rHoodOuter0,
      r1: rHoodOuter1,
      z0: zHood0,
      z1: zHood1,
    });

    // Exact front opening ellipse used to clip ALL interior hood details & deep glass optics
    const hoodInnerOpenPath = buildDiscPath(lx, ly, rHoodInner, zHood1);
    const hoodRimPath = buildRingPath(lx, ly, rHoodOuter1, rHoodInner, zHood1);
    const hoodRearRimPath = buildRingPath(lx, ly, rHoodOuter0, 0.464, zHood0);

    // Concentric anti-reflective matte baffle annuli inside hood (ordered BACK-TO-FRONT for exact occlusion)
    const hoodBaffleRings = [0.14, 0.32, 0.50, 0.68, 0.85].map((t) => {
      const z = zHood0 + (zHood1 - zHood0) * t;
      const rInner = 0.436 + (rHoodInner - 0.436) * t;
      return buildRingPath(lx, ly, 0.72, rInner, z);
    });

    // Deep recessed front optics inside the hood base (z = 1.13 back to 1.04)
    const filterThreadRing = buildRingPath(lx, ly, 0.68, 0.382, 1.135);
    const frontRetainerRing = buildRingPath(lx, ly, 0.68, 0.352, 1.125);
    const glassDisc = buildDiscPath(lx, ly, 0.352, 1.11);
    const glassCenter = project({ x: lx, y: ly, z: 1.11 });

    // 9-blade circular mechanical cinema iris diaphragm recessed at z = 1.04
    const irisHousing = buildDiscPath(lx, ly, 0.255, 1.055);
    const irisBlades: string[] = [];
    const numBlades = 9;
    const rIrisOuter = 0.255;
    const rIrisInner = 0.125;
    for (let i = 0; i < numBlades; i++) {
      const a0 = (i / numBlades) * Math.PI * 2;
      const a1 = ((i + 1.28) / numBlades) * Math.PI * 2;
      const aMid = (a0 + a1) * 0.5;
      irisBlades.push(
        ptsToPath([
          project({ x: lx + rIrisOuter * Math.cos(a0), y: ly + rIrisOuter * Math.sin(a0), z: 1.05 }),
          project({ x: lx + rIrisOuter * Math.cos(a1), y: ly + rIrisOuter * Math.sin(a1), z: 1.05 }),
          project({
            x: lx + rIrisInner * Math.cos(a1 - 0.22),
            y: ly + rIrisInner * Math.sin(a1 - 0.22),
            z: 1.045,
          }),
          project({
            x: lx + (rIrisInner + 0.012) * Math.cos(aMid - 0.15),
            y: ly + (rIrisInner + 0.012) * Math.sin(aMid - 0.15),
            z: 1.045,
          }),
        ])
      );
    }
    const irisPupil = buildDiscPath(lx, ly, rIrisInner - 0.004, 1.04);

    // Multi-coated optical specular reflection arcs inside the front glass
    const glassReflectMain = (() => {
      const pts: Vec2[] = [];
      for (let i = 0; i <= 14; i++) {
        const a = -Math.PI * 0.92 + (i / 14) * Math.PI * 0.52;
        pts.push(project({ x: lx + 0.295 * Math.cos(a), y: ly + 0.295 * Math.sin(a), z: 1.114 }));
      }
      for (let i = 14; i >= 0; i--) {
        const a = -Math.PI * 0.92 + (i / 14) * Math.PI * 0.52;
        pts.push(project({ x: lx + 0.205 * Math.cos(a), y: ly + 0.205 * Math.sin(a), z: 1.114 }));
      }
      return ptsToPath(pts);
    })();

    const glassReflectSecondary = (() => {
      const pts: Vec2[] = [];
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI * 0.08 + (i / 10) * Math.PI * 0.36;
        pts.push(project({ x: lx + 0.285 * Math.cos(a), y: ly + 0.285 * Math.sin(a), z: 1.114 }));
      }
      for (let i = 10; i >= 0; i--) {
        const a = Math.PI * 0.08 + (i / 10) * Math.PI * 0.36;
        pts.push(project({ x: lx + 0.235 * Math.cos(a), y: ly + 0.235 * Math.sin(a), z: 1.114 }));
      }
      return ptsToPath(pts);
    })();

    // Exact tangent-plane transforms for G-Master badge, FE 50/1.4 GM engraving & AF/MF switch block
    // Placed along the visible upper-right tangent of the mid-collar (~ -60 deg from +X)
    const barrelTextAngle = (-56 * Math.PI) / 180;
    const rText = 0.446;
    const txOrigin: Vec3 = {
      x: lx + rText * Math.cos(barrelTextAngle),
      y: ly + rText * Math.sin(barrelTextAngle),
      z: 0.56,
    };
    // Tangent along circumference (clockwise around +Z) & axis along +Z (bottom of letters faces front)
    const txCircumDir: Vec3 = {
      x: -Math.sin(barrelTextAngle),
      y: Math.cos(barrelTextAngle),
      z: 0,
    };
    const gmAngle = barrelTextAngle - 0.32;
    const gmBadgeMatrix = planeMatrix(
      {
        x: lx + rText * Math.cos(gmAngle),
        y: ly + rText * Math.sin(gmAngle),
        z: 0.56,
      },
      {
        x: -Math.sin(gmAngle),
        y: Math.cos(gmAngle),
        z: 0,
      },
      { x: 0, y: 0, z: 1 }
    );
    const lensSpecMatrix = planeMatrix(
      txOrigin,
      txCircumDir,
      { x: 0, y: 0, z: 1 }
    );

    // AF/MF Switch & Focus Hold block on visible right-side barrel (angle ~ +18 deg)
    const swAngle = (18 * Math.PI) / 180;
    const swR = 0.405;
    const afSwitchMatrix = planeMatrix(
      {
        x: lx + swR * Math.cos(swAngle),
        y: ly + swR * Math.sin(swAngle),
        z: 0.22,
      },
      { x: 0, y: 0, z: 1 },
      { x: -Math.sin(swAngle), y: Math.cos(swAngle), z: 0 }
    );

    // Hood bayonet lock tab on upper-left rear of hood
    const hoodLockMatrix = planeMatrix(
      {
        x: lx + 0.478 * Math.cos(-Math.PI * 0.42),
        y: ly + 0.478 * Math.sin(-Math.PI * 0.42),
        z: 1.18,
      },
      { x: 0, y: 0, z: 1 },
      { x: -Math.sin(-Math.PI * 0.42), y: Math.cos(-Math.PI * 0.42), z: 0 }
    );

    return {
      topFace,
      topFrontChamfer,
      topRightChamfer,
      topFrontRightCorner,
      topLeftChamfer,
      topLeftFrontCorner,
      frontRightChamfer,
      rightSideFace,
      frontFace,
      bottomRightChamfer,
      chassisSeam,
      ventInset,
      vents,
      strapLugMatrix,
      gripBodyPath,
      gripTopPath,
      frontDialMatrix,
      shutterCollar,
      shutterBtn,
      recBtn,
      modeDial,
      rearDial,
      shoeBase,
      shoeFront,
      shoeRight,
      shoeInner,
      mountThreads,
      sonyTopMatrix,
      fx3FrontMatrix,
      tallyPos,
      lensReleaseMatrix,
      mountSection,
      redMountSection,
      rearTaperSection,
      apertureSection,
      midCollarSection,
      focusSection,
      frontRedSection,
      frontCollarSection,
      hoodOuterSection,
      hoodInnerOpenPath,
      hoodRimPath,
      hoodRearRimPath,
      hoodBaffleRings,
      filterThreadRing,
      frontRetainerRing,
      glassDisc,
      glassCenter,
      irisHousing,
      irisBlades,
      irisPupil,
      glassReflectMain,
      glassReflectSecondary,
      gmBadgeMatrix,
      lensSpecMatrix,
      afSwitchMatrix,
      hoodLockMatrix,
    };
  }, []);

  const barrelSections = [
    { sec: geo.mountSection, fill: "url(#fx3GradSilver)" },
    { sec: geo.redMountSection, fill: "url(#fx3GradRed)" },
    { sec: geo.rearTaperSection, fill: "url(#fx3GradBarrel)" },
    { sec: geo.apertureSection, fill: "url(#fx3GradRingDark)" },
    { sec: geo.midCollarSection, fill: "url(#fx3GradBarrel)" },
    { sec: geo.focusSection, fill: "url(#fx3GradRingDark)" },
    { sec: geo.frontRedSection, fill: "url(#fx3GradRed)" },
    { sec: geo.frontCollarSection, fill: "url(#fx3GradBarrel)" },
  ];

  return (
    <motion.div
      style={{
        rotateY,
        rotateX,
        y: floatY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className="relative w-[270px] sm:w-[440px] lg:w-[620px] xl:w-[680px] h-[228px] sm:h-[372px] lg:h-[525px] xl:h-[575px] select-none pointer-events-none"
    >
      {/* Ambient Studio Shadow & Crimson Rim Backlight */}
      <div
        style={{ transform: "translateZ(-30px)" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[74%] h-[62%] rounded-full bg-black/85 blur-3xl translate-y-10 -translate-x-4" />
        <motion.div
          style={{ opacity: tallyGlow }}
          className="absolute top-[16%] right-[14%] w-[46%] h-[46%] rounded-full bg-red-600/20 blur-[75px]"
        />
      </div>

      {/* Unified Precision 3D-Projected Sony FX3 + FE 50mm f/1.4 GM SVG */}
      <svg
        viewBox="0 0 760 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_28px_52px_rgba(0,0,0,0.92)]"
      >
        <defs>
          {/* Chassis Magnesium & Matte Front Gradients */}
          <linearGradient id="fx3FrontGrad" x1="250" y1="180" x2="590" y2="410" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#262930" />
            <stop offset="45%" stopColor="#16181D" />
            <stop offset="100%" stopColor="#0C0D10" />
          </linearGradient>

          <linearGradient id="fx3TopGrad" x1="280" y1="110" x2="600" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#454954" />
            <stop offset="45%" stopColor="#2D3038" />
            <stop offset="100%" stopColor="#1C1E24" />
          </linearGradient>

          <linearGradient id="fx3SideGrad" x1="510" y1="160" x2="640" y2="390" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#23252C" />
            <stop offset="65%" stopColor="#14161A" />
            <stop offset="100%" stopColor="#090A0D" />
          </linearGradient>

          <linearGradient id="fx3GripGrad" x1="240" y1="220" x2="365" y2="410" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2F333B" />
            <stop offset="32%" stopColor="#1A1C22" />
            <stop offset="85%" stopColor="#0F1014" />
            <stop offset="100%" stopColor="#1E2027" />
          </linearGradient>

          {/* Studio Cylindrical Barrel Gradients (Key light top-left, satin falloff, subtle red rim bounce) */}
          <linearGradient
            id="fx3GradBarrel"
            x1={geo.midCollarSection.gradStart.x}
            y1={geo.midCollarSection.gradStart.y}
            x2={geo.midCollarSection.gradEnd.x}
            y2={geo.midCollarSection.gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#3B3F49" />
            <stop offset="14%" stopColor="#585E6B" />
            <stop offset="32%" stopColor="#272A31" />
            <stop offset="65%" stopColor="#121418" />
            <stop offset="88%" stopColor="#0A0B0E" />
            <stop offset="100%" stopColor="#2A171B" />
          </linearGradient>

          <linearGradient
            id="fx3GradRingDark"
            x1={geo.focusSection.gradStart.x}
            y1={geo.focusSection.gradStart.y}
            x2={geo.focusSection.gradEnd.x}
            y2={geo.focusSection.gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#2E3139" />
            <stop offset="15%" stopColor="#444954" />
            <stop offset="34%" stopColor="#1C1E23" />
            <stop offset="70%" stopColor="#0C0D10" />
            <stop offset="90%" stopColor="#07080A" />
            <stop offset="100%" stopColor="#211215" />
          </linearGradient>

          <linearGradient
            id="fx3GradHood"
            x1={geo.hoodOuterSection.gradStart.x}
            y1={geo.hoodOuterSection.gradStart.y}
            x2={geo.hoodOuterSection.gradEnd.x}
            y2={geo.hoodOuterSection.gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#32353E" />
            <stop offset="15%" stopColor="#4D525F" />
            <stop offset="35%" stopColor="#22242B" />
            <stop offset="68%" stopColor="#101216" />
            <stop offset="90%" stopColor="#08090C" />
            <stop offset="100%" stopColor="#2B1418" />
          </linearGradient>

          <linearGradient
            id="fx3GradSilver"
            x1={geo.mountSection.gradStart.x}
            y1={geo.mountSection.gradStart.y}
            x2={geo.mountSection.gradEnd.x}
            y2={geo.mountSection.gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="18%" stopColor="#F3F4F6" />
            <stop offset="40%" stopColor="#9CA3AF" />
            <stop offset="72%" stopColor="#4B5563" />
            <stop offset="92%" stopColor="#374151" />
            <stop offset="100%" stopColor="#6B7280" />
          </linearGradient>

          <linearGradient
            id="fx3GradRed"
            x1={geo.redMountSection.gradStart.x}
            y1={geo.redMountSection.gradStart.y}
            x2={geo.redMountSection.gradEnd.x}
            y2={geo.redMountSection.gradEnd.y}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="18%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#DC2626" />
            <stop offset="75%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          <linearGradient id="fx3HoodRimGrad" x1="180" y1="300" x2="380" y2="500" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4B505C" />
            <stop offset="50%" stopColor="#25272E" />
            <stop offset="100%" stopColor="#14151A" />
          </linearGradient>

          {/* Multi-Coated Front Lens Glass Gradient */}
          <radialGradient
            id="fx3GlassGrad"
            cx={geo.glassCenter.x - 12}
            cy={geo.glassCenter.y - 12}
            r="75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#282368" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#431234" stopOpacity="0.88" />
            <stop offset="68%" stopColor="#0C172B" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#030407" />
          </radialGradient>

          <radialGradient id="fx3IrisGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#14060A" />
            <stop offset="70%" stopColor="#050508" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>

          {/* Pebble Grip Texture */}
          <pattern id="fx3GripTex" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.65" fill="#FFFFFF" fillOpacity="0.045" />
            <circle cx="4" cy="4" r="0.65" fill="#000000" fillOpacity="0.45" />
          </pattern>

          {/* Smooth Silhouette ClipPaths for Knurled Focus & Aperture Rings */}
          <clipPath id="clipAperture">
            <path d={geo.apertureSection.silhouettePath} />
          </clipPath>
          <clipPath id="clipFocus">
            <path d={geo.focusSection.silhouettePath} />
          </clipPath>
          {/* Exact Inner Hood Opening ClipPath (mathematically guarantees clean optics occlusion) */}
          <clipPath id="clipHoodInterior">
            <path d={geo.hoodInnerOpenPath} />
          </clipPath>
        </defs>

        {/* ── 1. SONY FX3 MAGNESIUM CHASSIS ── */}
        <path d={geo.rightSideFace} fill="url(#fx3SideGrad)" stroke="#2A2D35" strokeWidth="0.9" />
        <path d={geo.bottomRightChamfer} fill="#121317" stroke="#2A2D35" strokeWidth="0.7" />
        <path d={geo.frontRightChamfer} fill="#1E2026" stroke="#343842" strokeWidth="0.8" />
        <path d={geo.topLeftChamfer} fill="#2F333B" stroke="#454954" strokeWidth="0.8" />
        <path d={geo.topLeftFrontCorner} fill="#2A2D35" stroke="#454954" strokeWidth="0.7" />
        <path d={geo.topRightChamfer} fill="#2A2D35" stroke="#484D59" strokeWidth="0.8" />
        <path d={geo.topFrontRightCorner} fill="#363943" stroke="#525763" strokeWidth="0.7" />
        <path d={geo.topFace} fill="url(#fx3TopGrad)" stroke="#525763" strokeWidth="1" />
        <path d={geo.topFrontChamfer} fill="#2A2D36" stroke="#4B505C" strokeWidth="0.8" />
        <path d={geo.frontFace} fill="url(#fx3FrontGrad)" stroke="#33363F" strokeWidth="1.1" />
        <path d={geo.chassisSeam} stroke="#0B0C0F" strokeWidth="1.2" strokeOpacity="0.85" />

        {/* Right Side Cooling Exhaust Louver */}
        <path d={geo.ventInset} fill="#0E0F12" stroke="#2B2E36" strokeWidth="0.9" />
        <g>
          {geo.vents.map((d, i) => (
            <path key={`vent-${i}`} d={d} stroke="#040507" strokeWidth="3.6" strokeLinecap="round" />
          ))}
        </g>

        {/* Metallic D-Ring Strap Lug */}
        <g transform={geo.strapLugMatrix}>
          <rect x="-5" y="-5" width="10" height="10" rx="2" fill="#374151" stroke="#6B7280" strokeWidth="0.8" />
          <path d="M 0 -7 L 9 5 L -9 5 Z" fill="none" stroke="#9CA3AF" strokeWidth="2.1" strokeLinejoin="round" />
        </g>

        {/* ── 2. ERGONOMIC SCULPTED HAND GRIP & CONTROLS ── */}
        <path d={geo.gripBodyPath} fill="url(#fx3GripGrad)" stroke="#2F333C" strokeWidth="0.9" />
        <path d={geo.gripBodyPath} fill="url(#fx3GripTex)" />
        <path d={geo.gripTopPath} fill="#272A32" stroke="#4B505C" strokeWidth="0.9" />

        {/* Embedded Front Finger Control Dial */}
        <g transform={geo.frontDialMatrix}>
          <rect x="-11" y="-5" width="22" height="10" rx="3" fill="#0B0C0F" stroke="#374151" strokeWidth="0.9" />
          {[-7, -4, -1, 2, 5, 8].map((dx) => (
            <line key={dx} x1={dx} y1="-4" x2={dx} y2="4" stroke="#6B7280" strokeWidth="1.1" />
          ))}
        </g>

        {/* Slanted Shutter Button & Collar */}
        <path d={geo.shutterCollar.sidePath} fill="#1E2026" stroke="#374151" strokeWidth="0.7" />
        <path d={geo.shutterCollar.topPath} fill="#2A2D35" stroke="#525763" strokeWidth="0.8" />
        <path d={geo.shutterBtn.sidePath} fill="#6B7280" />
        <path d={geo.shutterBtn.topPath} fill="#D1D5DB" stroke="#F9FAFB" strokeWidth="0.7" />

        {/* Rear Custom Dial */}
        <path d={geo.rearDial.sidePath} fill="#181A1F" stroke="#2D3038" strokeWidth="0.7" />
        {geo.rearDial.knurlLines.map((d, i) => (
          <path key={`rd-${i}`} d={d} stroke="#3B3E47" strokeWidth="0.7" />
        ))}
        <path d={geo.rearDial.topPath} fill="#262830" stroke="#525763" strokeWidth="0.9" />

        {/* Mode Dial */}
        <path d={geo.modeDial.sidePath} fill="#16181D" stroke="#2D3038" strokeWidth="0.7" />
        {geo.modeDial.knurlLines.map((d, i) => (
          <path key={`md-${i}`} d={d} stroke="#3D414B" strokeWidth="0.7" />
        ))}
        <path d={geo.modeDial.topPath} fill="#24272E" stroke="#5B616E" strokeWidth="1" />

        {/* Illuminated Red-Ringed REC Button */}
        <path d={geo.recBtn.sidePath} fill="#7F1D1D" />
        <path d={geo.recBtn.topPath} fill="#EF4444" stroke="#FCA5A5" strokeWidth="0.9" />

        {/* Multi-Interface (MI) Hotshoe */}
        <path d={geo.shoeRight} fill="#14151A" stroke="#374151" strokeWidth="0.8" />
        <path d={geo.shoeFront} fill="#1F2127" stroke="#4B5563" strokeWidth="0.8" />
        <path d={geo.shoeBase} fill="#2B2E36" stroke="#6B7280" strokeWidth="0.9" />
        <path d={geo.shoeInner} fill="#101115" stroke="#3F434D" strokeWidth="0.8" />

        {/* Iconic FX3 Top 1/4"-20 Accessory Mounting Threads */}
        {geo.mountThreads.map((mat, i) => (
          <g key={`thr-${i}`} transform={mat}>
            <circle cx="0" cy="0" r="6" fill="#6B7280" stroke="#9CA3AF" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.4" fill="#090A0D" />
          </g>
        ))}

        {/* ── 3. PERSPECTIVE-ALIGNED SONY, FX3, TALLY & LENS RELEASE ── */}
        <g transform={geo.sonyTopMatrix}>
          <text
            x="0"
            y="0"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#E5E7EB"
            fontSize="14.5"
            fontWeight="800"
            letterSpacing="3.8"
            fontFamily="sans-serif"
          >
            SONY
          </text>
        </g>

        <g transform={geo.fx3FrontMatrix}>
          <rect x="-24" y="-10" width="48" height="17" rx="2.5" fill="#0B0C0F" stroke="#3A3D47" strokeWidth="0.9" />
          <text x="-19" y="1.5" fill="#F9FAFB" fontSize="10" fontWeight="800" letterSpacing="1" fontFamily="sans-serif">
            FX3
          </text>
          <text x="7" y="1" fill="#EF4444" fontSize="6.8" fontWeight="800" fontFamily="monospace">
            4K
          </text>
        </g>

        <g transform={geo.lensReleaseMatrix}>
          <circle cx="0" cy="0" r="6" fill="#1F2128" stroke="#4B5563" strokeWidth="0.9" />
          <circle cx="0" cy="0" r="3" fill="#0E0F13" />
        </g>

        {/* Glowing Front Tally Light */}
        <motion.g style={{ opacity: tallyGlow }}>
          <circle cx={geo.tallyPos.x} cy={geo.tallyPos.y} r="3.4" fill="#EF4444" />
          <circle cx={geo.tallyPos.x} cy={geo.tallyPos.y} r="8.5" fill="#EF4444" fillOpacity="0.35" />
        </motion.g>

        {/* ── 4. SMOOTH 3D-PROJECTED LENS BARREL (BACK-TO-FRONT) ── */}
        {barrelSections.map(({ sec, fill }) => (
          <g key={sec.id}>
            <path d={sec.silhouettePath} fill={fill} />
            {sec.id === "aperture" && (
              <g clipPath="url(#clipAperture)">
                {sec.ribLines.map((d, i) => (
                  <path
                    key={`ap-rib-${i}`}
                    d={d}
                    stroke={i % 2 === 0 ? "#040507" : "#4B505B"}
                    strokeOpacity={i % 2 === 0 ? 0.65 : 0.25}
                    strokeWidth="1.2"
                  />
                ))}
                {sec.ticks.map((d, i) => (
                  <path key={`ap-tk-${i}`} d={d} stroke="#E5E7EB" strokeOpacity="0.55" strokeWidth="0.9" />
                ))}
              </g>
            )}
            {sec.id === "focus" && (
              <g clipPath="url(#clipFocus)">
                {sec.ribLines.map((d, i) => (
                  <path
                    key={`fo-rib-${i}`}
                    d={d}
                    stroke={i % 2 === 0 ? "#030406" : "#444954"}
                    strokeOpacity={i % 2 === 0 ? 0.72 : 0.22}
                    strokeWidth="1.3"
                  />
                ))}
              </g>
            )}
            {/* Subtle crisp rear & front ring catchlights */}
            <path
              d={sec.rearArcPath}
              stroke={sec.id === "redMount" || sec.id === "frontRed" ? "#FCA5A5" : "#6B7280"}
              strokeOpacity="0.32"
              strokeWidth="0.9"
              fill="none"
            />
            <path
              d={sec.frontRimPath}
              stroke={sec.id === "redMount" || sec.id === "frontRed" ? "#EF4444" : "#374151"}
              strokeOpacity="0.5"
              strokeWidth="0.8"
              fill="none"
            />
          </g>
        ))}

        {/* Perspective-Aligned Red G-Master Square Badge & Lens Spec on Mid-Collar */}
        <g transform={geo.gmBadgeMatrix}>
          <rect x="-8" y="-8" width="16" height="16" rx="2.5" fill="#DC2626" stroke="#FCA5A5" strokeWidth="0.7" />
          <text
            x="0"
            y="1"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFFFFF"
            fontSize="11.5"
            fontWeight="900"
            fontFamily="sans-serif"
          >
            G
          </text>
        </g>

        <g transform={geo.lensSpecMatrix}>
          <text
            x="0"
            y="0"
            dominantBaseline="central"
            fill="#E5E7EB"
            fillOpacity="0.92"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.8"
            fontFamily="monospace"
          >
            FE 50/1.4 GM
          </text>
        </g>

        {/* Perspective-Aligned AF/MF Switch & Focus Hold Module on Rear Barrel */}
        <g transform={geo.afSwitchMatrix}>
          <rect x="-15" y="-9" width="30" height="18" rx="3.5" fill="#17191F" stroke="#4B5563" strokeWidth="0.9" />
          <rect x="-10" y="-4.5" width="11" height="9" rx="1.5" fill="#090A0D" stroke="#6B7280" strokeWidth="0.7" />
          <rect x="-8.5" y="-3" width="4.5" height="6" rx="1" fill="#9CA3AF" />
          <circle cx="8" cy="0" r="4" fill="#272A30" stroke="#6B7280" strokeWidth="0.8" />
        </g>

        {/* ── 5. PRECISION CYLINDRICAL LENS HOOD & DEEP OPTICS ── */}
        {/* Outer Hood Shell */}
        <path d={geo.hoodOuterSection.silhouettePath} fill="url(#fx3GradHood)" />
        <path d={geo.hoodRearRimPath} fill="#181A20" stroke="#3F434D" strokeWidth="0.7" fillRule="evenodd" />

        {/* Hood Lock Release Button */}
        <g transform={geo.hoodLockMatrix}>
          <rect x="-5" y="-4" width="10" height="8" rx="2" fill="#272A30" stroke="#6B7280" strokeWidth="0.7" />
        </g>

        {/* Everything inside the Hood Opening (clipped cleanly to the true front ellipse, ordered BACK-TO-FRONT) */}
        <g clipPath="url(#clipHoodInterior)">
          {/* Base interior backdrop */}
          <path d={geo.hoodInnerOpenPath} fill="#050608" />

          {/* Deep Multi-Coated Convex Front Glass Element & 9-Blade Cinema Iris */}
          <path d={geo.glassDisc} fill="url(#fx3GlassGrad)" stroke="#374151" strokeWidth="0.9" />
          <path d={geo.irisHousing} fill="url(#fx3IrisGlow)" />
          {geo.irisBlades.map((d, i) => (
            <path
              key={`blade-${i}`}
              d={d}
              fill={i % 2 === 0 ? "#121419" : "#0D0E12"}
              stroke="#262932"
              strokeWidth="0.7"
            />
          ))}
          <path d={geo.irisPupil} fill="#010102" stroke="#DC2626" strokeOpacity="0.4" strokeWidth="0.9" />

          {/* Specular Multi-Coated Glass Reflections */}
          <motion.g style={{ opacity: sheenOpacity }}>
            <path d={geo.glassReflectMain} fill="#FFFFFF" fillOpacity="0.22" />
            <path d={geo.glassReflectSecondary} fill="#EF4444" fillOpacity="0.16" />
          </motion.g>

          {/* Front Retainer Ring & Recessed Filter Threads (occluding outer edge of glass) */}
          <path d={geo.frontRetainerRing} fill="#0B0C10" stroke="#22252C" strokeWidth="0.8" fillRule="evenodd" />
          <path d={geo.filterThreadRing} fill="#121318" stroke="#2A2D36" strokeWidth="0.8" fillRule="evenodd" />

          {/* Stepped Anti-Reflective Matte Baffle Annuli (back-to-front toward front rim) */}
          {geo.hoodBaffleRings.map((d, i) => (
            <path
              key={`baf-${i}`}
              d={d}
              fill={i % 2 === 0 ? "#08090C" : "#0D0E13"}
              stroke="#1E2028"
              strokeWidth="0.8"
              fillRule="evenodd"
            />
          ))}
        </g>

        {/* Crisp Beveled Front Circular Hood Rim */}
        <path
          d={geo.hoodRimPath}
          fill="url(#fx3HoodRimGrad)"
          stroke="#525763"
          strokeWidth="0.9"
          fillRule="evenodd"
        />
      </svg>
    </motion.div>
  );
}
