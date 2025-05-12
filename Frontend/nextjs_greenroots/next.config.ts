import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "www.willemsefrance.fr" },
      { hostname: "encrypted-tbn0.gstatic.com" },
      { hostname: "media.istockphoto.com" },
      { hostname: "www.pepiniere-vegetal85.fr" },
      { hostname: "www.leaderplant.com" },
      { hostname: "bauchery.fr" },
      { hostname: "www.jardiner-malin.fr" },
    ],
  },

  // Configuration pour Webpack si nécessaire via onDemandEntries
  onDemandEntries: {
    // période en ms où les pages sont conservées en mémoire
    maxInactiveAge: 25 * 1000,
    // nombre de pages conservées en mémoire
    pagesBufferLength: 2,
  },
};

export default nextConfig;
