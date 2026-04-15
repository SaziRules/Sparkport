import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Sparkport Pharmacy',
  description: 'Get in touch with Sparkport Pharmacy. Visit us at 382 Randles Rd, Overport, Durban or send us a message online.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
