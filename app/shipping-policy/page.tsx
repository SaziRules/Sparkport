import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Sparkport Pharmacy',
  description: 'Learn about Sparkport Pharmacy\'s delivery and collection options, timeframes, and fees across KwaZulu-Natal.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Home / Shipping Policy</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Shipping &amp; Delivery Policy</h1>
          <p className="text-white/70">Delivery time frames, collection options, and courier information</p>
          <p className="text-white/50 text-sm mt-3">Last updated: 28 June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-10 text-neutral-700 leading-relaxed">

          {/* Intro */}
          <div className="bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-6">
            <p className="text-neutral-600!">
              This Shipping &amp; Delivery Policy applies to all orders placed through the Sparkport Pharmacy website at{' '}
              <span className="font-semibold text-[#184363]">www.sparkport.co.za</span> and governs the collection and
              delivery of products and medications ordered online. Please read this policy carefully before placing an order.
            </p>
          </div>

          {/* 1. In-Store Collection */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">1. In-Store Collection</h2>
            <p className="text-neutral-600! mb-4">
              Sparkport Pharmacy offers free in-store collection at any of our eight branches across KwaZulu-Natal. Once you
              have submitted your order online, our pharmacy team will prepare your medication and notify you when it is ready
              for collection.
            </p>
            <p className="text-neutral-600! mb-4 font-semibold">Our branches:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { name: 'Overport', area: 'Overport City' },
                { name: 'City Centre', area: 'Durban CBD' },
                { name: 'Musgrave', area: 'Musgrave Centre' },
                { name: 'Quality Street', area: 'Quality Street Mall' },
                { name: 'Warner Beach', area: 'Warner Beach Mall' },
                { name: 'Chatsworth', area: 'Chatsworth Centre' },
                { name: 'Umlazi', area: 'Umlazi Mega City' },
                { name: 'Pietermaritzburg', area: 'PMB City Centre' },
              ].map((b) => (
                <div key={b.name} className="flex items-start gap-3 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-100">
                  <span className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full bg-[#009eb9] mt-1.5" />
                  <div>
                    <p className="font-semibold text-[#184363] text-sm">{b.name}</p>
                    <p className="text-neutral-500 text-xs">{b.area}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-neutral-600! mb-4">
              Please note: in-store collection is available for <span className="font-semibold text-[#184363]">prescription orders only</span>.
              All frontshop items purchased on the website are dispatched from Sparkport Overport and can also be collected there.
            </p>
            <p className="text-neutral-600!">
              Branch trading hours vary. Please contact your preferred branch or visit our website for up-to-date hours before
              attending to collect your order.
            </p>
          </section>

          {/* 2. Prescription Preparation Window */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">2. Prescription Preparation Window</h2>
            <p className="text-neutral-600! mb-4">
              All prescription medication orders require a minimum preparation window of{' '}
              <span className="font-semibold text-[#184363]">2 business hours</span> from the time your prescription and
              payment are verified. This allows our registered pharmacists to dispense your medication safely and accurately
              in compliance with the Pharmacy Act 53 of 1974 and the Medicines and Related Substances Act 101 of 1965.
            </p>
            <p className="text-neutral-600!">
              Complex or specialised prescriptions — including compounded medications, schedule 5 or 6 substances, or orders
              requiring authorisation from your medical aid — may require additional processing time. Our team will contact
              you if this applies to your order.
            </p>
          </section>

          {/* 3. Home Delivery */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">3. Home Delivery</h2>
            <p className="text-neutral-600! mb-4">
              Sparkport Pharmacy offers home delivery of eligible products and dispensed prescription medication to addresses
              within our designated delivery zones across KwaZulu-Natal.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#184363] mb-1">Delivery Areas</h3>
                <p className="text-neutral-600!">
                  We currently deliver to selected suburbs within the eThekwini Metropolitan Municipality (greater Durban),
                  Pietermaritzburg and surrounding areas, and the South Coast region up to and including Warner Beach. Delivery
                  availability to your specific address will be confirmed at checkout.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#184363] mb-1">Delivery Time Frames</h3>
                <p className="text-neutral-600!">
                  Standard delivery is typically completed within <span className="font-semibold">2–7 business days</span>{' '}
                  from the date your order is confirmed and payment is verified. Same-day or next-day delivery may be available
                  in select areas and is subject to order placement before 12:00 (noon) on a business day. We do not process
                  or dispatch orders on Sundays or public holidays.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#184363] mb-1">Delivery Fees</h3>
                <p className="text-neutral-600!">
                  Delivery fees are calculated at checkout based on your delivery address and order size. Free delivery may
                  be available on qualifying orders above a specified spend threshold, which is displayed on our website and
                  confirmed during checkout. Sparkport Pharmacy reserves the right to amend delivery fees at any time without
                  prior notice.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Prescription Delivery Requirements */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">4. Prescription Delivery Requirements</h2>
            <p className="text-neutral-600! mb-4">
              Prescription medication is regulated by South African law and may only be dispensed by a registered pharmacist
              upon receipt of a valid original prescription. The following conditions apply to all prescription deliveries:
            </p>
            <ul className="list-none space-y-3 mb-4">
              {[
                'A clear, legible photograph or digital copy of your original prescription must be submitted via our Fill Your Script form before your order is prepared.',
                'The original prescription must be surrendered to our pharmacy for schedule 5 or 6 substances, as required by law.',
                'Delivery of schedule 5 or 6 substances requires the signature of a person 18 years of age or older at the delivery address.',
                'We are unable to leave prescription medication unattended at a delivery address. If no authorised person is present, a re-delivery will be arranged.',
                'Repeat prescriptions will only be dispensed for the number of repeats authorised by the prescribing practitioner.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#009eb9] text-white text-xs flex items-center justify-center mt-0.5 font-bold">{i + 1}</span>
                  <p className="text-neutral-600!">{item}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Order Tracking */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">5. Order Tracking</h2>
            <p className="text-neutral-600! mb-4">
              Once your order is dispatched for delivery, you will receive a confirmation notification via the contact details
              provided at checkout. Where third-party courier services are used, tracking information will be shared where
              available.
            </p>
            <p className="text-neutral-600!">
              For collection orders, you will receive a notification when your prescription is prepared and ready for
              collection at your chosen branch. Uncollected orders will be held for a period of{' '}
              <span className="font-semibold text-[#184363]">14 calendar days</span> from the date of the ready notification.
              After this period, Sparkport Pharmacy reserves the right to return dispensed items to stock in accordance with
              applicable regulatory requirements. In such cases, a re-dispensing fee may apply.
            </p>
          </section>

          {/* 6. Failed Deliveries */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">6. Failed and Returned Deliveries</h2>
            <p className="text-neutral-600! mb-4">
              A delivery is considered failed if:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-600! mb-4 ml-2">
              <li>No authorised person is available to receive the order at the delivery address.</li>
              <li>The delivery address provided is incomplete, incorrect, or inaccessible.</li>
              <li>The recipient refuses delivery.</li>
            </ul>
            <p className="text-neutral-600! mb-4">
              In the event of a failed delivery, our team will contact you to arrange a re-delivery. A re-delivery fee may be
              charged. If we are unable to successfully deliver your order after two attempts, it will be returned to the
              nearest Sparkport branch and you will be notified to arrange collection.
            </p>
            <p className="text-neutral-600!">
              Sparkport Pharmacy is not liable for failed deliveries resulting from incorrect address information provided
              by the customer.
            </p>
          </section>

          {/* 7. Risk Transfer */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">7. Risk and Ownership</h2>
            <p className="text-neutral-600! mb-4">
              In accordance with the Consumer Protection Act 68 of 2008, risk in goods passes to the customer upon delivery
              and acceptance of the order. Ownership of goods passes to the customer once full payment has been received and
              confirmed.
            </p>
            <p className="text-neutral-600!">
              Where Sparkport Pharmacy uses a third-party courier or logistics provider, risk passes to the courier upon
              collection of the order from our premises. In such cases, Sparkport Pharmacy will assist customers in lodging
              any claims with the courier provider but cannot be held liable for loss or damage caused by the courier after
              collection.
            </p>
          </section>

          {/* 8. Exclusions */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">8. Products Excluded from Delivery</h2>
            <p className="text-neutral-600! mb-4">
              Certain products may not be eligible for home delivery due to regulatory, safety, or logistical constraints,
              including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-neutral-600! mb-4 ml-2">
              <li>Temperature-sensitive medications requiring cold chain management — <span className="font-semibold">delivery is only available to addresses within a 5km radius of our <a href="/branches/overport" className="text-[#009eb9] hover:underline">Overport branch</a>. Long-distance delivery of cold chain items is not offered; if your address falls outside this radius you are required to collect in-store.</span></li>
              <li>Controlled substances where in-person identification or prescription surrender is legally required.</li>
              <li>Bulky or hazardous items as classified under relevant transport legislation.</li>
            </ul>
            <p className="text-neutral-600!">
              Our team will advise you at checkout or upon order confirmation if any item in your order is excluded from
              delivery.
            </p>
          </section>

          {/* 9. Delays */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">9. Delays and Force Majeure</h2>
            <p className="text-neutral-600!">
              Sparkport Pharmacy takes all reasonable steps to meet advertised delivery time frames. However, delays may occur
              due to circumstances beyond our reasonable control, including but not limited to severe weather events, civil
              unrest, load shedding or extended power outages, national or regional lockdowns, courier disruptions, or acts
              of God. In such circumstances, we will communicate delays to affected customers as soon as reasonably
              practicable and will not be liable for any loss or inconvenience resulting from delivery delays outside our
              control.
            </p>
          </section>

          {/* 10. Contact */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">10. Contact Us</h2>
            <p className="text-neutral-600! mb-6">
              If you have any questions about your delivery or collection order, please contact us:
            </p>
            <div className="bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-6 space-y-2">
              <p className="font-semibold text-[#184363]">Sparkport Pharmacy</p>
              <p className="text-neutral-600!">Email: <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a></p>
              <p className="text-neutral-600!">Website: <span className="text-[#009eb9]">www.sparkport.co.za</span></p>
              <p className="text-neutral-600!">Operating across 8 branches in KwaZulu-Natal, South Africa</p>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}
