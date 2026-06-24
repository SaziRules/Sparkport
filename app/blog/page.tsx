import type { Metadata } from 'next';
import BlogGrid from '@/components/BlogGrid';
import { getPosts } from '@/lib/wordpress';

export const metadata: Metadata = {
  title: 'Health & Wellness Blog | Sparkport Pharmacy',
  description: 'Expert health advice, pharmacy tips, and wellness insights from the team at Sparkport Pharmacy in Durban.',
};

export default async function BlogPage() {
  const posts = await getPosts({ per_page: 12 });

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />
      <main className="relative">
        <BlogGrid posts={posts} />
      </main>
    </div>
  );
}
