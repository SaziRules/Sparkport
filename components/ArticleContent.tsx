'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost, Product } from '@/lib/wordpress';

function parseHeadings(html: string): { id: string; text: string; level: number }[] {
  const matches = [...html.matchAll(/<h([23])[^>]*>(.*?)<\/h\1>/gi)];
  return matches.map((m, i) => ({
    level: parseInt(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8216;/g, "'"),
    id: `heading-${i}`,
  }));
}

function injectHeadingIds(html: string): string {
  let i = 0;
  return html.replace(/<h([23])([^>]*)>/gi, (_, level, attrs) => {
    return `<h${level}${attrs} id="heading-${i++}" style="scroll-margin-top:6rem">`;
  });
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const QUICK_LINKS = [
  { label: 'Vitamins & Supplements', href: '/shop?category=vitamins-supplements' },
  { label: 'Baby & Toddler Care', href: '/shop?category=baby-toddler' },
  { label: 'Pain & Cold Relief', href: '/shop?category=pain-cold-flu' },
  { label: 'Skin & Beauty', href: '/shop?category=skin-beauty' },
  { label: 'Oral Health', href: '/shop?category=oral-care' },
  { label: 'Browse All Products', href: '/shop' },
];

interface Props {
  post: BlogPost;
  relatedPosts: BlogPost[];
  saleProducts: Product[];
}

const SHARE_ICONS = [
  {
    key: 'facebook',
    label: 'Facebook',
    bg: 'bg-[#1877F2] hover:bg-[#1864D8]',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    key: 'twitter',
    label: 'Twitter',
    bg: 'bg-[#1DA1F2] hover:bg-[#1A91DA]',
    path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    bg: 'bg-[#0A66C2] hover:bg-[#095196]',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    bg: 'bg-[#25D366] hover:bg-[#20BA5A]',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  },
];

export default function ArticleContent({ post, relatedPosts, saleProducts }: Props) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeId, setActiveId] = useState('');
  const [tocOpen, setTocOpen] = useState(false);

  const headings = parseHeadings(post.content);
  const contentWithIds = injectHeadingIds(post.content);
  const readTime = estimateReadTime(post.content);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(post.title + ' ' + shareUrl)}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="relative min-h-screen bg-white">

      {/* Reading Progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-200/60 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#184363] to-[#009eb9] transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero */}
      <div className="relative w-full h-[380px] lg:h-[500px] overflow-hidden">
        {post.image ? (
          <Image src={post.image} alt={post.imageAlt || post.title} fill sizes="100vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2133]/90 via-[#0d2133]/45 to-[#0d2133]/10" />

        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-10 xl:px-16 pb-10 lg:pb-14">
          <div className="max-w-4xl">
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map(cat => (
                  <span key={cat} className="px-3 py-1 bg-[#009eb9] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-5 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {readTime} min read
              </span>
              {post.author.name && (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {post.author.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-10 xl:px-16 py-3">
        <nav className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#009eb9] transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link href="/blog" className="hover:text-[#009eb9] transition-colors">Blog</Link>
          <svg className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-neutral-900 font-medium truncate">{post.title}</span>
        </nav>
      </div>

      {/* Main Layout */}
      <div className="px-4 sm:px-6 lg:px-10 xl:px-16 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] gap-10 lg:gap-12 items-start">

          {/* ── LEFT: Article ── */}
          <article>

            {/* Author byline */}
            {post.author.name && (
              <div className="flex items-center gap-3 mb-8 pl-4 border-l-4 border-[#009eb9]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#184363] to-[#009eb9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 select-none">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-[#184363] text-sm leading-tight">{post.author.name}</div>
                  <div className="text-xs text-neutral-500">Health &amp; Wellness Writer · {formatDate(post.date)}</div>
                </div>
              </div>
            )}

            {/* Mobile TOC (collapsible) */}
            {headings.length > 0 && (
              <div className="lg:hidden mb-8 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setTocOpen(!tocOpen)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-bold text-[#184363] flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Table of Contents
                  </span>
                  <svg className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${tocOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {tocOpen && (
                  <div className="border-t border-neutral-100 px-5 pb-5 pt-3">
                    <nav className="space-y-1">
                      {headings.map(h => (
                        <a
                          key={h.id}
                          href={`#${h.id}`}
                          onClick={() => setTocOpen(false)}
                          className={`block py-1.5 text-sm transition-colors border-l-2 pl-3 ${h.level === 3 ? 'ml-3 text-xs' : ''} ${
                            activeId === h.id
                              ? 'border-[#009eb9] text-[#009eb9] font-semibold'
                              : 'border-transparent text-neutral-600 hover:text-[#009eb9] hover:border-[#009eb9]/40'
                          }`}
                        >
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* Article body */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <style dangerouslySetInnerHTML={{__html: `
                .article-body { font-family: inherit; }
                .article-body h2 {
                  font-size: 1.65rem; font-weight: 800; color: #184363;
                  margin-top: 3rem; margin-bottom: 1.25rem;
                  padding-bottom: 0.75rem; border-bottom: 2px solid #e8f5f7; line-height: 1.3;
                }
                .article-body h3 {
                  font-size: 1.3rem; font-weight: 700; color: #184363;
                  margin-top: 2.25rem; margin-bottom: 0.875rem; line-height: 1.35;
                }
                .article-body h4 {
                  font-size: 1.05rem; font-weight: 700; color: #184363;
                  margin-top: 1.75rem; margin-bottom: 0.625rem;
                }
                .article-body p {
                  color: #404040; line-height: 1.85; margin-bottom: 1.5rem; font-size: 1.05rem;
                }
                .article-body a { color: #009eb9; font-weight: 600; text-decoration: none; }
                .article-body a:hover { color: #007a8f; text-decoration: underline; }
                .article-body strong { color: #184363; font-weight: 700; }
                .article-body em { font-style: italic; }
                .article-body ul { margin: 1.5rem 0; padding-left: 0; list-style: none; }
                .article-body ul li {
                  position: relative; padding-left: 1.75rem; color: #404040;
                  margin-bottom: 0.625rem; line-height: 1.75; font-size: 1.05rem;
                }
                .article-body ul li::before {
                  content: ''; position: absolute; left: 0; top: 0.65em;
                  width: 8px; height: 8px; background: #009eb9; border-radius: 50%;
                }
                .article-body ol { margin: 1.5rem 0; padding-left: 0; list-style: none; counter-reset: ol-counter; }
                .article-body ol li {
                  position: relative; padding-left: 2.5rem; color: #404040;
                  margin-bottom: 0.75rem; line-height: 1.75; font-size: 1.05rem;
                  counter-increment: ol-counter;
                }
                .article-body ol li::before {
                  content: counter(ol-counter); position: absolute; left: 0; top: 0.1em;
                  width: 1.6rem; height: 1.6rem; background: #184363; color: white;
                  border-radius: 50%; font-size: 0.75rem; font-weight: 700;
                  display: flex; align-items: center; justify-content: center;
                }
                .article-body blockquote {
                  margin: 2rem 0; padding: 1.25rem 1.5rem 1.25rem 1.75rem;
                  background: linear-gradient(135deg, #e8f5f7 0%, #f0fafb 100%);
                  border-left: 4px solid #009eb9; border-radius: 0 0.75rem 0.75rem 0;
                  font-size: 1.1rem; font-style: italic; color: #184363; line-height: 1.8;
                }
                .article-body img {
                  width: 100%; height: auto; border-radius: 0.875rem;
                  box-shadow: 0 8px 30px rgba(0,0,0,0.1); margin: 2rem 0; display: block;
                }
                .article-body figure { margin: 2rem 0; }
                .article-body figcaption { text-align: center; font-size: 0.875rem; color: #737373; margin-top: 0.5rem; }
                .article-body table { width: 100%; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem; border-radius: 0.75rem; overflow: hidden; }
                .article-body th { background: #184363; color: white; padding: 0.75rem 1rem; text-align: left; font-weight: 700; }
                .article-body td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; color: #404040; }
                .article-body tr:nth-child(even) td { background: #f9fafb; }
                .article-body code {
                  font-family: monospace; background: #f3f4f6; padding: 0.2em 0.5em;
                  border-radius: 0.3rem; font-size: 0.88em; color: #184363;
                }
                .article-body pre { background: #1e293b; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; }
                .article-body pre code { background: none; color: #e2e8f0; padding: 0; }
                .article-body hr { border: none; border-top: 2px solid #e8f5f7; margin: 2.5rem 0; }
              `}} />
              <div
                className="p-8 lg:p-12 article-body"
                dangerouslySetInnerHTML={{ __html: contentWithIds }}
              />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mr-1">Tags:</span>
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 text-xs font-semibold rounded-lg hover:border-[#009eb9] hover:text-[#009eb9] transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share (bottom of article) */}
            <div className="mt-8 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
              <h4 className="text-sm font-bold text-[#184363] mb-4">Share this article</h4>
              <div className="flex flex-wrap gap-3">
                {SHARE_ICONS.map(({ key, label, bg, path }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleShare(key)}
                    className={`flex items-center gap-2 px-5 py-2.5 ${bg} text-white font-semibold text-sm rounded-xl transition-colors`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-8 bg-gradient-to-br from-[#184363] to-[#0e6e82] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/5 rounded-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#009eb9]/15 rounded-full pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#009eb9]">Newsletter</span>
                </div>
                <h3 className="text-2xl font-extrabold mb-2">Stay Ahead of Your Health</h3>
                <p className="text-white/70 mb-6 leading-relaxed text-sm">
                  Get the latest health tips, wellness advice, and exclusive pharmacy deals delivered to your inbox every week.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#009eb9] focus:ring-2 focus:ring-[#009eb9]/30 transition-all text-sm"
                  />
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#009eb9] hover:bg-[#007a8f] text-white font-bold rounded-xl transition-colors whitespace-nowrap text-sm"
                  >
                    Subscribe Free
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile related articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-10 lg:hidden">
                <h3 className="text-xl font-extrabold text-[#184363] mb-5">Related Articles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedPosts.map(rp => (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      className="group flex gap-3 bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#009eb9]/30 transition-all"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {rp.image ? (
                          <Image src={rp.image} alt={rp.imageAlt || rp.title} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
                        )}
                      </div>
                      <div className="p-3 flex-1 min-w-0">
                        {rp.categories[0] && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#009eb9]">{rp.categories[0]}</span>
                        )}
                        <h4 className="text-sm font-bold text-[#184363] line-clamp-2 group-hover:text-[#009eb9] transition-colors mt-0.5">
                          {rp.title}
                        </h4>
                        <span className="text-xs text-neutral-400 mt-1 block">{formatDate(rp.date)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Back */}
            <div className="mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-[#009eb9] font-semibold hover:gap-3 transition-all text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Articles
              </Link>
            </div>
          </article>

          {/* ── RIGHT: Sticky Sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">

              {/* Share icons */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-4">Share</h4>
                <div className="flex gap-2.5">
                  {SHARE_ICONS.map(({ key, label, bg, path }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleShare(key)}
                      title={`Share on ${label}`}
                      className={`w-10 h-10 ${bg} text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d={path} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* TOC */}
              {headings.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-gradient-to-r from-[#184363] to-[#009eb9]">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      In This Article
                    </h4>
                  </div>
                  <nav className="px-4 py-4 max-h-72 overflow-y-auto space-y-1">
                    {headings.map(h => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-sm leading-snug py-1.5 pl-3 border-l-2 transition-all ${
                          h.level === 3 ? 'ml-3 text-xs' : ''
                        } ${
                          activeId === h.id
                            ? 'border-[#009eb9] text-[#009eb9] font-semibold'
                            : 'border-transparent text-neutral-600 hover:text-[#009eb9] hover:border-[#009eb9]/40'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-gradient-to-r from-[#184363] to-[#009eb9]">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Related Articles
                    </h4>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {relatedPosts.map(rp => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="group flex gap-3 p-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                          {rp.image ? (
                            <Image src={rp.image} alt={rp.imageAlt || rp.title} fill sizes="64px" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {rp.categories[0] && (
                            <span className="text-[10px] font-bold uppercase tracking-wide text-[#009eb9] block">{rp.categories[0]}</span>
                          )}
                          <h4 className="text-sm font-bold text-[#184363] line-clamp-2 group-hover:text-[#009eb9] transition-colors leading-snug mt-0.5">
                            {rp.title}
                          </h4>
                          <span className="text-xs text-neutral-400 mt-1 block">{formatDate(rp.date)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
                    <Link href="/blog" className="text-xs font-semibold text-[#009eb9] hover:text-[#007a8f] transition-colors flex items-center gap-1">
                      View all articles
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Pharmacist CTA */}
              <div className="bg-gradient-to-br from-[#e8f5f7] to-[#f0fafb] rounded-2xl border border-[#009eb9]/20 p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 bg-[#009eb9] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-bold text-[#184363] text-sm">Have a Question?</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  Our qualified pharmacists are here to help you with any health or medication queries.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-bold text-[#009eb9] hover:text-[#007a8f] flex items-center gap-1 transition-colors"
                >
                  Contact a Pharmacist
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              {/* On Sale Now */}
              {saleProducts.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-gradient-to-r from-black to-neutral-800 flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      On Sale Now
                    </h4>
                    <span className="text-[10px] bg-amber-400 text-black font-bold px-2 py-0.5 rounded-full">
                      Hot Deals
                    </span>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {saleProducts.map(product => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group flex items-center gap-3 p-3.5 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.imageAlt || product.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1.5 mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#184363] to-[#009eb9]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#184363] line-clamp-2 group-hover:text-[#009eb9] transition-colors leading-snug">
                            {product.name}
                          </h5>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            {product.originalPrice > product.salePrice && (
                              <span className="text-[10px] text-neutral-400 line-through">R{product.originalPrice.toFixed(0)}</span>
                            )}
                            <span className="text-sm font-extrabold text-[#009eb9]">R{product.salePrice.toFixed(0)}</span>
                            {product.originalPrice > product.salePrice && (
                              <span className="text-[9px] font-bold bg-black text-white px-1.5 py-0.5 rounded-full">
                                -{Math.round((1 - product.salePrice / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-neutral-300 group-hover:text-[#009eb9] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-neutral-100 bg-neutral-50">
                    <Link href="/shop?on_sale=1" className="text-xs font-semibold text-[#009eb9] hover:text-[#007a8f] transition-colors flex items-center gap-1">
                      View all deals
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </div>
                </div>
              )}

              {/* Browse the Shop */}
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 bg-gradient-to-r from-[#184363] to-[#009eb9]">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Browse the Shop
                  </h4>
                </div>
                <nav className="p-2">
                  {QUICK_LINKS.map((link, i) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                        i === QUICK_LINKS.length - 1
                          ? 'bg-[#e8f5f7] text-[#184363] font-bold hover:bg-[#009eb9] hover:text-white mt-1'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-[#009eb9]'
                      }`}
                    >
                      {link.label}
                      <svg className="w-3.5 h-3.5 text-neutral-300 group-hover:text-current transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </nav>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
