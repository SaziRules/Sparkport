'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type AuthMode = 'signin' | 'signup';

export default function AuthPageSplit() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    receiveMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password validation
  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      numeric: /\d/.test(password),
      alpha: /[a-zA-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordRequirements = validatePassword(formData.password);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (mode === 'signup') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    } else {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', { mode, formData });
      // Add your authentication logic here
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Sign in with ${provider}`);
    // Add your social login logic here
  };

  return (
    <div className="min-h-screen w-full flex m-0 p-0">{/* Added w-full, m-0, p-0 to ensure no spacing */}
      
      {/* Left Column: Lifestyle Image - Edge to Edge */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-[#184363] to-[#009eb9] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('/images/categories/brain-boost.jpg')] bg-cover bg-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-[#009eb9]/70 to-white/50" />
        </div>
        
        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-center -mt-78  items-center w-full px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-7xl font-extrabold! mb-6">
              Welcome to Sparkport
            </h2>
            <p className="text-xl text-white/90! mb-8">
              Your trusted partner in health and wellness. Access your orders, wishlist, and personalized recommendations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg">Easy prescription refills</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg">Track your orders</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-lg">Save your favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">{/* Added overflow-y-auto for scrolling */}
        <div className="w-full max-w-xl">
          
         

          {mode === 'signup' ? (
            /* Sign Up Form */
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">
                Sign Up
              </h1>
              <p className="text-neutral-600 mb-8">
                Sign up with us to get access to your Orders, Wishlist and Recommendations!
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.firstName ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="First name"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.lastName ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="Last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Cellphone number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.phone ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="0821234567"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.email ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Enter password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
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
                        className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
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
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.receiveMarketing}
                      onChange={(e) => handleInputChange('receiveMarketing', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#009eb9] rounded"
                    />
                    <span className="text-sm text-neutral-700">
                      I would like to receive specials and deals from Sparkport
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#009eb9] rounded"
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
                    </span>
                  </label>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg"
                >
                  Sign Up
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-neutral-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-[#009eb9] font-bold hover:text-[#184363] transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">
                Sign in to your account
              </h1>
              <p className="text-neutral-600 mb-8">
                Welcome back! Please enter your details
              </p>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => handleSocialLogin('google')}
                  className="flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-neutral-300 rounded-lg hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
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
                  onClick={() => handleSocialLogin('facebook')}
                  className="flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-neutral-300 rounded-lg hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email address / Cellphone number
                  </label>
                  <input
                    type="text"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                      errors.email ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    placeholder="Enter your email or phone"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.password ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-[#009eb9] rounded" />
                    <span className="text-sm text-neutral-700">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#009eb9] hover:text-[#184363] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  className="w-full border-2 border-neutral-300 text-neutral-700 font-semibold py-3.5 rounded-full hover:border-[#009eb9] hover:bg-[#009eb9]/5 transition-all"
                >
                  Sign in with OTP
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-neutral-600">
                  New to Sparkport?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-[#009eb9] font-bold hover:text-[#184363] transition-colors"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}