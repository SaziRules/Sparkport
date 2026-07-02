import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Scheduled Medicines — Understanding Regulated Medications | Sparkport Pharmacy',
  description:
    'Learn about Schedule 5 and Schedule 6 controlled substances, prescription requirements, repeat limits, and your responsibilities when submitting regulated medications at Sparkport Pharmacy.',
};

const schedules = [
  {
    label: 'S0–S2',
    title: 'Over-the-counter medicines',
    description: 'No prescription required.',
    highlight: null,
  },
  {
    label: 'S3',
    title: 'Pharmacist-only medicines',
    description: 'No prescription required but pharmacist supervision needed.',
    highlight: null,
  },
  {
    label: 'S4',
    title: 'Prescription-required medicines (standard)',
    description: 'Issued by a registered practitioner.',
    highlight: null,
  },
  {
    label: 'S5',
    title: 'Habit-forming substances',
    description:
      'Examples: codeine >10 mg, tramadol, diazepam, temazepam. Prescription required. Up to 5 repeats allowed within 6 months.',
    highlight: 'amber',
  },
  {
    label: 'S6',
    title: 'Potentially dangerous substances',
    description:
      'Examples: morphine, oxycodone, pethidine, methadone, ketamine. Prescription required. NO repeats — original retained by pharmacist.',
    highlight: 'red',
  },
  {
    label: 'S7/S8',
    title: 'Not dispensed in community pharmacies',
    description: 'Restricted to specialised facilities only.',
    highlight: null,
  },
];

const infoCards = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Bring the original',
    body: 'S5 and S6 medications require your original prescription. We cannot accept photographs, copies, or faxed prescriptions for these substances.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'S5 repeat limits',
    body: 'If your medication is a Schedule 5 substance, your prescription may be repeated up to 5 times within a 6-month period from the date of issue, as permitted by law.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: 'S6: no repeats',
    body: 'Schedule 6 medications cannot be repeated under any circumstances. The pharmacist is legally required to retain the original prescription after dispensing.',
  },
];

const regulatoryBodies = [
  {
    name: 'SAHPRA',
    fullName: 'South African Health Products Regulatory Authority',
    url: 'https://www.sahpra.org.za',
    displayUrl: 'sahpra.org.za',
    description: 'Regulates medicines, medical devices, and related matters in South Africa.',
  },
  {
    name: 'PCSA',
    fullName: 'Pharmacy Council of South Africa',
    url: 'https://www.pcsapharmacy.co.za',
    displayUrl: 'pcsapharmacy.co.za',
    description: 'Governs the practice of pharmacy and protects public health through professional standards.',
  },
  {
    name: 'HPCSA',
    fullName: 'Health Professions Council of South Africa',
    url: 'https://www.hpcsa.co.za',
    displayUrl: 'hpcsa.co.za',
    description: 'Registers and regulates healthcare practitioners.',
  },
  {
    name: 'National Department of Health',
    fullName: 'National Department of Health',
    url: 'https://www.health.gov.za',
    displayUrl: 'health.gov.za',
    description: 'Responsible for national health policy and the Medicines Act.',
  },
];

function highlightClass(highlight: string | null): string {
  if (highlight === 'amber') return 'border-amber-300 bg-amber-50';
  if (highlight === 'red') return 'border-red-300 bg-red-50';
  return 'border-neutral-200 bg-white';
}

export default function RegulatedMedicationPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#184363] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block text-[#009eb9] text-sm font-semibold uppercase tracking-widest mb-3">
            Scheduled Medicines
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Understanding Regulated Medications
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-2xl">
            What you need to know about S5 and S6 controlled substances at Sparkport Pharmacy
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-neutral-600 leading-relaxed text-base mb-12">
          South African medicines are classified into schedules under the Medicines and Related Substances Act 101 of
          1965. Schedule 5 and Schedule 6 substances are habit-forming or potentially dangerous and are subject to
          strict dispensing controls regulated by SAHPRA.
        </p>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#184363] mb-4">Schedule Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((s) => (
              <div
                key={s.label}
                className={`border rounded-2xl p-6 shadow-sm ${highlightClass(s.highlight)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      s.highlight === 'amber'
                        ? 'bg-amber-200 text-amber-900'
                        : s.highlight === 'red'
                        ? 'bg-red-200 text-red-900'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {s.label}
                  </span>
                  <p className="font-bold text-[#184363] text-sm">{s.title}</p>
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#184363] mb-4">What this means for your prescription</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {infoCards.map((card) => (
              <div key={card.title} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <div className="w-11 h-11 bg-[#009eb9]/10 rounded-xl flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <p className="font-bold text-[#184363] mb-2">{card.title}</p>
                <p className="text-neutral-600 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#184363] mb-4">Verification process</h2>
          <div className="space-y-4">
            {[
              'Our pharmacist reviews your submission and identifies any scheduled substances.',
              'We may contact your prescribing practitioner to verify authenticity.',
              'For S6 substances, we request that you present the original prescription in person or via secure courier before dispensing.',
              'Once dispensed, your S6 prescription is retained by us as required by law.',
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                <div className="w-9 h-9 bg-[#009eb9] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-neutral-600 leading-relaxed pt-1">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#184363] mb-4">Your responsibilities</h2>
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <p className="text-neutral-600 leading-relaxed mb-4">
              By submitting a prescription containing scheduled substances, you confirm:
            </p>
            <ul className="space-y-3">
              {[
                'The prescription was issued by a registered South African healthcare practitioner (registered with the HPCSA)',
                'You have not submitted the same prescription to another pharmacy for simultaneous dispensing',
                'For S6 medications, you understand the original must be surrendered to the pharmacist',
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-[#009eb9]/15 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-neutral-600 leading-relaxed text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#184363] mb-4">Regulatory bodies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regulatoryBodies.map((body) => (
              <div key={body.name} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#009eb9]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#009eb9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#184363] text-sm mb-0.5">{body.name}</p>
                    <p className="text-neutral-500 text-xs mb-1">{body.fullName}</p>
                    <a
                      href={body.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#009eb9] text-xs hover:underline font-medium"
                    >
                      {body.displayUrl}
                    </a>
                    <p className="text-neutral-600 text-sm leading-relaxed mt-2">{body.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-[#184363] rounded-2xl p-8 text-center">
          <p className="text-white font-bold text-xl mb-2">Not sure if your medication is scheduled?</p>
          <p className="text-white/70 text-sm mb-6">Our pharmacists are here to help. Contact us before submitting your prescription.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block px-7 py-3 bg-[#009eb9] text-white font-bold rounded-xl hover:bg-[#007fa0] transition-colors text-sm"
            >
              Contact Us
            </Link>
            <Link
              href="/terms-conditions"
              className="inline-block px-7 py-3 bg-transparent text-white/80 border border-white/30 font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              View Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
