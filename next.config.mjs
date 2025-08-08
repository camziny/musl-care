/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "via.placeholder.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "firebasestorage.googleapis.com" },
      { hostname: "*.amazonaws.com" },
      { hostname: "*.githubusercontent.com" },
      { hostname: "uploadthing.com" },
      { hostname: "*.uploadthing.com" }
    ],
  },
  async redirects() {
    return [
      { source: "/care-giver", destination: "/caregivers/register", permanent: true },
      { source: "/care-giver-form", destination: "/caregivers/register", permanent: true },
    ];
  },
};

export default nextConfig;
