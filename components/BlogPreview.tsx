'use client';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'World Cancer Day',
    excerpt: 'Raising awareness about cancer prevention, early detection, and treatment options available.',
    category: 'Pharmacy & Healthcare',
    date: '04 Feb 2026',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
    link: '/blog/world-cancer-day',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Pregnancy Awareness Week',
    excerpt: 'Essential vitamins, nutrition tips, and healthcare guidance for expecting mothers.',
    category: 'Insights',
    date: '04 Feb 2026',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80',
    link: '/blog/pregnancy-awareness-week',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Preparing Your Digestive System for Ramadan',
    excerpt: 'Expert advice on maintaining digestive health during fasting with proper nutrition and supplements.',
    category: 'Pharmacy & Healthcare',
    date: '30 Jan 2026',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
    link: '/blog/preparing-digestive-system-ramadan',
    readTime: '7 min read',
  },
  {
    id: 4,
    title: 'Flu Season Protection Guide',
    excerpt: 'Stay healthy this winter with our comprehensive guide to preventing and managing flu symptoms.',
    category: 'Insights',
    date: '15 Jan 2026',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    link: '/blog/flu-season-protection',
    readTime: '4 min read',
  },
];

export default function BlogPreview() {
  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6 bg-neutral-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">
              Health & Wellness Insights
            </h2>
            <p className="text-neutral-600 text-lg">
              Expert advice and tips from our healthcare professionals
            </p>
          </div>
          <a
            href="/blog"
            className="hidden lg:inline-flex items-center gap-2 text-[#009eb9] font-semibold! hover:gap-3 transition-all"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {BLOG_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.link}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-[#009eb9] text-white text-xs font-bold! rounded-full">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date & Read Time */}
                <div className="flex items-center gap-3 mb-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {post.date}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold! text-[#184363] mb-2 line-clamp-2 min-h-14 group-hover:text-[#009eb9] transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="inline-flex items-center gap-2 text-[#009eb9] font-semibold! text-sm group-hover:gap-3 transition-all">
                  Read Article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center lg:hidden">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-colors shadow-md"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}