import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,

  // Turbopack config (required for Next.js 16)
  turbopack: {},

  // TypeScript & ESLint config
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default withPWA(nextConfig);
