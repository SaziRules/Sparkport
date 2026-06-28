import type { Metadata } from 'next';
import FillYourScript from '@/components/FillYourScript';

export const metadata: Metadata = {
  title: 'Fill Your Script Online | Sparkport Pharmacy',
  description: 'Submit your prescription online for collection or delivery. Fast, safe, and convenient prescription filling at Sparkport Pharmacy.',
};

export default function FillScriptPage() {
  return <FillYourScript />;
}
