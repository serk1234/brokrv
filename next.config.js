/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow server-side functionality
  output: 'standalone',

  experimental: {
    esmExternals: 'loose',
  },

  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // required to make pdfjs work
    return config;
  },
};

module.exports = nextConfig;
