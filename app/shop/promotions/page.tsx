'use client';

import ShopLayout, { type ShopProduct } from '@/components/ShopLayout';

const PRODUCTS: ShopProduct[] = [
  { id: 1, name: 'Andolex C Lozenges Honey', category: 'Cold & Flu', tags: ['Spring Sale', 'Winter Deals'], originalPrice: 99.90, salePrice: 45.90, image: 'https://shoprite-ecommerce-prod-cdn.azureedge.net/sys-master-images/h6a/hee/9478893109278/300Wx300H_46240_01.jpg', inStock: true },
  { id: 2, name: 'Andolex C Lozenges Raspberry', category: 'Cold & Flu', tags: ['Spring Sale', 'Winter Deals'], originalPrice: 99.90, salePrice: 45.90, image: 'https://city-pharmacy-windhoek.myshopify.com/cdn/shop/files/500823c9dd0c5643cfa0a2ff1e25029a.png?v=1700466380&width=416', inStock: true },
  { id: 3, name: 'Andolex C Lozenges Strawberry', category: 'Cold & Flu', tags: ['Spring Sale', 'Winter Deals'], originalPrice: 99.90, salePrice: 45.90, image: 'https://city-pharmacy-windhoek.myshopify.com/cdn/shop/files/4f0ca86541a66b51e867d142629a2738.png?v=1700466456&width=1445', inStock: true },
  { id: 4, name: 'Multivitamin Complex 60 Tablets', category: 'Vitamins & Supplements', tags: ['Spring Sale'], originalPrice: 249.99, salePrice: 179.99, image: 'https://www.maximed.co.za/cdn/shop/files/NativaMultivitaminforWomenComplex60Capsules_1024x1024.jpg?v=1727100402', inStock: true },
  { id: 5, name: 'Omega-3 Fish Oil 1000mg', category: 'Vitamins & Supplements', tags: ['Spring Sale'], originalPrice: 189.99, salePrice: 139.99, image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01650/l/38.jpg', inStock: true },
  { id: 6, name: 'Vitamin C Effervescent 1000mg', category: 'Vitamins & Supplements', tags: ['Winter Deals'], originalPrice: 159.99, salePrice: 99.99, image: 'https://www.vitatechhealth.com/wp-content/uploads/2022/01/vitatech-vitamin-c-effervescent-thumb-2-min.png', inStock: true },
  { id: 7, name: 'Baby Gentle Lotion 500ml', category: 'Baby & Toddlers', tags: ['Spring Sale'], originalPrice: 119.99, salePrice: 79.99, image: 'https://clicks.co.za/medias/?context=bWFzdGVyfHByb2R1Y3QtaW1hZ2VzfDczOTQwfGltYWdlL2pwZWd8YURCaEwyZzBNaTh4TVRJME1qRXhOalV4TXpneU1nfDYzZWQ4Y2IwYjdlMzk5MDEzOGEwZDZiN2VjMTc2M2JlNzkwNzdhMTJjOWM5YjJmNzk0MzQzNTAwMzBiMzQxMmM', inStock: true },
  { id: 8, name: 'Sonic Electric Toothbrush', category: 'Oral Care', tags: ['Winter Deals'], originalPrice: 399.99, salePrice: 279.99, image: 'https://cdn.shopify.com/s/files/1/0797/2723/products/SonicBrush-Grey_withBase_Box_front-01_1.1.0_onWhite_web1600_4a2b7c17-fb7e-4467-814a-8cf48e432701_800x.jpg?v=1746687376', inStock: true },
];

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

export default function PromotionsPage() {
  return <ShopLayout products={PRODUCTS} hero={hero} linkSource="promotions" />;
}
