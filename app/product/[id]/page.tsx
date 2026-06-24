import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getProductCategories, getProducts, getAllProductIds } from '@/lib/wordpress';
import ProductDetailPage from '@/components/ProductDetailPage';

export const dynamicParams = true;

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id: String(id) }));
}

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export async function generateMetadata({ params: p }: PageProps): Promise<Metadata> {
  const params = await Promise.resolve(p);
  const product = await getProductById(parseInt(params.id));
  if (!product) return {};
  const desc = product.shortDescription.replace(/<[^>]*>/g, '').trim() || product.name;
  return {
    title: `${product.name} | Sparkport Pharmacy`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: product.image ? [{ url: product.image, alt: product.imageAlt }] : [],
    },
  };
}

export default async function ProductPage(props: PageProps) {
  const params = await Promise.resolve(props.params);
  const productId = parseInt(params.id);

  const [product, allCategories] = await Promise.all([
    getProductById(productId),
    getProductCategories(),
  ]);

  if (!product) notFound();

  const categoryObj = allCategories.find(c => c.name === product.category);
  const relatedProducts = categoryObj
    ? (await getProducts({ category: categoryObj.id, per_page: 5 }))
        .filter(p => p.id !== productId)
        .slice(0, 4)
    : [];

  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />;
}
