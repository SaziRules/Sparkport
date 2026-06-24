import { WP_API, REVALIDATE_POSTS, REVALIDATE_CATEGORIES, stripHtml, decodeHtml } from './config';
import type { WPPost, WPCategory, BlogPost, Category } from './types';

function mapPost(post: WPPost): BlogPost {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const terms = post._embedded?.['wp:term'] ?? [];
  const author = post._embedded?.author?.[0];

  const title = decodeHtml(stripHtml(post.title.rendered));
  const excerpt = decodeHtml(stripHtml(post.excerpt.rendered));

  return {
    id: post.id,
    title,
    excerpt,
    content: post.content.rendered,
    slug: post.slug,
    date: post.date,
    image: media?.source_url ?? '',
    imageAlt: decodeHtml(media?.alt_text ?? ''),
    categories: (terms[0] ?? []).map((t) => decodeHtml(t.name)),
    tags: (terms[1] ?? []).map((t) => decodeHtml(t.name)),
    author: {
      name: decodeHtml(author?.name ?? ''),
      avatar: author?.avatar_urls?.['96'] ?? '',
    },
    seo: {
      title: decodeHtml(post.yoast_head_json?.title ?? title),
      description: decodeHtml(post.yoast_head_json?.description ?? excerpt),
      ogImage: post.yoast_head_json?.og_image?.[0]?.url ?? media?.source_url ?? '',
    },
  };
}

export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  category?: number;
  search?: string;
}): Promise<BlogPost[]> {
  const query = new URLSearchParams({
    _embed: '1',
    per_page: String(params?.per_page ?? 12),
    page: String(params?.page ?? 1),
    ...(params?.category ? { categories: String(params.category) } : {}),
    ...(params?.search ? { search: params.search } : {}),
  });

  const res = await fetch(`${WP_API}/wp/v2/posts?${query}`, {
    next: { revalidate: REVALIDATE_POSTS },
  });

  if (!res.ok) return [];
  const data: WPPost[] = await res.json();
  return data.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${WP_API}/wp/v2/posts?slug=${slug}&_embed`, {
    next: { revalidate: REVALIDATE_POSTS },
  });

  if (!res.ok) return null;
  const data: WPPost[] = await res.json();
  return data[0] ? mapPost(data[0]) : null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const res = await fetch(`${WP_API}/wp/v2/posts?per_page=100&_fields=slug`, {
    next: { revalidate: REVALIDATE_POSTS },
  });

  if (!res.ok) return [];
  const data: { slug: string }[] = await res.json();
  return data.map((p) => p.slug);
}

export async function getBlogCategories(): Promise<Category[]> {
  const res = await fetch(`${WP_API}/wp/v2/categories?per_page=100&hide_empty=true`, {
    next: { revalidate: REVALIDATE_CATEGORIES },
  });

  if (!res.ok) return [];
  const data: WPCategory[] = await res.json();
  return data
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, name: decodeHtml(c.name), slug: c.slug, count: c.count }));
}
