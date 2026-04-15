import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop | Sparkport Pharmacy',
  description: 'Browse our full range of trusted pharmacy products — vitamins, supplements, personal care, baby essentials, and more.',
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
