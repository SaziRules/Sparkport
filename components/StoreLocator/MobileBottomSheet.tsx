'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Clock, Phone, Navigation, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Store } from '@/lib/stores';
import { todayLabel, todayHours, directionsUrl } from './time';
import ServiceBadge from './ServiceBadge';

interface Props {
  store: Store | null;
  open: boolean;
  onClose: () => void;
}

export default function MobileBottomSheet({ store, open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && store && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[400] bg-[#184363]/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0, 0.32, 1] }}
            className="absolute bottom-0 left-0 right-0 z-[500] bg-white rounded-t-2xl shadow-[0_-12px_40px_-12px_rgba(24,67,99,0.3)] pb-6"
          >
            <div className="flex justify-center pt-3 pb-4">
              <div className="w-10 h-1 rounded-full bg-neutral-200" />
            </div>

            {store.image && (
              <div className="relative h-28 mx-4 rounded-md overflow-hidden mb-4">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(24,67,99,0.65) 0%, transparent 60%)' }}
                  aria-hidden="true"
                />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#7fd4e0]">
                    {store.suburb}
                  </p>
                </div>
              </div>
            )}

            <div className="px-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-[#184363] leading-tight">{store.name}</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">{store.address}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-neutral-400 hover:text-[#184363] transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-[#184363]">{todayLabel()}:</span>
                  {todayHours(store)}
                </span>
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center gap-1 hover:text-[#009eb9] transition-colors"
                  aria-label={`Call ${store.name}`}
                >
                  <Phone className="w-3 h-3" aria-hidden="true" />
                  {store.phone}
                </a>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {store.services.map((s) => <ServiceBadge key={s} label={s} />)}
              </div>

              <div className="flex gap-2.5">
                <a
                  href={directionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#009eb9] text-white text-sm font-bold py-3 rounded-md hover:bg-[#007f95] transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  Get Directions
                </a>
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center gap-2 border border-neutral-200 text-[#184363] text-sm font-bold px-4 py-3 rounded-md hover:bg-neutral-50 transition-colors"
                  aria-label={`Call ${store.name}`}
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Call
                </a>
              </div>

              <Link
                href={`/branches/${store.slug}`}
                className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-neutral-500 hover:text-[#009eb9] transition-colors py-1"
              >
                View full branch details
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
