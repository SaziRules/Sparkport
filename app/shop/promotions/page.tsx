import ShopLayout from '@/components/ShopLayout';
import { getOnSaleProducts, getProductCategories } from '@/lib/wordpress';

const hero = (
  <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 lg:p-12 mb-8 text-center text-white">
    <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm font-bold! rounded-full mb-4 text-sm">
      Save Up To 40% Off
    </div>
    <h1 className="text-4xl lg:text-6xl font-extrabold! mb-4">
      Current Promotions
    </h1>
    <p className="text-lg lg:text-xl text-white! opacity-90 max-w-3xl mx-auto mb-6">
      Affordable Healthcare Starts Here. Shop Trusted Brands, Great Prices, and Everyday Essentials.
    </p>
    <a
      href="/catalogues/sparkport-catalogue.pdf"
      download
      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#184363] font-bold! rounded-lg hover:bg-neutral-100 transition-all shadow-lg"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
      </svg>
      Download Full Catalogue
    </a>
  </div>
);

export default async function PromotionsPage() {
  const [products, categories] = await Promise.all([
    getOnSaleProducts(100),
    getProductCategories(),
  ]);

  return <ShopLayout products={products} categories={categories} hero={hero} linkSource="promotions" />;
}
