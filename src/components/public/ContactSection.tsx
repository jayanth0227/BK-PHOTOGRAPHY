"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Marriage",
    eventDate: "",
    location: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "Marriage",
        eventDate: "",
        location: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please reach out via WhatsApp!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 py-14 sm:py-24 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-red-600/10 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between min-w-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold uppercase tracking-widest mb-3">
                Get In Touch
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                Let&apos;s Create Something{" "}
                <span className="font-serif italic text-red-500">Unforgettable</span>
              </h2>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base font-light leading-relaxed">
                We take a limited number of weddings and events each season to ensure every film and
                photograph receives our undivided attention and artistry.
              </p>

              {/* Direct Info List */}
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <Phone className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Direct Call & Inquiries
                    </h4>
                    <a
                      href="tel:+919876543210"
                      className="text-base font-medium text-white hover:text-red-400 transition-colors break-words"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <Mail className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Email Us
                    </h4>
                    <a
                      href="mailto:contact@bkphotography.com"
                      className="text-base font-medium text-white hover:text-red-400 transition-colors break-all sm:break-words"
                    >
                      contact@bkphotography.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Studio Location
                    </h4>
                    <p className="text-sm font-medium text-white">
                      Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Available for destination shoots worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      Studio Hours
                    </h4>
                    <p className="text-sm font-medium text-white">
                      Monday &ndash; Sunday: 10:00 AM &ndash; 8:00 PM (IST)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action Banner */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/30 border border-neutral-800">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Prefer Instant WhatsApp?
              </h4>
              <p className="text-xs text-neutral-300 mt-1">
                Chat directly with Bharath Kumar regarding availability and customized quotes.
              </p>
              <a
                href="https://wa.me/919876543210?text=Hi%20Bharath%20Kumar%20Photography%2C%20I%20would%20like%20to%20inquire%20about%20a%20photoshoot!"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                Open WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Booking Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 lg:p-10 rounded-3xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-md shadow-2xl relative">
              <h3 className="text-2xl font-serif text-white font-medium">
                Reserve Your Date
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 mb-8">
                Fill out the details below and we will get back to you within 24 hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-red-950/30 border border-red-800/60 text-center animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h4 className="text-xl font-medium text-white">Thank You!</h4>
                  <p className="text-sm text-neutral-300 mt-2">
                    Your inquiry has been received. Bharath Kumar will review your event details and reach out shortly.
                  </p>
                  <button
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs text-red-400 underline hover:text-red-300"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        suppressHydrationWarning
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        suppressHydrationWarning
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        suppressHydrationWarning
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Celebration Type *
                      </label>
                      <select
                        value={formData.eventType}
                        suppressHydrationWarning
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition"
                      >
                        <option value="Marriage">Marriage / Wedding</option>
                        <option value="Haldi">Haldi & Sangeet</option>
                        <option value="Birthday">Birthday Celebration</option>
                        <option value="Pre-Wedding">Pre-Wedding / Couple Shoot</option>
                        <option value="Portraits">Portraits & Lifestyle</option>
                        <option value="Other">Other Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Tentative Event Date
                      </label>
                      <input
                        type="date"
                        suppressHydrationWarning
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-red-600 transition [color-scheme:dark]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                        Event Venue / City
                      </label>
                      <input
                        type="text"
                        suppressHydrationWarning
                        placeholder="e.g. Hyderabad / Destination"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-600 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                      Tell Us About Your Vision & Requirements
                    </label>
                    <textarea
                      rows={4}
                      suppressHydrationWarning
                      placeholder="Share any special moments, ceremony timeline, or specific photography ideas..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-red-600 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    suppressHydrationWarning
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-semibold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 hover:shadow-red-800/60 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Inquiry...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Booking Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
