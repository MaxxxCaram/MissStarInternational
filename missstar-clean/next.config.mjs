/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
};

export default nextConfig;
