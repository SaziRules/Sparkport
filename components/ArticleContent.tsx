'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const RELATED_ARTICLES = [
  {
    title: 'Nutrition Tips for a Healthy Lifestyle',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    slug: 'nutrition-tips',
  },
  {
    title: 'Essential Oils and Wellness',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
    slug: 'essential-oils-wellness',
  },
  {
    title: 'Setting Healthy Goals',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80',
    slug: 'healthy-goals-new-year',
  },
];

export default function ArticleContent({ post }: { post: any }) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="relative min-h-screen">
      
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: "url('/images/heart-health.jpg')" }} />
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-200/50 z-50">
        <div 
          className="h-full bg-linear-to-r from-[#184363] to-[#009eb9] transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <article className="relative py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-600">
            <Link href="/" className="hover:text-[#009eb9]">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-[#009eb9]">Blog</Link>
            <span>›</span>
            <span className="text-neutral-900 font-semibold">{post.title}</span>
          </nav>

          {/* Hero Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/50 mb-8 max-w-7xl mx-auto">
            <div className="relative h-100 lg:h-125">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 text-white">
                <div className="flex flex-wrap gap-3 mb-4">
                  {post.categories.map((cat: string) => (
                    <span key={cat} className="px-4 py-2 bg-[#009eb9] text-white text-sm font-bold rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {post.readTime}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="max-w-7xl mx-auto">
            
            {/* Main Content */}
            <div>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 lg:p-12">
                
                {/* Author Info */}
                <div className="flex items-center gap-4 pb-8 mb-8 border-b border-neutral-200">
                  <img 
                    src={post.author.image} 
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-[#184363]">{post.author.name}</div>
                    <div className="text-sm text-neutral-600">{post.author.title}</div>
                  </div>
                </div>

                {/* Article Content */}
                <style dangerouslySetInnerHTML={{__html: `
                  .article-content h2 {
                    font-size: 1.875rem;
                    font-weight: 800;
                    color: #184363;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                  }
                  .article-content h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #184363;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                  }
                  .article-content p {
                    color: #525252;
                    line-height: 1.75;
                    margin-bottom: 1.5rem;
                    font-size: 1.125rem;
                  }
                  .article-content a {
                    color: #009eb9;
                    font-weight: 600;
                    text-decoration: none;
                  }
                  .article-content a:hover {
                    text-decoration: underline;
                  }
                  .article-content strong {
                    color: #184363;
                    font-weight: 700;
                  }
                  .article-content ul {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                  }
                  .article-content li {
                    color: #525252;
                    margin-bottom: 0.5rem;
                    line-height: 1.75;
                    font-size: 1.125rem;
                  }
                  .article-content img {
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    margin: 2rem 0;
                  }
                `}} />
                <div 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Featured Product Callout */}
                {post.relatedProducts && post.relatedProducts.length > 0 && (
                  <div className="mt-12 p-6 bg-linear-to-br from-[#184363]/5 to-[#009eb9]/5 border-2 border-[#009eb9]/20 rounded-2xl">
                    <h3 className="text-xl font-extrabold! text-[#184363] mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Recommended Product
                    </h3>
                    {post.relatedProducts.map((product: any, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
                        <img 
                          src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"
                          alt={product.name}
                          className="w-full md:w-32 h-32 object-cover rounded-xl shadow-md"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-bold! text-[#184363] mb-2">{product.name}</h4>
                          <p className="text-sm text-neutral-600 mb-3">{product.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-extrabold text-[#009eb9]">{product.price}</span>
                            <Link 
                              href={product.link}
                              className="px-6 py-2 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                            >
                              Shop Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link 
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-[#009eb9] hover:text-white transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h4 className="text-lg font-bold! text-[#184363] mb-4">Share this article</h4>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="px-6 py-3 bg-[#1877F2] text-white font-bold rounded-lg hover:bg-[#1864D8] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="px-6 py-3 bg-[#1DA1F2] text-white font-bold rounded-lg hover:bg-[#1A91DA] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="px-6 py-3 bg-[#0A66C2] text-white font-bold rounded-lg hover:bg-[#095196] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg hover:bg-[#20BA5A] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              <div className="mt-8">
                <h3 className="text-2xl font-extrabold! text-[#184363] mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {RELATED_ARTICLES.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className="group bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-white/50"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold! text-[#184363] group-hover:text-[#009eb9] transition-colors">
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold! mb-2">Stay Updated</h3>
                <p className="mb-6 opacity-90 text-white!">Get the latest health tips and wellness advice delivered to your inbox</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-white/30 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-6 py-3 bg-white text-[#184363] font-bold! rounded-lg hover:bg-neutral-100 transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Back to Blog */}
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[#009eb9] font-bold! hover:gap-3 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to All Articles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}