import Link from 'next/link';
import FeaturedProductsTabs from './FeaturedProductsTabs';
import { getOnSaleProducts, getFeaturedProducts, getNewArrivals } from '@/lib/wordpress';

export default async function FeaturedProducts() {
  const [hotDeals, bestsellers, newArrivals] = await Promise.all([
    getOnSaleProducts(4),
    getFeaturedProducts(4),
    getNewArrivals(4),
  ]);

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6">
      <div className="max-w-full mx-auto">

        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-3">
            Featured Products
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Discover our most popular items and exclusive deals
          </p>
        </div>

        <FeaturedProductsTabs
          hotDeals={hotDeals}
          bestsellers={bestsellers}
          newArrivals={newArrivals}
        />

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-all duration-200 shadow-md hover:shadow-lg group"
          >
            View All Products
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
