import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bkphotography.com"),
  title: "Bharath Kumar Photography | Wedding, Haldi & Milestone Cinematography",
  description:
    "Luxury wedding photography, vibrant haldi rituals, milestone birthdays, and couple pre-wedding shoots by Bharath Kumar Photography. Based in Hyderabad, available worldwide.",
  keywords: [
    "Bharath Kumar Photography",
    "BK Photography",
    "Wedding Photographer Hyderabad",
    "Haldi Photography",
    "Birthday Photography",
    "South Indian Wedding Cinematographer",
    "Pre wedding shoot Hyderabad",
  ],
  authors: [{ name: "Bharath Kumar" }],
  openGraph: {
    title: "Bharath Kumar Photography | Luxury Wedding & Celebration Cinematography",
    description: "Capturing Raw Emotions, Preserving Timeless Memories.",
    url: "https://bkphotography.com",
    siteName: "Bharath Kumar Photography",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "Bharath Kumar Photography",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen bg-[#080808] text-white flex flex-col antialiased selection:bg-red-600 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
