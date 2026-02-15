'use client';

import Link from 'next/link';

const SERVICES = [
  'Family Planning',
  'Baby Wellness',
  'Ear Syringing',
  'Pap Smear',
  'Prostate Screening (PSA – Finger Prick Test)',
  'HIV Screening',
  'Wound Care',
  'Blood Pressure Testing',
  'Blood Sugar Testing',
  'Cholesterol Testing',
  'Minor Injury Treatment',
  'Health Consultations',
];

const REVIEWS = [
  {
    text: "I can always rely on getting your essentials here at even the late hours of the night as they close at 10 pm most days",
    source: "Google Review"
  },
  {
    text: "Has everything you could look for in a pharmacy. Excellent business hours allowing for the late / weekend shop.",
    source: "Google Review"
  },
  {
    text: "Great hours, they were open after 9pm on a night I desperately needed medicine for a child.",
    source: "Google Review"
  },
  {
    text: "Absolutely friendly staff. The pharmacist staff are so helpful, fast and so efficient. Thanks guys keep up the great work",
    source: "Google Review"
  },
];

export default function HealthCareServicesPage() {
  return (
    <div className="relative min-h-screen">
      
      {/* Background image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/heart-health.jpg')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />

      {/* Page content */}
      <main className="relative py-12 lg:py-20 px-4 lg:px-6">
        <div className="max-w-full mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-extrabold! text-[#184363] mb-6">
              Health Care Services
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 max-w-4xl mx-auto mb-8">
              From routine check-ups to specialised treatments, our commitment to excellence ensures that you receive the highest quality of care at every step. Discover how Sparkport can be your trusted partner in health, offering advanced services tailored to meet your unique healthcare needs.
            </p>
            
            <Link
              href="/store-locator"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#184363] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Find a Store
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold text-[#009eb9] mb-2">50K+</div>
              <div className="text-lg font-bold text-[#184363]">Monthly Visits</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold text-[#009eb9] mb-2">45K+</div>
              <div className="text-lg font-bold text-[#184363]">Happy Customers</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold text-[#009eb9] mb-2">10+</div>
              <div className="text-lg font-bold text-[#184363]">Industry Awards</div>
            </div>
          </div>

          {/* Vitality Health Check */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Image */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"
                  alt="Vitality Health Check"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-6">
                  Vitality Health Check
                </h2>
                <p className="text-lg text-neutral-700 mb-6">
                  Book Now & Get your next Vitality Health Check with us. Take advantage of this exclusive opportunity to prioritise your well-being and access valuable rewards and benefits.
                </p>

                <div className="bg-linear-to-br from-[#184363]/10 to-[#009eb9]/10 rounded-xl p-6 mb-6">
                  <div className="text-2xl font-extrabold text-[#009eb9] mb-3">
                    EARN UP TO 22,500 VITALITY POINTS
                  </div>
                  <p className="text-neutral-700">
                    By doing your Vitality Health Check at any of our branches
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">Help manage existing health risks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">Potentially identify new health risks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-neutral-700">Recommend ways to improve your health and wellness</span>
                  </li>
                </ul>

                <a
                  href="https://sparkport.co.za/wp-content/uploads/vitality-health-check.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  Download Discovery Vitality Check PDF
                </a>
              </div>
            </div>
          </div>

          {/* Medxpress Network */}
          <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 lg:p-12 mb-8 text-white">
            <div className="max-w-4xl">
              <h2 className="text-3xl lg:text-4xl font-extrabold! mb-6">
                Looking for a Medxpress Network Pharmacy?
              </h2>
              <p className="text-lg mb-6 text-white! opacity-90">
                You can conveniently fill your chronic scripts at any of our stores, avoiding the <strong>20% DSP co-payment</strong>. This exclusive benefit saves you money while ensuring you have easy access to essential medications.
              </p>
              <p className="text-lg text-white! opacity-70">
                The Discovery Smart plan is now accepted at all our branches, ensuring you have access to our services wherever you are.
              </p>
            </div>
          </div>

          {/* Why Sparkport Pharmacy */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-12 mb-8">
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-6 text-center">
              Why Sparkport Pharmacy?
            </h2>
            <p className="text-xl text-neutral-700 text-center max-w-4xl mx-auto mb-12">
              Choosing Sparkport means choosing quality healthcare, advanced technology, skilled professionals, convenient access, and a patient-centered experience. We are committed to serving you and your family's healthcare needs with excellence and compassion.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold! text-[#184363] mb-2">Quality Healthcare</h3>
                <p className="text-sm text-neutral-600">Trusted excellence in every service</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold! text-[#184363] mb-2">Advanced Technology</h3>
                <p className="text-sm text-neutral-600">Modern equipment and systems</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold! text-[#184363] mb-2">Skilled Professionals</h3>
                <p className="text-sm text-neutral-600">Experienced healthcare team</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold! text-[#184363] mb-2">Convenient Access</h3>
                <p className="text-sm text-neutral-600">Extended hours and locations</p>
              </div>
            </div>
          </div>

          {/* GEMS Members Section */}
          <div className="bg-linear-to-br from-[#1a4a6e] to-[#184363] rounded-2xl overflow-hidden mb-8">
            <div className="flex flex-col lg:flex-row">
              
              {/* Content - LEFT */}
              <div className="flex-1 p-8 lg:p-12 text-white">
                <h2 className="text-3xl lg:text-4xl font-extrabold! mb-6">
                  ATTENTION ALL GEMS MEMBERS!
                </h2>
                
                <p className="text-lg mb-6 text-white! opacity-90">
                  Sparkport would like to extend a heartfelt <strong>THANK YOU</strong> for your continued support! Friendly Reminder, to complete your Health Risk Assessment at our branch! As a valued GEMS member, you qualify for the Screening Preventative Benefit, available from the Risk Fund. This benefit is designed to support your health and wellbeing, and we encourage you to take advantage of it!
                </p>

                <div className="inline-block px-6 py-3 bg-white text-[#184363] font-bold! rounded-xl mb-6">
                  Please visit our branch to complete your Health Risk Assessment today!
                </div>

                <p className="text-lg text-white! opacity-80">
                  Thank you for trusting Sparkport with your healthcare needs. We appreciate your loyalty and look forward to continuing to serve you!
                </p>
              </div>

              {/* Image - RIGHT */}
              <div className="lg:w-100 h-64 lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&q=90"
                  alt="Healthcare Professional"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Client Reviews */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 lg:p-12 mb-8">
            <h2 className="text-3xl font-extrabold! text-[#184363] mb-8 text-center">
              Client Reviews
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REVIEWS.map((review, idx) => (
                <div key={idx} className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-4 italic">"{review.text}"</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#009eb9]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                    <span className="text-sm font-semibold text-neutral-600">{review.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinic Services */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Content */}
              <div className="p-8 lg:p-12 order-2 lg:order-1">
                <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-6">
                  Clinic Services
                </h2>
                <p className="text-lg text-neutral-700 mb-8">
                  Our dedicated team of healthcare professionals is committed to providing top-notch care across a spectrum of medical needs.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((service, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-neutral-700 font-medium">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="relative h-64 lg:h-auto order-1 lg:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80"
                  alt="Clinic Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Generic Insurance */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Image */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
                  alt="Generic Insurance"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-6">
                  Affordable Coverage with Generic Insurance
                </h2>
                <p className="text-lg text-neutral-700 mb-8">
                  Our generic health insurance plans are designed to be cost-effective while providing essential coverage for medical expenses. You can access quality healthcare without worrying about exorbitant costs.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-[#009eb9]/10 rounded-lg">
                    <svg className="w-6 h-6 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-[#184363]">Main Member Coverage</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#009eb9]/10 rounded-lg">
                    <svg className="w-6 h-6 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="font-bold text-[#184363]">Adult Dependant Coverage</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#009eb9]/10 rounded-lg">
                    <svg className="w-6 h-6 text-[#009eb9]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-[#184363]">Child Dependant Coverage</span>
                  </div>
                </div>

                <a
                  href="https://sparkport.co.za/wp-content/uploads/Genric-Product-Brochure-2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#009eb9] text-white font-bold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  Download Brochure
                </a>
              </div>
            </div>
          </div>

          {/* Blister Packaging */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Content */}
              <div className="p-8 lg:p-12 order-2 lg:order-1">
                <div className="inline-block px-4 py-2 bg-[#009eb9] text-white font-bold rounded-lg mb-4">
                  R120 P/M
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-6">
                  Blister Packaging
                </h2>
                <p className="text-lg text-neutral-700 mb-8">
                  It's a pop-out system, meaning that once the blister seal is broken, it cannot be refilled. Greatly improves compliance. Blistering is foil, ensures correct temperature of medication, encourages compliance.
                </p>

                <p className="text-neutral-700 mb-8">
                  Dosage instructions and special precautions are attached to each blister, prevents referral to a dosage guide which becomes an administrative nightmare. Schedule 5 items are highlighted in Red.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                      </svg>
                    </div>
                    <div className="font-bold text-[#184363]">Right Pills</div>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="font-bold text-[#184363]">Right Dose</div>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="font-bold text-[#184363]">Right Time</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="relative h-64 lg:h-auto order-1 lg:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80"
                  alt="Blister Packaging"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}