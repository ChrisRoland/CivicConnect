/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zcltszovazyfdvosogvy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true, // Disabled image optimization to prevent timeout errors
  },
};

export default nextConfig;
