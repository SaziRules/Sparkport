'use client';

import { useState } from 'react';

// Sample product data - replace with actual WooCommerce API data
const PRODUCTS = {
  'hot-deals': [
    {
      id: 1,
      name: 'Multivitamin Complex 60 Tablets',
      category: 'Vitamins & Supplements',
      originalPrice: 249.99,
      salePrice: 179.99,
      image: 'https://www.maximed.co.za/cdn/shop/files/NativaMultivitaminforWomenComplex60Capsules_1024x1024.jpg?v=1727100402',
      badge: 'Sale',
      inStock: true,
    },
    {
      id: 2,
      name: 'Sonic Electric Toothbrush',
      category: 'Oral Care',
      originalPrice: 399.99,
      salePrice: 279.99,
      image: 'https://cdn.shopify.com/s/files/1/0797/2723/products/SonicBrush-Grey_withBase_Box_front-01_1.1.0_onWhite_web1600_4a2b7c17-fb7e-4467-814a-8cf48e432701_800x.jpg?v=1746687376',
      badge: 'Sale',
      inStock: true,
    },
    {
      id: 3,
      name: 'Vitamin C 1000mg Effervescent 20s',
      category: 'Vitamins & Supplements',
      originalPrice: 159.99,
      salePrice: 119.99,
      image: 'https://www.vitatechhealth.com/wp-content/uploads/2022/01/vitatech-vitamin-c-effervescent-thumb-2-min.png',
      badge: 'Sale',
      inStock: true,
    },
    {
      id: 4,
      name: 'Omega-3 Fish Oil 1000mg 60s',
      category: 'Vitamins & Supplements',
      originalPrice: 299.99,
      salePrice: 219.99,
      image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01650/l/38.jpg',
      badge: 'Sale',
      inStock: true,
    },
  ],
  'bestsellers': [
    {
      id: 5,
      name: 'Betadine Sore Throat Gargle 125ml',
      category: 'Cold & Flu',
      originalPrice: 89.99,
      salePrice: 89.99,
      image: 'https://cdn-prd-02.pnp.co.za/sys-master/images/h87/h04/10813184475166/silo-product-image-v2-23Apr2022-180110-6009802837245-Angle_D-23774-3859_400Wx400H',
      badge: 'Bestseller',
      inStock: true,
    },
    {
      id: 6,
      name: 'Rooibos Tea 80 Tagless Teabags',
      category: 'Health & Wellness',
      originalPrice: 79.99,
      salePrice: 79.99,
      image: 'https://m.media-amazon.com/images/I/71Z0zZSNiSL._AC_UF894,1000_QL80_.jpg',
      badge: 'Bestseller',
      inStock: true,
    },
    {
      id: 7,
      name: 'Rehidrat Oral Electrolyte 14 Sachets',
      category: 'Digestive Health',
      originalPrice: 89.99,
      salePrice: 89.99,
      image: 'https://www.dischem.co.za/api/catalog/product/6/0/6001137101312_d4c3b5299c44c0063241898d1cb30cf1.jpg?store=default&image-type=image',
      badge: 'Bestseller',
      inStock: true,
    },
    {
      id: 8,
      name: 'Disprin Aspirin 24 Tablets',
      category: 'Pain Relief',
      originalPrice: 79.99,
      salePrice: 79.99,
      image: 'https://www.dischem.co.za/api/catalog/product/6/0/6001016400239_side.jpg?width=400&height=400&store=default&image-type=image',
      badge: 'Bestseller',
      inStock: true,
    },
  ],
  'new-arrivals': [
    {
      id: 9,
      name: 'Collagen Peptides Powder 300g',
      category: 'Vitamins & Supplements',
      originalPrice: 399.99,
      salePrice: 399.99,
      image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/age/age12162/l/40.jpg',
      badge: 'New',
      inStock: true,
    },
    {
      id: 10,
      name: 'Probiotic Gummies 60 Count',
      category: 'Digestive Health',
      originalPrice: 289.99,
      salePrice: 289.99,
      image: 'https://clicks.co.za/medias/?context=bWFzdGVyfHByb2R1Y3QtaW1hZ2VzfDE0Nzg0MHxpbWFnZS9qcGVnfGFEUTBMMmhrWXk4eE1UYzFOek01T0RJeU9UQXlNZ3w3MjEzYTJiZDVjNWFlMWNjZTlkMzdiZmFkMWIyMDY3MjNhOGNlOGNhZDcxNTk2NjUxODk1ZDg4MWVjODRlZWM2',
      badge: 'New',
      inStock: true,
    },
    {
      id: 11,
      name: 'Melatonin Sleep Support 5mg',
      category: 'Health & Wellness',
      originalPrice: 199.99,
      salePrice: 199.99,
      image: 'https://cdn.shopify.com/s/files/1/0616/2130/5564/files/7978.901_25018_Melatonin_5mg_10ct_TravelPouch.png?v=1745966066',
      badge: 'New',
      inStock: true,
    },
    {
      id: 12,
      name: 'Turmeric Curcumin Complex',
      category: 'Vitamins & Supplements',
      originalPrice: 349.99,
      salePrice: 349.99,
      image: 'https://m.media-amazon.com/images/I/71tTV0OTqXL._AC_UF1000,1000_QL80_.jpg',
      badge: 'New',
      inStock: true,
    },
  ],
};

type TabType = 'hot-deals' | 'bestsellers' | 'new-arrivals';

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('hot-deals');

  const currentProducts = PRODUCTS[activeTab];

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-2">
      <div className="max-full mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-3">
            Featured Products
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Discover our most popular items and exclusive deals
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-xl shadow-md border border-neutral-200 p-1">
            <button
              onClick={() => setActiveTab('hot-deals')}
              className={`px-6 py-3 rounded-lg font-semibold! text-sm transition-all flex items-center gap-2 ${
                activeTab === 'hot-deals'
                  ? 'bg-[#009eb9] text-white shadow-md'
                  : 'text-neutral-600 hover:text-[#184363]'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Hot Deals
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-6 py-3 rounded-lg font-semibold! text-sm transition-all flex items-center gap-2 ${
                activeTab === 'bestsellers'
                  ? 'bg-[#009eb9] text-white shadow-md'
                  : 'text-neutral-600 hover:text-[#184363]'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`px-6 py-3 rounded-lg font-semibold! text-sm transition-all flex items-center gap-2 ${
                activeTab === 'new-arrivals'
                  ? 'bg-[#009eb9] text-white shadow-md'
                  : 'text-neutral-600 hover:text-[#184363]'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              New Arrivals
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative"
            >
              {/* Badge */}
              <div className={`absolute top-3 left-3 px-3 py-1 text-white text-xs font-bold! rounded-full z-10 ${
                product.badge === 'Sale' ? 'bg-black' : 'bg-[#009eb9]'
              }`}>
                {product.badge}
              </div>

              {/* Product Image */}
              <div className="relative bg-white p-6 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4 border-t border-neutral-100">
                {/* Category */}
                <p className="text-xs text-[#009eb9] font-medium! mb-2">
                  {product.category}
                </p>

                {/* Product Name */}
                <h3 className="text-sm font-bold! text-[#184363] mb-3 line-clamp-2 min-h-10">
                  {product.name}
                </h3>

                {/* Pricing */}
                <div className="flex items-baseline gap-2 mb-3">
                  {product.originalPrice !== product.salePrice && (
                    <span className="text-sm text-neutral-400 line-through">
                      R{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-xl font-extrabold! text-[#009eb9]">
                    R{product.salePrice.toFixed(2)}
                  </span>
                </div>

                {/* Quantity Picker + Add to Basket */}
                <div className="flex items-center gap-2">
                  {/* Quantity Picker */}
                  <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-2 py-2">
                    <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center">
                      -
                    </button>
                    <span className="font-semibold! text-[#184363] w-6 text-center text-sm">
                      1
                    </span>
                    <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg w-6 h-6 flex items-center justify-center">
                      +
                    </button>
                  </div>

                  {/* Add to Basket */}
                  <button className="flex-1 px-3 py-2 bg-[#e8f5f7] text-[#184363] font-semibold! text-sm rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center">
          <a
            href="/promotions"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-colors shadow-lg hover:shadow-xl"
          >
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}