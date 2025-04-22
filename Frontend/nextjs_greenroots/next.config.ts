import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "www.willemsefrance.fr",
      "encrypted-tbn0.gstatic.com",
      "media.istockphoto.com",
      "www.pepiniere-vegetal85.fr",
      "www.leaderplant.com",
      "bauchery.fr",
      "www.jardiner-malin.fr",
    ],
  },
  webpackDevMiddleware: (config: {
    watchOptions: {
      poll: number;
      aggregateTimeout: number;
    };
  }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
