import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Current Promotions | Sparkport Pharmacy',
  description: 'Save up to 40% on top pharmacy brands. Shop Sparkport\'s latest deals on vitamins, cold & flu, oral care, and more.',
};

export default function PromotionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
