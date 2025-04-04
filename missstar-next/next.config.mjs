/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "github.com",
      "raw.githubusercontent.com",
      "missstarinternational.com",
    ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  i18n: {
    locales: ["en", "es", "pt", "th", "vi"],
    defaultLocale: "en",
  },
};

export default nextConfig;
