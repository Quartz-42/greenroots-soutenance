import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour le hot reload dans Docker
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  // Configuration pour le développement avec Docker
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config: any, { dev }: { dev: boolean }) => {
      if (dev) {
        config.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
        };
      }
      return config;
    },
  }),

  // Configuration pour Webpack si nécessaire via onDemandEntries
  onDemandEntries: {
    // période en ms où les pages sont conservées en mémoire
    maxInactiveAge: 25 * 1000,
    // nombre de pages conservées en mémoire
    pagesBufferLength: 2,
  },
};

export default nextConfig;
