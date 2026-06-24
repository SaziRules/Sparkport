import Link from 'next/link';
import Image from 'next/image';
import { getProductCategories, getAllProducts, isPromotionalCategory } from '@/lib/wordpress';

const GRADIENTS = [
  'from-[#184363] to-[#009eb9]',
  'from-teal-600 to-cyan-500',
  'from-violet-600 to-purple-500',
  'from-rose-500 to-pink-500',
  'from-orange-500 to-amber-400',
  'from-emerald-600 to-teal-500',
  'from-blue-600 to-indigo-500',
  'from-fuchsia-600 to-pink-500',
];

export default async function CategoriesPage() {
  const [categories, allProducts] = await Promise.all([
    getProductCategories(),
    getAllProducts(),
  ]);

  // Count products per category using actual published product data.
  // A product can belong to multiple categories so we count each occurrence.
  const countByName = new Map<string, number>();
  for (const product of allProducts) {
    for (const catName of product.categories) {
      countByName.set(catName, (countByName.get(catName) ?? 0) + 1);
    }
  }

  const filtered = categories
    .filter(c => c.slug !== 'uncategorized' && !isPromotionalCategory(c.slug))
    .map(c => ({ ...c, count: countByName.get(c.name) ?? 0 }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="relative min-h-screen">

      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/heart-health.jpg')" }}
      />
      <div className="fixed inset-0 -z-10 bg-white/80" />

      <main className="relative py-12 lg:py-16 px-4 lg:px-6">

        {/* Hero */}
        <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 lg:p-12 mb-12 text-center text-white">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold! rounded-full mb-4 text-sm">
            {filtered.length} Categories
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold! mb-4">Shop by Category</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Browse our full range of healthcare products organised by category. From vitamins to baby care, we&apos;ve got you covered.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((category, idx) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image / Gradient */}
              <div className={`relative h-48 overflow-hidden ${!category.image ? `bg-linear-to-br ${GRADIENTS[idx % GRADIENTS.length]}` : 'bg-neutral-100'}`}>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                )}

                {/* Accurate count badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold! text-[#184363] shadow-sm">
                  {category.count} {category.count === 1 ? 'product' : 'products'}
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-base font-bold! text-[#184363] group-hover:text-[#009eb9] transition-colors leading-tight pr-2">
                  {category.name}
                </h2>
                <div className="w-8 h-8 rounded-full bg-[#e8f5f7] flex items-center justify-center shrink-0 group-hover:bg-[#009eb9] transition-colors duration-300">
                  <svg className="w-4 h-4 text-[#009eb9] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
