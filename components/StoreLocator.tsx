'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Store data type (same as main version)
interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  entrance?: string;
  parking?: string;
}

// Sample store data
const STORES: Store[] = [
  {
    id: '1',
    name: 'Sparkport Gateway',
    address: 'Shop 12, Gateway Shopping Centre, Umhlanga',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    postalCode: '4320',
    phone: '031 566 1234',
    coordinates: { lat: -29.7303, lng: 31.0672 },
    hours: {
      weekday: '08:00 - 20:00',
      saturday: '08:00 - 18:00',
      sunday: '09:00 - 15:00',
    },
    services: ['Prescriptions', 'Medical Aid', 'Vaccinations', 'Health Screening'],
    entrance: 'Main entrance, Level 1',
    parking: 'Free parking for 1 hour',
  },
  // Add more stores here
];

export default function StoreLocatorSimple() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [expandedStore, setExpandedStore] = useState<string | null>(null);

  // Filter stores
  const filteredStores = useMemo(() => {
    if (!searchQuery) return STORES;

    const query = searchQuery.toLowerCase();
    return STORES.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleGetDirections = (store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getStaticMapUrl = (store: Store) => {
    // Using OpenStreetMap static map (free, no API key needed)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${store.coordinates.lng - 0.01},${store.coordinates.lat - 0.01},${store.coordinates.lng + 0.01},${store.coordinates.lat + 0.01}&layer=mapnik&marker=${store.coordinates.lat},${store.coordinates.lng}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-neutral-200 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#184363] mb-2">Store Locator</h1>
          <p className="text-neutral-600">Find your nearest Sparkport pharmacy</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a store by name or location"
              className="w-full pl-12 pr-4 py-4 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600">
            {filteredStores.length} {filteredStores.length === 1 ? 'store' : 'stores'} found
          </p>
        </div>

        {/* Store Grid */}
        {filteredStores.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <svg
              className="w-16 h-16 text-neutral-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-neutral-500 text-lg">No stores found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-[#009eb9] hover:text-[#184363] font-semibold"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Map Preview */}
                <div className="h-48 bg-neutral-200 relative">
                  <iframe
                    src={getStaticMapUrl(store)}
                    className="w-full h-full border-0"
                    title={`Map of ${store.name}`}
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleGetDirections(store)}
                      className="bg-white px-4 py-2 rounded-lg shadow-md hover:bg-neutral-50 transition-colors flex items-center gap-2 font-semibold text-sm"
                    >
                      <svg
                        className="w-4 h-4 text-[#009eb9]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      Directions
                    </button>
                  </div>
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-extrabold text-[#184363] mb-3">{store.name}</h3>
                  
                  <div className="space-y-3 mb-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-neutral-600">{store.address}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-[#009eb9] shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a
                        href={`tel:${store.phone}`}
                        className="text-[#009eb9] hover:text-[#184363] font-semibold"
                      >
                        {store.phone}
                      </a>
                    </div>

                    {/* Entrance */}
                    {store.entrance && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-neutral-700 mb-0.5">Entrance</p>
                          <p className="text-sm text-neutral-600">{store.entrance}</p>
                        </div>
                      </div>
                    )}

                    {/* Parking */}
                    {store.parking && (
                      <div className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#009eb9] shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-neutral-700 mb-0.5">Parking</p>
                          <p className="text-sm text-neutral-600">{store.parking}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expandable Details */}
                  <button
                    onClick={() => setExpandedStore(expandedStore === store.id ? null : store.id)}
                    className="w-full flex items-center justify-between py-3 border-t border-neutral-200 text-[#009eb9] hover:text-[#184363] font-semibold transition-colors"
                  >
                    <span>View more details</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        expandedStore === store.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {expandedStore === store.id && (
                    <div className="pt-4 space-y-4 border-t border-neutral-200">
                      {/* Hours */}
                      <div>
                        <p className="text-sm font-bold text-neutral-700 mb-2">Trading Hours</p>
                        <div className="space-y-1 text-sm text-neutral-600">
                          <div className="flex justify-between">
                            <span>Monday - Friday</span>
                            <span className="font-semibold">{store.hours.weekday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Saturday</span>
                            <span className="font-semibold">{store.hours.saturday}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sunday</span>
                            <span className="font-semibold">{store.hours.sunday}</span>
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      <div>
                        <p className="text-sm font-bold text-neutral-700 mb-2">Services</p>
                        <div className="flex flex-wrap gap-2">
                          {store.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-[#009eb9]/10 text-[#009eb9] text-xs font-semibold rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}