'use client';

import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && acceptedTerms) {
      console.log('Subscribing:', email);
      setEmail('');
      setAcceptedTerms(false);
    }
  };

  return (
    <footer className="bg-[#2c2c2c] text-white">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column - Newsletter */}
          <div className="lg:col-span-4">
            <img 
              src="https://sparkport.co.za/wp-content/uploads/SP-Logo-01.png" 
              alt="Sparkport"
              className="h-14 mb-6"
            />
            <p className="text-neutral-300! mb-6">
              Stay tuned for latest updates and new features
            </p>
            
            <form onSubmit={handleSubscribe} className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 px-4 py-2.5 bg-white text-neutral-900 placeholder:text-neutral-500 focus:outline-none rounded-l-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className="px-6 py-2.5 bg-[#00bcd4] text-white font-medium rounded-r-lg hover:bg-[#00acc1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Subscribe
                </button>
              </div>
            </form>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-neutral-500 bg-transparent"
              />
              <span className="text-sm text-neutral-400">
                I accept terms and conditions & privacy policy
              </span>
            </label>
          </div>

          {/* Middle Columns - Links */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            
            {/* Information */}
            <div>
              <h3 className="text-white font-semibold mb-4">Information</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/health-care-services" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Health Care Services
                  </a>
                </li>
                <li>
                  <a href="/shipping-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Shipping policy
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/store-locator" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Store Locater
                  </a>
                </li>
                <li>
                  <a href="/terms-conditions" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Account details */}
            <div>
              <h3 className="text-white font-semibold mb-4">Account details</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href="/my-account/orders" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="/my-account/returns" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Returns
                  </a>
                </li>
                <li>
                  <a href="/my-account/lost-password" className="text-neutral-300 hover:text-white transition-colors text-sm">
                    Lost password
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column - Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold mb-4">About / Contacts</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-neutral-300! text-sm">
                  382 Randles Rd, Overport, Durban, 4091.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:online@sparkport.co.za" className="text-neutral-300 hover:text-white transition-colors text-sm">
                  online@sparkport.co.za
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/sparkport"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/sparkport"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#00bcd4] rounded flex items-center justify-center hover:bg-[#00acc1] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            <p className="text-neutral-400! text-xs text-center lg:text-left">
              © 1983-2026 Sparkport GOP. All Rights Reserved | Built to thrive by Move Digital.
            </p>

            <div className="flex items-center gap-3">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
              <div className="px-2 py-1 bg-white text-black text-xs font-semibold">
                PAYGATE
              </div>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}