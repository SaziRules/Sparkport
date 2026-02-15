'use client';

import { useState } from 'react';

export default function RewardsRegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    agreeToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Add your form submission logic here
    // This is where you'd integrate with your backend/WordPress
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-12 text-center">
        <div className="w-20 h-20 bg-linear-to-br from-[#184363] to-[#009eb9] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-3xl font-extrabold! text-[#184363] mb-4">Welcome to Sparkport+ Rewards!</h3>
        <p className="text-lg text-neutral-700 mb-6">
          Your member number has been sent to your phone via SMS. Start saving on your next purchase!
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="px-6 py-3 bg-[#009eb9] text-white font-bold! rounded-lg hover:bg-[#184363] transition-colors"
        >
          Register Another Member
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-12">
      <div className="mb-8">
        <h3 className="text-3xl font-extrabold! text-[#184363] mb-2">Join Sparkport+ Rewards</h3>
        <p className="text-neutral-600">Fill in your details below to start saving today. It's free and takes less than 2 minutes!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-bold! text-[#184363] mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent"
              placeholder="John"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-bold! text-[#184363] mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold! text-[#184363] mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent"
            placeholder="john.doe@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-bold! text-[#184363] mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent"
            placeholder="0XX XXX XXXX"
          />
          <p className="text-sm text-neutral-500 mt-2">This number will be used for in-store purchases and to receive your member number via SMS</p>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-bold! text-[#184363] mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] focus:border-transparent"
          />
          <p className="text-sm text-neutral-500 mt-2">You must be 18 years or older to join</p>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            required
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-1 w-5 h-5 text-[#009eb9] border-neutral-300 rounded focus:ring-[#009eb9]"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-neutral-700">
            I agree to the <a href="#terms" className="text-[#009eb9] font-semibold hover:underline">Terms and Conditions</a> and <a href="#privacy" className="text-[#009eb9] font-semibold hover:underline">Privacy Policy</a> of the Sparkport+ Rewards Program
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-[#009eb9] text-white font-bold! rounded-xl hover:bg-[#184363] transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Join Sparkport+ Rewards Now'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-[#009eb9]/10 rounded-lg">
        <p className="text-sm text-[#184363] font-semibold">
          ✓ Free enrollment • ✓ Instant activation • ✓ Start saving immediately
        </p>
      </div>
    </div>
  );
}