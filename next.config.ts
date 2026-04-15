import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder/blog images (Unsplash)
      { protocol: 'https', hostname: 'images.unsplash.com' },

      // Current hardcoded product image sources
      // These will be replaced by WooCommerce CDN when API connects
      { protocol: 'https', hostname: 'cloudinary.images-iherb.com' },
      { protocol: 'https', hostname: 'www.dischem.co.za' },
      { protocol: 'https', hostname: 'clicks.co.za' },
      { protocol: 'https', hostname: 'www.maximed.co.za' },
      { protocol: 'https', hostname: 'www.vitatechhealth.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'mopani.co.za' },
      { protocol: 'https', hostname: 'vitagene.co.za' },
      { protocol: 'https', hostname: 'catalog.sixty60.co.za' },
      { protocol: 'https', hostname: 'www.mynavyexchange.com' },
      { protocol: 'https', hostname: 'www.feelhealthy.co.za' },
      { protocol: 'https', hostname: 'cdn-prd-02.pnp.co.za' },
      { protocol: 'https', hostname: 'shoprite-ecommerce-prod-cdn.azureedge.net' },
      { protocol: 'https', hostname: 'city-pharmacy-windhoek.myshopify.com' },

      // Sparkport WordPress CDN (banners, logos)
      { protocol: 'https', hostname: 'sparkport.co.za' },

      // Wikipedia (payment icons in footer)
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
};

export default nextConfig;
