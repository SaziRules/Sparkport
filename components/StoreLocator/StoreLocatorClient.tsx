'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, X, List, Map, MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORES, type Store } from '@/lib/stores';
import { isOpenNow, directionsUrl } from './time';
import StoreCard from './StoreCard';
import MobileBottomSheet from './MobileBottomSheet';

const StoreMap = dynamic(() => import('./StoreMap'), { ssr: false });

export default function StoreLocatorClient() {
  const [query, setQuery] = useState('');
  const defaultStore = STORES.find((s) => s.slug === 'overport') ?? STORES[0];
  const [selected, setSelected] = useState<Store | null>(defaultStore);
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list');
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const compute = () => {
      const m: Record<string, boolean> = {};
      STORES.forEach((s) => { m[s.id] = isOpenNow(s); });
      setOpenMap(m);
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STORES;
    return STORES.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.suburb.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q) ||
      s.area.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (store: Store) => {
    setSelected((prev) => (prev?.id === store.id ? null : store));
    const node = cardRefs.current[store.id];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const openCount = Object.values(openMap).filter(Boolean).length;

  const SearchBox = ({ placeholder = 'Search by suburb or store name…' }: { placeholder?: string }) => (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-9 pr-9 py-2.5 bg-neutral-50 border border-neutral-200 rounded-md text-sm text-[#184363] placeholder:text-neutral-400 focus:outline-none focus:border-[#009eb9] focus:ring-2 focus:ring-[#009eb9]/20 transition-colors duration-200"
        aria-label="Search stores"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#184363] transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-48 text-center px-6">
      <MapPin className="w-8 h-8 text-neutral-200 mb-3" aria-hidden="true" />
      <p className="text-sm text-neutral-500">No stores match your search.</p>
      <button
        onClick={() => setQuery('')}
        className="mt-2 text-xs text-[#009eb9] hover:text-[#007f95] transition-colors"
      >
        Clear search
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex h-[calc(100dvh-144px)]">
        <aside className="w-[400px] shrink-0 bg-white border-r border-neutral-200 flex flex-col overflow-hidden shadow-[0_8px_30px_-15px_rgba(24,67,99,0.15)]">
          <div className="px-5 pt-6 pb-5 border-b border-neutral-100 shrink-0">
            <div className="flex items-baseline gap-2 mb-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#184363]">Find a Store</h1>
              {openCount > 0 && (
                <span className="text-xs text-emerald-600 font-bold">{openCount} open now</span>
              )}
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              {filtered.length} location{filtered.length !== 1 ? 's' : ''} across KwaZulu-Natal
            </p>
            <SearchBox />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((store) => (
              <div key={store.id} ref={(el) => { cardRefs.current[store.id] = el; }}>
                <StoreCard
                  store={store}
                  active={selected?.id === store.id}
                  open={openMap[store.id] ?? false}
                  onClick={() => handleSelect(store)}
                />
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-neutral-100 shrink-0">
            <p className="text-[11px] text-neutral-400 text-center">
              More Sparkport locations coming soon across KwaZulu-Natal
            </p>
          </div>
        </aside>

        <div className="flex-1 relative z-0 isolate">
          <StoreMap stores={filtered} selected={selected} onSelect={handleSelect} />

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-8 left-8 z-[500] w-[360px] bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(24,67,99,0.25)]"
              >
                <div className="px-5 pt-4 pb-3">
                  <div className="flex items-start gap-2.5 mb-2">
                    <MapPin className="w-4 h-4 text-[#009eb9] shrink-0 mt-1" aria-hidden="true" />
                    <h3 className="text-base font-extrabold text-[#184363] leading-tight">{selected.name}</h3>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-neutral-600 leading-snug">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{selected.hours}</span>
                  </div>
                </div>
                <div className="border-t border-neutral-100 flex">
                  <a
                    href={`tel:${selected.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#009eb9] hover:bg-[#009eb9]/5 transition-colors"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    {selected.phone}
                  </a>
                  <div className="w-px bg-neutral-100" />
                  <a
                    href={directionsUrl(selected)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#009eb9] hover:bg-[#009eb9]/5 transition-colors"
                  >
                    <Navigation className="w-4 h-4" aria-hidden="true" />
                    Directions
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col bg-white h-[calc(100dvh-64px)] overflow-hidden">
        <div className="px-4 pt-5 pb-4 border-b border-neutral-100 shrink-0">
          <div className="flex items-baseline gap-2 mb-3">
            <h1 className="text-xl font-extrabold tracking-tight text-[#184363]">Find a Store</h1>
            {openCount > 0 && (
              <span className="text-xs text-emerald-600 font-bold">{openCount} open now</span>
            )}
          </div>
          <SearchBox placeholder="Search stores…" />

          <div className="flex gap-1 bg-neutral-100 p-1 rounded-md mt-3">
            {(['list', 'map'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMobileTab(tab);
                  if (tab === 'list') setSelected(null);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-sm text-xs font-bold transition-colors duration-200 ${
                  mobileTab === tab ? 'bg-[#009eb9] text-white shadow-sm' : 'text-neutral-500 hover:text-[#184363]'
                }`}
              >
                {tab === 'list'
                  ? <><List className="w-3.5 h-3.5" aria-hidden="true" />List</>
                  : <><Map className="w-3.5 h-3.5" aria-hidden="true" />Map</>}
              </button>
            ))}
          </div>
        </div>

        {mobileTab === 'list' && (
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? <EmptyState /> : filtered.map((store) => (
              <div key={store.id} ref={(el) => { cardRefs.current[store.id] = el; }}>
                <StoreCard
                  store={store}
                  active={selected?.id === store.id}
                  open={openMap[store.id] ?? false}
                  onClick={() => handleSelect(store)}
                />
              </div>
            ))}
            <div className="p-5 text-center">
              <p className="text-[11px] text-neutral-400">More locations coming soon across KwaZulu-Natal</p>
            </div>
          </div>
        )}

        {mobileTab === 'map' && (
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 z-0 isolate">
              <StoreMap
                stores={filtered}
                selected={selected}
                onSelect={(store) => setSelected((prev) => (prev?.id === store.id ? null : store))}
              />
            </div>
            <MobileBottomSheet
              store={selected}
              open={!!selected}
              onClose={() => setSelected(null)}
            />
          </div>
        )}
      </div>
    </>
  );
}
