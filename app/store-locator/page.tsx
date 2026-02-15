import StoreLocator from '@/components/StoreLocator';

export const metadata = {
  title: 'Store Locator - Sparkport Pharmacy',
  description: 'Find your nearest Sparkport pharmacy location in South Africa. View store hours and get directions.',
  keywords: 'Sparkport pharmacy, pharmacy near me, store locator, pharmacy locations, South Africa pharmacy',
};

export default function StoreLocatorPage() {
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
        <StoreLocator />
      </main>
    </div>
  );
}