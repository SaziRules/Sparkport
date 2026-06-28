// Raw WordPress REST API shapes
export interface WPPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    robots?: Record<string, string>;
    canonical?: string;
    og_title?: string;
    og_description?: string;
    og_image?: [{ url: string }];
  };
  _embedded?: {
    'wp:featuredmedia'?: [{ source_url: string; alt_text: string }];
    'wp:term'?: [WPCategory[], WPTag[]];
    author?: [{ name: string; avatar_urls: Record<string, string> }];
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  description: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

// Raw WooCommerce REST API shapes
export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  status: string;
  type: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  featured: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  attributes: { name: string; options: string[] }[];
  meta_data: { key: string; value: string }[];
  average_rating: string;
  rating_count:   number;
}

export interface WCProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image: { src: string; alt: string } | null;
}

// Normalized internal types (what components consume)
export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  categories: string[];
  tags: string[];
  originalPrice: number;
  salePrice: number;
  image: string;
  imageAlt: string;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  sku: string;
  brand: string;
  averageRating: number;
  ratingCount:   number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  image: string;
  imageAlt: string;
  categories: string[];
  tags: string[];
  author: { name: string; avatar: string };
  seo: { title: string; description: string; ogImage: string };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  image?: string;
}
