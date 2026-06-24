'use client';

export default function ValuePropositionStrip() {
  const valueProps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Free Delivery',
      description: 'DBN <5km',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '100% Secure',
      description: 'Safe transactions',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Since 1983',
      description: '40+ years trusted',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: 'Nationwide Shipping',
      description: 'Delivered to your door',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Expert Care',
      description: 'Professional advice',
    },
  ];

  return (
    <section className="py-6 lg:py-8 px-4 lg:px-6 border-y border-neutral-100 bg-white">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group cursor-default select-none p-4 rounded-2xl hover:bg-[#009eb9]/5 transition-all duration-200"
            >
              {/* Icon container */}
              <div className="w-14 h-14 mb-3 rounded-2xl bg-[#009eb9]/10 flex items-center justify-center text-[#009eb9] group-hover:bg-[#009eb9] group-hover:text-white group-hover:scale-110 transition-all duration-200 shadow-sm">
                {prop.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm lg:text-base font-bold! text-[#184363] mb-0.5 group-hover:text-[#009eb9] transition-colors">
                {prop.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-neutral-500">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}