import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The repo root has its own package-lock.json (backend); pin the client as the workspace root.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // Produces a minimal, self-contained .next/standalone bundle (its own pruned
  // node_modules) so the Docker runtime image doesn't need a full npm install.
  output: 'standalone',
};

export default nextConfig;
