"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, CalendarCheck, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/919876543210?text=Hi%20Bharath%20Kumar%20Photography%2C%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot!";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "About Us", href: "#about" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* Click-outside backdrop when mobile dropdown is open */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
        <header
          className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-300 ${
            scrolled || mobileMenuOpen
              ? "bg-neutral-950/92 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/90 py-2 px-4 sm:px-6"
              : "bg-neutral-950/80 backdrop-blur-lg border border-white/10 shadow-xl py-2.5 px-4 sm:px-6"
          } flex items-center justify-between hover:border-red-900/50`}
        >
          {/* Brand Logo Image */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center pl-1 sm:pl-2 focus:outline-none transition-transform hover:scale-[1.03]"
          >
            <Image
              src="/navbar-logo.png"
              alt="Bharath Kumar Photography"
              width={446}
              height={173}
              priority
              className="h-8 sm:h-10 lg:h-11 w-auto object-contain"
            />
          </Link>

          {/* Center Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 transition-all tracking-wide whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Desktop CTA Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-green-400 px-3 py-2 rounded-full border border-neutral-800 hover:border-green-600/50 bg-neutral-900/60 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 px-4 py-2 rounded-full shadow-lg shadow-red-900/30 hover:shadow-red-800/50 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            >
              <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Book A Shoot</span>
            </a>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
              className="p-2 text-neutral-200 hover:text-white rounded-full bg-neutral-900/80 border border-white/10 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Simple Drop-Down Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-md mt-2 overflow-hidden rounded-2xl bg-neutral-950/95 backdrop-blur-2xl border border-white/10 shadow-2xl lg:hidden"
            >
              <div className="p-4 space-y-3">
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-neutral-200 hover:text-white hover:bg-white/[0.06] py-2.5 px-3.5 rounded-xl transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2.5">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-green-400 py-2.5 px-3 rounded-xl border border-white/10 bg-neutral-900/80 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 py-2.5 px-3 rounded-xl shadow-md shadow-red-950/50 transition-all whitespace-nowrap"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Book Shoot</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
