'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullWidth =
    pathname?.startsWith('/account') ||
    pathname?.startsWith('/fill-script') ||
    pathname?.startsWith('/manager') ||
    pathname?.startsWith('/terms-conditions') ||
    pathname?.startsWith('/privacy-policy') ||
    pathname?.startsWith('/shipping-policy') ||
    pathname?.startsWith('/regulated-medication') ||
    pathname?.startsWith('/branches') ||
    pathname?.startsWith('/health-care-services') ||
    pathname?.startsWith('/get-rewarded') ||
    pathname?.startsWith('/health-insurance') ||
    pathname?.startsWith('/events');

  return (
    <main className={isFullWidth ? 'mx-auto max-w-full' : 'mx-auto max-w-385'}>
      {children}
    </main>
  );
}
