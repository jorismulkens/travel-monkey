/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/over",
        destination: "/over-ons",
        permanent: false,
      },
      {
        source: "/blog",
        destination: "/reizen",
        permanent: false,
      },
      {
        source: "/blog/:slug*",
        destination: "/reizen",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
