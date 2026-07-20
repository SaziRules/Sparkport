import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sparkport Pharmacy',
  description: 'How Sparkport Pharmacy collects, uses, and protects your personal information in accordance with the Protection of Personal Information Act (POPIA).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#184363] via-[#1a5a8a] to-[#009eb9] py-16 lg:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-3">Home / Privacy Policy</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/70">How we collect, use, and protect your personal information under POPIA</p>
          <p className="text-white/50 text-sm mt-3">Last updated: 28 June 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="prose-neutral space-y-10 text-neutral-700 leading-relaxed">

          {/* Intro */}
          <section>
            <p className="text-lg text-neutral-600! leading-relaxed">
              <strong>Sparkport Pharmacy</strong> (&ldquo;Sparkport&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy describes how we collect, use, store, share, and safeguard your personal information when you visit our website at <strong>sparkport.co.za</strong>, use our online prescription service, or interact with us in any other way.
            </p>
            <p className="mt-4 text-neutral-600!">
              This Policy is governed by the <strong>Protection of Personal Information Act 4 of 2013 (POPIA)</strong> and the <strong>Electronic Communications and Transactions Act 25 of 2002 (ECT Act)</strong>. By accessing our website or providing us with your personal information, you acknowledge that you have read and understood this Policy.
            </p>
          </section>

          <hr className="border-neutral-200" />

          {/* 1 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">1. Who We Are</h2>
            <p className="text-neutral-600!">
              Sparkport Pharmacy is the responsible party (as defined in POPIA) for personal information collected through this website and our services.
            </p>
            <div className="mt-4 bg-neutral-50 rounded-xl p-6 border border-neutral-200 text-sm space-y-1.5">
              <p className="text-neutral-700!"><strong>Trading name:</strong> Sparkport Pharmacy</p>
              <p className="text-neutral-700!"><strong>Registered address:</strong> 382 Corner Moses Kotane &amp; Randles Road, Overport, Durban, 4091</p>
              <p className="text-neutral-700!"><strong>Email:</strong> <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a></p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">2. Information We Collect</h2>
            <p className="text-neutral-600! mb-4">We collect personal information that you provide to us directly and information collected automatically when you use our website.</p>

            <h3 className="text-lg font-semibold! text-[#184363] mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc list-outside ml-5 space-y-2 text-neutral-600!">
              <li><strong>Identity information:</strong> Full name, South African ID number, date of birth</li>
              <li><strong>Contact information:</strong> Email address, WhatsApp/mobile number, physical address</li>
              <li><strong>Health and prescription information:</strong> Prescription files (photos/PDFs), doctor&apos;s name, practice number, prescription date, medication details, chronic condition status, allergy information</li>
              <li><strong>Medical aid information:</strong> Medical aid provider, membership number, dependant code</li>
              <li><strong>Payment information:</strong> Payment method preference. Card details are processed directly by our payment gateway (PayGate) and are not stored on our servers</li>
              <li><strong>Account credentials:</strong> Email address and password (stored in encrypted form)</li>
              <li><strong>Communications:</strong> Records of any correspondence you send us</li>
            </ul>

            <h3 className="text-lg font-semibold! text-[#184363] mt-6 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-outside ml-5 space-y-2 text-neutral-600!">
              <li><strong>Usage data:</strong> Pages visited, time spent on pages, links clicked, referring URLs</li>
              <li><strong>Device information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Cookies and similar technologies:</strong> Session identifiers, preference cookies, and analytics cookies (see Section 9)</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">3. How We Use Your Information</h2>
            <p className="text-neutral-600! mb-4">We process your personal information for the following purposes:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-neutral-600!">
              <li><strong>To fulfill prescription orders:</strong> Processing, dispensing, and delivering your medication safely and accurately</li>
              <li><strong>To manage your account:</strong> Creating and administering your Sparkport account, tracking orders, and providing order history</li>
              <li><strong>To communicate with you:</strong> Sending order confirmations, prescription status updates, collection notifications, and responding to enquiries via WhatsApp, email, or phone</li>
              <li><strong>Medical aid claims:</strong> Processing claims with your nominated medical aid scheme where applicable</li>
              <li><strong>Legal and regulatory compliance:</strong> Meeting our obligations under the Pharmacy Act 53 of 1974, Medicines and Related Substances Act 101 of 1965, National Health Act 61 of 2003, and related healthcare regulations</li>
              <li><strong>Safety and fraud prevention:</strong> Verifying your identity and detecting or preventing fraudulent or illegal activity</li>
              <li><strong>Marketing (with consent):</strong> Sending promotional offers, health tips, and newsletters where you have opted in. You may unsubscribe at any time</li>
              <li><strong>Website improvement:</strong> Analysing usage patterns to improve our website and services</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">4. Legal Basis for Processing</h2>
            <p className="text-neutral-600! mb-4">Under POPIA, we process your personal information on the following grounds:</p>
            <div className="space-y-3">
              {[
                ['Contractual necessity', 'To fulfil prescription orders and provide our pharmacy services to you.'],
                ['Legal obligation', 'To comply with the Pharmacy Act, Medicines Act, SAPC regulations, SARS requirements, and other applicable South African law.'],
                ['Legitimate interest', 'To improve our services, prevent fraud, and ensure the safety of our customers and staff.'],
                ['Consent', 'For marketing communications and non-essential cookies. You may withdraw consent at any time without affecting the lawfulness of processing already carried out.'],
                ['Vital interest', 'In situations where processing is necessary to protect your life or that of another person, particularly relevant for health emergencies.'],
              ].map(([basis, desc]) => (
                <div key={basis} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="font-semibold! text-[#184363] text-sm">{basis}</p>
                  <p className="text-sm text-neutral-600! mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">5. Sharing of Personal Information</h2>
            <p className="text-neutral-600! mb-4">We do not sell your personal information. We may share it with trusted third parties in the following circumstances:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-neutral-600!">
              <li><strong>Registered dispensing pharmacists:</strong> Our licensed pharmacists who process and verify prescriptions</li>
              <li><strong>Delivery partners:</strong> Courier services engaged to deliver your medication</li>
              <li><strong>Payment processors:</strong> PayGate (Pty) Ltd for secure card payment processing</li>
              <li><strong>Medical aid administrators:</strong> Your nominated medical aid scheme or its administrator, solely for claims processing</li>
              <li><strong>IT service providers:</strong> Hosting, database, and email providers who process data on our behalf under binding data processing agreements</li>
              <li><strong>Regulatory authorities:</strong> The South African Pharmacy Council (SAPC), Department of Health, SAPS, or courts where required by law or legal process</li>
              <li><strong>Professional advisers:</strong> Attorneys, auditors, and insurers bound by confidentiality obligations</li>
            </ul>
            <p className="mt-4 text-neutral-600!">
              Where we share personal information with third parties, we take reasonable steps to ensure that they handle it in accordance with POPIA and are bound by appropriate contractual obligations.
            </p>
            <p className="mt-3 text-neutral-600!">
              We do not transfer personal information outside of the Republic of South Africa unless the recipient country provides an adequate level of protection substantially similar to POPIA, or you have consented to the transfer, or the transfer is necessary for the performance of a contract.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">6. Health and Prescription Information</h2>
            <p className="text-neutral-600!">
              Prescription data, diagnoses, and health-related information constitute <strong>special personal information</strong> under POPIA (Section 26) and are subject to heightened protection. We process this information only:
            </p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-neutral-600!">
              <li>With your explicit consent</li>
              <li>As required to provide pharmacy services and dispense medication safely</li>
              <li>As required by law (e.g., record-keeping obligations under the Pharmacy Act and Medicines Act)</li>
              <li>To protect your vital health interests or those of another person</li>
            </ul>
            <p className="mt-4 text-neutral-600!">
              Prescription records are retained for a minimum of <strong>five (5) years</strong> from the date of dispensing as required by the South African Pharmacy Council. Controlled substance records are retained for <strong>five (5) years</strong> from date of dispensing.
            </p>
            <p className="mt-3 text-neutral-600!">
              All prescription files uploaded to our platform are transmitted using TLS encryption and stored in encrypted form. Access is strictly limited to licensed pharmacists and authorised personnel.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">7. Data Security</h2>
            <p className="text-neutral-600!">
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, accidental loss, destruction, disclosure, or misuse. These measures include:
            </p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-neutral-600!">
              <li>TLS/SSL encryption for all data transmitted to and from our website</li>
              <li>Encrypted storage of sensitive data at rest</li>
              <li>Access controls limiting data access to authorised personnel on a need-to-know basis</li>
              <li>Regular security assessments and software updates</li>
              <li>Staff training on data protection and confidentiality obligations</li>
              <li>Incident response procedures in the event of a data breach</li>
            </ul>
            <p className="mt-4 text-neutral-600!">
              In the event of a data breach that poses a risk to your rights and freedoms, we will notify the Information Regulator and affected data subjects as required by Section 22 of POPIA without undue delay.
            </p>
            <p className="mt-3 text-neutral-600!">
              While we take every reasonable step to secure your information, no transmission over the internet is completely secure. You share information with us at your own risk and should use a secure connection when accessing our website.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">8. Retention of Personal Information</h2>
            <p className="text-neutral-600!">We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, unless a longer retention period is required by law:</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border border-neutral-200 rounded-lg overflow-hidden">
                <thead className="bg-[#184363] text-white">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold!">Category</th>
                    <th className="text-left px-4 py-3 font-semibold!">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {[
                    ['Account information', '5 years after account closure'],
                    ['Prescription records', '5 years from date of dispensing (SAPC requirement)'],
                    ['Controlled substance records', '5 years from date of dispensing'],
                    ['Transaction records', '5 years (SARS and financial reporting requirements)'],
                    ['Marketing preferences', 'Until you withdraw consent'],
                    ['Website usage data', '24 months'],
                    ['CCTV footage (in-store)', '30 days unless required for investigation'],
                  ].map(([cat, period], i) => (
                    <tr key={cat} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="px-4 py-3 text-neutral-700">{cat}</td>
                      <td className="px-4 py-3 text-neutral-600">{period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-neutral-600!">Upon expiry of the applicable retention period, personal information will be destroyed, deleted, or de-identified in a secure manner.</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">9. Cookies and Tracking Technologies</h2>
            <p className="text-neutral-600! mb-4">Our website uses cookies and similar technologies to enhance your experience. Cookies are small text files stored on your device.</p>
            <div className="space-y-3">
              {[
                ['Strictly necessary cookies', 'Required for the website to function (e.g., session management, shopping cart). Cannot be disabled.'],
                ['Functional cookies', 'Remember your preferences such as language, location, and logged-in status.'],
                ['Analytics cookies', 'Help us understand how visitors use our website so we can improve it (e.g., Vercel Analytics). Data is anonymised where possible.'],
                ['Marketing cookies', 'Used to deliver relevant advertisements. Only set with your consent.'],
              ].map(([type, desc]) => (
                <div key={type} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                  <p className="font-semibold! text-[#184363] text-sm">{type}</p>
                  <p className="text-sm text-neutral-600! mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-neutral-600!">You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our website. For non-essential cookies we obtain your consent on first visit.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">10. Your Rights Under POPIA</h2>
            <p className="text-neutral-600! mb-4">As a data subject, you have the following rights under POPIA:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-neutral-600!">
              <li><strong>Right of access (Section 23):</strong> Request confirmation of whether we hold your personal information and obtain a copy of it</li>
              <li><strong>Right to correction or deletion (Section 24):</strong> Request that inaccurate, irrelevant, excessive, outdated, or misleading information be corrected or deleted</li>
              <li><strong>Right to object (Section 11(3)):</strong> Object to processing of your personal information where we rely on legitimate interest or consent</li>
              <li><strong>Right to withdraw consent:</strong> Where processing is based on your consent, you may withdraw it at any time without affecting the lawfulness of prior processing</li>
              <li><strong>Right to complain:</strong> Lodge a complaint with the <strong>Information Regulator of South Africa</strong> if you believe your rights have been violated</li>
            </ul>
            <div className="mt-6 bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-5">
              <p className="font-semibold! text-[#184363] mb-2">Information Regulator Contact Details</p>
              <p className="text-sm text-neutral-600!">JD House, 27 Stiemens Street, Braamfontein, Johannesburg, 2001</p>
              <p className="text-sm text-neutral-600!">Email: <a href="mailto:enquiries@inforegulator.org.za" className="text-[#009eb9] hover:underline">enquiries@inforegulator.org.za</a></p>
              <p className="text-sm text-neutral-600!">Website: <a href="https://www.inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-[#009eb9] hover:underline">www.inforegulator.org.za</a></p>
            </div>
            <p className="mt-4 text-neutral-600!">To exercise any of your rights, please contact our Information Officer at <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a>. We will respond within <strong>30 days</strong> of receiving your request.</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-neutral-600!">
              Our website is not directed at children under the age of 18. We do not knowingly collect personal information from minors without verifiable parental or guardian consent. If you are a parent or guardian and believe your child has provided personal information without your consent, please contact us immediately and we will take steps to delete such information.
            </p>
            <p className="mt-3 text-neutral-600!">
              Prescription orders for dependants (e.g., minor children covered on a medical aid) are processed on behalf of the account holder who bears responsibility for the accuracy of the information provided.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">12. Third-Party Links</h2>
            <p className="text-neutral-600!">
              Our website may contain links to third-party websites (such as medical aid portals or health information resources). We are not responsible for the privacy practices of such websites and encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">13. Changes to This Policy</h2>
            <p className="text-neutral-600!">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will post the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. Where changes are material, we will notify registered customers by email or a prominent notice on our website. Your continued use of our website after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-2xl font-bold! text-[#184363] mb-4">14. Contact Us</h2>
            <p className="text-neutral-600! mb-4">If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Information Officer:</p>
            <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 text-sm space-y-2">
              <p className="text-neutral-700!">382 Corner Moses Kotane &amp; Randles Road, Overport, Durban, 4091</p>
              <p className="text-neutral-700!">Email: <a href="mailto:online@sparkport.co.za" className="text-[#009eb9] hover:underline">online@sparkport.co.za</a></p>
            </div>
          </section>

          <hr className="border-neutral-200" />

          <div className="flex flex-wrap gap-4 text-sm text-neutral-500!">
            <Link href="/terms-conditions" className="text-[#009eb9] hover:underline">Terms &amp; Conditions</Link>
            <span>·</span>
            <Link href="/shipping-policy" className="text-[#009eb9] hover:underline">Shipping Policy</Link>
            <span>·</span>
            <Link href="/contact" className="text-[#009eb9] hover:underline">Contact Us</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
