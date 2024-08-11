import withPWA from "next-pwa";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  transpilePackages: ["geist"],
};

// export default config;

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/astero\.vercel\.app\/guides$/,
      handler: "NetworkFirst",
      options: {
        cacheName: "guides-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
});

// @ts-expect-error nothing
export default pwaConfig(nextConfig);
