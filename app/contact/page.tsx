'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire to backend / email service
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen">

      {/* Background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/heart-health.jpg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
      />
      <div className="fixed inset-0 -z-10 bg-[#f2f2f2]/70" />

      <main className="relative py-12 lg:py-20 px-4 lg:px-6">
        <div className="max-w-full mx-auto">

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-extrabold! text-[#184363] mb-4">Contact Us</h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We&apos;d love to hear from you. Reach out with any questions, prescription enquiries, or general feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Details */}
            <div className="space-y-6">

              <div className="bg-white/95 rounded-2xl shadow-md border border-white/50 p-6">
                <h2 className="text-lg font-bold! text-[#184363] mb-4">Get In Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e8f5f7] rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold! text-[#184363]">Address</p>
                      <p className="text-sm text-neutral-600">382 Randles Rd, Overport<br />Durban, 4091</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e8f5f7] rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold! text-[#184363]">Phone</p>
                      <a href="tel:0312071011" className="text-sm text-[#009eb9] hover:underline">031 207 1011</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#e8f5f7] rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold! text-[#184363]">Email</p>
                      <a href="mailto:online@sparkport.co.za" className="text-sm text-[#009eb9] hover:underline">online@sparkport.co.za</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 rounded-2xl shadow-md border border-white/50 p-6">
                <h2 className="text-lg font-bold! text-[#184363] mb-3">Trading Hours</h2>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium! text-[#184363]">08:00 – 17:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium! text-[#184363]">08:30 – 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday &amp; Public Holidays</span>
                    <span className="font-medium! text-[#184363]">Closed</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 rounded-2xl shadow-md border border-white/50 p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[#e8f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[#009eb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold! text-[#184363] mb-2">Message Sent</h3>
                    <p className="text-neutral-600">Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold! text-[#184363] mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold! text-[#184363] mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Jane Smith"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold! text-[#184363] mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold! text-[#184363] mb-1.5">Phone (optional)</label>
                          <input
                            type="tel"
                            placeholder="082 000 0000"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold! text-[#184363] mb-1.5">Subject</label>
                          <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm bg-white"
                          >
                            <option value="">Select a subject</option>
                            <option>General Enquiry</option>
                            <option>Prescription Enquiry</option>
                            <option>Order Support</option>
                            <option>Product Information</option>
                            <option>Rewards Programme</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold! text-[#184363] mb-1.5">Message</label>
                        <textarea
                          required
                          rows={5}
                          placeholder="How can we help you?"
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-3 bg-[#184363] text-white font-bold! rounded-xl hover:bg-[#009eb9] transition-colors shadow-lg"
                      >
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
