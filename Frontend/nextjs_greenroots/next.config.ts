import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour le développement avec Docker
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config, { dev }) => {
      if (dev) {
        // Configuration pour le hot reload dans Docker
        config.watchOptions = {
          poll: 1000, // Polling toutes les secondes
          aggregateTimeout: 300,
          ignored: /node_modules/,
        };
      }
      return config;
    },
  }),

  // Variables d'environnement pour le hot reload
  env: {
    WATCHPACK_POLLING: "true",
    CHOKIDAR_USEPOLLING: "true",
  },

  // Configuration pour Docker
  output: "standalone",
};

export default nextConfig;
