/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "via.placeholder.com" }
    ],
  },
};

export default nextConfig;
