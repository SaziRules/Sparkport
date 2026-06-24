'use client';

import { useState } from 'react';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const STORES: Store[] = [
  {
    id: '1',
    name: 'Sparkport Quality Street',
    address: '315 Quality Street, Jacobs, Durban, 4052',
    phone: '(031) 461-3760',
    email: 'scriptsqs@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-5:30PM • Fri: 9AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8854, lng: 30.9838 },
  },
  {
    id: '2',
    name: 'Sparkport Musgrave',
    address: '77 Musgrave Rd, Musgrave, Berea, 4001',
    phone: '(031) 201-8121',
    email: 'clinic.musgrave@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-6PM • Fri: 8AM-6PM • Sat: 8AM-2PM • Sun: Closed',
    coordinates: { lat: -29.8389, lng: 30.9987 },
  },
  {
    id: '3',
    name: 'Sparkport Warner Beach',
    address: '125 Kingsway St, Warner Beach, Kingsburgh, 4126',
    phone: '(031) 916-6550',
    email: 'warnerbeach@sparkport.co.za',
    hours: 'Mon-Thu: 8:30AM-5:30PM • Fri: 8:30AM-5:30PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -30.0850, lng: 30.8567 },
  },
  {
    id: '4',
    name: 'Sparkport Chatsworth',
    address: 'Shop 3, Ayesha Centre, 50 Tranquil St, Chatsworth, 4092',
    phone: '(031) 401-0010',
    email: 'chatsdispensary@sparkport.co.za',
    hours: 'Mon-Sun: 9AM-8PM • Fri: 9AM-6PM',
    coordinates: { lat: -29.9197, lng: 30.8970 },
  },
  {
    id: '5',
    name: 'Sparkport Umlazi',
    address: 'Shop 4 Ithala Centre, Existing Main Road, Umlazi, 4031',
    phone: '(031) 906-8118',
    email: 'umlazidisp@sparkport.co.za',
    hours: 'Mon-Thu: 9AM-6PM • Fri: 9AM-5PM • Sat: 9AM-2PM • Sun: Closed',
    coordinates: { lat: -29.9589, lng: 30.8841 },
  },
  {
    id: '6',
    name: 'Sparkport Pietermaritzburg',
    address: '553 Dr Chota Motala Rd, Raisethorpe, PMB, 3201',
    phone: '(033) 397-0099',
    email: 'dispensary@sparkport.net',
    hours: 'Mon-Sat: 9AM-8PM • Sun: 10AM-6PM',
    coordinates: { lat: -29.6186, lng: 30.3802 },
  },
  {
    id: '7',
    name: 'Sparkport Overport',
    address: 'Corner Moses Kotane & Randles Road, Durban, 4091',
    phone: '(031) 207-1011',
    email: 'dispensary@sparkport.co.za',
    hours: 'Mon-Thu: 8AM-10PM • Fri: 8AM-10PM • Sat: 8AM-10PM • Sun: 9AM-10PM',
    coordinates: { lat: -29.8765, lng: 31.0131 },
  },
  {
    id: '8',
    name: 'Sparkport City Centre',
    address: 'Corner Yusuf Dadoo & Anton Lembede St, Durban, 4001',
    phone: '(031) 304-9767',
    email: 'wholesale@sparkport.co.za',
    hours: 'Mon-Thu: 7:30AM-7:30PM • Fri: 7:30AM-7:30PM • Sat: 7:30AM-7PM • Sun: 9AM-4PM',
    coordinates: { lat: -29.8587, lng: 31.0295 },
  },
];

export default function StoreLocator() {
  const [selectedStore, setSelectedStore] = useState<Store>(STORES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = STORES.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMapUrl = (store: Store) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${store.coordinates.lng - 0.02},${store.coordinates.lat - 0.02},${store.coordinates.lng + 0.02},${store.coordinates.lat + 0.02}&layer=mapnik&marker=${store.coordinates.lat},${store.coordinates.lng}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-4 lg:py-8 px-2 lg:px-4">
      <div className="w-full max-w-full lg:max-w-275">
        
        {/* Main White Container */}
        <div className="bg-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl overflow-hidden mt-0 lg:-mt-[5%]">
          
          {/* Header */}
          <div className="px-6 lg:px-8 pt-7 pb-5">
            <h1 className="text-2xl lg:text-3xl font-extrabold! text-[#184363] mb-1">Find a Sparkport Store</h1>
            <p className="text-sm text-neutral-500">{STORES.length} locations across KZN</p>
          </div>

          {/* Search Bar */}
          <div className="px-6 lg:px-8 pb-5 border-b border-neutral-100">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by store name or area..."
                className="w-full pl-10 pr-4 py-3 text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
              />
            </div>
          </div>

          {/* Split Layout: LEFT = Store List, RIGHT = Map - EXACTLY 50/50 on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-100 lg:h-125">
            
            {/* LEFT: Scrollable Store List */}
            <div 
              className="bg-white overflow-y-auto"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              
              {filteredStores.length === 0 && (
                <div className="p-8 text-center text-sm text-neutral-400">
                  No stores match your search.
                </div>
              )}
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  className={`px-5 lg:px-6 py-4 lg:py-5 border-b border-neutral-100 cursor-pointer transition-all duration-150 border-l-[3px] ${
                    selectedStore.id === store.id
                      ? 'border-l-[#009eb9] bg-[#009eb9]/5'
                      : 'border-l-transparent hover:bg-neutral-50'
                  }`}
                  onClick={() => setSelectedStore(store)}
                >
                  {/* Store Name */}
                  <h3 className={`text-sm font-extrabold! mb-2 transition-colors ${
                    selectedStore.id === store.id ? 'text-[#009eb9]' : 'text-[#184363]'
                  }`}>
                    {store.name}
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-3">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {store.address}
                    </p>
                  </div>

                  {/* Hours (compact) */}
                  <div className="flex items-start gap-2 mb-3">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-neutral-500 leading-relaxed">{store.hours}</p>
                  </div>

                  {/* Phone & Email */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${store.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 text-xs text-[#009eb9] hover:text-[#184363] font-semibold! transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {store.phone}
                    </a>
                    <span className="text-neutral-200">|</span>
                    <a
                      href={`mailto:${store.email}`}
                      className="flex items-center gap-1.5 text-xs text-[#009eb9] hover:text-[#184363] font-semibold! transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Map - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block relative bg-neutral-100">
              <iframe
                key={selectedStore.id}
                src={getMapUrl(selectedStore)}
                className="w-full h-full"
                title="Store Map"
                style={{ border: 0 }}
              />

              {/* Map Info Card */}
              <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 bg-white rounded-2xl shadow-2xl overflow-hidden w-72 lg:w-80">
                <div className="h-1 bg-[#009eb9]" />
                <div className="p-4 lg:p-5">
                  <h3 className="text-base font-extrabold! text-[#184363] mb-3 leading-snug">
                    {selectedStore.name}
                  </h3>

                  <div className="flex items-start gap-2 mb-2">
                    <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-neutral-600 leading-relaxed">{selectedStore.hours}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-neutral-100">
                    <a
                      href={`tel:${selectedStore.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-1.5 text-xs font-semibold! text-[#009eb9] hover:text-[#184363] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {selectedStore.phone}
                    </a>
                    <span className="text-neutral-200">|</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedStore.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold! text-[#009eb9] hover:text-[#184363] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}