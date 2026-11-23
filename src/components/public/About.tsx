"use client";

import React from "react";
import Image from "next/image";
import { Camera, Film, Award, Heart, CheckCircle2 } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function About() {
  return (
    <section id="about" className="py-24 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Profile / Camera Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative border with red glow */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-red-600/20 via-transparent to-red-600/10 blur-xl opacity-75" />

              <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <div className="relative h-[480px] sm:h-[540px] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1000&q=80"
                    alt="Bharath Kumar behind the lens"
                    fill
                    className="object-cover object-center filter grayscale-[20%] contrast-110"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Badge on Photo */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700/80">
                    <p className="text-xs uppercase tracking-widest text-red-400 font-semibold">
                      Lead Photographer & Founder
                    </p>
                    <h4 className="text-xl font-serif text-white mt-1">
                      Bharath Kumar
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      10+ Years immortalizing heartfelt weddings and celebrations across South India.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Camera Aperture Accent */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-neutral-900 border border-red-600/50 flex items-center justify-center shadow-xl red-glow-subtle hidden sm:flex">
                <Camera className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* About Biography & Artistic Vision */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3 w-fit">
              About Bharath Kumar Photography
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight">
              Crafting Visual Stories with{" "}
              <span className="font-serif italic text-red-500">Unfiltered Emotion</span>
            </h2>

            <p className="mt-6 text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
              We believe photography is not merely about pressing a shutter button—it is about
              feeling the unspoken connection, catching that tender tear in a parent’s eye, and
              freezing the contagious joy that erupts when two souls unite.
            </p>

            <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
              Founded by Bharath Kumar, our team blends cinematic high-frame-rate storytelling with
              unobtrusive photojournalism. We don’t force stiff poses; we create an environment where
              your genuine personality effortlessly shines.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
                <Award className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Full-Frame Cinema Grade</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    State-of-the-art Sony FX & Alpha bodies with prime G-Master optics.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
                <Film className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Bespoke Color Science</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Custom film-emulation color grading tailored to the warmth of your ceremonies.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
                <Heart className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Unobtrusive Candids</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    We melt into the background so your families enjoy every ritual uninterrupted.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Prompt Delivery</h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Teaser within 72 hours and handcrafted albums delivered right to your door.
                  </p>
                </div>
              </div>
            </div>

            {/* Quote / Philosophy */}
            <div className="mt-8 p-5 rounded-2xl bg-neutral-900/40 border-l-4 border-red-600 border-neutral-800">
              <p className="text-sm sm:text-base font-serif italic text-neutral-200">
                &ldquo;A photograph is the pause button of life. Years from now, when you look at these pictures, you won’t just remember how you looked—you’ll remember exactly how you felt.&rdquo;
              </p>
              <p className="text-xs text-red-400 font-semibold tracking-wider uppercase mt-2">
                — Bharath Kumar
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
