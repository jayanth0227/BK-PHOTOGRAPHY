import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

/** Collect local interface IPs so Next.js dev HMR/assets work over LAN IP access. */
function getAllowedDevOrigins(): string[] {
  const origins = new Set<string>(["127.0.0.1", "[::1]"]);

  for (const entries of Object.values(networkInterfaces())) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === "IPv4") {
        origins.add(entry.address);
      } else if (entry.family === "IPv6" && !entry.internal && !entry.address.startsWith("fe80:")) {
        origins.add(`[${entry.address}]`);
      }
    }
  }

  const extraOrigins = process.env.ALLOWED_DEV_ORIGINS;
  if (extraOrigins) {
    for (const origin of extraOrigins.split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
  serverExternalPackages: ["mongoose", "cloudinary", "bcryptjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
