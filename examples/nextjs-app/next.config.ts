import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile zenput so Next.js resolves its package exports correctly.
  transpilePackages: ['zenput'],
};

export default nextConfig;
