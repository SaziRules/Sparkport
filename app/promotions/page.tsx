'use client';

import { useState } from 'react';

const CATEGORIES = [
  'All Products',
  'Vitamins & Supplements',
  'Personal Care',
  'Baby & Toddlers',
  'Women\'s Health',
  'Cold & Flu',
  'Pain Relief',
  'Oral Care',
  'Hair & Beauty',
  'First Aid',
  'Digestive Health',
];

const SALE_PRODUCTS = [
  {
    id: 1,
    name: 'Andolex C Lozenges Honey',
    category: 'Cold & Flu',
    tags: ['Spring Sale', 'Winter Deals'],
    originalPrice: 99.90,
    salePrice: 45.90,
    image: 'https://shoprite-ecommerce-prod-cdn.azureedge.net/sys-master-images/h6a/hee/9478893109278/300Wx300H_46240_01.jpg',
    inStock: true,
  },
  {
    id: 2,
    name: 'Andolex C Lozenges Raspberry',
    category: 'Cold & Flu',
    tags: ['Spring Sale', 'Winter Deals'],
    originalPrice: 99.90,
    salePrice: 45.90,
    image: 'https://city-pharmacy-windhoek.myshopify.com/cdn/shop/files/500823c9dd0c5643cfa0a2ff1e25029a.png?v=1700466380&width=416',
    inStock: true,
  },
  {
    id: 3,
    name: 'Andolex C Lozenges Strawberry',
    category: 'Cold & Flu',
    tags: ['Spring Sale', 'Winter Deals'],
    originalPrice: 99.90,
    salePrice: 45.90,
    image: 'https://city-pharmacy-windhoek.myshopify.com/cdn/shop/files/4f0ca86541a66b51e867d142629a2738.png?v=1700466456&width=1445',
    inStock: true,
  },
  {
    id: 4,
    name: 'Multivitamin Complex 60 Tablets',
    category: 'Vitamins & Supplements',
    tags: ['Spring Sale'],
    originalPrice: 249.99,
    salePrice: 179.99,
    image: 'https://www.maximed.co.za/cdn/shop/files/NativaMultivitaminforWomenComplex60Capsules_1024x1024.jpg?v=1727100402',
    inStock: true,
  },
  {
    id: 5,
    name: 'Omega-3 Fish Oil 1000mg',
    category: 'Vitamins & Supplements',
    tags: ['Spring Sale'],
    originalPrice: 189.99,
    salePrice: 139.99,
    image: 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01650/l/38.jpg',
    inStock: true,
  },
  {
    id: 6,
    name: 'Vitamin C Effervescent 1000mg',
    category: 'Vitamins & Supplements',
    tags: ['Winter Deals'],
    originalPrice: 159.99,
    salePrice: 99.99,
    image: 'https://www.vitatechhealth.com/wp-content/uploads/2022/01/vitatech-vitamin-c-effervescent-thumb-2-min.png',
    inStock: true,
  },
  {
    id: 7,
    name: 'Baby Gentle Lotion 500ml',
    category: 'Baby & Toddlers',
    tags: ['Spring Sale'],
    originalPrice: 119.99,
    salePrice: 79.99,
    image: 'https://clicks.co.za/medias/?context=bWFzdGVyfHByb2R1Y3QtaW1hZ2VzfDczOTQwfGltYWdlL2pwZWd8YURCaEwyZzBNaTh4TVRJME1qRXhOalV4TXpneU1nfDYzZWQ4Y2IwYjdlMzk5MDEzOGEwZDZiN2VjMTc2M2JlNzkwNzdhMTJjOWM5YjJmNzk0MzQzNTAwMzBiMzQxMmM',
    inStock: true,
  },
  {
    id: 8,
    name: 'Sonic Electric Toothbrush',
    category: 'Oral Care',
    tags: ['Winter Deals'],
    originalPrice: 399.99,
    salePrice: 279.99,
    image: 'https://cdn.shopify.com/s/files/1/0797/2723/products/SonicBrush-Grey_withBase_Box_front-01_1.1.0_onWhite_web1600_4a2b7c17-fb7e-4467-814a-8cf48e432701_800x.jpg?v=1746687376',
    inStock: true,
  },
];

export default function PromotionsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = SALE_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.salePrice >= priceRange[0] && product.salePrice <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="relative min-h-screen">
      
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-white/80" />

      {/* Page content */}
      <main className="relative py-12 lg:py-16 px-4 lg:px-6">
        <div className="max-w-full mx-auto">
          
          {/* Hero Section */}
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

          {/* Main Layout: Sidebar + Products */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6 sticky top-6">
                
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-3">Categories</label>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? 'bg-[#009eb9] text-white font-semibold!'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="mb-6">
                  <label className="block text-sm font-bold! text-[#184363] mb-3">Price Range</label>
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#009eb9]"
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-neutral-600">R0</span>
                      <span className="text-sm font-bold! text-[#184363]">R{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory('All Products');
                    setPriceRange([0, 500]);
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2 border-2 border-[#009eb9] text-[#009eb9] font-semibold! rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors text-sm"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1">
              
              {/* Toolbar */}
              <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="text-neutral-600 text-sm">
                  Showing <span className="font-bold! text-[#184363]">{filteredProducts.length}</span> products
                </p>
                
                {/* View Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-[#009eb9] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === 'list'
                        ? 'bg-[#009eb9] text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-xl transition-all group relative"
                    >
                      {/* Sale Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-bold! rounded-full z-10">
                        Sale
                      </div>

                      {/* Product Image */}
                      <a href={`/product/${product.id}`} className="block">
                        <div className="relative bg-white p-8 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </a>

                      {/* Product Info */}
                      <div className="p-6 pt-4 border-t border-neutral-100">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs text-[#009eb9] font-medium!">
                              {tag}
                              {idx < product.tags.length - 1 && ','}
                            </span>
                          ))}
                        </div>

                        <a href={`/product/${product.id}`} className="block">
                          <h3 className="text-base font-bold! text-[#184363] mb-0.5 min-h-12 hover:text-[#009eb9] transition-colors">
                            {product.name}
                          </h3>
                        </a>
                        
                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-sm text-neutral-400 line-through">
                            R{product.originalPrice.toFixed(2)}
                          </span>
                          <span className="text-xl font-extrabold! text-[#009eb9]">
                            R{product.salePrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Picker + Add to Basket */}
                        <div className="flex items-center gap-3">
                          {/* Quantity Picker */}
                          <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-3">
                            <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg">-</button>
                            <span className="font-semibold! text-[#184363] w-6 text-center">1</span>
                            <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg">+</button>
                          </div>

                          {/* Add to Basket */}
                          <button className="flex-1 px-4 py-3 bg-[#e8f5f7] text-[#184363] font-semibold! rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Add to basket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 relative">
                        {/* Sale Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-bold! rounded-full">
                          Sale
                        </div>

                        {/* Product Image */}
                        <a href={`/product/${product.id}`} className="w-full sm:w-40 shrink-0 pt-8 sm:pt-0 block">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-contain"
                          />
                        </a>

                        {/* Product Info */}
                        <div className="flex-1">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {product.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs text-[#009eb9] font-medium!">
                                {tag}
                                {idx < product.tags.length - 1 && ','}
                              </span>
                            ))}
                          </div>

                          <a href={`/product/${product.id}`} className="block">
                            <h3 className="text-lg font-bold! text-[#184363] mb-3 hover:text-[#009eb9] transition-colors">
                              {product.name}
                            </h3>
                          </a>
                          
                          {/* Pricing */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm text-neutral-400 line-through">
                              R{product.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-xl font-extrabold! text-[#009eb9]">
                              R{product.salePrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {/* Quantity */}
                          <div className="flex items-center gap-3 bg-neutral-50 rounded-lg px-4 py-2">
                            <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg">-</button>
                            <span className="font-semibold! text-[#184363] w-8 text-center">1</span>
                            <button className="text-neutral-600 hover:text-[#184363] font-bold! text-lg">+</button>
                          </div>

                          {/* Add to Basket */}
                          <button className="flex-1 sm:flex-none px-6 py-3 bg-[#e8f5f7] text-[#184363] font-semibold! rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Add to basket
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}