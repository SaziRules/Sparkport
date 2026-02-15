'use client';

export default function PromotionalBanners() {
  return (
    <section className="py-12 lg:py-16 px-4 lg:px-6">
      <div className="max-w-full mx-auto space-y-6">
        
        {/* Large Hero Banner - Surgical/Medical Supplies */}
        <a
          href="/surgical-catalogue"
          className="block relative overflow-hidden rounded-3xl group h-75 lg:h-87.5 shadow-xl hover:shadow-2xl transition-shadow"
        >
          {/* Background Image - Pre-designed banner */}
          <img
            src="https://sparkport.co.za/wp-content/uploads/SURGICAL-BANNER.png"
            alt="Surgical Supplies Banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </a>

        {/* Two Side-by-Side Banners */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Flu Season Banner - Left */}
          <a
            href="/flu-protection-guide"
            className="relative overflow-hidden rounded-3xl group h-70 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80')"
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-800/90 to-slate-900/85" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8">
              <div className="mb-3">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold! uppercase tracking-wide">
                  Quick, Safe & Effective
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-extrabold! text-white mb-3 leading-tight">
                Protect Yourself
                <span className="block mt-1">This Flu Season</span>
              </h3>
              
              <div className="inline-flex items-center gap-2 text-white font-semibold! group-hover:gap-3 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Download Free Guide
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

          {/* Healthcare Services Banner - Right */}
          <a
            href="/health-care-services"
            className="relative overflow-hidden rounded-3xl group h-70 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80')"
              }}
            />
            
            {/* Gradient Overlay - Sparkport Teal */}
            <div className="absolute inset-0 bg-linear-to-br from-[#009eb9]/90 to-[#007a8f]/90" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-8">
              <div className="mb-3">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold! uppercase tracking-wide">
                  Your Health, Our Priority
                </span>
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-extrabold! text-white mb-3 leading-tight">
                Comprehensive Care
                <span className="block mt-1">Close to Home</span>
              </h3>
              
              <div className="inline-flex items-center gap-2 text-white font-semibold! group-hover:gap-3 transition-all">
                Learn More About Our Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>

        </div>

      </div>
    </section>
  );
}