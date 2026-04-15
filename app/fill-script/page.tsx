import type { Metadata } from 'next';
import FillYourScript from "@/components/FillYourScript";

export const metadata: Metadata = {
  title: 'Fill Your Script Online | Sparkport Pharmacy',
  description: 'Submit your prescription online for collection or delivery. Fast, safe, and convenient prescription filling at Sparkport Pharmacy.',
};

export default function FillScriptPage() {
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
        <FillYourScript />
      </main>

    </div>
  );
}
