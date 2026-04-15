import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Insurance | Sparkport Pharmacy',
  description: 'Explore affordable health insurance options available through Sparkport Pharmacy — protecting you and your family.',
};

export default function HealthInsuranceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
