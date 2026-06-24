'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitPrescriptionNoAuth } from '@/lib/supabase/prescriptions';

interface FormData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  idNumber: string;
  dateOfBirth: string;
  preferredContact: string;
  
  // Prescription File
  prescriptionFile: File | null;
  
  // Doctor Information (NEW - REQUIRED)
  doctorName: string;
  doctorPracticeNumber: string;
  prescriptionDate: string;
  
  // Chronic Medication (NEW)
  isChronic: boolean;
  chronicRepeats: string;
  
  // Delivery/Collection
  deliveryMethod: 'collection' | 'delivery';
  preferredPharmacyId: string;  // CHANGED from collectionStore - now UUID
  collectionStore: string;  // Store name for submission
  
  // Delivery Address
  streetAddress: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Medical & Payment
  paymentType: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  dependantCode: string;
  
  // Additional
  replaceWithGenerics: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  additionalNotes: string;
}

export default function FillYourScript() {
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    whatsappNumber: '',
    idNumber: '',
    dateOfBirth: '',
    preferredContact: 'whatsapp',
    prescriptionFile: null,
    
    // NEW: Doctor fields
    doctorName: '',
    doctorPracticeNumber: '',
    prescriptionDate: '',
    
    // NEW: Chronic fields
    isChronic: false,
    chronicRepeats: '',
    
    deliveryMethod: 'collection',
    preferredPharmacyId: '',  // CHANGED from collectionStore
    collectionStore: '',  // Store name
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const totalSteps = 5;

  // REPLACE YOUR PHARMACY IDS WITH REAL ONES FROM: SELECT id, name, street_address FROM pharmacies;
  const stores = [
    {
      id: '3fcdc50f-68c0-4d31-8fa0-3267d1e3e735',  // Sparkport 454
      name: 'Sparkport City Centre',
      address: 'Anton Lembede Street, Durban Central, 4000'
    },
    {
      id: '9ddae420-d72f-45c1-8926-740814a9efc0',  // Sparkport Chatsworth
      name: 'Sparkport Chatsworth',
      address: 'Chatsworth Centre, Chatsworth'
    },
    {
      id: 'd6809ab9-de13-4482-9080-c753a12e1e42',  // Sparkport Musgrave
      name: 'Sparkport Musgrave',
      address: '77 Musgrave Rd, Musgrave, Berea, 4001'
    },
    {
      id: '126dbab5-4f82-4e3f-adc8-877f793dfa22',  // Sparkport Overport
      name: 'Sparkport Overport',
      address: '382 Corner Moses Kotane & Randles Road, Durban, 4091'
    },
    {
      id: '5939cf00-f967-4019-aec3-e3d235452cf1',  // Sparkport Pietermaritzburg
      name: 'Sparkport Pietermaritzburg',
      address: 'Pietermaritzburg'
    },
    {
      id: '700ee74f-961d-4aa3-bad2-0aae5dff4e9e',  // Sparkport Quality Street
      name: 'Sparkport Quality Street',
      address: '315 Quality Street, Jacobs, Durban'
    },
    {
      id: '61a59c23-db1a-4f0d-90b5-3e189a3a4246',  // Sparkport Umlazi
      name: 'Sparkport Umlazi',
      address: 'Umlazi'
    },
    {
      id: '75bafc2e-2ada-4730-819c-d8d892336384',  // Sparkport Warner Beach
      name: 'Sparkport Pharmacy Warner Beach',
      address: '125 Kingsway St, Warner Beach, eManzimtoti, 4126'
    }
  ];

  // Parse South African ID number to extract date of birth
  const parseIdNumber = (idNumber: string) => {
    if (idNumber.length >= 6) {
      const year = idNumber.substring(0, 2);
      const month = idNumber.substring(2, 4);
      const day = idNumber.substring(4, 6);
      
      const currentYear = new Date().getFullYear();
      const currentYearShort = currentYear % 100;
      const yearNum = parseInt(year);
      const fullYear = yearNum > currentYearShort ? `19${year}` : `20${year}`;
      
      const monthNum = parseInt(month);
      const dayNum = parseInt(day);
      
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        return `${fullYear}-${month}-${day}`;
      }
    }
    return '';
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'idNumber' && typeof value === 'string') {
      const dob = parseIdNumber(value);
      if (dob && !formData.dateOfBirth) {
        setFormData(prev => ({ ...prev, dateOfBirth: dob }));
      }
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) setSubmitError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, prescriptionFile: 'File size must be less than 12 MB' }));
        return;
      }
      handleInputChange('prescriptionFile', file);
      
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
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      if (!formData.prescriptionFile) newErrors.prescriptionFile = 'Please upload your prescription';
      if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
      if (!formData.prescriptionDate) newErrors.prescriptionDate = 'Prescription date is required';
    }

    if (step === 3) {
      if (formData.deliveryMethod === 'collection' && !formData.preferredPharmacyId) {
        newErrors.preferredPharmacyId = 'Please select a collection store';
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await submitPrescriptionNoAuth(formData, formData.email);

      if (result.success) {
        router.push(
          `/prescription-success?number=${result.prescriptionNumber}&email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.whatsappNumber)}`
        );
      } else {
        setSubmitError(result.error || 'Failed to submit prescription. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT: Dark branded sticky panel */}
      <div className="lg:w-96 xl:w-[420px] lg:shrink-0 bg-[#184363] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto flex flex-col px-8 py-10">

        {/* Brand header */}
        <div className="mb-10">
          <p className="text-[#009eb9] text-xs font-bold! uppercase tracking-widest mb-5">Sparkport Pharmacy</p>
          <h1 className="text-3xl xl:text-4xl font-extrabold! text-white leading-tight mb-3">
            Fill Your Script<br className="hidden xl:block" /> Online
          </h1>
          <p className="text-white/55 text-sm leading-relaxed">
            Upload your prescription and we&apos;ll prepare it for safe collection or delivery.
          </p>
        </div>

        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-xs uppercase tracking-wide font-semibold!">Your Progress</span>
            <span className="text-[#009eb9] text-xs font-bold!">{currentStep} / {totalSteps}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-7">
            <div
              className="h-full bg-[#009eb9] transition-all duration-500 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-4 bottom-4 w-px bg-white/10" />
            <div className="space-y-0">
              {[
                { num: 1, label: 'Personal Details' },
                { num: 2, label: 'Prescription Upload' },
                { num: 3, label: 'Delivery / Collection' },
                { num: 4, label: 'Additional Info' },
                { num: 5, label: 'Review & Submit' },
              ].map((step) => (
                <div key={step.num} className="flex items-center gap-3 py-2.5 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 z-10 ${
                    currentStep > step.num
                      ? 'bg-[#009eb9] text-white'
                      : currentStep === step.num
                      ? 'bg-white text-[#184363] shadow-[0_0_0_4px_rgba(255,255,255,0.12)]'
                      : 'bg-white/8 text-white/30 border border-white/10'
                  }`}>
                    {currentStep > step.num ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : step.num}
                  </div>
                  <span className={`text-sm transition-colors ${
                    currentStep === step.num
                      ? 'font-bold! text-white'
                      : currentStep > step.num
                      ? 'text-[#009eb9] font-medium'
                      : 'text-white/30'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust signals + help */}
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="space-y-3 mb-6">
            {([
              { label: 'Encrypted & secure', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { label: 'Ready within 2 hours', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Collect or delivery', d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z' },
            ] as {label: string; d: string}[]).map(({ label, d }) => (
              <div key={label} className="flex items-center gap-2.5 text-xs text-white/50">
                <svg className="w-3.5 h-3.5 text-[#009eb9] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                </svg>
                {label}
              </div>
            ))}
          </div>
          <Link href="/contact" className="flex items-center gap-1.5 text-white/35 hover:text-white/70 text-xs transition-colors">
            Need help? Contact us →
          </Link>
        </div>
      </div>

      {/* RIGHT: Form area */}
      <div className="flex-1 bg-neutral-50/60">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 lg:py-12">

            {/* Mobile step strip — hidden on lg (left panel takes over) */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#184363] uppercase tracking-widest">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs text-neutral-400">
                  {['Personal Details', 'Prescription Upload', 'Delivery / Collection', 'Additional Info', 'Review & Submit'][currentStep - 1]}
                </span>
              </div>
              <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#009eb9] transition-all duration-500 rounded-full"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Error Alert */}
            {submitError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-red-800">
                    <p className="font-semibold mb-1">Submission Error</p>
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="px-6 lg:px-8 py-4 border-b border-neutral-100 flex items-center gap-2">
                <span className="text-xs font-bold text-[#009eb9] uppercase tracking-widest">Step {currentStep}</span>
                <span className="text-neutral-300 text-xs">·</span>
                <span className="text-xs font-semibold text-neutral-500">
                  {['Personal Details', 'Prescription Upload', 'Delivery / Collection', 'Additional Info', 'Review & Submit'][currentStep - 1]}
                </span>
              </div>
              <div className="p-6 lg:p-8">

              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.firstName ? 'border-red-500' : 'border-neutral-200'
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
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.lastName ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        placeholder="Enter last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Email (for tracking)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.email ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsappNumber}
                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.whatsappNumber ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        placeholder="e.g., 0821234567"
                      />
                      {errors.whatsappNumber && <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        ID Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value.slice(0, 13))}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.idNumber ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        placeholder="13-digit ID number"
                        maxLength={13}
                      />
                      <p className="text-sm text-neutral-500 mt-1">{formData.idNumber.length} of 13 characters</p>
                      {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Auto-filled from ID number</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="sms">SMS</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Upload Prescription + Doctor Info + Chronic */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  
                  <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-[#009eb9] transition-colors">
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
                    <div className="bg-neutral-50 rounded-xl p-4 flex items-center gap-4">
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

                  {/* NEW: Doctor Information */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-bold text-[#184363] mb-4">Doctor Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Doctor&apos;s Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.doctorName}
                          onChange={(e) => handleInputChange('doctorName', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                            errors.doctorName ? 'border-red-500' : 'border-neutral-200'
                          }`}
                          placeholder="Dr. John Smith"
                        />
                        {errors.doctorName && <p className="text-red-500 text-sm mt-1">{errors.doctorName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Practice Number
                        </label>
                        <input
                          type="text"
                          value={formData.doctorPracticeNumber}
                          onChange={(e) => handleInputChange('doctorPracticeNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                          placeholder="MP123456"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Prescription Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.prescriptionDate}
                        onChange={(e) => handleInputChange('prescriptionDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.prescriptionDate ? 'border-red-500' : 'border-neutral-200'
                        }`}
                      />
                      <p className="text-xs text-neutral-500 mt-1">When did the doctor issue this prescription?</p>
                      {errors.prescriptionDate && <p className="text-red-500 text-sm mt-1">{errors.prescriptionDate}</p>}
                    </div>
                  </div>

                  {/* NEW: Chronic Medication */}
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-bold text-[#184363] mb-4">Medication Type</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-3">
                        Is this chronic medication?
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="chronic"
                            checked={formData.isChronic === true}
                            onChange={() => handleInputChange('isChronic', true)}
                            className="w-4 h-4 text-[#009eb9]"
                          />
                          <span className="text-neutral-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="chronic"
                            checked={formData.isChronic === false}
                            onChange={() => handleInputChange('isChronic', false)}
                            className="w-4 h-4 text-[#009eb9]"
                          />
                          <span className="text-neutral-700">No (Acute)</span>
                        </label>
                      </div>
                    </div>

                    {formData.isChronic && (
                      <div className="mt-4">
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Number of Repeats
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="12"
                          value={formData.chronicRepeats}
                          onChange={(e) => handleInputChange('chronicRepeats', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                          placeholder="e.g., 5"
                        />
                        <p className="text-xs text-neutral-500 mt-1">How many repeats are left on this prescription?</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Delivery/Collection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
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
                            formData.deliveryMethod === 'collection' ? 'border-[#009eb9]' : 'border-neutral-200'
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
                            formData.deliveryMethod === 'delivery' ? 'border-[#009eb9]' : 'border-neutral-200'
                          }`}>
                            {formData.deliveryMethod === 'delivery' && (
                              <div className="w-3 h-3 rounded-full bg-[#009eb9]" />
                            )}
                          </div>
                          <span className="font-semibold text-neutral-700">Delivery</span>
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
                            key={store.id}
                            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              formData.preferredPharmacyId === store.id
                                ? 'border-[#009eb9] bg-[#009eb9]/5'
                                : 'border-neutral-300 hover:border-neutral-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="preferredPharmacyId"
                              value={store.id}
                              checked={formData.preferredPharmacyId === store.id}
                              onChange={(e) => {
                                handleInputChange('preferredPharmacyId', e.target.value);
                                handleInputChange('collectionStore', store.name);
                              }}
                              className="mt-1"
                            />
                            <div className="text-sm">
                              <p className="font-semibold text-neutral-700">{store.name}</p>
                              <p className="text-neutral-600">{store.address}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.preferredPharmacyId && <p className="text-red-500 text-sm mt-2">{errors.preferredPharmacyId}</p>}
                    </div>
                  )}

                  {formData.deliveryMethod === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.streetAddress}
                          onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                            errors.streetAddress ? 'border-red-500' : 'border-neutral-200'
                          }`}
                          placeholder="Enter street address"
                        />
                        {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.addressLine2}
                          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                              errors.city ? 'border-red-500' : 'border-neutral-200'
                            }`}
                            placeholder="City"
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Province <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.province}
                            onChange={(e) => handleInputChange('province', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                              errors.province ? 'border-red-500' : 'border-neutral-200'
                            }`}
                            placeholder="Province"
                          />
                          {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                              errors.postalCode ? 'border-red-500' : 'border-neutral-200'
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
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
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
                  
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Payment Type
                    </label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) => handleInputChange('paymentType', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                    >
                      <option value="card">Card Payment</option>
                      <option value="cash">Cash on Collection/Delivery</option>
                      <option value="eft">EFT</option>
                      <option value="medical-aid">Medical Aid / Medical Insurance</option>
                    </select>
                  </div>

                  {formData.paymentType === 'medical-aid' && (
                    <div className="space-y-4 border-l-4 border-[#009eb9] pl-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Medical Aid Provider
                          </label>
                          <input
                            type="text"
                            value={formData.medicalAidProvider}
                            onChange={(e) => handleInputChange('medicalAidProvider', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                            placeholder="e.g., Discovery, Bonitas, Medshield"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Medical Aid Number
                          </label>
                          <input
                            type="text"
                            value={formData.medicalAidNumber}
                            onChange={(e) => handleInputChange('medicalAidNumber', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                            placeholder="Membership number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                          Dependant Code
                        </label>
                        <input
                          type="text"
                          value={formData.dependantCode}
                          onChange={(e) => handleInputChange('dependantCode', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                          placeholder="e.g., 00 for main member"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
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
                    <label className="block text-sm font-semibold text-neutral-700 mb-3">
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
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Please specify your allergies <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.allergyDetails}
                        onChange={(e) => handleInputChange('allergyDetails', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors ${
                          errors.allergyDetails ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        rows={3}
                        placeholder="List all allergies..."
                      />
                      {errors.allergyDetails && <p className="text-red-500 text-sm mt-1">{errors.allergyDetails}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009eb9]/25 focus:border-[#009eb9] transition-colors"
                      rows={4}
                      placeholder="Any special instructions..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  
                  <div className="space-y-4">
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold text-neutral-700 mb-3">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-neutral-500">Name</p>
                          <p className="font-semibold text-neutral-700">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">WhatsApp</p>
                          <p className="font-semibold text-neutral-700">{formData.whatsappNumber}</p>
                        </div>
                        {formData.email && (
                          <div>
                            <p className="text-neutral-500">Email</p>
                            <p className="font-semibold text-neutral-700">{formData.email}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-neutral-500">ID Number</p>
                          <p className="font-semibold text-neutral-700">{formData.idNumber}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">Contact Method</p>
                          <p className="font-semibold text-neutral-700 capitalize">{formData.preferredContact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold text-neutral-700 mb-3">Prescription Details</h3>
                      <div className="text-sm space-y-2">
                        <p><span className="text-neutral-500">File:</span> <span className="font-semibold text-neutral-700">{formData.prescriptionFile?.name}</span></p>
                        <p><span className="text-neutral-500">Doctor:</span> <span className="font-semibold text-neutral-700">{formData.doctorName}</span></p>
                        {formData.doctorPracticeNumber && (
                          <p><span className="text-neutral-500">Practice Number:</span> <span className="font-semibold text-neutral-700">{formData.doctorPracticeNumber}</span></p>
                        )}
                        <p><span className="text-neutral-500">Prescription Date:</span> <span className="font-semibold text-neutral-700">{formData.prescriptionDate}</span></p>
                        <p><span className="text-neutral-500">Type:</span> <span className="font-semibold text-neutral-700">{formData.isChronic ? `Chronic (${formData.chronicRepeats || '0'} repeats)` : 'Acute'}</span></p>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-bold text-neutral-700 mb-3">
                        {formData.deliveryMethod === 'collection' ? 'Collection' : 'Delivery'} Details
                      </h3>
                      {formData.deliveryMethod === 'collection' ? (
                        <div className="text-sm">
                          {(() => {
                            const selected = stores.find(s => s.id === formData.preferredPharmacyId);
                            return selected ? (
                              <>
                                <p className="font-semibold text-neutral-700">{selected.name}</p>
                                <p className="text-neutral-600">{selected.address}</p>
                              </>
                            ) : (
                              <p className="text-red-500">No pharmacy selected</p>
                            );
                          })()}
                        </div>
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
                      <h3 className="font-bold text-neutral-700 mb-3">Additional Information</h3>
                      <div className="text-sm space-y-2">
                        <p><span className="text-neutral-500">Payment:</span> <span className="font-semibold text-neutral-700 capitalize">{formData.paymentType.replace('-', ' ')}</span></p>
                        {formData.paymentType === 'medical-aid' && formData.medicalAidProvider && (
                          <>
                            <p><span className="text-neutral-500">Medical Aid:</span> <span className="font-semibold text-neutral-700">{formData.medicalAidProvider}</span></p>
                            {formData.medicalAidNumber && <p><span className="text-neutral-500">Member Number:</span> <span className="font-semibold text-neutral-700">{formData.medicalAidNumber}</span></p>}
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

                  <div className="bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" required className="mt-1" />
                      <span className="text-sm text-[#184363]">
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
              </div>{/* /p-6 lg:p-8 */}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-6">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm text-neutral-600 font-semibold! rounded-xl border border-neutral-200 hover:border-[#009eb9] hover:text-[#009eb9] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="ml-auto inline-flex items-center gap-2 px-8 py-2.5 bg-[#009eb9] text-white text-sm font-semibold! rounded-xl hover:bg-[#184363] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  Continue
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="ml-auto inline-flex items-center gap-2 px-8 py-2.5 bg-[#009eb9] text-white text-sm font-semibold! rounded-xl hover:bg-[#184363] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Prescription
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="lg:hidden mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>Need help?</span>
              <Link href="/contact" className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors">
                Contact pharmacy team →
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}