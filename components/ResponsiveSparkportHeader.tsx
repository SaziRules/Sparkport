'use client';

import SparkportHeader from '@/components/KlaasHeader';
import SparkportMobileHeader from './SparkportMobileHeader';

// Unified responsive header component
// Shows desktop header on lg+ screens, mobile header on smaller screens
export default function ResponsiveSparkportHeader() {
  return (
    <>
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <SparkportHeader />
      </div>

      {/* Mobile Header - Hidden on desktop */}
      <SparkportMobileHeader />
    </>
  );
}