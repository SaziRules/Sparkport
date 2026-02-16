'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation';
import "./globals.css";
import KlaasHeader from "@/components/KlaasHeader";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import SparkportMobileHeader from "@/components/SparkportMobileHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAccountPage = pathname?.startsWith('/account');

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground relative`}>
        
        {/* FULL-BLEED HEADER */}
        <div className="hidden lg:block">
          <KlaasHeader />
        </div>

        <SparkportMobileHeader />
        
        <Analytics />

        {/* CONSTRAINED PAGE CONTENT - full width on /account */}
        <main className={isAccountPage ? "mx-auto max-w-full px-0" : "mx-auto max-w-385 px-6"}>
          {children}
        </main>
        <Footer />

      </body>
    </html>
  );
}