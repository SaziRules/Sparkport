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
    pathname?.startsWith('/branches');

  return (
    <main className={isFullWidth ? 'mx-auto max-w-full px-0' : 'mx-auto max-w-385 px-6'}>
      {children}
    </main>
  );
}
