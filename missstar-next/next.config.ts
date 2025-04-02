/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["github.com", "raw.githubusercontent.com"],
  },
};

module.exports = nextConfig;
