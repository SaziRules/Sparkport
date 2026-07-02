import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { STORES, getStoreBySlug } from '@/lib/stores';
import OpenIndicator from './OpenIndicator';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return STORES.map((store) => ({ slug: store.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) return {};
  return {
    title: `${store.name} | Sparkport Pharmacy ${store.area}`,
    description: store.content.seoWriteUp.slice(0, 160),
    keywords: `Sparkport pharmacy, ${store.area} pharmacy, pharmacy near me, ${store.area}, KwaZulu-Natal pharmacy, prescription dispensing ${store.area}`,
  };
}

function parseHourRows(hours: string): { label: string; time: string }[] {
  return hours.split('•').map((segment) => {
    const trimmed = segment.trim();
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) return { label: trimmed, time: '' };
    return {
      label: trimmed.slice(0, colonIdx).trim(),
      time: trimmed.slice(colonIdx + 1).trim(),
    };
  });
}

export default async function BranchPage({ params }: Props) {
  const { slug } = await params;
  const store = getStoreBySlug(slug);
  if (!store) notFound();

  const { lat, lng } = store.coordinates;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(store.address)}`;
  const waPhone = store.phone.replace(/\D/g, '').replace(/^0/, '27');
  const hourRows = parseHourRows(store.hours);
  const shortName = store.name.replace('Sparkport ', '');

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row">

        {/* Left panel — scrollable content */}
        <div className="w-full lg:w-1/2">

          {/* Branch hero strip */}
          <div className="bg-[#184363] px-6 py-10">
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Branches
            </Link>
            <h1 className="text-3xl font-extrabold text-white mb-1">{store.name}</h1>
            <p className="text-white/70 text-sm mb-3">{store.address}</p>
            <span className="inline-block bg-[#009eb9] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {store.area}
            </span>
          </div>

          <div className="px-6 py-8 space-y-8">

            {/* Hours */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-4">Trading Hours</h2>
              <div className="bg-neutral-50 rounded-2xl border border-neutral-200 divide-y divide-neutral-100">
                {hourRows.map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <span className="text-neutral-700 text-sm font-medium">{row.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600 text-sm">{row.time || 'Closed'}</span>
                      {i === 0 && <OpenIndicator hours={store.hours} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-4">Contact</h2>
              <div className="space-y-3">
                <a
                  href={`tel:${store.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">{store.phone}</span>
                </a>
                <a
                  href={`mailto:${store.email}`}
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{store.email}</span>
                </a>
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-700 hover:text-[#009eb9] transition-colors"
                >
                  <svg className="w-5 h-5 text-[#009eb9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="text-sm">Get Directions</span>
                </a>
              </div>
            </section>

            {/* Getting Here */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-3">Getting Here</h2>
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
                <p className="text-neutral-600 text-sm leading-relaxed">{store.content.gettingHere}</p>
              </div>
            </section>

            {/* Mobile map */}
            <div className="block lg:hidden rounded-2xl overflow-hidden border border-neutral-200">
              <iframe
                src={mapSrc}
                title={`Map of ${store.name}`}
                className="w-full border-0"
                style={{ height: '60vh' }}
                loading="lazy"
              />
            </div>

            {/* About This Branch */}
            <section>
              <h2 className="text-lg font-bold text-[#184363] mb-3">About {shortName}</h2>
              <div className="space-y-4">
                {store.content.seoWriteUp.split('\n\n').map((para, i) => (
                  <p key={i} className="text-neutral-600 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </section>

            {/* CTA strip */}
            <div className="flex flex-col sm:flex-row gap-3 pb-4">
              <Link
                href="/fill-script"
                className="flex-1 text-center px-6 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007fa0] transition-colors text-sm"
              >
                Fill Your Script
              </Link>
              <Link
                href="/contact"
                className="flex-1 text-center px-6 py-3 bg-transparent text-[#184363] border-2 border-[#184363] font-semibold rounded-xl hover:bg-[#184363] hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </div>

        {/* Right panel — sticky map (desktop only) */}
        <div className="hidden lg:block lg:w-1/2 sticky top-0 h-screen">
          <iframe
            src={mapSrc}
            title={`Map of ${store.name}`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

      </div>
    </div>
  );
}
