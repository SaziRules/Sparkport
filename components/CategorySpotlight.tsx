'use client';

import React, { useState } from 'react';

const CATEGORY_SPOTLIGHTS = [
  {
    id: 'vitamins',
    name: 'Vitamins & Supplements',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: 'Boost your wellness with our bestselling vitamins and supplements',
    products: [
      {
        id: 1,
        name: 'Vitamin D3 2000IU 60 Capsules',
        category: 'Vitamins',
        price: 189.99,
        salePrice: 149.99,
        image: 'https://www.feelhealthy.co.za/wp-content/uploads/2018/04/Viridian-Vitamin-D3-2000iu-60.jpg',
        badge: 'Popular',
      },
      {
        id: 2,
        name: 'Omega-3 Fish Oil 1000mg',
        category: 'Supplements',
        price: 299.99,
        salePrice: 219.99,
        image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01650/l/38.jpg',
        badge: 'Sale',
      },
      {
        id: 3,
        name: 'Multivitamin Complex 60s',
        category: 'Vitamins',
        price: 249.99,
        salePrice: 179.99,
        image: 'https://www.maximed.co.za/cdn/shop/files/NativaMultivitaminforWomenComplex60Capsules_1024x1024.jpg?v=1727100402',
        badge: 'Sale',
      },
      {
        id: 4,
        name: 'Vitamin C 1000mg Effervescent',
        category: 'Vitamins',
        price: 159.99,
        salePrice: 99.99,
        image: 'https://www.vitatechhealth.com/wp-content/uploads/2022/01/vitatech-vitamin-c-effervescent-thumb-2-min.png',
        badge: 'Hot',
      },
      {
        id: 5,
        name: 'Magnesium Citrate 400mg',
        category: 'Supplements',
        price: 219.99,
        salePrice: 219.99,
        image: 'https://mopani.co.za/cdn/shop/files/269273_1.webp?v=1759749351',
        badge: null,
      },
      {
        id: 6,
        name: 'Probiotic Complex 30 Capsules',
        category: 'Supplements',
        price: 249.99,
        salePrice: 179.99,
        image: 'https://vitagene.co.za/cdn/shop/files/Untitleddesign_37967e99-f920-4085-9b86-a0442c6a23f4.png?v=1725972784',
        badge: 'Sale',
      },
    ],
  },
  {
    id: 'baby',
    name: 'Baby & Toddler',
    description: 'Everything for your little ones, from diapers to gentle care products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    products: [
      {
        id: 7,
        name: 'Baby Gentle Lotion 500ml',
        category: 'Baby Care',
        price: 119.99,
        salePrice: 79.99,
        image: 'https://clicks.co.za/medias/?context=bWFzdGVyfHByb2R1Y3QtaW1hZ2VzfDczOTQwfGltYWdlL2pwZWd8YURCaEwyZzBNaTh4TVRJME1qRXhOalV4TXpneU1nfDYzZWQ4Y2IwYjdlMzk5MDEzOGEwZDZiN2VjMTc2M2JlNzkwNzdhMTJjOWM5YjJmNzk0MzQzNTAwMzBiMzQxMmM',
        badge: 'Sale',
      },
      {
        id: 8,
        name: 'Baby Wipes Sensitive 80s',
        category: 'Baby Care',
        price: 89.99,
        salePrice: 89.99,
        image: 'https://www.dischem.co.za/api/catalog/product/6/0/6009704612902_ba56e3de525a50653f7916e85764ef99.jpg?store=default&image-type=image',
        badge: null,
      },
      {
        id: 9,
        name: 'Infant Vitamin D Drops',
        category: 'Baby Health',
        price: 149.99,
        salePrice: 149.99,
        image: 'https://clicks.co.za/medias/?context=bWFzdGVyfHByb2R1Y3QtaW1hZ2VzfDI2ODE3fGltYWdlL2pwZWd8Y0hKdlpIVmpkQzFwYldGblpYTXZhR1k0TDJnME5DODRPRFEwTURFNU1UY3hNelU0TG1wd1p3fDNiMDk0MTJkNzA2ZDRiMmQ5MTIyMzM5YzcxOGI4MGQxZTcwMzQ2NTBjNDJjNzEyNWFhMDUwYmRkY2FlYmU1YmE',
        badge: 'New',
      },
      {
        id: 10,
        name: 'Baby Barrier Cream 100g',
        category: 'Baby Care',
        price: 99.99,
        salePrice: 69.99,
        image: 'https://catalog.sixty60.co.za/v2/files/6759b8defd0f8f3b7b8edc6b?width=1440&height=1440',
        badge: 'Sale',
      },
      {
        id: 11,
        name: 'Baby Bath & Shampoo 400ml',
        category: 'Baby Care',
        price: 129.99,
        salePrice: 89.99,
        image: 'https://www.mynavyexchange.com/products/images/large/14276109_000.jpg',
        badge: 'Sale',
      },
      {
        id: 12,
        name: 'Teething Gel Natural Relief',
        category: 'Baby Health',
        price: 79.99,
        salePrice: 79.99,
        image: 'https://www.dischem.co.za/api/catalog/product/6/1/619b77457416f_370797240164.jpg?store=default&image-type=image',
        badge: null,
      },
    ],
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    description: 'Skincare, hygiene, and personal wellness products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    products: [], // Placeholder - will use first category's products in render
  },
  {
    id: 'cold-flu',
    name: 'Cold & Flu',
    description: 'Relief from cold and flu symptoms',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'pain-relief',
    name: 'Pain Relief',
    description: 'Effective pain management solutions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'womens-health',
    name: "Women's Health",
    description: 'Feminine care and wellness products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'first-aid',
    name: 'First Aid',
    description: 'Emergency care and wound treatment',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'digestive-health',
    name: 'Digestive Health',
    description: 'Gut health and digestive support',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'oral-care',
    name: 'Oral Care',
    description: 'Dental hygiene and mouth care',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    products: [],
  },
  {
    id: 'hair-beauty',
    name: 'Hair & Beauty',
    description: 'Hair care and beauty essentials',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    products: [],
  },
];

export default function CategorySpotlight() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_SPOTLIGHTS[0].id);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const currentSpotlight = CATEGORY_SPOTLIGHTS.find(cat => cat.id === activeCategory) || CATEGORY_SPOTLIGHTS[0];
  
  // Use current category's products, or fall back to vitamins products if empty
  const displayProducts = currentSpotlight.products.length > 0 
    ? currentSpotlight.products 
    : CATEGORY_SPOTLIGHTS[0].products;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-2">
      <div className="max-w-full mx-auto">
        
        {/* Horizontally Scrollable Category Tabs - Airbnb Style with Arrows */}
        <div className="mb-8 -mx-4 lg:-mx-6 relative group">
          
          {/* Left Arrow - Visible on hover */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-all ml-2 opacity-0 group-hover:opacity-100"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Right Arrow - Visible on hover */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-all mr-2 opacity-0 group-hover:opacity-100"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="overflow-x-auto px-4 lg:px-6" 
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-3 pb-4 min-w-max">
              {CATEGORY_SPOTLIGHTS.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold! text-sm transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-[#184363] text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span className={activeCategory === category.id ? 'text-white' : 'text-[#009eb9]'}>
                    {category.icon}
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold! text-[#184363] mb-2">
              {currentSpotlight.name}
            </h3>
            <p className="text-neutral-600">
              {currentSpotlight.description}
            </p>
          </div>
          <a
            href={`/category/${activeCategory}`}
            className="hidden lg:inline-flex items-center gap-2 text-[#009eb9] font-semibold! hover:gap-3 transition-all"
          >
            View All in {currentSpotlight.name}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative"
            >
              {/* Badge */}
              {product.badge && (
                <div className={`absolute top-2 left-2 px-2 py-1 text-white text-xs font-bold! rounded-full z-10 ${
                  product.badge === 'Sale' ? 'bg-black' : 'bg-[#009eb9]'
                }`}>
                  {product.badge}
                </div>
              )}

              {/* Product Image */}
              <div className="relative bg-white p-4 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 border-t border-neutral-100">
                {/* Category */}
                <p className="text-xs text-[#009eb9] font-medium! mb-1">
                  {product.category}
                </p>

                {/* Product Name */}
                <h4 className="text-xs font-bold! text-[#184363] mb-2 line-clamp-2 min-h-8">
                  {product.name}
                </h4>

                {/* Pricing */}
                <div className="flex items-baseline gap-1 mb-2">
                  {product.price !== product.salePrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      R{product.price.toFixed(0)}
                    </span>
                  )}
                  <span className="text-base font-extrabold! text-[#009eb9]">
                    R{product.salePrice.toFixed(0)}
                  </span>
                </div>

                {/* Add to Basket */}
                <button className="w-full px-3 py-2 bg-[#e8f5f7] text-[#184363] font-semibold! text-xs rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center lg:hidden">
          <a
            href={`/category/${activeCategory}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-colors shadow-md"
          >
            View All in {currentSpotlight.name}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}