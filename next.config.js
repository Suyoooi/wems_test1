/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const apiUrl = process.env.API_URL;
console.log(apiUrl)

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  output: "standalone",
  i18n,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/v2/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
