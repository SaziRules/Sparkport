'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FormData {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  idNumber: string;
  dateOfBirth: string;
  preferredContact: string;
  
  // Step 2: Prescription
  prescriptionFile: File | null;
  
  // Step 3: Delivery/Collection
  deliveryMethod: 'collection' | 'delivery';
  collectionStore: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Step 4: Medical & Payment
  additionalNotes: string;
  paymentType: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  dependantCode: string;
  replaceWithGenerics: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
}

export default function FillYourScript() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    whatsappNumber: '',
    idNumber: '',
    dateOfBirth: '',
    preferredContact: 'whatsapp',
    prescriptionFile: null,
    deliveryMethod: 'collection',
    collectionStore: '',
    streetAddress: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    additionalNotes: '',
    paymentType: 'card',
    medicalAidProvider: '',
    medicalAidNumber: '',
    dependantCode: '',
    replaceWithGenerics: false,
    hasAllergies: false,
    allergyDetails: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filePreview, setFilePreview] = useState<string>('');

  const totalSteps = 5;

  const stores = [
    'Sparkport Overport - 382 Corner Moses Kotane & Randles Road, Durban, 4091',
    'Sparkport 454 - Anton Lembede Street, Durban Central, 4000',
    'Sparkport Quality Street - 315 Quality Street, Jacobs, Durban',
    'Sparkport Musgrave - 77 Musgrave Rd, Musgrave, Berea, 4001',
    'Sparkport Pharmacy Warner Beach - 125 Kingsway St, Warner Beach, eManzimtoti, 4126',
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, prescriptionFile: 'File size must be less than 12 MB' }));
        return;
      }
      handleInputChange('prescriptionFile', file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
      if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
      if (formData.idNumber.length !== 13) newErrors.idNumber = 'ID number must be 13 characters';
    }

    if (step === 2) {
      if (!formData.prescriptionFile) newErrors.prescriptionFile = 'Please upload your prescription';
    }

    if (step === 3) {
      if (formData.deliveryMethod === 'collection' && !formData.collectionStore) {
        newErrors.collectionStore = 'Please select a collection store';
      }
      if (formData.deliveryMethod === 'delivery') {
        if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.province.trim()) newErrors.province = 'Province is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
      }
    }

    if (step === 4) {
      if (formData.hasAllergies && !formData.allergyDetails.trim()) {
        newErrors.allergyDetails = 'Please specify your allergies';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
      // Here you would send to your backend
      alert('Prescription submitted successfully! We will contact you soon.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent mt-10 py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-2 lg:px-0">
        
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          
          {/* Left Column: Header & Progress - Sticky on Desktop */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
            
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-6xl font-extrabold! text-[#184363] mb-3">
                Fill Your Script Online
              </h1>
              <p className="text-neutral-600 text-sm lg:text-base">
                Simply provide your personal details, prescription information, and any special instructions to ensure a seamless and efficient process.
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xs font-bold! text-neutral-700 mb-4 uppercase tracking-wide">
                Progress
              </h3>
              
              <div className="space-y-3 mb-6">
                {[
                  { num: 1, label: 'Personal Details' },
                  { num: 2, label: 'Prescription Upload' },
                  { num: 3, label: 'Delivery/Collection' },
                  { num: 4, label: 'Additional Info' },
                  { num: 5, label: 'Review & Submit' },
                ].map((step) => (
                  <div key={step.num} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0 ${
                      currentStep > step.num
                        ? 'bg-[#009eb9] text-white'
                        : currentStep === step.num
                        ? 'bg-[#009eb9] text-white ring-4 ring-[#009eb9]/20'
                        : 'bg-neutral-200 text-neutral-500'
                    }`}>
                      {currentStep > step.num ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.num
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      currentStep >= step.num ? 'text-[#009eb9]' : 'text-neutral-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#009eb9] transition-all duration-500"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-sm text-neutral-600 mt-2 text-center font-medium">
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            {/* Help Section - Desktop Only */}
            <div className="hidden lg:block mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Need help?</p>
                  <Link href="/contact" className="text-[#009eb9] hover:underline font-semibold">
                    Contact our pharmacy team
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-8">
            
            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
              
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold! text-[#184363] mb-6">Personal Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                          errors.firstName ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="Enter first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                          errors.lastName ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.whatsappNumber ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="e.g., 0821234567"
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => handleInputChange('idNumber', e.target.value.slice(0, 13))}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                        errors.idNumber ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="13-digit ID number"
                      maxLength={13}
                    />
                    <p className="text-sm text-neutral-500 mt-1">{formData.idNumber.length} of 13 characters</p>
                    {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Preferred Contact
                      </label>
                      <select
                        value={formData.preferredContact}
                        onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone Call</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Prescription */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold! text-[#184363] mb-6">Upload Your Prescription</h2>
                  
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-[#009eb9] transition-colors">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    
                    <label className="cursor-pointer">
                      <span className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors">
                        Click to upload
                      </span>
                      <span className="text-neutral-600"> or drag and drop</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    
                    <p className="text-sm text-neutral-500 mt-2">
                      PNG, JPG, PDF up to 12MB
                    </p>
                  </div>

                  {formData.prescriptionFile && (
                    <div className="bg-neutral-50 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#009eb9] rounded-lg flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-700 truncate">{formData.prescriptionFile.name}</p>
                        <p className="text-sm text-neutral-500">{(formData.prescriptionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        onClick={() => {
                          handleInputChange('prescriptionFile', null);
                          setFilePreview('');
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {errors.prescriptionFile && <p className="text-red-500 text-sm">{errors.prescriptionFile}</p>}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Important:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Ensure prescription is clear and legible</li>
                          <li>Include all pages if multiple</li>
                          <li>Doctor's signature must be visible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Delivery/Collection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold! text-[#184363] mb-6">Delivery or Collection?</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold! text-neutral-700 mb-3">
                      Select Preferred Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleInputChange('deliveryMethod', 'collection')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          formData.deliveryMethod === 'collection'
                            ? 'border-[#009eb9] bg-[#009eb9]/5'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.deliveryMethod === 'collection' ? 'border-[#009eb9]' : 'border-neutral-300'
                          }`}>
                            {formData.deliveryMethod === 'collection' && (
                              <div className="w-3 h-3 rounded-full bg-[#009eb9]" />
                            )}
                          </div>
                          <span className="font-semibold text-neutral-700">Collection</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleInputChange('deliveryMethod', 'delivery')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          formData.deliveryMethod === 'delivery'
                            ? 'border-[#009eb9] bg-[#009eb9]/5'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.deliveryMethod === 'delivery' ? 'border-[#009eb9]' : 'border-neutral-300'
                          }`}>
                            {formData.deliveryMethod === 'delivery' && (
                              <div className="w-3 h-3 rounded-full bg-[#009eb9]" />
                            )}
                          </div>
                          <span className="font-semibold! text-neutral-700">Delivery</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {formData.deliveryMethod === 'collection' && (
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-3">
                        Select Store <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-3">
                        {stores.map((store) => (
                          <label
                            key={store}
                            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.collectionStore === store
                                ? 'border-[#009eb9] bg-[#009eb9]/5'
                                : 'border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="collectionStore"
                              value={store}
                              checked={formData.collectionStore === store}
                              onChange={(e) => handleInputChange('collectionStore', e.target.value)}
                              className="mt-1"
                            />
                            <span className="text-sm text-neutral-700">{store}</span>
                          </label>
                        ))}
                      </div>
                      {errors.collectionStore && <p className="text-red-500 text-sm mt-2">{errors.collectionStore}</p>}
                    </div>
                  )}

                  {formData.deliveryMethod === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.streetAddress}
                          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                            errors.streetAddress ? 'border-red-500' : 'border-neutral-300'
                          }`}
                          placeholder="Enter street address"
                        />
                        {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.addressLine2}
                          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                              errors.city ? 'border-red-500' : 'border-neutral-300'
                            }`}
                            placeholder="City"
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                            Province <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.province}
                            onChange={(e) => handleInputChange('province', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                              errors.province ? 'border-red-500' : 'border-neutral-300'
                            }`}
                            placeholder="Province"
                          />
                          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                            Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                              errors.postalCode ? 'border-red-500' : 'border-neutral-300'
                            }`}
                            placeholder="Postal code"
                          />
                          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Country
                          </label>
                          <select
                            value={formData.country}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                          >
                            <option value="South Africa">South Africa</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Medical & Payment Info */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold! text-[#184363] mb-6">Additional Information</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                      Payment Type
                    </label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) => handleInputChange('paymentType', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    >
                      <option value="card">Card Payment</option>
                      <option value="cash">Cash on Collection/Delivery</option>
                      <option value="eft">EFT</option>
                      <option value="medical-aid">Medical Aid / Medical Insurance</option>
                    </select>
                  </div>

                  {/* Medical Aid Fields - Show only if Medical Aid selected */}
                  {formData.paymentType === 'medical-aid' && (
                    <div className="space-y-4 border-l-4 border-[#009eb9] pl-4">
                      <div>
                        <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                          Medical Aid Provider
                        </label>
                        <input
                          type="text"
                          value={formData.medicalAidProvider}
                          onChange={(e) => handleInputChange('medicalAidProvider', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                          placeholder="e.g., Discovery, Bonitas, Medshield"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                          Medical Aid Number
                        </label>
                        <input
                          type="text"
                          value={formData.medicalAidNumber}
                          onChange={(e) => handleInputChange('medicalAidNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                          placeholder="Membership number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                          Dependant Code
                        </label>
                        <input
                          type="text"
                          value={formData.dependantCode}
                          onChange={(e) => handleInputChange('dependantCode', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                          placeholder="e.g., 00 for main member"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold! text-neutral-700 mb-3">
                      Replace with generics?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="generics"
                          checked={formData.replaceWithGenerics === true}
                          onChange={() => handleInputChange('replaceWithGenerics', true)}
                          className="w-4 h-4 text-[#009eb9]"
                        />
                        <span className="text-neutral-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="generics"
                          checked={formData.replaceWithGenerics === false}
                          onChange={() => handleInputChange('replaceWithGenerics', false)}
                          className="w-4 h-4 text-[#009eb9]"
                        />
                        <span className="text-neutral-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold! text-neutral-700 mb-3">
                      Do you have any allergies?
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="allergies"
                          checked={formData.hasAllergies === true}
                          onChange={() => handleInputChange('hasAllergies', true)}
                          className="w-4 h-4 text-[#009eb9]"
                        />
                        <span className="text-neutral-700">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="allergies"
                          checked={formData.hasAllergies === false}
                          onChange={() => handleInputChange('hasAllergies', false)}
                          className="w-4 h-4 text-[#009eb9]"
                        />
                        <span className="text-neutral-700">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.hasAllergies && (
                    <div>
                      <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                        Please specify your allergies <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.allergyDetails}
                        onChange={(e) => handleInputChange('allergyDetails', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${
                          errors.allergyDetails ? 'border-red-500' : 'border-neutral-300'
                        }`}
                        rows={3}
                        placeholder="List all allergies..."
                      />
                      {errors.allergyDetails && <p className="text-red-500 text-sm mt-1">{errors.allergyDetails}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold! text-neutral-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                      rows={4}
                      placeholder="Any special instructions..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold! text-[#184363] mb-6">Review Your Information</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold! text-neutral-700 mb-3">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500">Name</p>
                          <p className="font-semibold! text-neutral-700">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">WhatsApp</p>
                          <p className="font-semibold! text-neutral-700">{formData.whatsappNumber}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">ID Number</p>
                          <p className="font-semibold! text-neutral-700">{formData.idNumber}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Contact Method</p>
                          <p className="font-semibold text-neutral-700 capitalize">{formData.preferredContact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold! text-neutral-700 mb-3">Prescription</h3>
                      <p className="text-sm text-neutral-600">{formData.prescriptionFile?.name}</p>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold! text-neutral-700 mb-3">
                        {formData.deliveryMethod === 'collection' ? 'Collection' : 'Delivery'} Details
                      </h3>
                      {formData.deliveryMethod === 'collection' ? (
                        <p className="text-sm text-neutral-600">{formData.collectionStore}</p>
                      ) : (
                        <div className="text-sm text-neutral-600">
                          <p>{formData.streetAddress}</p>
                          {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                          <p>{formData.city}, {formData.province} {formData.postalCode}</p>
                          <p>{formData.country}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold! text-neutral-700 mb-3">Additional Information</h3>
                      <div className="text-sm space-y-2">
                        <p><span className="text-neutral-500">Payment:</span> <span className="font-semibold text-neutral-700 capitalize">{formData.paymentType.replace('-', ' ')}</span></p>
                        {formData.paymentType === 'medical-aid' && (
                          <>
                            <p><span className="text-neutral-500">Medical Aid Provider:</span> <span className="font-semibold text-neutral-700">{formData.medicalAidProvider || 'Not provided'}</span></p>
                            <p><span className="text-neutral-500">Medical Aid Number:</span> <span className="font-semibold text-neutral-700">{formData.medicalAidNumber || 'Not provided'}</span></p>
                            <p><span className="text-neutral-500">Dependant Code:</span> <span className="font-semibold text-neutral-700">{formData.dependantCode || 'Not provided'}</span></p>
                          </>
                        )}
                        <p><span className="text-neutral-500">Generics:</span> <span className="font-semibold text-neutral-700">{formData.replaceWithGenerics ? 'Yes' : 'No'}</span></p>
                        <p><span className="text-neutral-500">Allergies:</span> <span className="font-semibold text-neutral-700">{formData.hasAllergies ? formData.allergyDetails : 'None'}</span></p>
                        {formData.additionalNotes && (
                          <p><span className="text-neutral-500">Notes:</span> <span className="font-semibold text-neutral-700">{formData.additionalNotes}</span></p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1" />
                      <span className="text-sm text-blue-900">
                        I confirm that the information provided is accurate and I agree to the{' '}
                        <Link href="/terms" className="text-[#009eb9] hover:underline font-semibold">
                          Terms & Conditions
                        </Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-[#009eb9] hover:underline font-semibold">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 text-[#009eb9] font-semibold rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="ml-auto px-8 py-3 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#184363] transition-colors flex items-center gap-2"
                >
                  Next Step
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="ml-auto px-8 py-3 bg-[#009eb9] text-white font-semibold rounded-lg hover:bg-[#184363] transition-colors"
                >
                  Submit Prescription
                </button>
              )}
            </div>

            {/* Help Section - Mobile Only */}
            <div className="lg:hidden mt-8 text-center">
              <p className="text-neutral-600 mb-2">Need help?</p>
              <Link href="/contact" className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors">
                Contact our pharmacy team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}