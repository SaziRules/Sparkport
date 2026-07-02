import type { Metadata } from 'next';
import Link from 'next/link';
import RewardsRegistrationForm from '@/components/RewardsRegistrationForm';

export const metadata: Metadata = {
  title: 'Sparkport+ Rewards | Sparkport Pharmacy',
  description: 'Join Sparkport+ Rewards for free and unlock exclusive discounts on hundreds of health and wellness products every time you shop.',
};

const BENEFITS = [
  {
    title: 'Instant Discounts',
    description: 'Exclusive discounts on hundreds of products every time you shop, applied automatically at checkout.',
  },
  {
    title: 'Easy to Use',
    description: 'Provide your phone number in-store or your member number online. No card to carry.',
  },
  {
    title: 'Free to Join',
    description: 'Zero enrollment fees, zero monthly charges. Just savings from the moment you sign up.',
  },
  {
    title: 'Members-Only Offers',
    description: 'Access exclusive deals and early notification of sales events reserved for Sparkport+ members.',
  },
];

const HOW_IT_WORKS = [
  {
    title: 'Sign Up',
    description: 'Complete the quick registration form below with your name, phone number, and email. Takes under a minute.',
  },
  {
    title: 'Get Your Member Number',
    description: 'Receive your unique member number instantly via SMS. Save it in your contacts for easy access.',
  },
  {
    title: 'Start Saving',
    description: 'Give your phone number at any Sparkport till or enter your member number at online checkout to unlock discounts.',
  },
];

const FAQS = [
  {
    question: 'How do I use my rewards in-store?',
    answer: 'Simply provide your registered phone number at the checkout. Our system will automatically apply eligible discounts to your purchase.',
  },
  {
    question: 'How do I use my rewards online?',
    answer: 'Use the member number sent to you via SMS during online checkout to receive your discounts.',
  },
  {
    question: 'Which products are eligible for discounts?',
    answer: 'Discounts apply to selective items as determined by Sparkport Pharmacy. Look for the Rewards Eligible badge on qualifying products.',
  },
  {
    question: 'Can I combine rewards with other offers?',
    answer: 'Discounts cannot be used in conjunction with other promotional offers unless explicitly stated at the time of the promotion.',
  },
  {
    question: 'Is there an age restriction?',
    answer: 'Yes, you must be 18 years or older to participate in the Sparkport+ Rewards Program.',
  },
  {
    question: 'How many accounts can I have?',
    answer: 'Enrollment is limited to one account per phone number to ensure fair access for all customers.',
  },
];

export default function SparkportRewardsPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-20 lg:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
            100% Free · No Hidden Fees
          </span>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Sparkport+ Rewards
          </h1>
          <p className="text-white/75 text-lg lg:text-xl max-w-2xl leading-relaxed mb-8">
            Save more every time you shop. Join thousands of members already enjoying exclusive discounts on health and wellness products at every Sparkport branch.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#register"
              className="px-7 py-3.5 bg-white text-[#184363] font-bold rounded-xl hover:bg-white/90 transition-colors text-sm"
            >
              Join Free Today
            </a>
            <a
              href="#how-it-works"
              className="px-7 py-3.5 bg-white/10 border border-white/25 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              How It Works
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
            {[
              { value: 'Free', label: 'To Join' },
              { value: '1,000s', label: 'Of Eligible Products' },
              { value: 'Instant', label: 'Activation' },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 py-10 text-center">
                <p className="text-4xl lg:text-5xl font-extrabold text-[#009eb9]">{stat.value}</p>
                <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Join */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-64 shrink-0 mb-8 lg:mb-0">
              <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Member Benefits</p>
              <h2 className="text-3xl font-extrabold text-[#184363] leading-tight">Why join Sparkport+ Rewards?</h2>
            </div>
            <div className="lg:flex-1">
              <p className="text-neutral-600 leading-relaxed mb-10">
                The Sparkport+ Rewards Program is built for people who take their health seriously. Sign up once and save on every qualifying purchase, in-store or online, at any of our eight branches across KwaZulu-Natal.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.title} className="flex gap-4">
                    <div className="w-px bg-[#009eb9] shrink-0 self-stretch" />
                    <div>
                      <p className="font-semibold text-[#184363] mb-1">{benefit.title}</p>
                      <p className="text-neutral-500 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="lg:flex lg:gap-16 lg:items-start">
            <div className="lg:w-64 shrink-0 mb-10 lg:mb-0">
              <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
              <h2 className="text-3xl font-extrabold text-[#184363] leading-tight">How it works</h2>
            </div>
            <ol className="lg:flex-1 space-y-10">
              {HOW_IT_WORKS.map((step, i) => (
                <li key={i} className="flex gap-6">
                  <div className="shrink-0 pt-0.5">
                    <span className="text-5xl font-extrabold text-[#009eb9]/20 leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-bold text-[#184363] text-lg mb-1.5">{step.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register" className="py-16 lg:py-20 px-6 border-t border-neutral-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Join Now</p>
            <h2 className="text-3xl font-extrabold text-[#184363]">Sign up in under a minute</h2>
          </div>
          <RewardsRegistrationForm />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-16 lg:py-20 px-6">
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

      {/* Terms */}
      <section id="terms" className="py-16 lg:py-20 px-6 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#009eb9] text-xs font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h2 className="text-3xl font-extrabold text-[#184363] mb-10">Terms and Conditions</h2>

          <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700">

            <div className="p-5 bg-[#009eb9]/6 border-l-4 border-[#009eb9] rounded-r-xl">
              <p className="font-semibold text-[#184363] mb-1">Program Overview</p>
              <p className="text-sm leading-relaxed">
                The Sparkport+ Rewards Program offers discounts on selective items. In-store customers identify themselves with their registered phone number. Online customers receive a unique member number via SMS to use at checkout.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-2">Eligibility</h3>
              <p className="text-sm leading-relaxed">Only individuals 18 years of age or older are eligible to participate. Enrollment is free and limited to one account per phone number.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-3">How Discounts Work</h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Discounts apply only to eligible items as determined by Sparkport Pharmacy.',
                  'Not all products are eligible for discounts.',
                  'In-store customers must provide their registered phone number at checkout.',
                  'Online customers must use the member number sent via SMS.',
                  'Discounts are applied at the time of purchase and cannot be redeemed for cash or store credit.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Sparkport Pharmacy reserves the right to modify eligible items, discount amounts, or terminate the program at any time without prior notice.',
                  'Discounts cannot be applied to past purchases.',
                  'Discounts cannot be used in conjunction with other promotional offers unless explicitly stated.',
                  'Sparkport Pharmacy is not responsible for issues arising from incorrect phone or member numbers provided at checkout.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-2">Privacy and Security</h3>
              <p className="text-sm leading-relaxed">Personal information collected in connection with the rewards program, including phone numbers, will be used in accordance with the Sparkport Pharmacy Privacy Policy and POPIA. Online customers are responsible for the security of their SMS-received member number. Report any unauthorised use immediately.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-2">Limitation of Liability</h3>
              <p className="text-sm leading-relaxed">Sparkport Pharmacy will not be liable for any direct, indirect, incidental, or consequential damages arising from the Program or any rewards provided, including delays in processing transactions or expiration of discounted prices.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-2">Governing Law</h3>
              <p className="text-sm leading-relaxed">These terms are governed by the laws of the Republic of South Africa. Any disputes arising from the Program will be resolved in the courts of South Africa.</p>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#184363] mb-2">Contact</h3>
              <p className="text-sm leading-relaxed">For questions about the Program, contact our customer service team on <strong>031 207 1011</strong> or <Link href="/contact" className="text-[#009eb9] hover:underline">send us a message</Link>.</p>
            </div>

            <p className="text-xs text-neutral-400 border-t border-neutral-100 pt-6">
              By participating in the Sparkport+ Rewards Program, you acknowledge that you have read, understood, and agree to these terms and conditions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
