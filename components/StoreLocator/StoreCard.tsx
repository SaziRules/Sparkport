'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Navigation, Clock, ChevronDown, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Store } from '@/lib/stores';
import { todayLabel, todayHours, directionsUrl } from './time';
import ServiceBadge from './ServiceBadge';
import HoursTable from './HoursTable';

interface Props {
  store: Store;
  active: boolean;
  open: boolean;
  onClick: () => void;
}

export default function StoreCard({ store, active, open, onClick }: Props) {
  const day = todayLabel();
  const hours = todayHours(store);

  return (
    <div
      onClick={onClick}
      className={`border-b border-neutral-100 cursor-pointer transition-colors duration-150 border-l-[3px] ${
        active
          ? 'border-l-[#009eb9] bg-[#009eb9]/5'
          : 'border-l-transparent hover:bg-neutral-50'
      }`}
    >
      {store.image && (
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="object-cover"
            sizes="400px"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(24,67,99,0.88) 0%, rgba(24,67,99,0.08) 60%)' }}
            aria-hidden="true"
          />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#7fd4e0] mb-0.5">
                {store.suburb}
              </p>
              <h3 className="text-base font-extrabold text-white leading-tight truncate">
                {store.name}
              </h3>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-sm border ${
                open
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-emerald-500' : 'bg-rose-500'}`}
                aria-hidden="true"
              />
              {open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="flex items-start gap-1.5 text-sm text-neutral-500 leading-snug">
            <MapPin className="w-3.5 h-3.5 text-[#009eb9] shrink-0 mt-0.5" aria-hidden="true" />
            {store.address}
          </p>
          <a
            href={`tel:${store.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[#009eb9] transition-colors shrink-0"
            aria-label={`Call ${store.name}`}
          >
            <Phone className="w-3 h-3" aria-hidden="true" />
            {store.phone}
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
          <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="font-semibold text-[#184363]">{day}:</span>
          <span>{hours}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {store.services.map((s) => <ServiceBadge key={s} label={s} />)}
        </div>

        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <HoursTable store={store} />
              <div className="flex gap-2 mt-4">
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#009eb9] text-white text-xs font-bold py-2.5 rounded-md hover:bg-[#007f95] transition-colors duration-200 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
                  Get Directions
                </a>
                <a
                  href={`tel:${store.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 border border-neutral-200 text-[#184363] text-xs font-bold px-4 py-2.5 rounded-md hover:bg-neutral-50 transition-colors duration-200"
                  aria-label={`Call ${store.name}`}
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  Call
                </a>
              </div>
              <Link
                href={`/branches/${store.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-neutral-500 hover:text-[#009eb9] transition-colors py-1"
              >
                View full branch details
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <button
            className="mt-3 flex items-center gap-1 text-[11px] text-neutral-400 hover:text-[#009eb9] transition-colors"
            tabIndex={-1}
            aria-hidden="true"
          >
            <ChevronDown className="w-3 h-3" aria-hidden="true" />
            View hours & directions
          </button>
        )}
      </div>
    </div>
  );
}
