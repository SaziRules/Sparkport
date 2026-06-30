'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_PATHS = ['/account', '/fill-script', '/manager'];

export default function NavVisibility({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (HIDDEN_PATHS.some((p) => pathname?.startsWith(p))) return null;
  return <>{children}</>;
}
