"use client";

import React from "react";
import Image from "next/image";
import { Heart, Sparkles, Cake, Camera, User, ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  image: string;
  features: string[];
  icon: React.ReactNode;
}

const servicesList: ServiceItem[] = [
  {
    id: "marriage",
    title: "Marriage & Wedding Cinematography",
    categoryTag: "Wedding Special",
    description:
      "Complete coverage of your sacred vows, muhurtham, candid moments, and grand reception with full-frame cinematic precision.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    features: [
      "Traditional & Candid Photography",
      "Cinematic Teaser & Full Wedding Film",
      "Drone Aerial Views & 4K Master Grading",
      "Luxury Handcrafted Photo Album",
    ],
    icon: <Heart className="w-5 h-5 text-red-500" />,
  },
  {
    id: "haldi",
    title: "Haldi & Sangeet Ceremonies",
    categoryTag: "Festive Vibes",
    description:
      "Capturing the vibrant bursts of yellow marigolds, joyous laughter, playful splashes, and high-energy dance performances.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    features: [
      "Fast-shutter candid splash shots",
      "Vibrant high-contrast festive color grading",
      "Family & relatives portraits",
      "Same-day reel & social media highlights",
    ],
    icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "birthday",
    title: "Birthday & Milestone Celebrations",
    categoryTag: "Milestones",
    description:
      "Cherishing your child's 1st birthday, sweet sixteen, or silver jubilee with heartwarming smiles and spontaneous joy.",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
    features: [
      "Cake smash & candid party moments",
      "Themed stage and decor documentation",
      "Instant group portraits with guests",
      "High-res digital album delivery within 48h",
    ],
    icon: <Cake className="w-5 h-5 text-pink-500" />,
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding & Couple Concept Shoots",
    categoryTag: "Romantic Concepts",
    description:
      "Romantic, story-driven visuals captured across breathtaking outdoor landscapes, heritage palaces, and scenic horizons.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    features: [
      "Artistic location curation & concept styling",
      "Cinematic slow-motion music video",
      "Sunset golden hour & twilight portraits",
      "Engagement party showcase teaser",
    ],
    icon: <Camera className="w-5 h-5 text-red-500" />,
  },
];

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Services We Offer
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Tailored Experiences For Every{" "}
            <span className="font-serif italic text-red-500">Celebration</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-base font-light">
            Each occasion is unique. We blend documentary candids with artistic fine-art framing
            to immortalize your greatest milestones.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicesList.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl overflow-hidden bg-neutral-900/60 border border-neutral-800 hover:border-red-600/50 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-red-950/30"
            >
              {/* Image banner */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                {/* Category badge */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-neutral-700/80 text-xs font-medium text-white">
                  {service.icon}
                  {service.categoryTag}
                </div>
              </div>

              {/* Content area */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-white group-hover:text-red-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <ul className="mt-5 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-xs sm:text-sm text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-red-500 mr-2.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 pt-5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                    Custom Packages Available
                  </span>
                  <a
                    href={`#contact?service=${service.id}`}
                    className="inline-flex items-center gap-2 text-xs uppercase font-semibold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-full transition-all group-hover:shadow-md group-hover:shadow-red-600/40"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
