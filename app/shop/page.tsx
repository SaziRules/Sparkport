import Image from 'next/image';
import Link from 'next/link';
import ShopLayout from '@/components/ShopLayout';
import { getAllProducts, getProductCategories } from '@/lib/wordpress';

function buildHero(categoryName?: string) {
  const title = categoryName ? `Shop ${categoryName}` : 'Shop Our Full Range';
  return (
    <section key="shop-hero" className="relative min-h-[260px] lg:min-h-[320px] flex items-center overflow-hidden">
      <Image
        src="/images/winter-specials.png"
        alt="Sparkport Pharmacy shop"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/70 via-45% to-transparent" />

      <div className="relative z-10 w-full max-w-385 mx-auto px-4 lg:px-6 py-10 lg:py-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
          Your Pathway To Sparkling Health
        </div>
        <h1 className="text-3xl lg:text-5xl font-extrabold! text-white leading-[1.05] mb-4">
          {title}
        </h1>
        <p className="text-white/70 text-sm lg:text-base max-w-2xl leading-relaxed mb-6">
          Browse trusted brands, everyday essentials, and products designed to keep you and your family feeling your best.
        </p>
        <Link
          href="/shop/promotions"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold rounded-xl hover:bg-neutral-100 transition-colors text-sm shadow-lg"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          Shop Current Promotions
        </Link>
      </div>
    </section>
  );
}

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
      hero={buildHero(categoryObj?.name)}
      linkSource="shop"
      initialCategory={categoryObj?.name}
      initialQuery={q}
    />
  );
}
