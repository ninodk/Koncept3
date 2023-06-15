/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_IPFS_PROJECT_ID: process.env.INFURA_IPFS_PROJECT_ID,
    INFURA_IPFS_PROJECT_SECRET: process.env.INFURA_IPFS_PROJECT_SECRET,
    INFURA_API_KEY: process.env.INFURA_API_KEY,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          fs: false,
          net: false,
          dns: false,
          tls: false,
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
