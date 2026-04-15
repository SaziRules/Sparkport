import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sparkport+ Rewards | Free Member Savings',
  description: 'Join the Sparkport+ Rewards programme for free and unlock exclusive discounts every time you shop in-store or online.',
};

export default function GetRewardedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
