// FINAL VERSION - After testing, use this in: app/product/[id]/page.tsx

import ProductDetailPage from '@/components/ProductDetailPage';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProductPage(props: PageProps) {
  // Handle both sync and async params (Next.js 14/15 compatibility)
  const params = await Promise.resolve(props.params);
  const productId = parseInt(params.id);
  
  return <ProductDetailPage productId={productId} />;
}