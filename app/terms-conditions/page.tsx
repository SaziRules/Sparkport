import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sparkport Pharmacy',
  description: 'Read the Terms and Conditions governing your use of Sparkport Pharmacy\'s website and services.',
};

export default function TermsConditionsPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Home / Terms &amp; Conditions</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-white/70">The rules governing your use of Sparkport Pharmacy&apos;s website and services</p>
          <p className="text-white/50 text-sm mt-3">Last updated: 2 July 2026 · Version 2.0</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-10 text-neutral-700 leading-relaxed">

          {/* Intro */}
          <div className="bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-6">
            <p className="text-neutral-600!">
              These Terms and Conditions ("Terms") govern your access to and use of the Sparkport Pharmacy website located
              at <span className="font-semibold text-[#184363]">www.sparkport.co.za</span> ("the Website") and all related
              services, including online prescription submissions, product purchases, and account registration ("Services").
              By accessing the Website or placing an order, you agree to be bound by these Terms. If you do not agree, please
              do not use our Website or Services.
            </p>
          </div>

          {/* 1. Definitions */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">1. Definitions</h2>
            <div className="space-y-3">
              {[
                ['"Sparkport Pharmacy", "we", "us", "our"', 'Refers to Sparkport Pharmacy, a registered South African pharmacy operating across KwaZulu-Natal.'],
                ['"Customer", "you", "your"', 'Any natural or juristic person who accesses the Website or uses our Services.'],
                ['"Order"', 'A request by a Customer to purchase products or have a prescription dispensed via the Website.'],
                ['"Prescription"', 'A valid written order issued by a registered healthcare practitioner authorising the dispensing of scheduled medication.'],
                ['"Products"', 'All goods offered for sale via the Website, including prescription medication, over-the-counter medication, health products, and general wellness items.'],
                ['"Business Day"', 'Any day other than a Saturday, Sunday, or South African public holiday.'],
              ].map(([term, def]) => (
                <div key={term as string} className="flex gap-3">
                  <div className="flex-shrink-0 w-1 bg-[#009eb9] rounded-full mt-1" />
                  <p className="text-neutral-600!"><span className="font-semibold text-[#184363]">{term}</span> — {def}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Eligibility */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">2. Eligibility</h2>
            <p className="text-neutral-600! mb-4">
              You must be at least <span className="font-semibold text-[#184363]">18 years of age</span> to register an
              account, place an order, or purchase products or prescription medication via our Website. By using the Website,
              you represent and warrant that you meet this age requirement.
            </p>
            <p className="text-neutral-600!">
              Prescription medication may only be dispensed to or on behalf of the patient named on a valid prescription
              issued by a practitioner registered with the Health Professions Council of South Africa ("HPCSA"). The ordering
              of prescription medication for purposes other than legitimate personal medical use is strictly prohibited.
            </p>
          </section>

          {/* 3. Account Registration */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">3. Account Registration</h2>
            <p className="text-neutral-600! mb-4">
              Certain features of our Website require you to create a registered account. When registering, you agree to
              provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of
              your account credentials and for all activity that occurs under your account.
            </p>
            <p className="text-neutral-600! mb-4">
              You must notify us immediately at{' '}
              <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a>{' '}
              if you become aware of any unauthorised use of your account. Sparkport Pharmacy is not liable for any loss or
              damage arising from your failure to safeguard your account credentials.
            </p>
            <p className="text-neutral-600!">
              We reserve the right to suspend or terminate any account that violates these Terms, without prior notice.
            </p>
          </section>

          {/* 4. Products and Pricing */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">4. Products and Pricing</h2>
            <p className="text-neutral-600! mb-4">
              All prices displayed on the Website are quoted in South African Rand (ZAR) and include Value Added Tax (VAT)
              at the applicable rate, unless otherwise stated. Prices are subject to change without notice. The price
              applicable to your order is the price displayed at the time you complete checkout.
            </p>
            <p className="text-neutral-600! mb-4">
              We make every effort to ensure that product information, descriptions, and prices displayed on the Website are
              accurate. However, errors may occasionally occur. In the event of a pricing error, we reserve the right to
              cancel or refuse an order. Where an order has been accepted and payment taken in error, we will refund the
              full amount paid.
            </p>
            <p className="text-neutral-600! mb-4">
              Certain products, including prescription medication, are regulated under the Medicines and Related Substances
              Act 101 of 1965 and may only be sold in accordance with applicable schedule controls. Advertised prices for
              prescription medication are indicative only and may vary based on the specific product dispensed, medical aid
              co-payments, or regulatory pricing controls.
            </p>
            <p className="text-neutral-600!">
              Product images displayed on the Website are for illustrative purposes only. Actual product packaging may differ
              from images shown, as manufacturers may update packaging without prior notice to us.
            </p>
          </section>

          {/* 5. Prescription Medication */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">5. Prescription Medication</h2>
            <p className="text-neutral-600! mb-4">
              The dispensing of prescription medication is governed by the Pharmacy Act 53 of 1974, the Medicines and
              Related Substances Act 101 of 1965, and all regulations promulgated thereunder. Sparkport Pharmacy operates
              in full compliance with these laws and under the oversight of the South African Pharmacy Council ("SAPC").
            </p>
            <p className="text-neutral-600! mb-4">
              By submitting a prescription via our Website, you confirm that:
            </p>
            <ul className="list-none space-y-2 mb-4">
              {[
                'The prescription is valid, authentic, and was issued by a registered healthcare practitioner for your personal use.',
                'You have not submitted the same prescription to any other pharmacy for simultaneous dispensing.',
                'All personal and medical information provided is accurate and complete to the best of your knowledge.',
                'You understand that our pharmacists may contact your prescribing practitioner to verify the prescription before dispensing.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#009eb9] text-white text-xs flex items-center justify-center mt-0.5 font-bold">{i + 1}</span>
                  <p className="text-neutral-600!">{item}</p>
                </li>
              ))}
            </ul>
            <p className="text-neutral-600!">
              Sparkport Pharmacy reserves the right to refuse to dispense any prescription where we have reasonable grounds
              to believe it is invalid, fraudulent, or otherwise not in compliance with applicable law. The submission of a
              forged or fraudulent prescription is a criminal offence under South African law.
            </p>
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-bold text-amber-900 mb-2">Scheduled Medicines (Schedule 5 &amp; 6)</h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-2">
                Certain medicines classified as Schedule 5 or Schedule 6 under the Medicines and Related Substances Act are
                subject to additional dispensing controls:
              </p>
              <ul className="text-sm text-amber-800 space-y-1 mb-3">
                <li className="flex gap-2"><span className="shrink-0">·</span><span><strong>S5 medicines</strong> may be repeated up to 5 times within a 6-month period. An original prescription is required.</span></li>
                <li className="flex gap-2"><span className="shrink-0">·</span><span><strong>S6 medicines</strong> may not be repeated. The pharmacist is legally required to retain the original prescription after dispensing.</span></li>
                <li className="flex gap-2"><span className="shrink-0">·</span><span>No copies, photographs, or faxed prescriptions are accepted for scheduled substances.</span></li>
              </ul>
              <a href="/regulated-medication" className="text-sm font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2">
                Learn more about scheduled medicines →
              </a>
            </div>
          </section>

          {/* 6. Orders and Payment */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">6. Orders and Payment</h2>
            <p className="text-neutral-600! mb-4">
              An order placed through the Website constitutes an offer to purchase. No binding contract is formed until we
              confirm acceptance of your order via email or notification. We reserve the right to decline any order at our
              sole discretion, including where stock is unavailable, a prescription cannot be verified, or payment is not
              successfully authorised.
            </p>
            <p className="text-neutral-600! mb-4">
              Payment is processed securely through <span className="font-semibold text-[#184363]">PayFast</span>, a
              registered payment service provider in South Africa. We accept major credit and debit cards as well as other
              payment methods displayed at checkout. All payment transactions are encrypted using SSL technology in
              accordance with the Electronic Communications and Transactions Act 25 of 2002 ("ECT Act").
            </p>
            <p className="text-neutral-600!">
              Full payment is required before any order is processed or medication is dispensed. We do not offer credit
              facilities or deferred payment arrangements through the Website.
            </p>
          </section>

          {/* 7. Delivery and Collection */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">7. Delivery and Collection</h2>
            <p className="text-neutral-600!">
              Delivery and collection are governed by our{' '}
              <a href="/shipping-policy" className="text-[#009eb9] hover:underline font-medium">Shipping &amp; Delivery Policy</a>,
              which forms part of these Terms and is incorporated herein by reference. Risk in goods passes to you upon
              delivery in accordance with the Consumer Protection Act 68 of 2008.
            </p>
            <p className="text-neutral-600! mt-4">
              Certain pharmaceutical products require temperature-controlled storage and transport
("cold-chain" items). Cold-chain items must be collected in-store from your preferred branch. 
If you are unsure whether your medication is a cold-chain item, please contact us at 
<a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline"> online@sparkport.co.za</a>
            </p>
          </section>

          {/* 8. Returns and Refunds */}
          <section id="returns">
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">8. Returns, Refunds, and Consumer Rights</h2>
            <p className="text-neutral-600! mb-4">
              Your consumer rights are protected by the Consumer Protection Act 68 of 2008 ("CPA"). Nothing in these Terms
              limits or excludes any right you are entitled to under the CPA.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#184363] mb-2">Cooling-Off Period (Online Purchases)</h3>
                <p className="text-neutral-600!">
                  In accordance with Section 44 of the ECT Act, you have the right to cancel an online order within{' '}
                  <span className="font-semibold">7 days</span> of receiving goods, without reason, provided the goods are
                  returned in their original, unopened, and undamaged condition. This right does not apply to prescription medication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#184363] mb-2">Exclusions</h3>
                <p className="text-neutral-600!">
                  We are unable to accept returns of: dispensed prescription medication; opened or used health and hygiene
                  products; products that have been tampered with; or products returned beyond the applicable return period.
                  Refunds will not be issued for prescription medication.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#184363] mb-2">How to Return</h3>
                <p className="text-neutral-600!">
                  To initiate a return or refund, please contact us at{' '}
                  <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a>{' '}
                  within the applicable period, quoting your order number and reason for return. Approved refunds are
                  processed to the original payment method within 1–7 business days.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">9. Intellectual Property</h2>
            <p className="text-neutral-600! mb-4">
              All content on the Website — including but not limited to text, graphics, logos, images, product descriptions,
              software, and the Website's overall design and compilation — is the property of Sparkport Pharmacy or its
              content licensors and is protected by South African copyright law and applicable international treaties.
            </p>
            <p className="text-neutral-600!">
              You may not copy, reproduce, distribute, publish, transmit, modify, or create derivative works from any content
              on the Website without our prior written permission. You are granted a limited, non-exclusive, non-transferable
              licence to access and use the Website for personal, non-commercial purposes only.
            </p>
          </section>

          {/* 10. Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">10. Medical Disclaimer</h2>
            <p className="text-neutral-600! mb-4">
              Information provided on the Website, including product descriptions, health articles, and general wellness
              content, is for informational purposes only and does not constitute medical advice. It is not a substitute for
              professional medical advice, diagnosis, or treatment from a qualified healthcare practitioner.
            </p>
            <p className="text-neutral-600!">
              Always seek the advice of your doctor, pharmacist, or other qualified health provider with any questions you
              have regarding a medical condition or medication. Never disregard professional medical advice or delay seeking
              it because of something you have read on this Website.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">11. Limitation of Liability</h2>
            <p className="text-neutral-600! mb-4">
              To the fullest extent permitted by applicable law, Sparkport Pharmacy shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of or in connection with your use of the
              Website or Services, even if we have been advised of the possibility of such damages.
            </p>
            <p className="text-neutral-600! mb-4">
              Our total aggregate liability to you for any claim arising out of or relating to these Terms or the Services
              shall not exceed the total amount paid by you for the specific order giving rise to the claim.
            </p>
            <p className="text-neutral-600!">
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence,
              fraud or fraudulent misrepresentation, or any liability that cannot be excluded or limited by South African law,
              including liability under the Consumer Protection Act 68 of 2008.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">12. Indemnification</h2>
            <p className="text-neutral-600!">
              You agree to indemnify, defend, and hold harmless Sparkport Pharmacy, its directors, employees, pharmacists,
              agents, and suppliers from and against any claims, liabilities, damages, losses, costs, and expenses (including
              reasonable legal fees) arising out of or in connection with: (a) your use of the Website or Services; (b) your
              breach of these Terms; (c) the submission of a false, fraudulent, or invalid prescription; or (d) your
              violation of any applicable law or the rights of any third party.
            </p>
          </section>

          {/* 13. Privacy */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">13. Privacy and Data Protection</h2>
            <p className="text-neutral-600!">
              Your use of the Website is also governed by our{' '}
              <a href="/privacy-policy" className="text-[#009eb9] hover:underline font-medium">Privacy Policy</a>, which is
              incorporated into these Terms by reference. By using the Website, you consent to the collection, processing,
              and use of your personal information as described in our Privacy Policy, in accordance with the Protection of
              Personal Information Act 4 of 2013 ("POPIA").
            </p>
          </section>

          {/* 14. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">14. Third-Party Websites and Services</h2>
            <p className="text-neutral-600!">
              The Website may contain links to third-party websites or services, including medical aid portals, health
              information resources, and payment processors. These links are provided for your convenience only. Sparkport
              Pharmacy does not endorse, control, or accept responsibility for the content, privacy practices, or terms of
              any third-party website. Your use of third-party websites is at your own risk.
            </p>
          </section>

          {/* 15. Changes */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">15. Changes to These Terms</h2>
            <p className="text-neutral-600!">
              Sparkport Pharmacy reserves the right to amend these Terms at any time. Updated Terms will be published on this
              page with a revised "Last updated" date. Your continued use of the Website after any changes constitutes your
              acceptance of the updated Terms. We encourage you to review these Terms periodically. Where changes are
              material, we will endeavour to notify registered users via email.
            </p>
          </section>

          {/* 16. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">16. Governing Law and Jurisdiction</h2>
            <p className="text-neutral-600! mb-4">
              These Terms are governed by and construed in accordance with the laws of the Republic of South Africa. You
              agree to submit to the exclusive jurisdiction of the courts of Durban, KwaZulu-Natal for any disputes arising
              out of or in connection with these Terms or the Services, without prejudice to our right to seek urgent or
              injunctive relief in any competent court.
            </p>
            <p className="text-neutral-600!">
              In the event of a dispute, the parties agree to first attempt to resolve the matter through good-faith
              negotiation. If the dispute is not resolved within 20 business days, either party may refer the matter to
              mediation or arbitration before a mutually agreed mediator/arbitrator. Nothing in this clause prevents a
              consumer from exercising their rights under the Consumer Protection Act 68 of 2008, including referral to the
              National Consumer Commission or Consumer Court.
            </p>
          </section>

          {/* 17. Contact */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">17. Contact Us</h2>
            <p className="text-neutral-600! mb-6">
              If you have any questions, concerns, or complaints regarding these Terms or our Services, please contact us:
            </p>
            <div className="bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-6 space-y-2">
              <p className="font-semibold text-[#184363]">Sparkport Pharmacy</p>
              <p className="text-neutral-600!">Email: <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a></p>
              <p className="text-neutral-600!">Website: <span className="text-[#009eb9]">www.sparkport.co.za</span></p>
              <p className="text-neutral-600!">Registered with the South African Pharmacy Council (SAPC)</p>
              <p className="text-neutral-600!">Operating across KwaZulu-Natal, South Africa</p>
            </div>
            <div className="mt-6">
              <p className="font-semibold text-[#184363] mb-3 text-sm">Regulatory Bodies</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'SAHPRA', full: 'SA Health Products Regulatory Authority', url: 'https://www.sahpra.org.za' },
                  { name: 'SAPC', full: 'South African Pharmacy Council', url: 'https://www.pharmcouncil.co.za/' },
                  { name: 'POPIA InfoRegulator', full: 'Information Regulator (South Africa)', url: 'https://inforegulator.org.za' },
                  { name: 'Dept. of Health', full: 'National Department of Health', url: 'https://www.health.gov.za' },
                ].map(({ name, full, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-3 bg-white border border-neutral-200 rounded-lg hover:border-[#009eb9] transition-colors group"
                  >
                    <svg className="w-4 h-4 text-[#009eb9] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>
                      <span className="block font-semibold text-[#184363] text-sm">{name}</span>
                      <span className="block text-xs text-neutral-500">{full}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
