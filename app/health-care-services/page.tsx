import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Health Care Services | Sparkport Pharmacy',
  description: 'From Vitality Health Checks to chronic disease management, clinic services, and blister packaging — discover the full range of healthcare services at Sparkport Pharmacy.',
};

const SERVICES = [
  'Family Planning',
  'Baby Wellness',
  'Ear Syringing',
  'Pap Smear',
  'Prostate Screening (PSA Finger Prick Test)',
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
    source: "Google Review",
  },
  {
    text: "Has everything you could look for in a pharmacy. Excellent business hours allowing for the late and weekend shop.",
    source: "Google Review",
  },
  {
    text: "Great hours, they were open after 9pm on a night I desperately needed medicine for a child.",
    source: "Google Review",
  },
  {
    text: "Absolutely friendly staff. The pharmacist staff are so helpful, fast and so efficient. Thanks guys keep up the great work.",
    source: "Google Review",
  },
];

export default function HealthCareServicesPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Home / Health Care Services</p>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Healthcare you can<br className="hidden lg:block" /> count on
          </h1>
          <p className="text-white/75 text-lg lg:text-xl max-w-2xl leading-relaxed mb-8">
            From routine check-ups to specialised treatments, Sparkport Pharmacy is your trusted partner in health across KwaZulu-Natal.
          </p>
          <Link
            href="/store-locator"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-[#184363] font-bold rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Find a Branch
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {[
              { value: '50K+', label: 'Monthly Visits' },
              { value: '45K+', label: 'Happy Customers' },
              { value: '8', label: 'Branches in KZN' },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 py-10 text-center">
                <p className="text-4xl lg:text-5xl font-extrabold text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vitality Health Check */}
      <section className="flex flex-col lg:flex-row min-h-[520px]">
        <div className="relative lg:w-1/2 h-72 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=85"
            alt="Vitality Health Check"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:w-1/2 px-8 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Discovery Vitality</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#184363] mb-4 leading-tight">Vitality Health Check</h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Book your next Vitality Health Check at any Sparkport branch. Earn up to 22,500 Vitality Points while taking control of your health. Our trained pharmacists assess your biometrics, identify risk factors, and recommend personalised wellness improvements.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Help manage existing health risks',
              'Potentially identify new health risks early',
              'Receive personalised wellness recommendations',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-neutral-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] shrink-0 mt-2" />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <a
              href="https://sparkport.co.za/wp-content/uploads/vitality-health-check.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#007fa0] transition-colors text-sm"
            >
              Download PDF
            </a>
            <Link href="/store-locator" className="text-[#009eb9] hover:text-[#184363] text-sm font-semibold transition-colors">
              Find a branch
            </Link>
          </div>
        </div>
      </section>

      {/* Medxpress */}
      <section className="bg-[#184363] py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto lg:flex lg:items-center lg:gap-16">
          <div className="lg:flex-1 mb-8 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Discovery Health</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">Medxpress Network Pharmacy</h2>
            <p className="text-white/75 leading-relaxed">
              Fill your chronic scripts at any of our stores and avoid the 20% DSP co-payment. The Discovery Smart plan is accepted at all our branches, giving you convenient access to essential medications across KwaZulu-Natal without paying more than you should.
            </p>
          </div>
          <div className="lg:w-72 bg-white/8 rounded-2xl p-8 text-center border border-white/10">
            <p className="text-5xl font-extrabold text-[#009eb9] mb-2">20%</p>
            <p className="text-white/60 text-sm uppercase tracking-widest font-semibold">Co-payment saved</p>
          </div>
        </div>
      </section>

      {/* Clinic Services */}
      <section className="flex flex-col lg:flex-row-reverse min-h-[520px]">
        <div className="relative lg:w-1/2 h-72 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=85"
            alt="Clinic Services"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:w-1/2 px-8 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">In-Pharmacy Clinic</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#184363] mb-4 leading-tight">Clinic Services</h2>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Our dedicated team of healthcare professionals provides top-notch care across a broad spectrum of medical needs, all available without an appointment at most branches.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {SERVICES.map((service) => (
              <li key={service} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] shrink-0 mt-1.5" />
                {service}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GEMS Members */}
      <section className="bg-[#009eb9]/8 border-t border-b border-[#009eb9]/15 py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto lg:flex lg:items-start lg:gap-16">
          <div className="lg:w-64 shrink-0 mb-6 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-2">Government Employees</p>
            <h2 className="text-2xl font-extrabold text-[#184363] leading-tight">GEMS Members</h2>
          </div>
          <div className="lg:flex-1 space-y-4 text-neutral-700 leading-relaxed">
            <p>
              Sparkport extends a heartfelt thank you to all GEMS members for your continued support. As a valued GEMS member, you qualify for the Screening Preventative Benefit available from the Risk Fund.
            </p>
            <p>
              Please visit your nearest Sparkport branch to complete your Health Risk Assessment and take full advantage of the benefits available to you.
            </p>
            <Link href="/store-locator" className="inline-flex items-center gap-2 mt-2 text-[#009eb9] font-semibold text-sm hover:text-[#184363] transition-colors">
              Find your nearest branch
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Generic Insurance */}
      <section className="flex flex-col lg:flex-row min-h-[520px]">
        <div className="relative lg:w-1/2 h-72 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&q=85"
            alt="Generic Health Insurance"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="lg:w-1/2 px-8 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Affordable Coverage</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#184363] mb-4 leading-tight">Generic Insurance</h2>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Our generic health insurance plans deliver essential coverage without the heavy price tag, giving you access to quality healthcare regardless of your budget.
          </p>
          <ul className="space-y-3 mb-8">
            {['Main Member Coverage', 'Adult Dependant Coverage', 'Child Dependant Coverage'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#009eb9] shrink-0" />
                <span className="text-neutral-700 text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://sparkport.co.za/wp-content/uploads/Genric-Product-Brochure-2024.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#007fa0] transition-colors text-sm self-start"
          >
            Download Brochure
          </a>
        </div>
      </section>

      {/* Blister Packaging */}
      <section className="flex flex-col lg:flex-row-reverse min-h-[520px] bg-neutral-50">
        <div className="relative lg:w-1/2 h-72 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&q=85"
            alt="Blister Packaging"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="lg:w-1/2 px-8 lg:px-16 py-14 lg:py-20 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 bg-[#009eb9] text-white text-xs font-bold rounded-md">R120 / month</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#184363] mb-4 leading-tight">Blister Packaging</h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            A tamper-evident pop-out system that greatly improves medication compliance. Once the blister seal is broken it cannot be refilled, and the foil ensures the correct storage temperature is maintained throughout.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Dosage instructions and special precautions are printed on each blister, removing the need for a separate dosage guide. Schedule 5 and 6 items are colour-coded for quick identification.
          </p>
          <div className="flex gap-8">
            {['Right Pills', 'Right Dose', 'Right Time'].map((item) => (
              <div key={item} className="border-l-2 border-[#009eb9] pl-3">
                <p className="font-semibold text-[#184363] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sparkport */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-64 shrink-0 mb-8 lg:mb-0">
              <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Our Promise</p>
              <h2 className="text-3xl font-extrabold text-[#184363] leading-tight">Why Sparkport Pharmacy?</h2>
            </div>
            <div className="lg:flex-1">
              <p className="text-neutral-600 leading-relaxed mb-10">
                Choosing Sparkport means choosing quality healthcare, advanced technology, skilled professionals, and a patient-centred experience. We are committed to serving you and your family with excellence and compassion across all eight of our KwaZulu-Natal branches.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Quality Healthcare', body: 'Trusted excellence in every prescription and consultation.' },
                  { title: 'Advanced Technology', body: 'Modern dispensary systems and equipment at every branch.' },
                  { title: 'Skilled Professionals', body: 'Registered pharmacists and clinical staff who care.' },
                  { title: 'Convenient Access', body: 'Extended trading hours and eight branches across KZN.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-px bg-[#009eb9] shrink-0 self-stretch" />
                    <div>
                      <p className="font-semibold text-[#184363] mb-1">{item.title}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#184363] py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3 text-center">Google Reviews</p>
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">What our customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS.map((review, i) => (
              <blockquote key={i} className="border-l-2 border-[#009eb9] pl-6">
                <p className="text-white/80 leading-relaxed italic text-base mb-4">&ldquo;{review.text}&rdquo;</p>
                <footer className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#009eb9]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                  <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">{review.source}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-16 px-6 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-extrabold text-[#184363] mb-1">Ready to take control of your health?</h3>
            <p className="text-neutral-500 text-sm">Visit any of our eight branches across KwaZulu-Natal.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/store-locator"
              className="px-6 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007fa0] transition-colors text-sm"
            >
              Find a Branch
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-[#184363] text-[#184363] font-semibold rounded-xl hover:bg-[#184363] hover:text-white transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
