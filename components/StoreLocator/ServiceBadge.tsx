import type { ComponentType } from 'react';
import {
  Pill, Clock, ShieldCheck, Upload, Moon, Sunrise,
  CalendarDays, Clock3, Stethoscope, Package, Heart,
} from 'lucide-react';

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  'Dispensary': Pill,
  'Chronic Meds': Clock,
  'Schedule 5 & 6': ShieldCheck,
  'Script Upload': Upload,
  'Late-night Trading': Moon,
  'Early Opening': Sunrise,
  '7-Day Trading': CalendarDays,
  'Extended Hours': Clock3,
  'Pharmacist Consult': Stethoscope,
  'Wholesale Enquiries': Package,
  'ARV/HIV Management': Heart,
};

export default function ServiceBadge({ label }: { label: string }) {
  const Icon = ICONS[label];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-neutral-50 border border-neutral-200 text-[#184363] px-2 py-0.5 rounded-sm whitespace-nowrap">
      {Icon && <Icon className="w-3 h-3 shrink-0 text-[#009eb9]" aria-hidden="true" />}
      {label}
    </span>
  );
}
