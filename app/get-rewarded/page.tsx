'use client';

import RewardsRegistrationForm from '@/components/RewardsRegistrationForm';

const BENEFITS = [
  {
    title: 'Instant Discounts',
    description: 'Get exclusive discounts on hundreds of products every time you shop',
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Easy to Use',
    description: 'Simply provide your phone number at checkout - no cards, no hassle',
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    ),
  },
  {
    title: 'Free to Join',
    description: 'Zero enrollment fees, zero monthly charges - just savings',
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    title: 'Exclusive Offers',
    description: 'Access members-only deals and early access to sales events',
    icon: (
      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Sign Up',
    description: 'Complete our quick registration form with your details, and you\'re in!',
  },
  {
    step: '2',
    title: 'Get Your Number',
    description: 'Receive your member number instantly via SMS, ready to use in-store and online',
  },
  {
    step: '3',
    title: 'Start Saving',
    description: 'Use your phone number in-store or member number online to unlock discounts',
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
    question: 'What products are eligible for discounts?',
    answer: 'Discounts apply to selective items as determined by Sparkport Pharmacy. Look for the "Rewards Eligible" badge on qualifying products.',
  },
  {
    question: 'Can I combine rewards with other offers?',
    answer: 'Discounts cannot be used in conjunction with other promotional offers unless explicitly stated.',
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
          <div className="relative -mx-4 lg:-mx-6 mb-16 overflow-hidden rounded-none lg:rounded-2xl">
            {/* Hero Background */}
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=90"
                alt="Sparkport Rewards Hero"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-[#184363]/95 to-[#009eb9]/65" />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center py-20 lg:py-32 px-4 lg:px-6">
              <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm text-white font-bold! rounded-full mb-6">
                100% Free • No Hidden Fees
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold! text-white mb-6">
                Sparkport+ Rewards
              </h1>
              <p className="text-xl lg:text-2xl text-white/90! max-w-4xl mx-auto mb-8">
                Save more every time you shop. Join thousands of members already enjoying exclusive discounts on their favorite health and wellness products.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                
                <a  href="#register"
                  className="px-8 py-4 bg-white text-[#184363] font-bold! rounded-xl hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Join Free Today
                </a>
                
                <a  href="#how-it-works"
                  className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold! rounded-xl hover:bg-white/30 transition-all shadow-lg border-2 border-white/30"
                >
                  How It Works
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold! text-[#009eb9] mb-2">FREE</div>
              <div className="text-lg font-bold! text-[#184363]">Enrollment</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold! text-[#009eb9] mb-2">1000s</div>
              <div className="text-lg font-bold! text-[#184363]">Of Eligible Products</div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
              <div className="text-5xl font-extrabold! text-[#009eb9] mb-2">INSTANT</div>
              <div className="text-lg font-bold! text-[#184363]">Activation</div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold! text-[#184363] text-center mb-12">
              Why Join Sparkport+ Rewards?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((benefit, idx) => (
                <div key={idx} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 text-center hover:shadow-2xl transition-all">
                  <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold! text-[#184363] mb-3">{benefit.title}</h3>
                  <p className="text-neutral-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div id="how-it-works" className="bg-linear-to-br from-[#184363] to-[#009eb9] rounded-2xl p-8 lg:p-12 mb-16 text-white">
            <h2 className="text-4xl font-extrabold! text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-white text-[#184363] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold!">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold! mb-3">{item.title}</h3>
                  <p className="text-white! opacity-90">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-block p-6 bg-white/20 backdrop-blur-sm rounded-xl">
                <p className="text-lg font-semibold! text-white! mb-2">
                  💡 Pro Tip: Save your member number in your phone contacts for easy access!
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div id="register" className="mb-16">
            <RewardsRegistrationForm />
          </div>

          {/* FAQs */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 lg:p-12 mb-16">
            <h2 className="text-4xl font-extrabold! text-[#184363] text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border-b border-neutral-200 pb-6 last:border-0">
                  <h4 className="text-lg font-bold! text-[#184363] mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-neutral-700">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div id="terms" className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 lg:p-12">
            <h2 className="text-3xl font-extrabold! text-[#184363] mb-8">
              Terms & Conditions
            </h2>
            
            <div className="prose prose-lg max-w-none space-y-6 text-neutral-700">
              <div className="p-6 bg-[#009eb9]/10 rounded-xl mb-6">
                <p className="font-bold! text-[#184363] text-lg mb-2">
                  Sparkport+ Rewards Program Overview
                </p>
                <p className="mb-0">
                  The Sparkport Pharmacy Rewards Program offers discounts on selective items. In-store customers use their phone number, while online customers receive a member number via SMS for checkout.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Eligibility</h3>
                <p>Only individuals 18 years of age or older are eligible to participate in this program. Enrollment is free and limited to one account per phone number.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">How Discounts Work</h3>
                <ul className="space-y-2">
                  <li>Discounts apply only to eligible items as determined by Sparkport Pharmacy</li>
                  <li>Not all products are eligible for discounts</li>
                  <li>In-store customers must provide their registered phone number at checkout</li>
                  <li>Online customers must use the member number sent via SMS</li>
                  <li>Discounts are applied at the time of purchase and cannot be redeemed for cash or store credit</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Important Information</h3>
                <ul className="space-y-2">
                  <li>Sparkport Pharmacy reserves the right to modify eligible items, discount amounts, or terminate the program at any time without prior notice</li>
                  <li>Discounts cannot be applied to past purchases</li>
                  <li>Discounts cannot be used in conjunction with other promotional offers unless explicitly stated</li>
                  <li>Sparkport Pharmacy is not responsible for any issues arising from incorrect phone numbers or card numbers provided at checkout</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Privacy & Security</h3>
                <p>Personal information, including phone numbers, collected in connection with the rewards program will be used in accordance with Sparkport Pharmacy's privacy policy. Online customers are responsible for the security of their SMS-received card number. Report any unauthorized use immediately.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Limitation of Liability</h3>
                <p>Sparkport Pharmacy will not be liable for any direct, indirect, incidental, or consequential damages arising from the Program or any rewards provided. This includes, but is not limited to, delays of payment and expiration of discounted price, and errors or delays in processing transactions.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Governing Law</h3>
                <p>These terms and conditions are governed by the laws of South Africa. Any disputes arising out of or relating to the Program will be resolved exclusively in the courts of South Africa.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold! text-[#184363] mb-3">Contact Us</h3>
                <p>For any questions or concerns regarding the Program, please contact our customer service team at <strong>031 207 1011</strong>.</p>
                <p className="mt-4 p-4 bg-neutral-100 rounded-lg">
                  <strong>By participating in the Sparkport+ Rewards Program, you acknowledge that you have read, understood, and agree to these terms and conditions.</strong>
                </p>
              </div>

              <div className="border-t border-neutral-200 pt-6 mt-8">
                <p className="text-sm text-neutral-500">
                  Orders will be dispatched <strong>Monday – Friday (08:00 – 15:30)</strong> – <strong>5KM Radius is available till 5 PM</strong>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}