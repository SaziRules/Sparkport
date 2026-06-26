import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KlaasHeader from "@/components/KlaasHeader";
import { Analytics } from "@vercel/analytics/next";
import Footer from "@/components/Footer";
import SparkportMobileHeader from "@/components/SparkportMobileHeader";
import MainWrapper from "@/components/MainWrapper";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sparkport Pharmacy",
  description: "Quality healthcare products and services delivered to your door.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground relative`}>
        <ClientProviders>

          {/* FULL-BLEED HEADER */}
          <div className="hidden lg:block">
            <KlaasHeader />
          </div>

          <SparkportMobileHeader />

          <Analytics />

          {/* CONSTRAINED PAGE CONTENT - full width on /account */}
          <MainWrapper>
            {children}
          </MainWrapper>

          <Footer />

        </ClientProviders>
      </body>
    </html>
  );
}
