'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { submitPrescriptionNoAuth } from '@/lib/supabase/prescriptions';
import { supabase } from '@/lib/supabase/client';

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

  type SessionUser = {
    id: string
    email: string
    firstName: string
  } | null

  const [sessionUser, setSessionUser] = useState<SessionUser>(null);

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, id_number, date_of_birth, medical_aid_provider, medical_aid_number')
        .eq('id', user.id)
        .single();

      setSessionUser({ id: user.id, email: user.email!, firstName: profile?.first_name || '' });

      if (profile) {
        setFormData(prev => ({
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: user.email!,
          whatsappNumber: profile.phone || '',
          idNumber: profile.id_number || '',
          dateOfBirth: profile.date_of_birth || '',
          medicalAidProvider: profile.medical_aid_provider || '',
          medicalAidNumber: profile.medical_aid_number || '',
        }));
      }
    }
    checkSession();
  }, []);

  useEffect(() => {
    if (sessionUser && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [sessionUser]);

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

  const stepTitles = ['Personal Details', 'Your Prescription', 'Delivery / Collection', 'Medical & Payment', 'Review & Submit'];
  const stepSubtitles = [
    'We need a few details to process your prescription safely.',
    'Upload your script and provide your doctor\'s information.',
    'Choose how you\'d like to receive your medication.',
    'Help us prepare your medication correctly.',
    'Review your details before submitting.',
  ];

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${hasError ? 'border-red-500' : 'border-neutral-300'}`;

  return (
    <div className="min-h-screen w-full flex m-0 p-0">

      {/* LEFT: Background image + overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-[#184363] to-[#009eb9] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero-main-care.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-linear-to-br from-[#184363]/80 to-[#009eb9]/60" />
        </div>

        <div className="relative z-10 flex flex-col w-full px-12 py-10 text-white">
          <Link href="/" className="text-white/50 hover:text-white text-xs flex items-center gap-1.5 transition-colors self-start mb-8">
            ← Back to Sparkport
          </Link>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="max-w-md">
              <h2 className="text-7xl font-extrabold! mb-6">
                Fill Your Script Online
              </h2>
              <p className="text-xl! text-white/90! mb-8">
                Upload your prescription and we&apos;ll prepare it for safe collection or delivery — fast, secure, and convenient.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Easy prescription upload</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Ready within 2 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">Collect in-store or get delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* Mobile home link */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="text-neutral-400 hover:text-[#184363] text-xs flex items-center gap-1.5 transition-colors">
              ← Back to Sparkport
            </Link>
          </div>

          {/* Step indicator */}
          <p className="text-[#009eb9]! text-xs font-semibold! uppercase tracking-widest mb-2">
            Step {currentStep} of {totalSteps}
          </p>

          {/* Step heading */}
          <h1 className="text-3xl lg:text-4xl font-extrabold! text-[#184363] mb-2">
            {stepTitles[currentStep - 1]}
          </h1>
          <p className="text-neutral-600! mb-8">
            {stepSubtitles[currentStep - 1]}
          </p>

          {/* Mobile progress bar */}
          <div className="lg:hidden mb-8">
            <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#009eb9] transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Logged-in greeting */}
          {sessionUser && currentStep === 2 && (
            <div className="mb-6 p-4 bg-[#009eb9]/8 border border-[#009eb9]/20 rounded-lg flex items-center justify-between">
              <p className="text-sm text-[#184363] font-medium">
                Welcome back{sessionUser.firstName ? `, ${sessionUser.firstName}` : ''}. Your details are pre-filled.
              </p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  setSessionUser(null);
                  setCurrentStep(1);
                }}
                className="text-xs text-neutral-500 hover:text-red-500 transition-colors ml-4 shrink-0"
              >
                Not you? Sign out
              </button>
            </div>
          )}

          {/* Error alert */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800! text-sm">{submitError}</p>
            </div>
          )}

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={inputClass(!!errors.firstName)}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="text-red-500! text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={inputClass(!!errors.lastName)}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="text-red-500! text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email (for tracking)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={inputClass(!!errors.email)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500! text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    className={inputClass(!!errors.whatsappNumber)}
                    placeholder="e.g., 0821234567"
                  />
                  {errors.whatsappNumber && <p className="text-red-500! text-xs mt-1">{errors.whatsappNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange('idNumber', e.target.value.slice(0, 13))}
                    className={inputClass(!!errors.idNumber)}
                    placeholder="13-digit ID number"
                    maxLength={13}
                  />
                  <p className="text-xs text-neutral-500! mt-1">{formData.idNumber.length} of 13 characters</p>
                  {errors.idNumber && <p className="text-red-500! text-xs mt-1">{errors.idNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  />
                  <p className="text-xs text-neutral-500! mt-1">Auto-filled from ID number</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Prescription Upload + Doctor Info */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-[#009eb9] transition-colors">
                <svg className="w-12 h-12 mx-auto text-neutral-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <label className="cursor-pointer">
                  <span className="text-[#009eb9] font-semibold hover:text-[#184363] transition-colors">Click to upload</span>
                  <span className="text-neutral-600"> or drag and drop</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="text-sm text-neutral-500! mt-2">PNG, JPG, PDF up to 12MB</p>
              </div>

              {formData.prescriptionFile && (
                <div className="bg-neutral-50 rounded-lg p-4 flex items-center gap-4 border border-neutral-200">
                  <div className="w-10 h-10 bg-[#009eb9] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold! text-neutral-700! truncate text-sm">{formData.prescriptionFile.name}</p>
                    <p className="text-xs text-neutral-500!">{(formData.prescriptionFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => { handleInputChange('prescriptionFile', null); setFilePreview(''); }} className="text-red-400 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {errors.prescriptionFile && <p className="text-red-500! text-xs">{errors.prescriptionFile}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Doctor&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.doctorName}
                    onChange={(e) => handleInputChange('doctorName', e.target.value)}
                    className={inputClass(!!errors.doctorName)}
                    placeholder="Dr. John Smith"
                  />
                  {errors.doctorName && <p className="text-red-500! text-xs mt-1">{errors.doctorName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Practice Number</label>
                  <input
                    type="text"
                    value={formData.doctorPracticeNumber}
                    onChange={(e) => handleInputChange('doctorPracticeNumber', e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    placeholder="MP123456"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Prescription Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.prescriptionDate}
                  onChange={(e) => handleInputChange('prescriptionDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={inputClass(!!errors.prescriptionDate)}
                />
                <p className="text-xs text-neutral-500! mt-1">When did the doctor issue this prescription?</p>
                {errors.prescriptionDate && <p className="text-red-500! text-xs mt-1">{errors.prescriptionDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Is this chronic medication?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="chronic" checked={formData.isChronic === true} onChange={() => handleInputChange('isChronic', true)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="chronic" checked={formData.isChronic === false} onChange={() => handleInputChange('isChronic', false)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">No (Acute)</span>
                  </label>
                </div>
              </div>

              {formData.isChronic && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Number of Repeats</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    value={formData.chronicRepeats}
                    onChange={(e) => handleInputChange('chronicRepeats', e.target.value)}
                    className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                    placeholder="e.g., 5"
                  />
                  <p className="text-xs text-neutral-500! mt-1">How many repeats are left on this prescription?</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Delivery / Collection */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Select Preferred Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('deliveryMethod', 'collection')}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${formData.deliveryMethod === 'collection' ? 'border-[#009eb9] bg-[#009eb9]/5' : 'border-neutral-300 hover:border-neutral-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryMethod === 'collection' ? 'border-[#009eb9]' : 'border-neutral-300'}`}>
                        {formData.deliveryMethod === 'collection' && <div className="w-2.5 h-2.5 rounded-full bg-[#009eb9]" />}
                      </div>
                      <span className="font-semibold text-neutral-700 text-sm">Collection</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleInputChange('deliveryMethod', 'delivery')}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${formData.deliveryMethod === 'delivery' ? 'border-[#009eb9] bg-[#009eb9]/5' : 'border-neutral-300 hover:border-neutral-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryMethod === 'delivery' ? 'border-[#009eb9]' : 'border-neutral-300'}`}>
                        {formData.deliveryMethod === 'delivery' && <div className="w-2.5 h-2.5 rounded-full bg-[#009eb9]" />}
                      </div>
                      <span className="font-semibold text-neutral-700 text-sm">Delivery</span>
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
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.preferredPharmacyId === store.id ? 'border-[#009eb9] bg-[#009eb9]/5' : 'border-neutral-300 hover:border-neutral-400'}`}
                      >
                        <input
                          type="radio"
                          name="preferredPharmacyId"
                          value={store.id}
                          checked={formData.preferredPharmacyId === store.id}
                          onChange={(e) => { handleInputChange('preferredPharmacyId', e.target.value); handleInputChange('collectionStore', store.name); }}
                          className="mt-0.5"
                        />
                        <div className="text-sm">
                          <p className="font-semibold! text-neutral-700!">{store.name}</p>
                          <p className="text-neutral-500 text-xs">{store.address}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.preferredPharmacyId && <p className="text-red-500! text-xs mt-2">{errors.preferredPharmacyId}</p>}
                </div>
              )}

              {formData.deliveryMethod === 'delivery' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input type="text" value={formData.streetAddress} onChange={(e) => handleInputChange('streetAddress', e.target.value)} className={inputClass(!!errors.streetAddress)} placeholder="Enter street address" />
                    {errors.streetAddress && <p className="text-red-500! text-xs mt-1">{errors.streetAddress}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Address Line 2 (Optional)</label>
                    <input type="text" value={formData.addressLine2} onChange={(e) => handleInputChange('addressLine2', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]" placeholder="Apartment, suite, etc." />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">City <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className={inputClass(!!errors.city)} placeholder="City" />
                      {errors.city && <p className="text-red-500! text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Province <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.province} onChange={(e) => handleInputChange('province', e.target.value)} className={inputClass(!!errors.province)} placeholder="Province" />
                      {errors.province && <p className="text-red-500! text-xs mt-1">{errors.province}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Postal Code <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.postalCode} onChange={(e) => handleInputChange('postalCode', e.target.value)} className={inputClass(!!errors.postalCode)} placeholder="Postal code" />
                      {errors.postalCode && <p className="text-red-500! text-xs mt-1">{errors.postalCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Country</label>
                      <select value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]">
                        <option value="South Africa">South Africa</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Medical & Payment */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Payment Type</label>
                <select value={formData.paymentType} onChange={(e) => handleInputChange('paymentType', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]">
                  <option value="card">Card Payment</option>
                  <option value="cash">Cash on Collection/Delivery</option>
                  <option value="eft">EFT</option>
                  <option value="medical-aid">Medical Aid / Medical Insurance</option>
                </select>
              </div>

              {formData.paymentType === 'medical-aid' && (
                <div className="space-y-5 pl-4 border-l-2 border-[#009eb9]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Medical Aid Provider</label>
                      <input type="text" value={formData.medicalAidProvider} onChange={(e) => handleInputChange('medicalAidProvider', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]" placeholder="e.g., Discovery, Bonitas" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Medical Aid Number</label>
                      <input type="text" value={formData.medicalAidNumber} onChange={(e) => handleInputChange('medicalAidNumber', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]" placeholder="Membership number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Dependant Code</label>
                    <input type="text" value={formData.dependantCode} onChange={(e) => handleInputChange('dependantCode', e.target.value)} className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]" placeholder="e.g., 00 for main member" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Replace with generics?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="generics" checked={formData.replaceWithGenerics === true} onChange={() => handleInputChange('replaceWithGenerics', true)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="generics" checked={formData.replaceWithGenerics === false} onChange={() => handleInputChange('replaceWithGenerics', false)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-3">Do you have any allergies?</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="allergies" checked={formData.hasAllergies === true} onChange={() => handleInputChange('hasAllergies', true)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="allergies" checked={formData.hasAllergies === false} onChange={() => handleInputChange('hasAllergies', false)} className="w-4 h-4 text-[#009eb9]" />
                    <span className="text-sm text-neutral-700">No</span>
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
                    className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9] ${errors.allergyDetails ? 'border-red-500' : 'border-neutral-300'}`}
                    rows={3}
                    placeholder="List all allergies..."
                  />
                  {errors.allergyDetails && <p className="text-red-500! text-xs mt-1">{errors.allergyDetails}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  className="w-full px-4 py-3.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009eb9]"
                  rows={4}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold! text-neutral-700! mb-3 text-sm uppercase tracking-wide!">Personal Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-neutral-500 text-xs">Name</p><p className="font-semibold! text-neutral-700!">{formData.firstName} {formData.lastName}</p></div>
                  <div><p className="text-neutral-500 text-xs">WhatsApp</p><p className="font-semibold! text-neutral-700!">{formData.whatsappNumber}</p></div>
                  {formData.email && <div><p className="text-neutral-500 text-xs">Email</p><p className="font-semibold! text-neutral-700!">{formData.email}</p></div>}
                  <div><p className="text-neutral-500 text-xs">ID Number</p><p className="font-semibold! text-neutral-700!">{formData.idNumber}</p></div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold! text-neutral-700! mb-3 text-sm uppercase tracking-wide!">Prescription</h3>
                <div className="text-sm space-y-1.5">
                  <div className="flex justify-between"><span className="text-neutral-500">File</span><span className="font-semibold! text-neutral-700!">{formData.prescriptionFile?.name}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Doctor</span><span className="font-semibold! text-neutral-700!">{formData.doctorName}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Date</span><span className="font-semibold! text-neutral-700!">{formData.prescriptionDate}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Type</span><span className="font-semibold! text-neutral-700!">{formData.isChronic ? `Chronic (${formData.chronicRepeats || '0'} repeats)` : 'Acute'}</span></div>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold! text-neutral-700! mb-3 text-sm uppercase tracking-wide!">{formData.deliveryMethod === 'collection' ? 'Collection' : 'Delivery'}</h3>
                {formData.deliveryMethod === 'collection' ? (() => {
                  const s = stores.find(s => s.id === formData.preferredPharmacyId);
                  return s ? <div className="text-sm"><p className="font-semibold! text-neutral-700!">{s.name}</p><p className="text-neutral-500 text-xs">{s.address}</p></div> : <p className="text-red-500! text-sm">No pharmacy selected</p>;
                })() : (
                  <div className="text-sm text-neutral-600">
                    <p>{formData.streetAddress}</p>
                    {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                    <p>{formData.city}, {formData.province} {formData.postalCode}</p>
                  </div>
                )}
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <h3 className="font-semibold! text-neutral-700! mb-3 text-sm uppercase tracking-wide!">Medical & Payment</h3>
                <div className="text-sm space-y-1.5">
                  <div className="flex justify-between"><span className="text-neutral-500">Payment</span><span className="font-semibold text-neutral-700 capitalize">{formData.paymentType.replace('-', ' ')}</span></div>
                  {formData.paymentType === 'medical-aid' && formData.medicalAidProvider && (
                    <div className="flex justify-between"><span className="text-neutral-500">Medical Aid</span><span className="font-semibold! text-neutral-700!">{formData.medicalAidProvider}</span></div>
                  )}
                  <div className="flex justify-between"><span className="text-neutral-500">Generics</span><span className="font-semibold! text-neutral-700!">{formData.replaceWithGenerics ? 'Yes' : 'No'}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Allergies</span><span className="font-semibold! text-neutral-700!">{formData.hasAllergies ? formData.allergyDetails : 'None'}</span></div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-1 w-4 h-4 text-[#009eb9] rounded" />
                <span className="text-sm text-neutral-700">
                  I confirm that the information provided is accurate and I agree to the{' '}
                  <Link href="/terms" className="text-[#009eb9] hover:underline font-semibold">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[#009eb9] hover:underline font-semibold">Privacy Policy</Link>
                </span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 space-y-3">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={isSubmitting}
                className="w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#009eb9] text-white font-bold py-4 rounded-full hover:bg-[#184363] transition-colors text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Prescription'}
              </button>
            )}

            {currentStep > 1 && (
              <div className="text-center">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="text-neutral-500 hover:text-[#184363] font-semibold transition-colors disabled:opacity-50 text-sm"
                >
                  ← Back to {stepTitles[currentStep - 2]}
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-neutral-500! text-sm">
              Need help?{' '}
              <Link href="/contact" className="text-[#009eb9] font-bold hover:text-[#184363] transition-colors">
                Contact our pharmacy team →
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}