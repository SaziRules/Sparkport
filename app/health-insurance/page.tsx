import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Insurance | Sparkport Pharmacy',
  description: 'Protect yourself and your family with comprehensive health insurance solutions, guided by the experts at Sparkport Pharmacy. Get a personalised quote via WhatsApp.',
};

const COVERAGE = [
  { title: 'Hospital Stays', description: 'Private and semi-private room coverage during admissions.' },
  { title: 'Surgical Procedures', description: 'Major and minor surgical operations covered.' },
  { title: 'Specialist Consultations', description: 'Direct access to a wide network of medical specialists.' },
  { title: 'Diagnostic Tests', description: 'X-rays, MRIs, blood tests, and other lab work.' },
  { title: 'Chronic Medication', description: 'Ongoing prescription coverage for chronic conditions.' },
  { title: 'Emergency Services', description: '24/7 emergency medical care included as standard.' },
];

const BENEFITS = [
  { title: 'Preventative Care', description: 'Annual check-ups, screenings, and wellness visits.' },
  { title: 'Maternity Coverage', description: 'Pre-natal and post-natal care for growing families.' },
  { title: 'Dental and Vision', description: 'Optional dental and optical coverage add-ons.' },
  { title: 'Mental Health Support', description: 'Counselling and therapy sessions covered.' },
  { title: 'Alternative Therapies', description: 'Physiotherapy, chiropractic, and related care.' },
  { title: 'Travel Insurance', description: 'Medical coverage while you travel domestically or abroad.' },
];

const FAQS = [
  {
    question: 'When does my coverage start?',
    answer: 'Your coverage typically begins on the first day of the month following your application approval. Some plans may have waiting periods for certain benefits.',
  },
  {
    question: 'Can I add family members to my plan?',
    answer: 'Yes. We offer comprehensive family coverage options. You can add your spouse, children, and other dependents to your plan at competitive rates.',
  },
  {
    question: 'What if I have pre-existing conditions?',
    answer: 'We offer coverage options for individuals with pre-existing conditions. Specific terms and waiting periods may apply. Contact us to discuss your situation.',
  },
  {
    question: 'How do I submit a claim?',
    answer: 'Claims can be submitted through the online portal, mobile app, or by contacting our customer service team. We will guide you through the simple process to ensure quick reimbursement.',
  },
];

const WA_ICON = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function HealthInsurancePage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
            Trusted Health Solutions
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Health Insurance
          </h1>
          <p className="text-white/75 text-lg lg:text-xl max-w-2xl leading-relaxed mb-8">
            Protect yourself and your loved ones with comprehensive health coverage. Our specialists at Sparkport Pharmacy help you find the right plan for your life and budget.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.msg.partners/P/SparkportSPO1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm"
            >
              {WA_ICON}
              Get a Quote via WhatsApp
            </a>
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Chat with a Specialist
            </a>
          </div>
        </div>
      </div>

      {/* Key facts */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {[
              { value: 'Comprehensive', label: 'Hospital Cover' },
              { value: 'Family', label: 'Coverage Options' },
              { value: 'Expert', label: 'Guidance' },
              { value: 'Personalised', label: 'Plans' },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 py-10 text-center">
                <p className="text-3xl lg:text-4xl font-extrabold text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Health Insurance */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-64 shrink-0 mb-8 lg:mb-0">
              <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Why It Matters</p>
              <h2 className="text-3xl font-extrabold text-[#184363] leading-tight">Protecting your health is protecting your future</h2>
            </div>
            <div className="lg:flex-1">
              <p className="text-neutral-600 leading-relaxed mb-10">
                Medical costs in South Africa continue to rise. A single unplanned hospital visit can set a family back by tens of thousands of rands. The right health insurance plan gives you access to quality care without the financial shock, so you can focus on recovery, not bills.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-7">
                {[
                  { title: 'Financial Protection', desc: 'Shield your savings from unexpected medical expenses and catastrophic events.' },
                  { title: 'Quality Access', desc: 'Reach a wide network of private hospitals, specialists, and facilities.' },
                  { title: 'Family Security', desc: 'Comprehensive cover options that include your spouse, children, and dependents.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <div className="w-px bg-[#009eb9] shrink-0 self-stretch" />
                    <div>
                      <p className="font-semibold text-[#184363] mb-1">{item.title}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-64 shrink-0 mb-10 lg:mb-0">
              <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">What You Get</p>
              <h2 className="text-3xl font-extrabold text-[#184363] leading-tight">What's covered</h2>
              <p className="text-neutral-500 text-sm mt-4 leading-relaxed">
                Core cover and optional benefits designed to meet you where you are in life.
              </p>
            </div>
            <div className="lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h3 className="font-bold text-[#184363] text-base mb-5 pb-2 border-b border-neutral-200">Core Coverage</h3>
                <ul className="space-y-5">
                  {COVERAGE.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <div className="w-px bg-[#009eb9] shrink-0 self-stretch" />
                      <div>
                        <p className="font-semibold text-[#184363] text-sm mb-0.5">{item.title}</p>
                        <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-[#184363] text-base mb-5 pb-2 border-b border-neutral-200">Additional Benefits</h3>
                <ul className="space-y-5">
                  {BENEFITS.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <div className="w-px bg-[#009eb9] shrink-0 self-stretch" />
                      <div>
                        <p className="font-semibold text-[#184363] text-sm mb-0.5">{item.title}</p>
                        <p className="text-neutral-500 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialist CTA band */}
      <section className="bg-[#184363] py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto lg:flex lg:items-center lg:gap-16">
          <div className="lg:flex-1 mb-8 lg:mb-0">
            <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Personalised Advice</p>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">Not sure which plan is right for you?</h2>
            <p className="text-white/70 leading-relaxed">
              Our health insurance specialists take the time to understand your situation and recommend a plan that fits your life, your family, and your budget. No jargon, no pressure.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href="https://api.whatsapp.com/message/73IDH2VXICILE1?autoload=1&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm"
            >
              {WA_ICON}
              Chat with a Specialist
            </a>
            <a
              href="https://www.msg.partners/P/SparkportSPO1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              {WA_ICON}
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-20 px-6 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Questions</p>
          <h2 className="text-3xl font-extrabold text-[#184363] mb-12">Frequently asked questions</h2>
          <dl className="space-y-0 divide-y divide-neutral-200">
            {FAQS.map((faq, i) => (
              <div key={i} className="py-7">
                <dt className="font-semibold text-[#184363] mb-2">{faq.question}</dt>
                <dd className="text-neutral-600 leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Take the First Step</p>
          <h2 className="text-3xl font-extrabold text-[#184363] mb-4">Ready to get protected?</h2>
          <p className="text-neutral-600 leading-relaxed mb-10 max-w-xl mx-auto">
            A personalised quote takes minutes. Speak to one of our Sparkport specialists today and find the cover that works for you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://www.msg.partners/P/SparkportSPO1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#20BA5A] transition-colors text-sm"
            >
              {WA_ICON}
              Get a Quote via WhatsApp
            </a>
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-[#184363] text-white font-semibold rounded-xl hover:bg-[#009eb9] transition-colors text-sm"
            >
              Send Us a Message
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
