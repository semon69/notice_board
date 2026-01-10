// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["drive.google.com"],
    // disable the built-in domain check
  },
};

module.exports = nextConfig;
