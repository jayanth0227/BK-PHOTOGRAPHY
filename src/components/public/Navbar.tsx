"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, CalendarCheck, MessageCircle } from "lucide-react";
import CursiveSignature from "@/components/ui/CursiveSignature";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "About Us", href: "#about" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <header
        className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-neutral-950/90 backdrop-blur-xl border border-neutral-850 shadow-2xl shadow-black/90 py-2 px-4 sm:px-6"
            : "bg-neutral-950/75 backdrop-blur-lg border border-neutral-800/80 shadow-xl py-2.5 px-4 sm:px-6"
        } flex items-center justify-between hover:border-red-900/50`}
      >
        {/* Cursive Signature Brand Logo */}
        <div className="flex items-center pl-1 sm:pl-2">
          <CursiveSignature size="sm" />
        </div>

        {/* Center Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 transition-all tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center space-x-3">
          <a
            href="https://wa.me/919876543210?text=Hi%20Bharath%20Kumar%20Photography%2C%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-green-400 px-3 py-2 rounded-full border border-neutral-800 hover:border-green-600/50 bg-neutral-900/60 transition-all hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 text-green-500" />
            <span>WhatsApp</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 px-4 py-2 rounded-full shadow-lg shadow-red-900/30 hover:shadow-red-800/50 hover:scale-105 active:scale-95 transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Book A Shoot</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-full bg-neutral-900/60 border border-neutral-800 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Floating Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute top-full left-4 right-4 mt-2 max-w-md mx-auto bg-neutral-950/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-neutral-200 hover:text-red-400 py-2.5 px-3 rounded-xl hover:bg-neutral-900/70 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-neutral-850 flex flex-col gap-2.5">
            <a
              href="https://wa.me/919876543210?text=Hi%20Bharath%20Kumar%20Photography%2C%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-200 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80"
            >
              <MessageCircle className="w-4 h-4 text-green-500" />
              Chat on WhatsApp
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 py-3 rounded-xl shadow-lg shadow-red-900/40"
            >
              <CalendarCheck className="w-4 h-4" />
              Book A Shoot
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
