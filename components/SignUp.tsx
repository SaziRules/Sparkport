'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cellphone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeMarketing: false,
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password validation
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasAlpha: /[a-zA-Z]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.cellphone.trim()) newErrors.cellphone = 'Cellphone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!Object.values(passwordValidation).every(Boolean)) {
      newErrors.password = 'Password does not meet requirements';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Sign up:', formData);
      // Handle sign up logic here
    }
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    // Handle social sign up logic here
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-extrabold text-[#184363]">
              Sparkport
            </div>
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-extrabold! text-[#184363] mb-2">
            Sign Up
          </h1>
          <p className="text-sm text-neutral-600 mb-8">
            Sign up with us to get access to your Orders, Wishlist and Recommendations!
          </p>

          {/* Social Sign Up */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSocialSignUp('google')}
              className="flex items-center justify-center gap-3 px-4 py-3 border-2 border-neutral-300 rounded-lg hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-semibold text-neutral-700">Google</span>
            </button>

            <button
              onClick={() => handleSocialSignUp('facebook')}
              className="flex items-center justify-center gap-3 px-4 py-3 border-2 border-neutral-300 rounded-lg hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm font-semibold text-neutral-700">Facebook</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">or</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                    errors.firstName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Last name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                    errors.lastName ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Cellphone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.cellphone}
                  onChange={(e) => handleInputChange('cellphone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                    errors.cellphone ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="0821234567"
                />
                {errors.cellphone && <p className="text-red-500 text-sm mt-1">{errors.cellphone}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                    errors.email ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Enter password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                      errors.password ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Re-enter password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                      errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            {/* Marketing Consent */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeMarketing}
                  onChange={(e) => handleInputChange('agreeMarketing', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-neutral-700">
                  I would like to receive specials and deals from Sparkport Pharmacy (by checking this box, you agree to receive promotional communications)
                </span>
              </label>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-neutral-700">
                  I agree with{' '}
                  <Link href="/terms" className="text-[#009eb9] hover:underline font-semibold">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#009eb9] hover:underline font-semibold">
                    Privacy Policy
                  </Link>
                  {' '}<span className="text-red-500">*</span>
                </span>
              </label>
              {errors.agreeTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#009eb9] text-white font-semibold py-3 rounded-lg hover:bg-[#184363] transition-colors"
            >
              Sign Up
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Secure your account: </span>
                Enhance your personal information security by enabling two-factor authentication. Set it up in the "My Account" section after signing up.
              </p>
            </div>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-semibold text-[#009eb9] hover:text-[#184363] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}