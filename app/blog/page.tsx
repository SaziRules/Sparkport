import type { Metadata } from 'next';
import BlogGrid from '@/components/BlogGrid';

export const metadata: Metadata = {
  title: 'Health & Wellness Blog | Sparkport Pharmacy',
  description: 'Expert health advice, pharmacy tips, and wellness insights from the team at Sparkport Pharmacy in Durban.',
};

export default function BlogPage() {
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
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />

      {/* Page content */}
      <main className="relative">
        <BlogGrid />
      </main>

    </div>
  );
}