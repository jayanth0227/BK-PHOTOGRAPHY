"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-neutral-300 border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 pb-10 sm:pb-12 border-b border-neutral-900">
          {/* Brand Info & Signature */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <BrandLogo size="lg" />
            <p className="mt-6 text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
              Artistic wedding, haldi, and celebration photography. Preserving pure emotion,
              spontaneous laughter, and timeless heritage with cinematic excellence.
            </p>

            {/* Social Icons (Custom SVG) */}
            <div className="flex items-center gap-3 mt-6">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-neutral-800 border border-neutral-800 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-neutral-800 border border-neutral-800 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-neutral-800 border border-neutral-800 transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="text-sm uppercase tracking-wider text-white font-semibold mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="#services" className="hover:text-red-400 transition-colors">
                  Services Offered
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-red-400 transition-colors">
                  Photography Portfolio
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-red-400 transition-colors">
                  About Bharath Kumar
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-red-400 transition-colors">
                  Client Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-red-400 transition-colors">
                  Book A Date
                </a>
              </li>
            </ul>
          </div>

          {/* Studio Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="text-sm uppercase tracking-wider text-white font-semibold mb-5">
              Studio Details
            </h4>
            <ul className="space-y-3.5 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <span>Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <a href="mailto:contact@bkphotography.com" className="hover:text-white transition">
                  contact@bkphotography.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-900">
              <span className="text-xs text-red-400 font-medium">Opening Hours:</span>
              <p className="text-xs text-neutral-400 mt-0.5">
                Mon &ndash; Sun: 10:00 AM &ndash; 8:00 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-xs text-neutral-500 gap-4">
          <p>
            &copy; {currentYear} Bharath Kumar Photography. All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span>Designed with precision in Red, White &amp; Black</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-red-400 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Studio Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
