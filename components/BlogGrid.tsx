'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress';

function formatDate(dateStr: string): { day: string; month: string } {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en-ZA', { month: 'short' }).toUpperCase(),
  };
}

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const allCategories = ['All', ...Array.from(new Set(posts.flatMap((p) => p.categories)))];
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.categories.includes(selectedCategory));

  return (
    <div className="py-12 lg:py-20 px-4 lg:px-6">
      <div className="max-w-full mx-auto">

        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl lg:text-6xl font-extrabold! text-[#184363] mb-4">
            Health & Wellness Blog
          </h1>
          <p className="text-lg lg:text-xl text-neutral-700 max-w-3xl mx-auto">
            Stay informed with the latest health tips, wellness advice, and pharmacy insights from our experts
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {allCategories.map((category) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredPosts.map((post) => {
            const { day, month } = formatDate(post.date);
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <article className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 h-full flex flex-col">
                  <div className="relative h-56 lg:h-64 overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#009eb9]/10" />
                    )}
                    <div className="absolute top-4 left-4 bg-[#009eb9] text-white px-4 py-3 rounded-xl shadow-xl z-10">
                      <div className="text-center">
                        <div className="text-2xl font-extrabold leading-none">{day}</div>
                        <div className="text-xs font-bold uppercase tracking-wide mt-0.5">{month}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
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

                    <h2 className="text-xl lg:text-2xl font-extrabold! text-[#184363] mb-3 group-hover:text-[#009eb9] transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-neutral-600 text-sm lg:text-base leading-relaxed mb-6 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-[#009eb9] font-bold text-sm group-hover:gap-3 transition-all">
                      Read more
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-neutral-400 mb-2">No articles found</h3>
            <p className="text-neutral-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
