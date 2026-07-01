import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder/blog images (Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },

      // Sparkport WordPress CDN — product images, banners, logos
      { protocol: 'https', hostname: 'sparkport.co.za' },

      // Wikipedia (payment icons in footer)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },

      // Supabase Storage — promotion images, uploads
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
