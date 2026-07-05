import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleContent from '@/components/ArticleContent';
import { getPostBySlug, getAllPostSlugs, getPosts, getOnSaleProducts } from '@/lib/wordpress';

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
  const [post, allPosts, saleProducts] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ per_page: 6 }),
    getOnSaleProducts(4),
  ]);

  if (!post) notFound();

  const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3);

  return <ArticleContent post={post} relatedPosts={relatedPosts} saleProducts={saleProducts} />;
}
