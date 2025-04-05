/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  i18n: {
    locales: ['es'],
    defaultLocale: 'es',
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
};

export default nextConfig; 