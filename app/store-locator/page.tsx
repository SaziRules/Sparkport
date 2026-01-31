// app/store-locator/page.tsx
// Ready-to-use Store Locator Page

import StoreLocator from '@/components/StoreLocator';
// OR: import StoreLocatorSimple from '@/components/StoreLocatorSimple';

export const metadata = {
  title: 'Store Locator - Sparkport Pharmacy',
  description: 'Find your nearest Sparkport pharmacy location in South Africa. View store hours, services, and get directions.',
  keywords: 'Sparkport pharmacy, pharmacy near me, store locator, pharmacy locations, South Africa pharmacy',
};

export default function StoreLocatorPage() {
  return <StoreLocator />;
  // OR: return <StoreLocatorSimple />;
}

// If you want full-width layout (like /account page), update your root layout:
// const isFullWidth = pathname?.startsWith('/account') || pathname?.startsWith('/store-locator');