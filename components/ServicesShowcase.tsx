'use client';

export default function ServicesShowcase() {
  const services = [
    {
      title: 'Fill Your Script',
      description: 'Upload your prescription and collect from your nearest Sparkport store',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      cta: 'Upload Now',
      link: '/fill-script',
      gradient: 'from-[#184363] to-[#0d2942]',
    },
    {
      title: 'Get Rewarded',
      description: 'Join our loyalty program and save 10% on every visit',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
      cta: 'Join Today',
      link: '/get-rewarded',
      gradient: 'from-[#009eb9] to-[#007a8f]',
    },
    {
      title: 'Health Insurance',
      description: 'Get a personalized health insurance quote within 24 hours',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      cta: 'Get Quote',
      link: '/health-insurance',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      title: 'Health Care Services',
      description: 'Professional healthcare services from blood pressure checks to health screenings',
      image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80',
      cta: 'Learn More',
      link: '/health-care-services',
      gradient: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6 bg-neutral-50 mt-2">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-3">
            Our Services
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Comprehensive healthcare solutions tailored to your needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <a
              key={index}
              href={service.link}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-100"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url('${service.image}')` }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-linear-to-t ${service.gradient} opacity-90`} />
              
              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                
                {/* Title */}
                <h3 className="text-2xl font-extrabold! mb-3">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-white! opacity-90 mb-4 line-clamp-3">
                  {service.description}
                </p>
                
                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-2.5 rounded-lg font-semibold! text-sm transition-all w-fit">
                  {service.cta}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Info Strip */}
        <div className="mt-10 bg-white rounded-xl shadow-md border border-neutral-200 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#e8f5f7] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Need help choosing?</p>
                <p className="font-bold! text-[#184363]">Call us: 031 123 4567</p>
              </div>
            </div>
            <a
              href="/store-locator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#184363] text-white font-semibold! rounded-lg hover:bg-[#009eb9] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Find Your Nearest Store
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}