'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  categories: string[];
  slug: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'World Cancer Day',
    excerpt: 'Join us in raising awareness and supporting those affected by cancer on this important day.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    date: '04 FEB',
    categories: ['Pharmacy & Healthcare'],
    slug: 'world-cancer-day',
  },
  {
    id: '2',
    title: 'Pregnancy Awareness Week',
    excerpt: 'Everything you need to know about staying healthy during pregnancy and prenatal care.',
    image: 'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80',
    date: '04 FEB',
    categories: ['Insights', 'Pharmacy & Healthcare'],
    slug: 'pregnancy-awareness-week',
  },
  {
    id: '3',
    title: 'Preparing Your Digestive System for Ramadan',
    excerpt: 'Tips and advice for maintaining digestive health during the holy month of Ramadan.',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    date: '30 JAN',
    categories: ['Insights', 'Pharmacy & Healthcare'],
    slug: 'digestive-system-ramadan',
  },
  {
    id: '4',
    title: 'Nutrition Tips for a Healthy Lifestyle',
    excerpt: 'Discover the best nutrition practices to maintain your health and wellness throughout the year.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    date: '28 JAN',
    categories: ['Pharmacy & Healthcare'],
    slug: 'nutrition-tips',
  },
  {
    id: '5',
    title: 'Essential Oils and Wellness',
    excerpt: 'Learn how essential oils can enhance your daily wellness routine and improve your wellbeing.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
    date: '14 JAN',
    categories: ['Insights'],
    slug: 'essential-oils-wellness',
  },
  {
    id: '6',
    title: 'Setting Healthy Goals for the New Year',
    excerpt: 'Make this year your healthiest yet with our comprehensive goal-setting guide.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
    date: '03 JAN',
    categories: ['Pharmacy & Healthcare'],
    slug: 'healthy-goals-new-year',
  },
];

export default function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', 'Pharmacy & Healthcare', 'Insights'];
  
  const filteredPosts = selectedCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.categories.includes(selectedCategory));

  return (
    <div className="py-12 lg:py-20 px-4 lg:px-6">
      <div className="max-w-full mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl font-extrabold! text-[#184363] mb-4">
            Health & Wellness Blog
          </h1>
          <p className="text-lg lg:text-xl text-neutral-700 max-w-3xl mx-auto">
            Stay informed with the latest health tips, wellness advice, and pharmacy insights from our experts
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl font-bold! text-sm transition-all ${
                selectedCategory === category
                  ? 'bg-[#009eb9] text-white shadow-lg'
                  : 'bg-white/90 text-neutral-700 hover:bg-white hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 h-full flex flex-col">
                
                {/* Image */}
                <div className="relative h-56 lg:h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#009eb9] text-white px-4 py-3 rounded-xl shadow-xl z-10">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold leading-none">
                        {post.date.split(' ')[0]}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wide mt-0.5">
                        {post.date.split(' ')[1]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-block px-3 py-1 bg-[#009eb9]/10 text-[#009eb9] text-xs font-bold rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl lg:text-2xl font-extrabold! text-[#184363] mb-3 group-hover:text-[#009eb9] transition-colors leading-tight">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-neutral-600 text-sm lg:text-base leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-[#009eb9] font-bold text-sm group-hover:gap-3 transition-all">
                    Read more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* No Results Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <svg className="w-24 h-24 text-neutral-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-bold text-neutral-400 mb-2">No articles found</h3>
            <p className="text-neutral-500">Try selecting a different category</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12 lg:mt-16">
            <button className="px-8 py-4 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#184363] transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}