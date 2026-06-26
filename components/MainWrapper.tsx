'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAccountPage = pathname?.startsWith('/account');

  return (
    <main className={isAccountPage ? 'mx-auto max-w-full px-0' : 'mx-auto max-w-385 px-6'}>
      {children}
    </main>
  );
}
