/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Stillwater Psychology is a plain HTML concept site (no React), served
      // as-is from public/work/stillwater-psychology/.
      {
        source: "/work/stillwater-psychology",
        destination: "/work/stillwater-psychology/index.html",
      },
    ];
  },
};

export default nextConfig;
