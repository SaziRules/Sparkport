import ShopLayout from '@/components/ShopLayout';
import { getAllProducts, getProductCategories } from '@/lib/wordpress';

const hero = (
  <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-6 lg:p-12 mb-8 text-center text-white">
    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold! rounded-full mb-3 text-sm">
      Your Pathway To Sparkling Health
    </div>
    <h1 className="text-2xl lg:text-6xl font-extrabold! mb-3">
      Shop Our Full Range
    </h1>
    <p className="text-sm lg:text-xl text-white! opacity-90 max-w-3xl mx-auto mb-4 lg:mb-6">
      Browse trusted brands, everyday essentials, and products designed to keep you and your family feeling your best.
    </p>
    <a
      href="/shop/promotions"
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold! rounded-lg hover:bg-neutral-100 transition-all shadow-lg"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
      Shop Current Promotions
    </a>
  </div>
);

interface PageProps {
  searchParams?: Promise<{ category?: string; q?: string }> | { category?: string; q?: string };
}

export default async function ShopPage(props: PageProps) {
  const searchParams = await Promise.resolve(props.searchParams ?? {});
  const { category: categorySlug, q } = searchParams as { category?: string; q?: string };

  const categories = await getProductCategories();
  const categoryObj = categorySlug ? categories.find(c => c.slug === categorySlug) : undefined;

  const products = q
    ? await getAllProducts({ search: q })
    : await getAllProducts(categoryObj ? { category: categoryObj.id } : undefined);

  return (
    <ShopLayout
      products={products}
      categories={categories}
      hero={hero}
      linkSource="shop"
      initialCategory={categoryObj?.name}
      initialQuery={q}
    />
  );
}
