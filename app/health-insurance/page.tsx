'use client';

import Link from 'next/link';

export default function HealthInsurancePage() {
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
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-7xl font-extrabold! text-[#184363] mb-6">
              Health Insurance Solutions
            </h1>
            <p className="text-xl lg:text-2xl text-neutral-700 max-w-3xl mx-auto mb-8">
              Protect yourself and your loved ones with comprehensive health coverage tailored to your needs
            </p>
            
            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.msg.partners/P/SparkportSPO1"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Get a Quote via WhatsApp
              </a>
              
              <button className="px-8 py-4 bg-[#184363] text-white font-bold rounded-xl hover:bg-[#009eb9] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Download Brochure
              </button>
            </div>
          </div>

          {/* Why Health Insurance Matters */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-12 mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold! text-[#184363] mb-8 text-center">
              Why Health Insurance Matters
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Financial Protection</h3>
                <p className="text-neutral-600">
                  Protect yourself from unexpected medical expenses and focus on recovery, not bills
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Quality Healthcare Access</h3>
                <p className="text-neutral-600">
                  Access to a wide network of quality healthcare providers and facilities
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Family Coverage</h3>
                <p className="text-neutral-600">
                  Comprehensive coverage options for you and your entire family
                </p>
              </div>
            </div>
          </div>

          {/* Coverage Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* What's Covered */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
              <h3 className="text-2xl font-extrabold! text-[#184363] mb-6">What's Covered</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Hospital Stays</span>
                    <p className="text-sm text-neutral-600">Private and semi-private room coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Surgical Procedures</span>
                    <p className="text-sm text-neutral-600">Major and minor surgical operations</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Specialist Consultations</span>
                    <p className="text-sm text-neutral-600">Access to medical specialists</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Diagnostic Tests</span>
                    <p className="text-sm text-neutral-600">X-rays, MRIs, blood tests, and more</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Chronic Medication</span>
                    <p className="text-sm text-neutral-600">Coverage for ongoing prescriptions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Emergency Services</span>
                    <p className="text-sm text-neutral-600">24/7 emergency medical care</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Additional Benefits */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
              <h3 className="text-2xl font-extrabold! text-[#184363] mb-6">Additional Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Preventative Care</span>
                    <p className="text-sm text-neutral-600">Annual check-ups and screenings</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Maternity Coverage</span>
                    <p className="text-sm text-neutral-600">Pre and post-natal care</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Dental & Vision</span>
                    <p className="text-sm text-neutral-600">Optional dental and optical coverage</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Mental Health Support</span>
                    <p className="text-sm text-neutral-600">Counseling and therapy sessions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Alternative Therapies</span>
                    <p className="text-sm text-neutral-600">Physiotherapy, chiropractic care</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#009eb9] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-bold text-[#184363]">Travel Insurance</span>
                    <p className="text-sm text-neutral-600">Medical coverage while traveling</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* WhatsApp Help CTA */}
          <div className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 lg:p-12 mb-8 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-3xl font-extrabold! mb-3">Need Help Choosing a Plan?</h3>
                <p className="text-lg opacity-90 text-white!">
                  Our health insurance specialists are here to help you find the perfect coverage for your needs. 
                  Chat with us on WhatsApp for personalized assistance.
                </p>
              </div>
              <a
                href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-[#184363] font-bold rounded-xl hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 whitespace-nowrap"
              >
                <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Chat with a Specialist
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 lg:p-12 mb-8">
            <h2 className="text-3xl font-extrabold! text-[#184363] mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-6">
                <h4 className="text-lg font-bold! text-[#184363] mb-2">
                  When does my coverage start?
                </h4>
                <p className="text-neutral-600">
                  Your coverage typically begins on the first day of the month following your application approval. 
                  However, some plans may have waiting periods for certain benefits.
                </p>
              </div>

              <div className="border-b border-neutral-200 pb-6">
                <h4 className="text-lg font-bold! text-[#184363] mb-2">
                  Can I add family members to my plan?
                </h4>
                <p className="text-neutral-600">
                  Yes! We offer comprehensive family coverage options. You can add your spouse, children, and other 
                  dependents to your plan at competitive rates.
                </p>
              </div>

              <div className="border-b border-neutral-200 pb-6">
                <h4 className="text-lg font-bold! text-[#184363] mb-2">
                  What if I have pre-existing conditions?
                </h4>
                <p className="text-neutral-600">
                  We offer coverage options for individuals with pre-existing conditions. Specific terms and waiting 
                  periods may apply. Contact us to discuss your specific situation.
                </p>
              </div>

              <div className="pb-6">
                <h4 className="text-lg font-bold! text-[#184363] mb-2">
                  How do I submit a claim?
                </h4>
                <p className="text-neutral-600">
                  Claims can be submitted through our online portal, mobile app, or by contacting our customer service 
                  team. We'll guide you through the simple process to ensure quick reimbursement.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-4">
              Ready to Get Protected?
            </h2>
            <p className="text-xl text-neutral-700 mb-8 max-w-2xl mx-auto">
              Take the first step towards comprehensive health coverage. Get your personalized quote today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://www.msg.partners/P/SparkportSPO1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 text-lg"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Get Your Quote Now
              </a>
              
              <button className="px-10 py-5 bg-[#184363] text-white font-bold rounded-xl hover:bg-[#009eb9] transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3 text-lg">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Download Full Brochure
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}