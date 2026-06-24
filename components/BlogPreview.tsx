import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/wordpress';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6 bg-neutral-50">
      <div className="max-w-full mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">
              Health & Wellness Insights
            </h2>
            <p className="text-neutral-600 text-lg">
              Expert advice and tips from our healthcare professionals
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden lg:inline-flex items-center gap-2 text-[#009eb9] font-semibold! hover:gap-3 transition-all"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                {post.categories[0] && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#009eb9] text-white text-xs font-bold! rounded-full">
                    {post.categories[0]}
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(post.date)}
                  </span>
                </div>

                <h3 className="text-lg font-bold! text-[#184363] mb-2 line-clamp-2 min-h-14 group-hover:text-[#009eb9] transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="inline-flex items-center gap-2 text-[#009eb9] font-semibold! text-sm group-hover:gap-3 transition-all">
                  Read Article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center lg:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-colors shadow-md"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
