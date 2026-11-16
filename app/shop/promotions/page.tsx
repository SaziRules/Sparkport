import Image from 'next/image';
import ShopLayout from '@/components/ShopLayout';
import { getOnSaleProducts, getProductCategories } from '@/lib/wordpress';

const hero = (
  <section key="promotions-hero" className="relative min-h-[260px] lg:min-h-[320px] flex items-center overflow-hidden">
    <Image
      src="/images/winter-specials.png"
      alt="Sparkport Pharmacy current promotions"
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#184363]/95 via-[#184363]/70 via-45% to-transparent" />

    <div className="relative z-10 w-full max-w-385 mx-auto px-4 lg:px-6 py-10 lg:py-14">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-5 text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] animate-pulse" />
        Save Up To 40% Off
      </div>
      <h1 className="text-3xl lg:text-5xl font-extrabold! text-white leading-[1.05] mb-4">
        Current Promotions
      </h1>
      <p className="text-white/70 text-sm lg:text-base max-w-2xl leading-relaxed mb-6">
        Affordable healthcare starts here. Shop trusted brands, great prices, and everyday essentials.
      </p>
      <a
        href="/catalogues/sparkport-catalogue.pdf"
        download
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold rounded-xl hover:bg-neutral-100 transition-colors text-sm shadow-lg"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
        Download Full Catalogue
      </a>
    </div>
  </section>
);

export default async function PromotionsPage() {
  const [products, categories] = await Promise.all([
    getOnSaleProducts(100),
    getProductCategories(),
  ]);

  return <ShopLayout products={products} categories={categories} hero={hero} linkSource="promotions" />;
}
