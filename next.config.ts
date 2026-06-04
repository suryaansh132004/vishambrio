import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/popular-routes.html',
        destination: '/popular-routes',
        permanent: true,
      },
      {
        source: '/packaged-tours.html',
        destination: '/packaged-tours',
        permanent: true,
      },
      {
        source: '/tourist-attractions.html',
        destination: '/tourist-attractions',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
