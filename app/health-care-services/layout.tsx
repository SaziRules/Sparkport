import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Care Services | Sparkport Pharmacy',
  description: 'Comprehensive pharmacy health services in Durban — health checks, chronic medication management, blister packaging, and more.',
};

export default function HealthCareServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
