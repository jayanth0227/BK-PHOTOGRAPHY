"use client";

import React from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  event: string;
  quote: string;
  rating: number;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Vikram & Sneha",
    event: "Wedding & Reception (Taj Krishna)",
    quote:
      "Bharath and his team captured the soul of our wedding! Looking through the album made our entire family relive every tear and cheer. The cinematic video was pure Bollywood level!",
    rating: 5,
    date: "January 2026",
  },
  {
    id: "2",
    name: "Ananya Sharma",
    event: "Haldi & Sangeet Ceremony",
    quote:
      "The colors, the candid laughter, the splash shots during Haldi—everything looked straight out of a fairy tale. Bharath is polite, punctual, and so easy to work with!",
    rating: 5,
    date: "February 2026",
  },
  {
    id: "3",
    name: "Rajesh & Priya",
    event: "Son's 1st Birthday Milestone",
    quote:
      "Photographing a one-year-old is almost impossible, but BK Photography had so much patience. They captured our baby’s spontaneous giggles perfectly without any distress.",
    rating: 5,
    date: "December 2025",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-black relative border-t border-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Client Words
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Loved By <span className="font-serif italic text-red-500">Families & Couples</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-base font-light">
            Nothing brings us more joy than the smiles and heartwarming feedback of the people we photograph.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative p-8 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-red-950/20"
            >
              <Quote className="w-8 h-8 text-red-600/40 mb-4" />

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-white">{t.name}</h4>
                  <p className="text-xs text-red-400">{t.event}</p>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
