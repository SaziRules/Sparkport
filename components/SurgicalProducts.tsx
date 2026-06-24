import Link from 'next/link';
import { getProductCategories, getAllProducts } from '@/lib/wordpress';
import SurgicalProductsGrid from './SurgicalProductsGrid';

export default async function SurgicalProducts() {
  const categories = await getProductCategories();
  const surgicalCat = categories.find((c) => c.slug === 'surgical');
  if (!surgicalCat) return null;
  const products = await getAllProducts({ category: surgicalCat.id });

  if (!products.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6">
      <div className="max-w-full mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-1">
              Surgical Products
            </h2>
            <p className="text-neutral-500 text-sm">Quick, Safe &amp; Effective</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop?category=surgical"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#184363] text-white font-bold! rounded-xl text-sm hover:bg-[#009eb9] transition-colors duration-200"
            >
              Shop Surgical Range
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="https://sparkport.co.za/wp-content/uploads/Surgical-Catalogue-2024-Whatsapp.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#184363] text-[#184363] font-bold! rounded-xl text-sm hover:bg-[#184363] hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Catalogue
            </a>
          </div>
        </div>

        {/* Scrollable product row */}
        <SurgicalProductsGrid products={products} />

      </div>
    </section>
  );
}
