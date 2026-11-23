import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import StatsParallax from "@/components/public/StatsParallax";
import Services from "@/components/public/Services";
import Portfolio from "@/components/public/Portfolio";
import About from "@/components/public/About";
import Testimonials from "@/components/public/Testimonials";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-[#080808]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section with Scroll Parallax */}
      <Hero />

      {/* KPI Cards & Floating Camera Hand Parallax Section */}
      <StatsParallax />

      {/* Services Section (Marriage, Haldi, Birthday, etc.) */}
      <Services />

      {/* Portfolio Gallery with Filter Tabs & Fullscreen Lightbox */}
      <Portfolio />

      {/* About Bharath Kumar Section */}
      <About />

      {/* Verified Client Testimonials */}
      <Testimonials />

      {/* Booking Inquiry & Contact Form */}
      <ContactSection />

      {/* Luxury Footer with Contact Info & Socials */}
      <Footer />
    </main>
  );
}
