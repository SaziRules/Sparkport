import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleContent from '@/components/ArticleContent';
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress';

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo.title,
    description: post.seo.description,
    openGraph: {
      images: post.seo.ogImage ? [post.seo.ogImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <ArticleContent post={post} />;
}
