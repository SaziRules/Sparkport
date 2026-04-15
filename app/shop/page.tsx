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

export default function ShopPage() {
  return <ShopLayout products={PRODUCTS} hero={hero} linkSource="shop" />;
}
