import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KlaasHeader from "@/components/KlaasHeader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sparkport Group of Pharmacies",
  description: "Your pathway to sparkling health.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-background text-foreground relative`}>
        
        {/* Background image - 400px height with smoother fade starting higher */}
        {/* Background image with dark top overlay + fade */}


        
        {/* FULL-BLEED HEADER */}
        <KlaasHeader />

        {/* CONSTRAINED PAGE CONTENT */}
        <main className="mx-auto max-w-385 px-6">
          {children}
        </main>

      </body>
    </html>
  );
}